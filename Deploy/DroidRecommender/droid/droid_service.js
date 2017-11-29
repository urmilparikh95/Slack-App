var Promise = require("bluebird");
var japa = require("java-parser");

function getCodeLibraries(file_list){
	return new Promise(function (resolve, reject) 
	{
		//Get All Suggestions, i.e. Recommended UI libraries, Code Libraries, and CodeRefactorings
		var builder = analyze(file_list, new CodeFileBuilder());
		if (checkIfBuilderEmpty(builder)){
			resolve(builder);
		}else{
			reject("Suggestions could not be found!");
		}
	});
}

function getUiLibraries(file_list){
	return new Promise(function (resolve, reject) 
	{
		//Get All Suggestions, i.e. Recommended UI libraries, Code Libraries, and CodeRefactorings
		var builder = analyze(file_list, new UiFileBuilder());
		if (checkIfBuilderEmpty(builder)){
			resolve(builder);
		}else{
			reject("Suggestions could not be found!");
		}
	});
}

function getCodeRefactoringSuggestions(file_list){
	return new Promise(function (resolve, reject) 
	{
		//Get All Suggestions, i.e. Recommended UI libraries, Code Libraries, and CodeRefactorings
		var builder = analyze(file_list, new GeneralFileBuilder());
		if (checkIfBuilderEmpty(builder)){
			resolve(builder);
		}else{
			reject("Error! Suggestions could not be found!");
		}
	});
}

function getAllSuggestions(file_list){
	return new Promise(function (resolve, reject) 
	{
		//Get All Suggestions, i.e. Recommended UI libraries, Code Libraries, and CodeRefactorings
		var builder = analyze(file_list, new AllFileBuilder());
		if (checkIfBuilderEmpty(builder)){
			resolve(builder);
		}else{
			reject("Suggestions could not be found!");
		}
	});
}

function checkIfBuilderEmpty(builder){
	if (builder){
		for (let key of Object.keys(builder)) {
			if (builder[key].length > 0){
				return true;	
			}
		}
		return false;
	}else{
		return false;
	}
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

function pixelExists(file_content){
	// checking if the code uses this type of object
	return (file_content.indexOf('px"')) != -1
}

function analyze(fileListInput, builder){
	//allBuilder is a builder for all types of data such as code, UI, and general.
	//builder is the builder for specific type of data. eg. code, UI, general.
	var allBuilder = new AllFileBuilder();
	for(var i=0; i < fileListInput.length; i++){
		var filePath = fileListInput[i].filePath;
		var fileContents = fileListInput[i].fileContents;
		//Handle .java as well as xml's
		if (filePath.indexOf(".java") != -1){

			if (asyncHttpClientExists(fileContents) && builder.hasOwnProperty("AsyncHttpClient")){
				allBuilder.AsyncHttpClient.push(filePath)
			}
			
			if (viewPagerExists(fileContents) && builder.hasOwnProperty("ViewPager")){
				allBuilder.ViewPager.push(filePath)
			}

			// //Sample code for JAVA parsing, if required
			// var ast = japa.parse(fileContents);
			// // Tranverse program with a function visitor.
			// traverseWithParents(ast, function (tree) 
			// {
			// 	if (tree.node === 'ImportDeclaration') 
			// 	{
			// 		// console.log(tree);
			// 		//TODO
			// 	}
			// 	//Sample
			// });


		}
		else if(filePath.indexOf(".xml") != -1){
			if (progressBarExists(fileContents) && builder.hasOwnProperty("ProgressBar")){
				allBuilder.ProgressBar.push(filePath)
			}
			if (calendarViewExists(fileContents) && builder.hasOwnProperty("CalendarView")){
				allBuilder.CalendarView.push(filePath)
			}
			if (calendarViewExists(fileContents) && builder.hasOwnProperty("Pixels")){
				allBuilder.Pixels.push(filePath)
			}
		}
	}
	console.log("Builder: "+JSON.stringify(allBuilder));
	return allBuilder;
}

// A builder for storing file level information.
function AllFileBuilder()
{
	// AsyncHttpClient exists in file.
	this.AsyncHttpClient = [];
	// ProgressBar exists in file.
	this.ProgressBar = [];
	// ViewPager exists in file.
	this.ViewPager = [];
	// CalendarView exists in file.
	this.CalendarView = [];
	// Pixels exists in file
	this.Pixels = [];
}

// A builder for storing file level information.
function UiFileBuilder()
{
	// ProgressBar exists in file.
	this.ProgressBar = [];
	// ViewPager exists in file.
	this.ViewPager = [];
	// CalendarView exists in file.
	this.CalendarView = [];
}

// A builder for storing file level information.
function CodeFileBuilder()
{
	// AsyncHttpClient exists in file.
	this.AsyncHttpClient = [];
}


// A builder for storing file level information.
function GeneralFileBuilder()
{
	//Pixels exists in file
	this.Pixels = [];
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