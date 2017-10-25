var Botkit = require('botkit');
var droid_database = require('./database');
var droid = require('./droid');
var github = require('./github');
var github = require('bluebird');

//var childProcess = require("child_process");

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACKTOKEN,
}).startRTM()


controller.hears('configure GIT',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	// sample call to service
	droid_database.save('test_user','test_repo.git').then(function (result) 
	{
				
		bot.reply(message,"Stored successfully");

	}).catch(function(error){

		bot.reply(message,"Error in storing the data");

	});

});