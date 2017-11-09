var Botkit = require('botkit');
var database = require('./database');
var droid_service = require('./droid_service');
var github = require('./github');
var bluebird = require('bluebird');
var sinon = require('sinon');
var data = require("./mock.json");

var mock = require("./mock.js");

mock.loadMockData(database, github, droid_service)

module.exports = function(controller){

var currentUser; 
var repo_link;
var credential;

controller.hears('config',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{	
	currentUser = message.user
	bot.startConversation(message, register)
});

register = function(response, convo) {
	convo.say("Let's first configure your Github Repository..")
	convo.ask("Enter the link of github repository which you want to monitor. Eg. `https://github.ncsu.edu/dummy_user/dummy_repo1/`", function(response, convo) {
		repo_link = response.text;
		if (repo_link){
			convo.say("Great! Let me store this in my database..");
			saveUserGitInfo("test_user1", "https://github.ncsu.edu/dummy_user/dummy_repo1", convo);
		}else{
			convo.say("Darn! Some problem getting git repository from the user!");
		}
	  	convo.next();
	});
}

saveUserGitInfo = function(user, repo_link, convo) { 		
	//call to function
	database.saveUserInfo(user,repo_link).then(function (result) 
	{
		convo.say("User information stored successfully!");
		convo.say("Now, you can say `Suggest me some libraries` to get library recommendations!");
	}).catch(function(error){
		convo.say("Darn! Some problem in saving user information!");
		console.log("Error: "+error);
	});
}

controller.hears('UI',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	bot.startConversation(message, function(err, convo) {
		convo.say('Give me a moment!');
		convo.say('Let me check if you have configured a git repository!');
		// sample call to service
		database.getUserInfo(message.user).then(function (result)
		{
			convo.say('You have configured repository: '+result.repo_link);
			convo.say('Scanning repository to suggest UI libraries...');
			github.getFilesFromRepo(result.repo_link).then(function (repo)
			{
				console.log("Repo: "+JSON.stringify(repo));
					droid_service.getUiLibraries(repo.files).then(function (recommendations) 
					{
						console.log("Recommendations: "+JSON.stringify(recommendations));
						if (recommendations.status != undefined && recommendations.status === "error"){
							convo.say(recommendations.message);
						}else{
							// convo.say("Recommendations: "+JSON.stringify(recommendations));
							convo.say({
								"text": "Here are your recommendations!",
								"attachments": [
								  {
									  "fallback": "Required plain-text summary of the attachment.",
									  "color": "#36a64f",
									  "pretext": "Use *RetroFit* library for web service calls instead of *AsyncHttpClient*",
									  "title": "RetroFit",
									  "title_link": "http://square.github.io/retrofit/",
									  "text": "RetroFit is a library from *Square* which turns your HTTP web service calls into a JAVA interface.",
									  "fields": [
										  {
											  "title": "What does it replace? How?",
											  "value": "RetroFit is a library which should be definitely used instead of basic HTTP calls using *AsyncHttpClient*. It automatically converts a *REST* service to a Plain Old JAVA object using *annotations* and avoids boiler plate code of parsing data from AsyncHttpClient.",
											  "short": false
										  },
										  {
											  "title": "Code Snippet",
											  "value": "```public interface GitHubService\n{\n @GET('users/{user}/repos')\n Call<List<Repo>> listRepos(@Path('user') String user);\n}\n\n\nRetrofit retrofit = new Retrofit.Builder().baseUrl('https://api.github.com/') \n.build();\nGitHubService service = retrofit.create(GitHubService.class);```",
											  "short": false
										  }
									  ],
									  "mrkdwn_in": ["text", "pretext", "fields"]
								  }
								]
							  });
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
	console.log(message);
	bot.startConversation(message, function(err, convo) {
		convo.say('Give me a moment..');
		convo.say('Let me first check if you have configured a git repository..');
		// sample call to service
		database.getUserInfo(message.user).then(result => findRecommendations(result, convo)).catch(function(error){ 
			//We use => when we want result and also some other variable like convo in the method. If we just write the method, we just have result
			convo.say('You have not configured a git repository. Please configure a git repository first using the /start command.');
			console.log("Error: "+error);
		});
	  });
});

findRecommendations = function (result, convo)
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
					suggesUiLibraries(result.repo_link, process.env.githubToken, convo);
					convo.next();
				}
			},
			{
				pattern: "Code",
				callback: function(reply, convo) {
					suggesCodeLibraries(result.repo_link, process.env.githubToken, convo);
					convo.next();
				}
			},
			{
				pattern: "General",
				callback: function(reply, convo) {
					suggesCodeRefactorings(result.repo_link, process.env.githubToken, convo);
					convo.next();
				}
			},
			{
				pattern: "All",
				callback: function(reply, convo) {
					suggestAllImprovements(result.repo_link, process.env.githubToken, convo);
					convo.next();
				}
			},
			{
				default: true,
				callback: function(reply, convo) {
					// do nothing
				}
			}
		]);
}

function suggesUiLibraries(repo_link, credential, convo){
	convo.say('Scanning repository to suggest UI libraries...');
	github.getFilesFromRepo(repo_link).then(function (repo) 
	{
		console.log("Repo: "+JSON.stringify(repo));
			droid_service.getUiLibraries(repo.files).then(function (recommendations) 
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
	github.getFilesFromRepo(repo_link).then(function (repo) 
	{
		console.log("Repo: "+JSON.stringify(repo));
			droid_service.getCodeLibraries(repo.files).then(function (recommendations) 
			{
				if (recommendations.status != undefined && recommendations.status === "error"){
					convo.say(recommendations.message);
				}else{
					console.log("Recommendations: "+JSON.stringify(recommendations));
					convo.say("We suggest you these following core code libraries improve the quality of your code ..")
					// convo.say("Recommendations: "+JSON.stringify(recommendations));
					convo.say({
						"text": "Here are your recommendations!",
						"attachments": [
						  {
							  "fallback": "Required plain-text summary of the attachment.",
							  "color": "#36a64f",
							  "pretext": "Use *RetroFit* library for web service calls instead of *AsyncHttpClient*",
							  "title": "RetroFit",
							  "title_link": "http://square.github.io/retrofit/",
							  "text": "RetroFit is a library from *Square* which turns your HTTP web service calls into a JAVA interface.",
							  "fields": [
								  {
									  "title": "What does it replace? How?",
									  "value": "RetroFit is a library which should be definitely used instead of basic HTTP calls using *AsyncHttpClient*. It automatically converts a *REST* service to a Plain Old JAVA object using *annotations* and avoids boiler plate code of parsing data from AsyncHttpClient.",
									  "short": false
								  },
								  {
									  "title": "Code Snippet",
									  "value": "```public interface GitHubService\n{\n @GET('users/{user}/repos')\n Call<List<Repo>> listRepos(@Path('user') String user);\n}\n\n\nRetrofit retrofit = new Retrofit.Builder().baseUrl('https://api.github.com/') \n.build();\nGitHubService service = retrofit.create(GitHubService.class);```",
									  "short": false
								  }
							  ],
							  "mrkdwn_in": ["text", "pretext", "fields"]
						  }
						]
					  });
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
	github.getFilesFromRepo(repo_link).then(function (repo) 
	{
		console.log("Repo: "+JSON.stringify(repo));
			droid_service.getCodeRefactoringSuggestions(repo.files).then(function (recommendations) 
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
	github.getFilesFromRepo(repo_link).then(function (repo) 
	{
		console.log("Repo: "+JSON.stringify(repo));
			droid_service.getAllSuggestions(repo.files).then(function (recommendations) 
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
	database.getUserInfo(message.user).then(function (user) 
	{
		console.log("User: "+JSON.stringify(user));
			// sample call to service
			github.getFilesFromRepo(user.repo_link).then(function (repo) 
			{
				console.log("Repo: "+JSON.stringify(repo));
						// sample call to service
					droid_service.getAllSuggestions(repo.files).then(function (recommendations)
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

}