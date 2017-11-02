var Promise = require("bluebird");
var sinon = require('sinon');

function sleep (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function save(user, git_data ){
	return new Promise(function (resolve, reject) 
	{
			
	});
}

function get(user){
	return new Promise(function (resolve, reject) 
	{
		//Get git_data
		resolve(git_data);
	});
}

exports.save = save;
exports.get = get;