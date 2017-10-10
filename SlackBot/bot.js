
var Botkit = require('botkit');

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


// give the bot something to listen for.
//controller.hears('string or regex',['direct_message','direct_mention','mention'],function(bot,message) {


controller.hears('configure GIT',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	bot.reply(message,"Please provide the repo link");

});

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
