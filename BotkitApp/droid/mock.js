var sinon = require('sinon');
var data = require("./mock.json");

function loadMockData(database, github, droid){
    
    //Mock Data
    var save = sinon.stub(database, "saveUserInfo");
    save.withArgs('test_user1',
        'https://github.com/joshio1/DroidRecommenderAndroidSample')
        .resolves(true);
    save.withArgs({"name": "Test User2", "email": "dummy_email@bot.com"},
        {"git_repo_url": "https://github.ncsu.edu/dummy_user/dummy_repo2"})
        .rejects("Unable to store data in the database!");
    
    var get = sinon.stub(database, "getUserInfo");
    get.withArgs(data.user_repos[0].user).resolves(data.user_repos[0]);
    get.withArgs(data.user_repos[1].user).resolves(data.user_repos[1]);
    get.withArgs(data.user_repos[2].user).resolves(data.user_repos[2]);
    get.withArgs(data.user_repos[3].user).resolves(data.user_repos[3]);
    get.withArgs(data.user_repos[4].user).resolves(data.user_repos[4]);

    var github_mock = sinon.stub(github, "getFilesFromRepo");
    github_mock.withArgs(data.user_repos[0].repo_link).resolves(data.repos[0]);
    github_mock.withArgs(data.user_repos[1].repo_link).resolves(data.repos[1]);
    github_mock.withArgs(data.user_repos[2].repo_link).resolves(data.repos[2]);
    github_mock.withArgs(data.user_repos[3].repo_link).resolves(data.repos[3]);
    github_mock.withArgs(data.user_repos[4].repo_link).resolves(data.repos[4]);

    var droid_code_lib = sinon.stub(droid, "getCodeLibraries");
    droid_code_lib.withArgs(data.repos[0].files).resolves(data.recommendations[9]);
    droid_code_lib.withArgs(data.repos[1].files).resolves(data.recommendations[9]);
    droid_code_lib.withArgs(data.repos[2].files).resolves(data.recommendations[9]);
    droid_code_lib.withArgs(data.repos[3].files).resolves(data.recommendations[9]);
    droid_code_lib.withArgs(data.repos[4].files).resolves(data.recommendations[9]);

    var droid_ui_lib = sinon.stub(droid, "getUiLibraries");
    droid_ui_lib.withArgs(data.repos[0].files).resolves(data.recommendations[8]);
    droid_ui_lib.withArgs(data.repos[1].files).resolves(data.recommendations[8]);
    droid_ui_lib.withArgs(data.repos[2].files).resolves(data.recommendations[8]);
    droid_ui_lib.withArgs(data.repos[3].files).resolves(data.recommendations[8]);
    droid_ui_lib.withArgs(data.repos[4].files).resolves(data.recommendations[8]);

    var droid_refactorings = sinon.stub(droid, "getCodeRefactoringSuggestions");
    droid_refactorings.withArgs(data.repos[0].files).resolves(data.recommendations[10]);
    droid_refactorings.withArgs(data.repos[1].files).resolves(data.recommendations[10]);
    droid_refactorings.withArgs(data.repos[2].files).resolves(data.recommendations[10]);
    droid_refactorings.withArgs(data.repos[3].files).resolves(data.recommendations[10]);
    droid_refactorings.withArgs(data.repos[4].files).resolves(data.recommendations[10]);

    var droid_all = sinon.stub(droid, "getAllSuggestions");
    droid_all.withArgs(data.repos[0].files).resolves(data.recommendations[7]);
    droid_all.withArgs(data.repos[1].files).resolves(data.recommendations[7]);
    droid_all.withArgs(data.repos[2].files).resolves(data.recommendations[7]);
    droid_all.withArgs(data.repos[3].files).resolves(data.recommendations[7]);
    droid_all.withArgs(data.repos[4].files).resolves(data.recommendations[7]);

}

exports.loadMockData = loadMockData;