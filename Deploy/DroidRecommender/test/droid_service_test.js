var chai = require("chai");
var expect = chai.expect;
var droid_service = require("../droid/droid_service");
var fs = require("fs");
var path = require('path');

describe('droid_service', function(){

    var mainActivityContent = fs.readFileSync("test/MainActivity.java", "utf8");
    var layoutContent = fs.readFileSync("test/activity_test.xml", "utf8");
    var fileListInput = [{"filePath": "test/MainActivity.java", "fileContents": mainActivityContent}, 
                 {"filePath": "test/activity_test.xml", "fileContents": layoutContent}]

    it(' #analyze() must return true for AsyncHttpClient in MainActivity.java', function(done) {
        var result = droid_service.analyze(fileListInput)
        expect(result).to.haveOwnProperty("AsyncHttpClient"); 
        expect(result.AsyncHttpClient).to.be.an('array').to.include('test/MainActivity.java');
        done();
    });

    it(' #analyze() must return true for ProgressBar in activity_test.xml', function(done) {
        var result = droid_service.analyze(fileListInput)
        expect(result).to.haveOwnProperty("ProgressBar"); 
        expect(result.ProgressBar).to.be.an('array').to.include('test/activity_test.xml');
        done();
    });

    it(' #analyze() must return true for ViewPager in MainActivity.java', function(done) {
        var result = droid_service.analyze(fileListInput)
        expect(result).to.haveOwnProperty("ViewPager"); 
        expect(result.ViewPager).to.be.an('array').to.include('test/MainActivity.java');
        done();
    });

    it(' #analyze() must return true for CalendarView in MainActivity.java', function(done) {
        var result = droid_service.analyze(fileListInput)
        expect(result).to.haveOwnProperty("CalendarView"); 
        expect(result.CalendarView).to.be.an('array').to.include('test/activity_test.xml');
        done();
    });

});