
///////////////////////////////////////////////////
// Init
///////////////////////////////////////////////////

// Express
var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use('/', express.static('./public'));
app.engine('html', require('ejs').renderFile);

// Mongo
var mongo = require('mongodb').MongoClient;
var mongoURI = process.env.MONGO_URI;

// Sendgrid
var SendGrid = require('sendgrid').SendGrid;
var sendgrid = new SendGrid( process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD );

// Paypal
var ipn = require('paypal-ipn');

// Sandbox Mode
var SANDBOX_MODE = (process.env.SANDBOX_MODE==1);


///////////////////////////////////////////////////
// Pages
///////////////////////////////////////////////////

app.get('/', function(request, response){

    mongo.connect(mongoURI, function(err, db) {
        if(err) { return console.dir(err); }
        db.collection('transactions').find().toArray( function(err,items){
            if(err) { return console.dir(err); }
            response.render('index.ejs',{
                donations: items,
                SANDBOX_MODE : SANDBOX_MODE,
                PAYPAL_EMAIL : process.env.PAYPAL_EMAIL,
                PAYPAL_EMAIL_SANDBOX : process.env.PAYPAL_EMAIL_SANDBOX,
                DEADLINE: process.env.DEADLINE,
                TOTAL: process.env.TOTAL,
                PREVIEW: true
            });
        });
    });

});

app.get('/garage', function(request, response){
    response.redirect('/');
});

app.get('/license', function(request, response){
    response.send('Everything in this bundle has been dedicated to the public domain (Creative Commons Zero)! You have the rights to use these assets in any commercial/personal project, royalty-free, no attribution necessary.');
});

app.get('/thanks', function(request, response){
    
    var txn_id = request.query.tx;
    if(txn_id){

        mongo.connect(mongoURI, function(err, db) {
            if(err) { return console.dir(err); }
            db.collection('transactions').find({txn_id:txn_id}).toArray( function(err,items){
                if(err) { return console.dir(err); }
                if(items.length==0){
                    response.redirect('/'); // You cheat
                }else{
                    response.render('thanks.ejs',{ 
                        donation:items[0],
                        SANDBOX_MODE: SANDBOX_MODE,
                        PREVIEW: false
                    });
                }
            });
        });

    }else{
        response.redirect('/');
    }

});


///////////////////////////////////////////////////
// Paypal
///////////////////////////////////////////////////

app.post('/paypal/ipn', function(request, response){

    var params = request.body;
    response.end(); // Response doesn't actually matter

    console.log("Paypal transaction received!");
    console.log(JSON.stringify(params));

    ///////////////////////
    // Verify with Paypal
    ipn.verify(params, function callback(err, msg) {
        if(err){
            console.log("!!! Payment IPN Invalid !!!");
            console.error(msg);
            return;
        }else{
            
            // Assure I'm the intended recipient
            var intended = SANDBOX_MODE ? process.env.PAYPAL_EMAIL_SANDBOX : process.env.PAYPAL_EMAIL;
            if(params.receiver_email != intended){
                console.log("!!! Payment email spoof !!!");
                return;
            }
            
            // Assure payment is Completed
            if(params.payment_status!='Completed') {
                console.log("!!! Payment not completed !!!");
                return;
            }

            // Assure currency is USD, not tampered with
            if(params.mc_currency!='USD') {
                console.log("!!! Payment is wrong currency !!!");
                return;
            }           

            ///////////////////////
            // Everything is fine.
            saveTransaction(params);

        }
    });

});

function saveTransaction(params){

    mongo.connect(mongoURI, function(err, db) {

        if(err) { return console.dir(err); }

        // Parse custom variables
        try{
            params.custom = JSON.parse(params.custom);
        }catch(err){
            console.dir(err);
            params.custom = {};
        }

        // Insert new entry
        var collection = db.collection('transactions');
        collection.ensureIndex( {txn_id:1}, {unique:true}, function(err){ // Not duplicated transaction
            if(err) { return console.dir(err); }
            collection.insert( params, function(err,inserted){
                if(err) { return console.dir(err); }
                sendEmail(params); // Email
            });
        });

    });

}

function sendEmail(params){
    
    var toEmail = params.custom.email;
    var tx = params.txn_id;
    if(toEmail){
        
        // TO DO: Generic thank you for others
        sendgrid.send({
  
            to: toEmail,
            from: 'nicklaus.liow@gmail.com',
            subject: 'Thank you!',
            text: 'Get your Gamedev Garage assets at: http://commonly.cc/thanks?tx='+tx+'\n\n'+
                    'Feel free to email me any comments or questions! I personally respond to all replies.\n\n'+
                    'And you? Keep being awesome.\n~ Nick'

        }, function(success, message) {
            if(!success) console.log(message);
        });

    }
            
}




///////////////////////////////////////////////////
// Listen
///////////////////////////////////////////////////

var port = process.env.PORT || 80;
app.listen(port);
console.log('Express server started on port '+port);
