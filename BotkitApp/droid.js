var Promise = require("bluebird");

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

exports.getCodeLibraries = getCodeLibraries;
exports.getUiLibraries = getUiLibraries;
exports.getCodeRefactoringSuggestions = getCodeRefactoringSuggestions;
exports.getAllSuggestions = getAllSuggestions;