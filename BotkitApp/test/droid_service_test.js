var chai = require("chai");
var expect = chai.expect;
var droid_service = require("../droid/droid_service");
var fs = require("fs");
var path = require('path');

describe('droid_service', function(){
    // TEST CASE
    it(' #asyncHttpClient() must return true for MainActivity.java', function(done) {
        var mainActivityContent = fs.readFileSync("test/MainActivity.java", "utf8");
        var result = droid_service.asyncHttpClientExists(mainActivityContent) 
        expect(result).to.equal(true);
        // Call back to let mocha know that test case is done. Need this for asychronous operations.
        done();
    });
    it(' #analyze() must return true for AsyncHttpClient.java', function(done) {
        var mainActivityContent = fs.readFileSync("test/MainActivity.java", "utf8");
        var result = droid_service.analyze(mainActivityContent)
        expect(result).to.haveOwnProperty("AsyncHttpClients"); 
        expect(result.AsyncHttpClients).to.equal(true);
        // Call back to let mocha know that test case is done. Need this for asychronous operations.
        done();
    });
});
