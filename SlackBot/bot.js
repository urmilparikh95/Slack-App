
var Botkit = require('botkit');
var database = require('./database');
var droid = require('./droid');
var github = require('./github');
var bluebird = require('bluebird');
var sinon = require('sinon');
var data = require("./mock.json");
var mock = require("./mock.js");

if (!process.env.token) {
	console.log('Error: Specify token in environment');
	process.exit(1);
}
  
var controller = Botkit.slackbot({
	debug: false
});

// connect the bot to a stream of messages
controller.spawn({
	token: process.env.token
}).startRTM(function(err) {
	if (err) {
	  throw new Error(err);
	}
});


// give the bot something to listen for.
//controller.hears('string or regex',['direct_message','direct_mention','mention'],function(bot,message) {

var currentUser; 
var repo_link;
var credential;

controller.hears('config',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{	
	currentUser = message.user
	bot.startConversation(message, register)
});



register = function(response, convo) {
	convo.ask("Configure your Github Repository\n Enter your Repo Link", function(response, convo) {
		repo_link = response.text;
	  	convo.say("Great");
	 	credentials(response, convo);
	  	convo.next();
	});
}

credentials = function(response, convo) { 
		convo.ask("Provide your Github credentials ", function(response, convo) {
		credential = response.text;
		database.save('test_user2','fail_test_repo.git').then(function (result) 
		{
			bot.reply(message,"Stored successfully");
		}).catch(function(error){
			bot.reply(message, "Data could not be saved!");
			console.log("Error: "+error);
		});
	  convo.say("Github Configured!!");
	  convo.next();
	});
}

/*
controller.hears('github.ncsu.edu',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	bot.reply(message,"Please provide credentials");
//https://github.ncsu.edu/uparikh/androidbot
});

controller.hears('username',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	bot.reply(message,"GIT configured");
});

controller.hears('GIT pull',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	bot.reply(message,"New pull request created,\n\nBefore merging the code you can view these recommendations for your code,\n some libraries which can be used - EventBus, ActiveAndroid \n UI designs libraries that can be used- MaterialDesignLibrary, Material Tabs \nCode refactoring required - class name should be 'User' instead of users");

});

controller.hears('UI',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	bot.reply(message,"These are the recommended UI designs libraries - MaterialDesignLibrary, Material Tabs");

});

controller.hears('libraries',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	bot.reply(message,"These are the recommended libraries - EventBus, ActiveAndroid");

});

controller.hears('refactor',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	bot.reply(message,"These are the recommended code refactoring - class name should be 'User' instead of users");

});
*/