var Promise = require("bluebird");
var sinon = require('sinon');
var Botkit = require('botkit');
var mongoStorage = require('botkit-storage-mongo')({mongoUri: 'mongodb://slackbot:slackbot@ds159235.mlab.com:59235/slackbot510'});
var controller = Botkit.slackbot({
	storage: mongoStorage
});

function sleep (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function saveUserInfo(user, git_data){
	return new Promise(function (resolve, reject) 
	{
		var data = {id: user, git_repo: git_data};
		controller.storage.users.save(data);
	});
}

function getUserInfo(user){
	return new Promise(function (resolve, reject) 
	{
		var git_data;
		controller.storage.users.get(user, function(error, data){
			git_data = data.git_repo;
		});
		resolve(git_data);
	});
}

//saveUserInfo("xyz", "http://www.github.com/xyyzz");
//saveUserInfo("xyzzzzz", "http://www.github.com/xyz");
//console.log("@@@@@@@@@@@@@@@@@@"+getUserInfo("xyz"));

exports.saveUserInfo = saveUserInfo;
exports.getUserInfo = getUserInfo;