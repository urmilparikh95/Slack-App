var Promise = require("bluebird");

var gitCredentials = process.env.githubToken;
var urlRoot = "https://api.github.com";
var repo="REPO_URL"; //enter the github repo (containing android code) url here

if (!process.env.githubToken) {
	console.log('Error: Specify githubToken in environment or .env file');
	process.exit(1);

}

function getFilesFromRepo(repo_url){
	return new Promise(function (resolve, reject)
	{
		//Get Recommended Code Libraries
		//For dummy data, see mock.json also.
		var list = [
			{
				"filePath": "Settings.java",
				"fileContents": "class Settings { waegnoiwn ngoawengo }"
			},
			{
				"filePath": "ViewPager.java",
				"fileContents": "class MainActivity.java { waegnoiwn ngoawengo }"
			},
			{
				"filePath": "CalendarEventActivity.java",
				"fileContents": "class MainActivity.java { waegnoiwn ngoawengo }"
			},
			{
				"filePath": "layout_main.xml",
				"fileContents": "class MainActivity.java { waegnoiwn ngoawengo }"
			}
		]
		resolve(list);
	});
}

function createWebHook(repo)
{
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
					"url": "https://requestb.in/rby5s0rb",
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
