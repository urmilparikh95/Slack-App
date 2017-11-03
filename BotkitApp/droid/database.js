var Promise = require("bluebird");
var sinon = require('sinon');

function sleep (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function saveUserInfo(user, git_data ){
	return new Promise(function (resolve, reject) 
	{
			
	});
}

function getUserInfo(user){
	return new Promise(function (resolve, reject) 
	{
		//Get git_data
		resolve(git_data);
	});
}

exports.saveUserInfo = saveUserInfo;
exports.getUserInfo = getUserInfo;