
# Droid: Android Library Recommender Bot.
Droid is a Slack-based bot for Android library recommendations. It was developed over the course of the Fall 2017 semester as part of course project for the course CSC 510 under the guidance of Dr. Christopher Parnin at the NC State University.

## Presentation:

Please find the screencast demonstrating the working of our Droid Bot [here](https://www.youtube.com/watch?v=5jV6bEREovA)


## Problem Statement:  
Android development is an exciting and at times challenging area of application development. In spite of having experience in coding on other platforms, starting development on Android apps involves a steep learning curve. Android development is supported by a set of resources (libraries and features) that are openly available for reuse by other developers in their applications. For a beginner in Android app development, being aware of these existing libraries and other open-source features is unlikely/difficult, restricting the beginner from leveraging the expertise of the developer community and being informed of the generally followed coding conventions. **Our bot aims to solve this problem by recommending existing libraries to users by analyzing their code and thus, provide the users with a choice to optimize their code by integrating these libraries into their code. The Droid Bot aims to making it easy for a beginner Android developer to leverage the resources provided by the Android developer community.** 


## Primary Features:
Droid is a Slack based Bot with the following features:  
* **Provide recommendations for API libraries:** This case is concerned with providing library recommendations for Java code.  
* **Provide recommendations for UI libraries:** In this case, the bot will suggest different recommendations related to UI components such as Buttons, ProgressBar etc.   
* **Code refactoring suggestions:** This use case consists of providing general refactoring tips according to the best practices for Android development.  

In short, **Droid** provides library recommendations to the Android developers for improving their application code, application user interface, and code quality. Droid suggests different android libraries and utilities to refactor the application code and optimize it. It also provides suggestions on how to beautify the application interface by recommending various layouts and styles for the controls used to develop the application graphics.


## Limitations:
**Pre-conditions:** Droid is designed specifically, for Android projects only. A user must have understanding of Android design components before hand as well as experience with Github.  
**Droid** has a few other limitations:  
* Droid  will give recommendations only for those rules which are matched unambiguously.  
* If there is any library which can be recommended for android as a whole and not for a specific piece of code or functionality, such libraries will not be considered.  
*  The bot will provide static analysis for Android JAVA code, XML files and would not work with any other files.


## Development process:

The project was completed keeping in mind the following milestones:  
* **Design:**  This involved completing the design sketches and architecture diagrams for the proposed bot.  
* **Bot:** We implemented the Mocking Service component to support service integration. It also involved performing bot integration and selenium testing.  
* **Service:**  The actual bot implementation was performed during this period where we implemented the different functionalities in the bot: Database functionality, Github functionality, Parsing functionality and Recommendation functionality.  
* **Deployment:** By this time, we had deployed our Droid Bot to an Amazon-EC2 instance.    

## Important Links:

* Milestone 1: [DESIGN](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/DESIGN.md)
* Milestone 2: [BOT](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/README_M2.md)
* Milestone 3: [SERVICE](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/README_M3.md)
* Milestone 4: [DEPLOY](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/README_M4.md)
* Milestone 5: [REPORT](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/edit/master/REPORT.md)


**Task Tracking:**  We also performed continuous task tracking using Trello for [Bot](https://trello.com/b/TOCZ77rb/android-recommender), [Service](https://trello.com/b/QfvJ0xst/service-milestone), [Deploy](https://trello.com/b/4s99IqfE/deploy-milestone). We also maintained a separate [worksheet](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Worksheet.md) to keep a track of tasks we planned for the bot implementation.  
