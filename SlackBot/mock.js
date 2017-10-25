var sinon = require('sinon');
var data = require("./mock.json");

function loadMockData(database, github, droid){
    
        //Mock Data
        var save = sinon.stub(database, "save");
        save.withArgs("test_user", "test_repo.git").resolves(true);
        save.withArgs("test_user", "fail_test_repo.git").rejects("Repository could not be saved in the database!");
    
        var get = sinon.stub(database, "get");
        get.withArgs("a").resolves(data.user_repos[0]);
        get.withArgs("b").resolves(data.user_repos[1]);
        get.withArgs("c").resolves(data.user_repos[2]);
        get.withArgs("d").resolves(data.user_repos[3]);
        get.withArgs("e").resolves(data.user_repos[4]);
    
        var github_mock = sinon.stub(github, "getFilesFromRepo");
        github_mock.withArgs(data.user_repos[0].repo_link, data.user_repos[0].credential).resolves(data.repos[0]);
        github_mock.withArgs(data.user_repos[1].repo_link, data.user_repos[1].credential).resolves(data.repos[1]);
        github_mock.withArgs(data.user_repos[2].repo_link, data.user_repos[2].credential).resolves(data.repos[2]);
        github_mock.withArgs(data.user_repos[3].repo_link, data.user_repos[3].credential).resolves(data.repos[3]);
        github_mock.withArgs(data.user_repos[4].repo_link, data.user_repos[4].credential).resolves(data.repos[4]);
    
        var droid_code_lib = sinon.stub(droid, "getCodeLibraries");
        droid_code_lib.withArgs(data.repos[0].files).resolves(data.recommendations[0]);
        droid_code_lib.withArgs(data.repos[1].files).resolves(data.recommendations[0]);
        droid_code_lib.withArgs(data.repos[2].files).resolves(data.recommendations[0]);
        droid_code_lib.withArgs(data.repos[3].files).resolves(data.recommendations[0]);
        droid_code_lib.withArgs(data.repos[4].files).resolves(data.recommendations[0]);
    
        var droid_ui_lib = sinon.stub(droid, "getUiLibraries");
        droid_ui_lib.withArgs(data.repos[0].files).resolves(data.recommendations[1]);
        droid_ui_lib.withArgs(data.repos[1].files).resolves(data.recommendations[1]);
        droid_ui_lib.withArgs(data.repos[2].files).resolves(data.recommendations[1]);
        droid_ui_lib.withArgs(data.repos[3].files).resolves(data.recommendations[1]);
        droid_ui_lib.withArgs(data.repos[4].files).resolves(data.recommendations[1]);
    
        var droid_refactorings = sinon.stub(droid, "getCodeRefactoringSuggestions");
        droid_refactorings.withArgs(data.repos[0].files).resolves(data.recommendations[2]);
        droid_refactorings.withArgs(data.repos[1].files).resolves(data.recommendations[2]);
        droid_refactorings.withArgs(data.repos[2].files).resolves(data.recommendations[2]);
        droid_refactorings.withArgs(data.repos[3].files).resolves(data.recommendations[2]);
        droid_refactorings.withArgs(data.repos[4].files).resolves(data.recommendations[2]);
    
        var droid_all = sinon.stub(droid, "getAllSuggestions");
        droid_all.withArgs(data.repos[0].files).resolves(data.recommendations[3]);
        droid_all.withArgs(data.repos[1].files).resolves(data.recommendations[3]);
        droid_all.withArgs(data.repos[2].files).resolves(data.recommendations[3]);
        droid_all.withArgs(data.repos[3].files).resolves(data.recommendations[3]);
        droid_all.withArgs(data.repos[4].files).resolves(data.recommendations[3]);   
    
}

exports.loadMockData = loadMockData;
