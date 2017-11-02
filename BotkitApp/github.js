var Promise = require("bluebird");

function getFilesFromRepo(repo_url, git_credentials){
	return new Promise(function (resolve, reject) 
	{
		//Get Recommended Code Libraries
		var list = ['MainActivity.java', 'SecondaryActivity.java']
		resolve(list);
	});
}

exports.getFilesFromRepo = getFilesFromRepo;