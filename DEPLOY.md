
### Deployment

We have deployed our Droid Bot to an Amazon-EC2 instance and for this purpose, we have used following deployment script:
[]()

##### Steps to run the scripts:




### Acceptance Testing:

##### The Droid Bot:
Droid is an Android library recommender Bot that analyzes Android code from a given github repositoy and recommends Android libraries that can be used in the code. Thus, the Droid Bot suggests libraries which can help improve the quality of your code.


We have deployed the Droid bot to the following Slack channel](). For the purpose of testing, We have created two dummy users. The credentials for the dummy users are as follows:
for The Use cases for the Bot are as follows:

| User ID     | Password      | Slack user name |
| ------------- | ------------|-----------------| 
|               |             |                 |
|               |             |                 |

Log into the channel given above using any of the login credentials.

##### General Instructions:

1. For the purpose of testing, we used a sample Android application. The github repository containing the code for this sample application can be found [here](https://github.com/joshio1/DroidRecommenderAndroidSample). Thus, you can use this sample github repository as an input to the Droid Bot while testing.

2. As mentioned above, we have depolyed our Droid Bot on an Amazon EC2 instance. In order to improve our messaging with the Bot, we have added a slack application instead of a Bot user. We have added the Bot application to our [slack team](https://se-bot-project.slack.com/messages/D7NNV7X44/). Login into this slack team using the credentials mentioned above.

3. We have created a channel- [droid_test]() for communicating with the Droid Recommender Bot. Now, we invited the Droid Recommender Bot to this channel by typing the following in the chat box for the given channel:

```
/invite @Droid Recommender
```
4. The next step is to configure the Bot. For configuring the Bot, type the following in the chat box:

```
@Droid Recommender please configure me
```

5. The Bot will then ask you for the URL of the Github repository to be monitored. Enter the URL of the [sample repository](https://github.com/joshio1/DroidRecommenderAndroidSample) we used for testing in the chat box:
```
https://github.com/joshio1/DroidRecommenderAndroidSample
```
6. The Bot will then store the repository in it's database. Now you can type
```
Suggest me some libraries
```
to get the library recommendations.

7. The Bot will then check if you have a Github repository configured. If a repository has been configured, the bot will then ask you about the type of recommendations you want as shown in the screenshot below:

![](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Images/Screen%20Shot%201.png)


#### Use cases:

The use cases vary depending on the type of recommendations you want. We have used message buttons They are as follows:

##### Use case I: 
In this case, the bot will suggest different recommendations related to UI components such as Buttons, ProgressBar etc.

1. When asked to select the type of recommendation, click on "UI". 
2. The Bot will then scan the code and it will recommend UI libraries according to the UI elements that have been used in the code that is being analyzed.
3. For the given sample repository, it should give the reply as described:
  * 
##### Use case II: 
This case is concerned with providing library recommendations for Java code.

1. When asked to select the type of recommendation, click on "Code". 
2. The Bot will then scan the code and it will recommend Java code libraries accordingly to improve the quality of code.
3. For the given sample repository, it will give the output as follows:

##### Use Case III:
This use case consists of providing general refactoring tips according to the best practices for Android development.



### Task Tracking:

Please find task tracking at ()[]

### Screencast:

Please find the screencast demonstrating the working of our Droid Bot [here]()



