var Promise = require("bluebird");
var japa = require("java-parser");

function getCodeLibraries(file_list){
	return new Promise(function (resolve, reject) 
	{
		//Get Recommended Code Libraries
		var list = ['Butterknife']
		resolve(list);
	});
}

function getUiLibraries(file_list){
	return new Promise(function (resolve, reject) 
	{
		//Get Recommended UI Libraries
		var list = ['Button Factory']
		resolve(list);
	});
}

function getCodeRefactoringSuggestions(file_list){
	return new Promise(function (resolve, reject) 
	{
		//Get Recommended CodeRefactorings
		var list = ['Please use dp instead of pixels']
		resolve(list);
	});
}

function getAllSuggestions(file_list){
	return new Promise(function (resolve, reject) 
	{
		//Get All Suggestions, i.e. Recommended UI libraries, Code Libraries, and CodeRefactorings
		var list = ['Please use dp instead of pixels']
		resolve(list);
	});
}

// Here we check if the file contains a specific keyword in order to provide suggestions 
function progressBarExists(file_content){
	// checking if the code uses this type of object
	return (file_content.indexOf('ProgressBar')) != -1
}

function calendarViewExists(file_content){
	// checking if the code uses this type of object
	return (file_content.indexOf('CalendarView')) != -1
}

function viewPagerExists(file_content){
	// checking if the code uses this type of object
	return (file_content.indexOf('android.support.v4.view.ViewPager')) != -1
}

function asyncHttpClientExists(file_content){
	// checking if the code uses this type of object
	return (file_content.indexOf('com.loopj.android.http.AsyncHttpClient')) != -1
}

function analyze(fileListInput){
	var builder = new FileListBuilder();
	for(var i=0; i < fileListInput.length; i++){
		var filePath = fileListInput[i].filePath;
		var fileContents = fileListInput[i].fileContents;
		//Handle .java as well as xml's
		if (filePath.indexOf(".java") != -1){

			if (asyncHttpClientExists(fileContents)){
				builder.AsyncHttpClient.push(filePath)
			}
			
			if (viewPagerExists(fileContents)){
				builder.ViewPager.push(filePath)
			}

			//Sample code for JAVA parsing, if required
			var ast = japa.parse(fileContents);
			// Tranverse program with a function visitor.
			traverseWithParents(ast, function (tree) 
			{
				if (tree.node === 'ImportDeclaration') 
				{
					// console.log(tree);
					//TODO
				}
				//Sample
			});


		}
		else if(filePath.indexOf(".xml") != -1){

			if (progressBarExists(fileContents)){
				builder.ProgressBar.push(filePath)
			}

			if (calendarViewExists(fileContents)){
				builder.CalendarView.push(filePath)
			}

		}
	}
	console.log("Builder: "+JSON.stringify(builder));
	return builder;
}

// A builder for storing file level information.
function FileListBuilder()
{
	// AsyncHttpClient exists in file.
	this.AsyncHttpClient = [];
	// ProgressBar exists in file.
	this.ProgressBar = [];
	// ViewPager exists in file.
	this.ViewPager = [];
	// CalendarView exists in file.
	this.CalendarView = [];

	// this.report = function()
	// {
		// console.log (
		// 	( "{0}\n" +
		// 	  "~~~~~~~~~~~~\n"+
		// 	  "ImportCount {1}\t" +
		// 	  "AsyncHttpClient: {2}\n"
		// 	).format( this.FileName, this.ImportCount, this.AsyncHttpClients ));
	// }
}

// A function following the Visitor pattern.
// Annotates nodes with parent objects.
function traverseWithParents(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverseWithParents(child, visitor);
            }
        }
    }
}

exports.getCodeLibraries = getCodeLibraries;
exports.getUiLibraries = getUiLibraries;
exports.getCodeRefactoringSuggestions = getCodeRefactoringSuggestions;
exports.getAllSuggestions = getAllSuggestions;
exports.progressBarExists = progressBarExists;
exports.calendarViewExists = calendarViewExists;
exports.viewPagerExists = viewPagerExists;
exports.asyncHttpClientExists = asyncHttpClientExists;
exports.analyze = analyze;