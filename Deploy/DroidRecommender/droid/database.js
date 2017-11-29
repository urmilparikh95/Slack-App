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
		var data = {id: user, repo_link: git_data};
		controller.storage.users.save(data);
		resolve(true);
	});
}

function getUserInfo(user){
	return new Promise(function (resolve, reject) 
	{
		controller.storage.users.get(user, function(error, data){
			console.log(error);
			if(error){
				reject("Error occured in fetching the data");
			}
			resolve(data);
		});
	});
}

/*saveUserInfo("xyz", "http://www.github.com/xyyzz");
saveUserInfo("xyzzzzz", "http://www.github.com/xyz");
getUserInfo("xyz").then(function (result){
	console.log(result);
}).catch(function(error){
	console.log(error);
});*/

exports.saveUserInfo = saveUserInfo;
exports.getUserInfo = getUserInfo;