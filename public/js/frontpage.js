////////////////////////
// Scroll to purchase!

document.getElementById("splash_button").onclick = function(){
	if(isFunded){
		window.location.hash = "#download";
	}else{
		window.location.hash = "#donate";
	}
};

////////////////////////
// Show all in leaderboard

document.getElementById("leaderboard_show").onclick = function(){
	document.getElementById("leaderboard_show").style.display = "none";
	document.getElementById("leaderboard_hidden").style.display = "block";
};


//////////////
// Countdown

if(!isFunded){
	(function(){

		var _second = 1000;
		var _minute = _second * 60;
		var _hour = _minute * 60;
		var _day = _hour * 24;
		function toDoubleDigits(num){
			var s = "00"+num;
			return s.substr(s.length-2);
		}

		var end = new Date( window.DEADLINE ? window.DEADLINE : '04/05/2013' );
		var countdown = document.getElementById("countdown");
		function tick(){

			var now = new Date();
		    var distance = end-now;
		    if(distance<0) distance=0;

		    var days = Math.floor(distance / _day);
		    var hours = Math.floor((distance % _day) / _hour);
		    var minutes = Math.floor((distance % _hour) / _minute);
		    var seconds = Math.floor((distance % _minute) / _second);

			countdown.innerHTML = toDoubleDigits(days)+"d "+toDoubleDigits(hours)+"h "+toDoubleDigits(minutes)+"m "+toDoubleDigits(seconds)+"s";

		}
		setInterval(tick,1000);
		tick();

	})();
}

//////////////
// Payment Form

var form = document.getElementById("payment_form");
var formCustom = document.getElementById("custom");
var formSubmit = document.getElementById("submit_button");

formSubmit.onclick = function(){

	formCustom.value = JSON.stringify({
		name: form.custom_name.value,
		email: form.custom_email.value,
		email_subscribe: form.custom_email_subscribe.checked,
	});

	document.querySelector('input[type=submit]').click();  

};

// Todo: Amount Buttons to change 'em, or custom
