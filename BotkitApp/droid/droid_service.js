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

function progressBarExists(file_content){
	return true;
}

function calendarViewExists(file_content){
	return true;
}

function viewPagerExists(file_content){
	return true;
}

function asyncHttpClientExists(file_content){
	//TODO
	return (file_content.indexOf('com.loopj.android.http.AsyncHttpClient')) != -1
}

function analyze(file_content){
	var ast = japa.parse(file_content);
	var builder = new FileBuilder();
	builder.FileName = "";
	// Tranverse program with a function visitor.
	traverseWithParents(ast, function (tree) 
	{
		builder.AsyncHttpClients = asyncHttpClientExists(file_content);
		if (tree.node === 'ImportDeclaration') 
		{
			console.log(tree);
			//TODO
		}
	});
	console.log("Builder: "+JSON.stringify(builder));
	return builder;
}

// A builder for storing file level information.
function FileBuilder()
{
	this.FileName = "";
	// AsyncHttpClient exists in file.
	this.AsyncHttpClients = false;
	// Number of imports in a file.
	this.ImportCount = 0;

	this.report = function()
	{
		console.log (
			( "{0}\n" +
			  "~~~~~~~~~~~~\n"+
			  "ImportCount {1}\t" +
			  "AsyncHttpClient: {2}\n"
			).format( this.FileName, this.ImportCount, this.AsyncHttpClients ));
	}
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