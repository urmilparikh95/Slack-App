
### Code

Please find our code for the deployment milestone in the this [deploy](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/tree/master/Deploy) folder

### Deployment

We have deployed our Droid Bot to an Amazon-EC2 instance and for this purpose, we have used following deployment scripts:

[deploy_bot.yml](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Deploy/deploy_bot.yml): this script needs to be invoked every time we need to push latest code to the server

[setup_bot_server.yml](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Deploy/setup_bot_server.yml): this script will deploy our Droid Bot to a remote environment and needs to be invoked just once.

##### Steps to run the scripts:

1. Invoke the setup_bot_server playbook by running the following command:

```
ansible-playbook setup_bot_server.yml
```
This playbook will install all the dependencies required for the EC2 module and then launch the AWS instance which will create a new AWS instance for us. You will see that a new instance has been created in the Amazon AWS console. Further, we will install the dependencies and modules such as Nodejs, Forever and so on that are required for our Droid Bot. The screencast will give a detailed description of these steps. Finally we will start the server for our Bot application using Forever. Since, this script creates a new AWS instance, it has to be invoked only once in the entire lifetime of the project.

2. Go to your browser and type the <IP address>:<port number>. You will see that our server is up and running. You'll also be able to see a button "Add to Slack" that will let you add the Slack Bot to any Slack team. This indicates that the server has been properly provisioned and deployed.

3. This script will also create an [inventory file](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Deploy/aws_inventory) which will be used to deploy our latest code to the server. 

4. Since we do not want to create a new AWS instance every time, we will use the deploy_bot.yml script with the inventory file to deploy our latest code to the production server. 

5. The deploy_bot.yml script needs to be invoked every time we need to push latest code to the server. Use the following command to invoke the script:

```
ansible-playbook deploy_bot.yml
```

6. Since our server is already up and running on the IP address and port number mentioned in the inventory file, the next steps is to add the bot to your slack team by clicking on the "Add to Slack" button.

7. Further, follow the steps mentioned in the screencast to perform the use cases.

### Acceptance Testing:

##### The Droid Bot:
Droid is an Android library recommender Bot that analyzes Android code from a given github repositoy and recommends Android libraries that can be used in the code. Thus, the Droid Bot suggests libraries which can help improve the quality of your code.


We have deployed the Droid bot to the following Slack channel[](https://se-bot-project.slack.com/messages/C85LLTS8Z/). For the purpose of testing, We have created two dummy users. The credentials for the dummy users are as follows:

| User ID     | Password      | Slack user name |
| ------------- | ------------|-----------------| 
| droidcsc510a@gmail.com | slackbot | TA1 |
| droidcsc510@gmail.com | slackbot | TA2 |

Log into the channel given above using any of the login credentials.

##### General Instructions:

1. For the purpose of testing, we used a sample Android application. The github repository containing the code for this sample application can be found [here](https://github.com/joshio1/DroidRecommenderAndroidSample). Thus, you can use this sample github repository as an input to the Droid Bot while testing.

2. As mentioned above, we have depolyed our Droid Bot on an Amazon EC2 instance. In order to improve our messaging with the Bot, we have added a slack application instead of a Bot user. We have added the Bot application to our [slack team](https://se-bot-project.slack.com/messages/D7NNV7X44/). Login into this slack team using the credentials mentioned above.

3. We have created a channel- [droid_test](https://se-bot-project.slack.com/messages/C85LLTS8Z/) for communicating with the Droid Recommender Bot. The Droid Recommender Bot has already been invited to this channel.
 
4. The next step is to configure the Bot with a Github repository. For configuring the Bot, type the following in the chat box:

```
@Droid Recommender please configure me
```
Even if you simply type "libraries", the Bot will prompt you to configure a GitHub repository.

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


Now, the following use cases describe the further actions to be taken to get various recommendations.

#### Use cases:

The use cases vary depending on the type of recommendations you want. We have used message buttons to select the type of recommendation. They are as follows:

##### Use case I: UI
In this case, the bot will suggest different recommendations related to UI components such as Buttons, ProgressBar etc.

1. When asked to select the type of recommendation, click on "UI". 
2. The Bot will then scan the code and it will recommend UI libraries according to the UI elements that have been used in the code that is being analyzed.
3. For the given sample repository, it should give the reply as described:
A recommendation for using SmoothProgressBar library is provided as a Progress Bar related UI element was used in the sample [code](https://github.com/joshio1/DroidRecommenderAndroidSample/blob/master/app/src/main/res/layout/activity_main.xml). This recommendation comes with a link detailing it's usage and a code snippet. In addition, you will also get a recommendation to use the SilkCal library instead of the default CalenderView which was used [here](https://github.com/joshio1/DroidRecommenderAndroidSample/blob/master/app/src/main/res/layout/activity_main.xml) in the given sample code. There's also a usage link, a code snippet and a gif image showing how the Calender looks like after you have set this library up in your android applucation. This can be seen in the following screenshot:

![](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Images/Screen%20Shot%201-1.png)

  One more UI related library -ElasticDownload (another ProgressBar library) is recommended for the sample code.
  This is how the Bot gives interactive suggestions.
  
##### Use case II: Code
This case is concerned with providing library recommendations for Java code.

1. When asked to select the type of recommendation, click on "Code". 
2. The Bot will then scan the code and it will recommend Java code libraries accordingly to improve the quality of code.
3. For the given sample repository, it will give the output as follows:
A recommendation to use RetroFit library instead of AsyncHttpClient for web services calls is made because HTTP web service calls have been used in the provided sample code [here](https://github.com/joshio1/DroidRecommenderAndroidSample/blob/5c29a97aa2dfaa0535f991021cf105dbff2dbd94/app/src/main/java/com/wolfhackers/counsellink/MainActivity.java). Along with this, what does the library replace and how it does so, code  snippet for using RetroFit and alternatives to using RetroFit (such as Picasso and okHttp) are also provided. The following screenshot shows that:
  ![](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Images/Screen%20Shot%202-1.png)

##### Use Case III: General
This use case consists of providing general refactoring tips according to the best practices for Android development.
1. When asked to select the type of recommendation, click on "General". 
2. The Bot will then scan the code and it will recommend general good practices to be followed to improve the quality of code.
3. For the given sample repository, it will give the output as follows:
The Bot will recommend you to use Density Independent Pixels i.e to use "dp" instead of "px" in the [this](https://github.com/joshio1/DroidRecommenderAndroidSample/blob/master/app/src/main/res/layout/activity_base.xml) file that is present in the given sample code. This suggestion has been made as it makes an application independent of density or resolution and hence is a good practice to follow. The bot will also tell you how to modify your code to use dp instead of px as shown in the following screenshot:

![](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Images/Screen%20Shot%203-1.png)

Another Use Case that gives all types of suggetsions is also provided. This can be done by clicking on the "all" button.

### Task Tracking:  

Here is the link to our [Worksheet](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Worksheet.md)

Please find task tracking with Trello [here](https://trello.com/b/4s99IqfE/deploy-milestone)

### Screencast:

Please find the screencast demonstrating the working of our Droid Bot [here](https://www.youtube.com/watch?v=5jV6bEREovA)



