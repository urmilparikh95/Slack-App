var Promise = require("bluebird");
var request = require('request');
var parse = require('parse-link-header');
var fs = require('fs');
var clone = require('git-clone');
var gitpull = require('git-pull');

if (!process.env.githubToken) {
	console.log('Error: Specify githubToken in environment or .env file');
	process.exit(1);
}

function getFilesFromRepo(repo_url) {
	return new Promise(function (resolve, reject) {
		var res = repo_url.split("/");
		var token = "token " + process.env.githubToken; //must be set
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

getFilesFromRepo("https://github.com/joshio1/DroidRecommenderAndroidSample.git").then(function (result) {
	console.log(result);
});

exports.getFilesFromRepo = getFilesFromRepo;