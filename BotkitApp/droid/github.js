var Promise = require("bluebird");
var request = require('request');
var parse = require('parse-link-header');
var fs = require('fs');
var clone = require('git-clone');
var gitpull = require('git-pull');

var token = "token " + process.env.githubToken; //must be set

if (!process.env.githubToken) {
	console.log('Error: Specify githubToken in environment or .env file');
	process.exit(1);
}

function getFilesFromRepo(repo_url) {
	return new Promise(function (resolve, reject) {
		var res = repo_url.split("/");
		gitpull(res[res.length - 1], function (err, consoleOutput) {
			if (err) {
				clone(repo_url, res[res.length - 1], [], function(){});
			} else {
				console.log("Success!", consoleOutput);
			}
		});
		var list = [];
		walkSync(res[res.length - 1],[]);
		function walkSync(dir, filelist) {
			files = fs.readdirSync(dir);
			filelist = filelist || [];
			var a = "";
			files.forEach(function(file) {
			  if (fs.statSync(dir + '/' + file).isDirectory()) {
				filelist = walkSync(dir + '/' + file, filelist);
			  }
			  else {
				filelist.push(dir+'/'+file);
				var contents = fs.readFileSync(dir+'/'+file, 'utf8');
				list.push({
					"filePath": dir+'/'+file,
					"fileContents": contents
				});
			  }
			});
			return filelist;
		  };
		  resolve(list);
	});
}

function createWebHook(repo_url)
{
	var res = repo_url.split("/");
	var urlRoot = "https://api.github.com";
	var owner = res[res.length-2];
	var repo = res[res.length-1];

	var options = {
		url: urlRoot + "/repos/" + owner + "/" + repo +"/hooks",
		method: 'POST',
		json: true,
		headers: {
			"User-Agent": "EnableIssues",
			"Authorization": token
			},

			json:
			{

				"name": "web",
				"active": true,
				"events": [
    				"pull_request"
  				],
				"config":{
					"url": "https://droidrecommender.localtunnel.me",
					"content-type": "json"

			}

		},
		body : {
			name: "WEBHOOK CREATED",
			description: "A webhook has been created using the Github API",
			private: false
		},
	};

	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body)
	{
		//print the response
		//console.log(body);

	});
	
}

exports.getFilesFromRepo = getFilesFromRepo;
