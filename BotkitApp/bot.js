/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Create a new app via the Slack Developer site:

    -> http://api.slack.com

  Get a Botkit Studio token from Botkit.ai:

    -> https://studio.botkit.ai/

  Run your bot from the command line:

    clientId=<MY SLACK TOKEN> clientSecret=<my client secret> PORT=<3000> studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js

# USE THE BOT:

    Navigate to the built-in login page:

    https://<myhost.com>/login

    This will authenticate you with Slack.

    If successful, your bot will come online and greet you.


# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var env = require('node-env-file');
env(__dirname + '/.env');

//Droid
var database = require('./database');
var droid = require('./droid');
var github = require('./github');
var bluebird = require('bluebird');
var sinon = require('sinon');
var data = require("./mock.json");
var mock = require("./mock.js");
mock.loadMockData(database, github, droid)


if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  usage_tip();
  process.exit(1);
}

var Botkit = require('botkit');
var debug = require('debug')('botkit:main');

var bot_options = {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    // debug: true,
    scopes: ['bot'],
    studio_token: process.env.studio_token,
    studio_command_uri: process.env.studio_command_uri
};

// Use a mongo database if specified, otherwise store in a JSON file local to the app.
// Mongo is automatically configured when deploying to Heroku
if (process.env.MONGO_URI) {
    var mongoStorage = require('botkit-storage-mongo')({mongoUri: process.env.MONGO_URI});
    bot_options.storage = mongoStorage;
} else {
    bot_options.json_file_store = __dirname + '/.data/db/'; // store user data in a simple JSON format
}

// Create the Botkit controller, which controls all instances of the bot.
var controller = Botkit.slackbot(bot_options);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
var webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Set up a simple storage backend for keeping a record of customers
// who sign up for the app via the oauth
require(__dirname + '/components/user_registration.js')(controller);

// Send an onboarding message when a new team joins
require(__dirname + '/components/onboarding.js')(controller);

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

// enable advanced botkit studio metrics
require('botkit-studio-metrics')(controller);

var normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
  require("./skills/" + file)(controller);
});

// This captures and evaluates any message sent to the bot as a DM
// or sent to the bot in the form "@bot message" and passes it to
// Botkit Studio to evaluate for trigger words and patterns.
// If a trigger is matched, the conversation will automatically fire!
// You can tie into the execution of the script using the functions
// controller.studio.before, controller.studio.after and controller.studio.validate
if (process.env.studio_token) {
    controller.on('direct_message,direct_mention,mention', function(bot, message) {
        controller.studio.runTrigger(bot, message.text, message.user, message.channel, message).then(function(convo) {
            if (!convo) {
                // no trigger was matched
                // If you want your bot to respond to every message,
                // define a 'fallback' script in Botkit Studio
                // and uncomment the line below.
                // controller.studio.run(bot, 'fallback', message.user, message.channel);
            } else {
                // set variables here that are needed for EVERY script
                // use controller.studio.before('script') to set variables specific to a script
                convo.setVar('current_time', new Date());
            }
        }).catch(function(err) {
            bot.reply(message, 'I experienced an error with a request to Botkit Studio: ' + err);
            debug('Botkit Studio: ', err);
        });
    });
} else {
    console.log('~~~~~~~~~~');
    console.log('NOTE: Botkit Studio functionality has not been enabled');
    console.log('To enable, pass in a studio_token parameter with a token from https://studio.botkit.ai/');
}

controller.hears('hello', 'direct_message', function (bot, message) {
    bot.reply(message, 'Hello!');
});

controller.hears('test', 'direct_message', function(bot, message) {
    console.log(message);	
	bot.startConversation(message, function(err, convo) {
		
			convo.ask({
				attachments:[
					{
						title: 'Do you want to proceed?',
						callback_id: '123',
						attachment_type: 'default',
						actions: [
							{
								"name":"yes",
								"text": "Yes",
								"value": "yes",
								"type": "button",
							},
							{
								"name":"no",
								"text": "No",
								"value": "no",
								"type": "button",
							}
						]
					}
				]
			},function(reply, convo) {// convo.ask callback
              console.log("Here");
              bot.replyInteractive(reply, "This text replaces the previous message");
              convo.say("This is a regular message");
              convo.next();
            });
		});
});



controller.hears('user interface','direct_message', function(bot,message) 
{
	console.log(message);
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
                ]},
                [
                    {
                        pattern: "UI",
                        callback: function(reply, convo) {
                            suggesUiLibraries(result.repo_link, result.credential, convo);
                            convo.next();
                        }
                    },
                    {
                        pattern: "Code",
                        callback: function(reply, convo) {
                            suggesCodeLibraries(result.repo_link, result.credential, convo);
                            convo.next();
                        }
                    },
                    {
                        pattern: "General",
                        callback: function(reply, convo) {
                            suggesCodeRefactorings(result.repo_link, result.credential, convo);
                            convo.next();
                        }
                    },
                    {
                        pattern: "All",
                        callback: function(reply, convo) {
                            suggestAllImprovements(result.repo_link, result.credential, convo);
                        }
                    },
                    {
                        default: true,
                        callback: function(reply, convo) {
                            // do nothing
                        }
                    }
                ]);
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



function usage_tip() {
    console.log('~~~~~~~~~~');
    console.log('Botkit Starter Kit');
    console.log('Execute your bot application like this:');
    console.log('clientId=<MY SLACK CLIENT ID> clientSecret=<MY CLIENT SECRET> PORT=3000 studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js');
    console.log('Get Slack app credentials here: https://api.slack.com/apps')
    console.log('Get a Botkit Studio token here: https://studio.botkit.ai/')
    console.log('~~~~~~~~~~');
}
