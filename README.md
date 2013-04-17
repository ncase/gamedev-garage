The Gamedev Garage Sale
===

Last month, [I launched an experiment](http://garage.commonly.cc/),
with the goal to find a way to reward creators for publishing to the public domain.
It was a success.
Now, it would be ironic if I did not, too, release the very code behind that, to the world.

In this repo, is the full, configurable code from the original Gamedev Garage Sale.

Getting Started
===

The original Gamedev Garage site ran on Heroku, which I highly recommend.
Heroku makes it simple & straightforward to setup your lil' app.
Here's the way to do it:

0. Clone this repo
1. Install the [Heroku Toolbelt](https://toolbelt.heroku.com/)
2. Run "heroku create" on the terminal in the cloned folder
3. Run "git push heroku master" on the terminal in the cloned folder

Voila, your Gamedev Garage sale is now live!

However, it's still running on the default variables. Let's change that.

Customizing Variables
===

Open up local.env. You should see something like this:

    TOTAL=1337
    DEADLINE=12/25/2013
    MONGO_URI=mongodb://localhost:27017/commonly
    SENDGRID_USERNAME=username@heroku.com
    SENDGRID_PASSWORD=password
    PAYPAL_EMAIL=nick@nutcasenightmare.com
    PAYPAL_EMAIL_SANDBOX=business@ncase.me
    SANDBOX_MODE=1

Here's what each line means:

* The 1st & 2nd lines set the total amount & deadline for the campaign.
* The 3rd line sets the [MongoDB](http://www.mongodb.org/) database this app uses.
* The 4th & 5th lines set your [Sendgrid](http://sendgrid.com/) account, an automatic email-sender.
* The 6th & 7th lines are your [Paypal](https://developer.paypal.com/) emails, both production & sandbox.
* The 8th final line is a switch for the sandbox mode. Change it from '1' to '0' when you're ready to launch.

For your Heroku app, I recommend installing MongoDB & Sendgrid through their [Addons Marketplace](https://addons.heroku.com/).

Closing Thoughts
===

I most likely messed up the code within, or the instructions in this Readme.

Please shoot me any questions & comments you have at <nick@commonly.cc>!


