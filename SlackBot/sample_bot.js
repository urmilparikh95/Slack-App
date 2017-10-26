var Botkit = require('botkit');
var database = require('./database');
var droid = require('./droid');
var github = require('./github');
var bluebird = require('bluebird');
var sinon = require('sinon');
var data = require("./mock.json");
var mock = require("./mock.js");

mock.loadMockData(database, github, droid)

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.SLACKTOKEN,
}).startRTM()

controller.hears('save',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	// sample call to service
	database.save('test_user2','fail_test_repo.git').then(function (result) 
	{
		bot.reply(message,"Stored successfully");
	}).catch(function(error){
		bot.reply(message, "Data could not be saved!");
		console.log("Error: "+error);
	});

});

controller.hears('UI',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	console.log(bot);
	bot.startConversation(message, function(err, convo) {
		convo.say('Give me a moment!');
		convo.say('Let me check if you have configured a git repository!');
		// sample call to service
		database.get('FAIL_USER_ID').then(function (result) 
		{
			convo.say('You have configured repository: '+result.repo_link);
			convo.say('Scanning repository to suggest UI libraries...');
			github.getFilesFromRepo(result.repo_link, result.credential).then(function (repo) 
			{
				console.log("Repo: "+JSON.stringify(repo));
					droid.getUiLibraries(repo.files).then(function (recommendations) 
					{
						console.log("Recommendations: "+JSON.stringify(recommendations));
						if (recommendations.status != undefined && recommendations.status === "error"){
							convo.say(recommendations.message);
						}else{
							convo.say("Recommendations: "+JSON.stringify(recommendations));
						}
					}).catch(function(error){
						convo.say("Recommendations could not be fetched!");
						console.log("Error: "+error);
					});

			}).catch(function(error){
				console.log("Get Files Error : "+error);
				convo.say("Files could not be found!");
			});
		}).catch(function(error){
			convo.say('You have not configured a git repository. Please configure a git repository first using the /start command.');
			console.log("Error: "+error);
		});
	  });
});

controller.hears('libraries',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	bot.startConversation(message, function(err, convo) {
		convo.say('Give me a moment!');
		convo.say('Let me check if you have configured a git repository!');
		// sample call to service
		database.get('dummy_user_a').then(function (result) 
		{
			convo.say('You have configured repository: '+result.repo_link);
			convo.ask('Which type of recommendations do you want? Options are 1. UI 2. Code 3. General 4. All (Default)', function(answer, convo) {
				var recommendation_type = answer.text;
				if (recommendation_type === "UI"){
					suggesUiLibraries(result.repo_link, result.credential, convo);
				}else if(recommendation_type === "Code"){
					suggesCodeLibraries(result.repo_link, result.credential, convo);
				}else if(recommendation_type === "General"){
					suggesCodeRefactorings(result.repo_link, result.credential, convo);
				}else{
					suggestAllImprovements(result.repo_link, result.credential, convo);
				}
				convo.next();
			  });
		}).catch(function(error){
			convo.say('You have not configured a git repository. Please configure a git repository first using the /start command.');
			console.log("Error: "+error);
		});
	  });
});

function suggesUiLibraries(repo_link, credential, convo){
	convo.say('Scanning repository to suggest UI libraries...');
	github.getFilesFromRepo(repo_link, credential).then(function (repo) 
	{
		console.log("Repo: "+JSON.stringify(repo));
			droid.getUiLibraries(repo.files).then(function (recommendations) 
			{
				if (recommendations.status != undefined && recommendations.status === "error"){
					convo.say(recommendations.message);
				}else{
					convo.say("We suggest you these following UI libraries improve the quality of your code ..")
					console.log("Recommendations: "+JSON.stringify(recommendations));
					convo.say("Recommendations: "+JSON.stringify(recommendations));
				}
			}).catch(function(error){
				convo.say("Recommendations could not be fetched!");
				console.log("Error: "+error);
			});

	}).catch(function(error){
		convo.say("Files could not be fetched!");
		console.log("Error: "+error);
	});
}

function suggesCodeLibraries(repo_link, credential, convo){
	convo.say('Scanning repository to suggest Core Code libraries...');
	github.getFilesFromRepo(repo_link, credential).then(function (repo) 
	{
		console.log("Repo: "+JSON.stringify(repo));
			droid.getCodeLibraries(repo.files).then(function (recommendations) 
			{
				if (recommendations.status != undefined && recommendations.status === "error"){
					convo.say(recommendations.message);
				}else{
					console.log("Recommendations: "+JSON.stringify(recommendations));
					convo.say("We suggest you these following core code libraries improve the quality of your code ..")
					convo.say("Recommendations: "+JSON.stringify(recommendations));
				}
			}).catch(function(error){
				convo.say("Recommendations could not be fetched!");
				console.log("Error: "+error);
			});

	}).catch(function(error){
		convo.say("Files could not be fetched!");
		console.log("Error: "+error);
	});
}

function suggesCodeRefactorings(repo_link, credential, convo){
	convo.say('Scanning repository to suggest general code refactorings...');
	github.getFilesFromRepo(repo_link, credential).then(function (repo) 
	{
		console.log("Repo: "+JSON.stringify(repo));
			droid.getCodeRefactoringSuggestions(repo.files).then(function (recommendations) 
			{
				if (recommendations.status != undefined && recommendations.status === "error"){
					convo.say(recommendations.message);
				}else{
					console.log("Recommendations: "+JSON.stringify(recommendations));
					convo.say("We suggest you these following things to improve the quality of your code ..")
					convo.say("Suggestions: "+JSON.stringify(recommendations));
				}
			}).catch(function(error){
				convo.say("Recommendations could not be fetched!");
				console.log("Error: "+error);
			});

	}).catch(function(error){
		convo.say("Files could not be fetched!");
		console.log("Error: "+error);
	});
}

function suggestAllImprovements(repo_link, credential, convo){
	convo.say('Scanning repository to suggest all possible improvements...');
	github.getFilesFromRepo(repo_link, credential).then(function (repo) 
	{
		console.log("Repo: "+JSON.stringify(repo));
			droid.getAllSuggestions(repo.files).then(function (recommendations) 
			{
				if (recommendations.status != undefined && recommendations.status === "error"){
					convo.say(recommendations.message);
				}else{
					console.log("Recommendations: "+JSON.stringify(recommendations));
					convo.say("We suggest you these following things to improve the quality of your code ..")
					convo.say("Recommendations: "+JSON.stringify(recommendations));
				}
			}).catch(function(error){
				convo.say("Recommendations could not be fetched!");
				console.log("Error: "+error);
			});

	}).catch(function(error){
		convo.say("Files could not be fetched!");
		console.log("Error: "+error);
	});
}


controller.hears('get',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	// sample call to service
	database.get(message.user).then(function (user) 
	{
		console.log("User: "+JSON.stringify(user));
			// sample call to service
			github.getFilesFromRepo(user.repo_link, user.credential).then(function (repo) 
			{
				console.log("Repo: "+JSON.stringify(repo));
						// sample call to service
					droid.getAllSuggestions(repo.files).then(function (recommendations) 
					{
						console.log("Recommendations: "+JSON.stringify(recommendations));
						bot.reply(message,"Recommendations: "+JSON.stringify(recommendations));
					}).catch(function(error){
						bot.reply(message, "Recommendations could not be fetched!");
						console.log("Error: "+error);
					});

			}).catch(function(error){
				bot.reply(message, "Files could not be fetched!");
				console.log("Error: "+error);
			});

	}).catch(function(error){
		bot.reply(message, "Data could not be fetched!");
		console.log("Error: "+error);
	});

});