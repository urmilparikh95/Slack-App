var Botkit = require('botkit');
var database = require('./database');
var droid = require('./droid');
var github = require('./github');
var bluebird = require('bluebird');
var sinon = require('sinon');
var data = require("./mock.json");
var mock = require("./mock.js");

mock.loadMockData(database, github, droid)

// var controller = Botkit.slackbot({
//   debug: false
//   //include "log: false" to disable logging
//   //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
// });

// // connect the bot to a stream of messages
// controller.spawn({
//   token: process.env.SLACKTOKEN,
// }).startRTM()

/**
 * A Bot for Slack!
 */


/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});

controller.hears('hello', 'direct_message', function (bot, message) {
    bot.reply(message, 'Hello!');
});


/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
//controller.on('direct_message,mention,direct_mention', function (bot, message) {
//    bot.api.reactions.add({
//        timestamp: message.ts,
//        channel: message.channel,
//        name: 'robot_face',
//    }, function (err) {
//        if (err) {
//            console.log(err)
//        }
//        bot.reply(message, 'I heard you loud and clear boss.');
//    });
//});


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
		//call to function
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

controller.hears('UI',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	bot.startConversation(message, function(err, convo) {
		convo.say('Give me a moment!');
		convo.say('Let me check if you have configured a git repository!');
		// sample call to service
		database.get(message.user).then(function (result)
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
	console.log(message.user);
	bot.startConversation(message, function(err, convo) {
		convo.say('Give me a moment!');
		convo.say('Let me check if you have configured a git repository!');
		// sample call to service
		database.get(message.user).then(function (result) 
		{
			convo.say('You have configured repository: '+result.repo_link);
			convo.ask({
				attachments:[
					{
						title: 'Which type of recommendations do you want?',
						callback_id: result.repo_link+"-"+result.credential,
						attachment_type: 'default',
						actions: [
							{
								"name":"UI",
								"text": "UI",
								"value": "UI",
								"type": "button",
							},
							{
								"name":"Code",
								"text": "Code",
								"value": "Code",
								"type": "button",
							},
							{
								"name":"General",
								"text": "General",
								"value": "General",
								"type": "button",
							},
							{
								"name":"All",
								"text": "All",
								"value": "All",
								"type": "button",
							}
						]
					}
				]});
			// convo.ask('Which type of recommendations do you want? Options are 1. UI 2. Code 3. General 4. All (Default)', function(answer, convo) {
			// 	var recommendation_type = answer.text;
			// 	if (recommendation_type === "UI"){
			// 		suggesUiLibraries(result.repo_link, result.credential, convo);
			// 	}else if(recommendation_type === "Code"){
			// 		suggesCodeLibraries(result.repo_link, result.credential, convo);
			// 	}else if(recommendation_type === "General"){
			// 		suggesCodeRefactorings(result.repo_link, result.credential, convo);
			// 	}else{
			// 		suggestAllImprovements(result.repo_link, result.credential, convo);
			// 	}
			// 	convo.next();
			//   });
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

controller.hears('interactive', 'direct_message', function(bot, message) {	
	bot.startConversation(message, function(err, convo) {
		convo.ask({
		  text: "Here's some pretext",
		  attachments: [{
			"text": "More text",
			"fallback": "Fallback text",
			"callback_id": "Test",
			"actions": [
			  {
				"name": "yes",
				"text": "Yes",
				"value": "yes",
				"type": "button",
			  },
			  {
				"name": "no",
				"text": "No",
				"value": "no",
				"type": "button",
			  }
			]
		  }]
		}, function(reply, convo) {// convo.ask callback
			console.log("Here");
		  bot.replyInteractive(reply, "This text replaces the previous message");
		  convo.say("This is a regular message");
		  convo.next();
		});
	  });
});

// controller.hears('test', 'direct_message', function(bot, message) {	
// 	bot.startConversation(message, function(err, convo) {
		
// 			convo.ask({
// 				attachments:[
// 					{
// 						title: 'Do you want to proceed?',
// 						callback_id: '123',
// 						attachment_type: 'default',
// 						actions: [
// 							{
// 								"name":"yes",
// 								"text": "Yes",
// 								"value": "yes",
// 								"type": "button",
// 							},
// 							{
// 								"name":"no",
// 								"text": "No",
// 								"value": "no",
// 								"type": "button",
// 							}
// 						]
// 					}
// 				]
// 			},[
// 				{
// 					pattern: "yes",
// 					callback: function(reply, convo) {
// 						convo.say('FABULOUS!');
// 						convo.next();
// 						// do something awesome here.
// 					}
// 				},
// 				{
// 					pattern: "no",
// 					callback: function(reply, convo) {
// 						convo.say('Too bad');
// 						convo.next();
// 					}
// 				},
// 				{
// 					default: true,
// 					callback: function(reply, convo) {
// 						// do nothing
// 					}
// 				}
// 			]);
// 		});
// });

// controller.on('message_received', function(bot, message) {
// 	console.log(message);
//   });

// controller.hears('interactive', 'direct_message', function(bot, message) {
	
// 		bot.reply(message, {
// 			attachments:[
// 				{
// 					title: 'Do you want to interact with my buttons?',
// 					callback_id: '123',
// 					attachment_type: 'default',
// 					actions: [
// 						{
// 							"name":"yes",
// 							"text": "Yes",
// 							"value": "yes",
// 							"type": "button",
// 						},
// 						{
// 							"name":"no",
// 							"text": "No",
// 							"value": "no",
// 							"type": "button",
// 						}
// 					]
// 				}
// 			]
// 		});
// 	});

// // receive an interactive message, and reply with a message that will replace the original
controller.on('interactive_message_callback', function(bot, message) {
	// check message.actions and message.callback_id to see what action to take...
	console.log(message);
	// bot.say("Response received");
	var ids = message.callback_id.split(/\-/);
    var user_id = ids[0];
    var item_id = ids[1];
	var recommendation_type = message.actions[0];
	// bot.reply(message, message.actions[0].value);

	bot.startConversation(message, function(err, convo) {
		// var recommendation_type = answer.text;
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
		// check message.actions and message.callback_id to see what action to take...
		console.log(message);
		// bot.say("Response received");
		bot.reply(message, message.actions[0].value);
		// bot.replyInteractive(message, {
		// 	text: '...',
		// 	attachments: [
		// 		{
		// 			title: 'My buttons',
		// 			callback_id: '123',
		// 			attachment_type: 'default',
		// 			actions: [
		// 				{
		// 					"name":"yes",
		// 					"text": "Yes!",
		// 					"value": "yes",
		// 					"type": "button",
		// 				},
		// 				{
		// 				   "text": "No!",
		// 					"name": "no",
		// 					"value": "delete",
		// 					"style": "danger",
		// 					"type": "button",
		// 					"confirm": {
		// 					  "title": "Are you sure?",
		// 					  "text": "This will do something!",
		// 					  "ok_text": "Yes",
		// 					  "dismiss_text": "No"
		// 					}
		// 				}
		// 			]
		// 		}
		// 	]
		// });
	
	});