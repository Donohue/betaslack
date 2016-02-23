/* Post channel topic changes to Twitter */

if (!process.env.token ||
    !process.env.TWITTER_CONSUMER_KEY ||
    !process.env.TWITTER_CONSUMER_SECRET ||
    !process.env.TWITTER_ACCESS_TOKEN_KEY ||
    !process.env.TWITTER_ACCESS_TOKEN_SECRET) {
    console.log('Error: Environment variables missing');
    process.exit(1);
}

var Twitter = require('twitter');
var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

var twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

controller.on('channel_topic', function(bot, message) {
    var matches = message.text.match(/set the channel topic: (.*)/i);
    var topic = matches[1];
    twitterClient.post('statuses/update', {status: topic}, function(error, tweet, response) {
        if (error) {
            console.log('There was an error tweeting: ' + error);
            return;
        }
    });
})

