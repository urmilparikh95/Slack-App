var Botkit = require('botkit');
var droid_database = require('./database');
var droid = require('./droid');
var github = require('./github');
var bluebird = require('bluebird');
var sinon = require('sinon');
var data = require("./mock.json")

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

controller.hears('save',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	// sample call to service
	droid_database.save('test_user','fail_test_repo.git').then(function (result) 
	{
		bot.reply(message,"Stored successfully");
	}).catch(function(error){
		bot.reply(message, "Data could not be saved!");
		console.log("Error: "+error);
	});

});

controller.hears('get',['ambient','mention', 'direct_mention','direct_message'], function(bot,message) 
{
	// sample call to service
	droid_database.get("b").then(function (user) 
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


function loadMockData(){

	//Mock Data
	var save = sinon.stub(droid_database, "save");
	save.withArgs("test_user", "test_repo.git").resolves(true);
	save.withArgs("test_user", "fail_test_repo.git").rejects("Repository could not be saved in the database!");

	var get = sinon.stub(droid_database, "get");
	get.withArgs("a").resolves(data.user_repos[0]);
	get.withArgs("b").resolves(data.user_repos[1]);
	get.withArgs("c").resolves(data.user_repos[2]);
	get.withArgs("d").resolves(data.user_repos[3]);
	get.withArgs("e").resolves(data.user_repos[5]);

	var github_mock = sinon.stub(github, "getFilesFromRepo");
	github_mock.withArgs(data.user_repos[0].repo_link, data.user_repos[0].credential).resolves(data.repos[0]);
	github_mock.withArgs(data.user_repos[1].repo_link, data.user_repos[1].credential).resolves(data.repos[1]);
	github_mock.withArgs(data.user_repos[2].repo_link, data.user_repos[2].credential).resolves(data.repos[2]);
	github_mock.withArgs(data.user_repos[3].repo_link, data.user_repos[3].credential).resolves(data.repos[3]);
	github_mock.withArgs(data.user_repos[4].repo_link, data.user_repos[4].credential).resolves(data.repos[4]);

	var droid_code_lib = sinon.stub(droid, "getCodeLibraries");
	droid_code_lib.withArgs(data.repos[0].files).resolves(data.recommendations[0]);
	droid_code_lib.withArgs(data.repos[1].files).resolves(data.recommendations[0]);
	droid_code_lib.withArgs(data.repos[2].files).resolves(data.recommendations[0]);
	droid_code_lib.withArgs(data.repos[3].files).resolves(data.recommendations[0]);
	droid_code_lib.withArgs(data.repos[4].files).resolves(data.recommendations[0]);

	var droid_ui_lib = sinon.stub(droid, "getUiLibraries");
	droid_ui_lib.withArgs(data.repos[0].files).resolves(data.recommendations[1]);
	droid_ui_lib.withArgs(data.repos[1].files).resolves(data.recommendations[1]);
	droid_ui_lib.withArgs(data.repos[2].files).resolves(data.recommendations[1]);
	droid_ui_lib.withArgs(data.repos[3].files).resolves(data.recommendations[1]);
	droid_ui_lib.withArgs(data.repos[4].files).resolves(data.recommendations[1]);

	var droid_refactorings = sinon.stub(droid, "getCodeRefactoringSuggestions");
	droid_refactorings.withArgs(data.repos[0].files).resolves(data.recommendations[2]);
	droid_refactorings.withArgs(data.repos[1].files).resolves(data.recommendations[2]);
	droid_refactorings.withArgs(data.repos[2].files).resolves(data.recommendations[2]);
	droid_refactorings.withArgs(data.repos[3].files).resolves(data.recommendations[2]);
	droid_refactorings.withArgs(data.repos[4].files).resolves(data.recommendations[2]);

	var droid_all = sinon.stub(droid, "getAllSuggestions");
	droid_all.withArgs(data.repos[0].files).resolves(data.recommendations[3]);
	droid_all.withArgs(data.repos[1].files).resolves(data.recommendations[3]);
	droid_all.withArgs(data.repos[2].files).resolves(data.recommendations[3]);
	droid_all.withArgs(data.repos[3].files).resolves(data.recommendations[3]);
	droid_all.withArgs(data.repos[4].files).resolves(data.recommendations[3]);


}

loadMockData();