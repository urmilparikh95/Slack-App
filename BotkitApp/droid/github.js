var Promise = require("bluebird");

var gitCredentials = process.env.githubToken;

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

exports.getFilesFromRepo = getFilesFromRepo;