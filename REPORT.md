
# Droid: Android Library Recommender Bot.
Droid is a Slack-based bot for Android library recommendations. It was developed over the course of the Fall 2017 semester as part of course project for the course CSC 510 under the guidance of Dr. Christopher Parnin at the NC State University.

## Presentation:

Please find the screencast demonstrating the working of our Droid Bot [here](https://www.youtube.com/watch?v=Nx5agZH0Rtw&feature=youtu.be)


## Problem Statement:  

Android development is an exciting and at times challenging area of application development. In spite of having experience in coding on other platforms, starting development on Android apps involves a steep learning curve. Android development is supported by a set of resources (libraries and features) that are openly available for reuse by other developers in their applications. For a beginner in Android app development, being aware of these existing libraries and other open-source features is unlikely/difficult, restricting the beginner from leveraging the expertise of the developer community and being informed of the generally followed coding conventions. **Our bot aims to solve this problem by recommending existing libraries to users by analyzing their code and thus, provide the users with a choice to optimize their code by integrating these libraries into their code. The Droid Bot aims to making it easy for a beginner Android developer to leverage the resources provided by the Android developer community.** 

#### How the Bot helps:

The Droid Bot aims at making it easy for a beginner Android developer to leverage the resources provided by the Android developer community. Reusing code that has been pre-built and pre-tested increases the reliability of a new application and reduces programming and testing effort. Utilizing an existing library in your code can help establish better programming practices, help make use of appropriate design patterns and new programming tools. In addition, developers continue to add new features and provide upgrades throughout an application’s lifetime. A library upgrade can provide new functionality, improved performance, or improved quality without additional programming effort by library user. In case of discovery of new bugs or issues, it is always easier and more reliable to use upgraded versions of the frameworks and libraries (which provide the required functionality) that are released periodically. Thus, utilizing existing libraries and frameworks is always a good practice. Therefore, beginner programmers should have an easy access to these set of libraries rather than having to comb through the plethora of results that he/she would get by doing a simple google search or some similar generic search.


## Primary Features:
Droid is a Slack based Bot with the following features:  

The Bot first lets you configure a Github repository that contains Android application code for which you need library recommendations and which needs to be monitored. It then gives you four choices to choose the type of recommendation you want:
The following screenshot depicts this:

 ![](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Images/Screen%20Shot%201.png)
 
 
* **Provide recommendations for API libraries:** This case is concerned with providing library recommendations for Java code. Here is a screenshot depicting this use case:

![](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Images/Screen%20Shot%202-1.png)

* **Provide recommendations for UI libraries:** In this case, the bot will suggest different recommendations related to UI components such as Buttons, ProgressBar etc.   
The following screenshot shows this use case:

![](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Images/Screen%20Shot%201-1.png)

* **Code refactoring suggestions:** This use case consists of providing general refactoring tips according to the best practices for Android development.  

![](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Images/Screen%20Shot%203-1.png)

In short, **Droid** provides library recommendations to the Android developers for improving their application code, application user interface, and code quality. Droid suggests different android libraries and utilities to refactor the application code and optimize it. It also provides suggestions on how to beautify the application interface by recommending various layouts and styles for the controls used to develop the application graphics.


## Limitations:
**Pre-conditions:** Droid is designed specifically, for Android projects only. A user must have understanding of Android design components before hand as well as should have experience with Github.  
**Droid** has a few other limitations:  
* Droid  will give recommendations only for those rules which are matched unambiguously.  
* If there is any library which can be recommended for android as a whole and not for a specific piece of code or functionality, such libraries will not be considered.  
*  The bot will provide static analysis for Android JAVA code, XML files and would not work with any other files.


## Development process and Reflection:

The project was completed keeping in mind the following milestones:  
* **Design:**  This involved completing the design sketches and architecture diagrams for the proposed bot.  
* **Bot:** We implemented the Mocking Service component to support service integration. It also involved performing bot integration and selenium testing.  
* **Service:**  The actual bot implementation was performed during this period where we implemented the different functionalities in the bot: Database functionality, Github functionality, Parsing functionality and Recommendation functionality.  
* **Deployment:** By this time, we had deployed our Droid Bot to an Amazon-EC2 instance.    

### Reflection on each phase and development process:

* **For milestone-1 design**, we described the problem statement for a bot along with the architecture design that we were planning to use for the development process. It also involved understanding the problem statement and coming up with design patterns for the development of the bot etc. We had to be careful in deciding what kind of design pattern could be utilized for this project since our future strategy relied on it. We came up with using event systems and batch sequential design pattern. The functionalities provided by the bot were such that both, explicit and implicit invocation was relevant. For eg. User could either explicitly request for recommendations or could be implicitly notified of recommendations whenever he/she pushes the code into the repository. This was our initial understanding and design conclusions. We modified our design and refined our problem statement after recommendations from the professor and feedback recieved from the TAs as well. One more major component of this phase was deciding the technology stack which was one of the important parts of project.


* **For milestone-2 bot**, we came up with the implementation logic for the bot and developed the basic framework or skeleton for the application code. We implemented mock services and data to support service integration. For example, we mocked github user data for the bot to use, that helped us to mock git configuration with the bot. Hooks were also implemented in the code and these hooks listened for specific keywords and on occurence of such words, the execution sequence transfered to the callback function corresponding to those listeners. By this stage, the bot had been implemented in Slack and Our bot had an interactive communication with the user, whereby the user could ask for suggestions for his Android code. To support testing of our bot, we used Selenium testing to verify that the bot was returning the correct response based on a input message. To track the development process, we used trello cards to track and manage tasks assigned to each person.

* **For milestone-3 Service**, we implemented the service part of bot i.e. integrating the GitHub API for configuring a GitHub Repository. We implemented the code for all our modules for the use cases that were proposed. We had to refine our use cases as we advanced with the development and implementation as we gradually understood the feasibility of our design. Accordingly, we enhanced our scope to include functionalities as well as we had to restrict it in some cases where we realized the limitations of our design. A big takeway from this phase was realizing the well-known fact that requirements change over time and hence the fact that Agile Software Developers' teams should always be ready to embrace change.

* **For milestone-4 Deploy**, we deployed the application on an Amazon EC-2 instance to make the bot forever running. We used ansible server script to deploy this application along with all the dependent packages required to make bot run on Amazon EC2.
Thus, this phase helped us in getting a hang of configuaration management and issues that could be faced during it.

Overall, it was been a great journey with lot of learning during each of the phases of the project. This project helped us experience a software development process in every perspective. Throughout this project, we made use of agile methodology which was quite helpful to understand the requirement at early stages and incorporate the changes as and when a need for them was realized as we moved further down the phases. It also gave us a first hand experience of working in a team environment as well as put into practice everything that we learnt in the course.

## Important Links:

* Milestone 1: [DESIGN](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/DESIGN.md)
* Milestone 2: [BOT](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/README_M2.md)
* Milestone 3: [SERVICE](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/README_M3.md)
* Milestone 4: [DEPLOY](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/README_M4.md)
* Milestone 5: [REPORT](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/edit/master/REPORT.md)


**Task Tracking:**  We also performed continuous task tracking using Trello for [Bot](https://trello.com/b/TOCZ77rb/android-recommender), [Service](https://trello.com/b/QfvJ0xst/service-milestone), [Deploy](https://trello.com/b/4s99IqfE/deploy-milestone). We also maintained a separate [worksheet](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Worksheet.md) to keep a track of tasks we planned for the bot implementation.  
