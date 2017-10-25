var Promise = require("bluebird");

function sleep (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function save(user, git_data ){
	return new Promise(function (resolve, reject) 
	{
		sleep(2000).then(() => {
			//Save user and git_data
			var result = true;
			reject(result);
		})
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