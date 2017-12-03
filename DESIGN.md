# 510-Project-Fall 2017-Milestone I: Design

## Droid: An Android library recommender Bot.

## Problem Statement

#### The problem: 
A beginner programmer often learns a new skill by following video tutorials or similar resources which are pretty much restricted in the sense that they only provide the very basic and essential information that is sufficient to get started as well as is at a level that is easy to grasp for the novice programmer. This restricts the beginner from leveraging the expertise of the developer community and being informed of the generally followed coding conventions/idioms.

Android development is an exciting and sometimes challenging area of application development. In spite of having experience in coding on other platforms, starting development on Android apps involves a steep learning curve. Android development is supported by a set of resources such as libraries and features that are openly available for reuse by other developers in their applications. For a beginner in Android app development, being aware of these existing libraries and other open-source features is unlikely/difficult. Our bot aims to solve this problem by recommending existing libraries to users by analyzing their code thereby providing the users with a choice to optimize their code by integrating these libraries into their code.

#### Why it is a problem:

The Droid Bot aims at making it easy for a beginner Android developer to leverage the resources provided by the Android developer community. Reusing code that has been pre-built and pre-tested increases the reliability of a new application and reduces programming and testing effort. Utilizing an existing library in your code can help establish better programming practices, help make use of appropriate design patterns and new programming tools. In addition, developers continue to add new features and provide upgrades throughout an application’s lifetime. A library upgrade can provide new functionality, improved performance, or improved quality without additional programming effort by library user. In case of discovery of new bugs or issues, it is always easier and more reliable to use upgraded versions of the frameworks and libraries (which provide the required functionality) that are released periodically. Thus, utilizing existing libraries and frameworks is always a good practice. Therefore, beginner programmers should have an easy access to these set of libraries rather than having to comb through the plethora of results that he/she would get by doing a simple google search or some similar generic search.



## Bot Description

Droid: An Android Library Recommender Bot is a Slack based Bot which provides library recommendations to the Android developers for improving their application code, application user interface, and code quality. Droid suggests different android libraries and utilities to refactor the application code and optimize it. It also provides suggestions on how to beautify the application interface by recommending various layouts and styles for the controls used to develop the application graphics. The bot static analyzes the code to make sure the developer has followed the Android code conventions.

Droid is a better implementation than any web application or other such resources, as it narrows down the search results and helps in providing only the relevant recommendations for the currently added code. If this same functionality would have been provided by a third party application, the user would have had the overhead of using this third party application every time to get recommendations. Droid responds to git pull requests by parsing the android code fragment that has been added, in order to make android library and UI library related recommendations. Apart from Continuous Integration, user can explicity ask for recommendations. When user asks for recommendation, current code from the repository will be fetched and analyzed by the bot to provide recommendations. Droid can be categorized into the category of Recommender Bots.

## Use Cases

### 1. Use Case: Get recommendations for API code
#### 1 Preconditions:
Specifically, for Android projects only. User must have understanding of Android design components. User must provide GitHub credentials. User must have a public repo on github and must configure it with the bot.
#### 2 Main Flow:
User submits a pull request to merge his code to the remote repository [S1]. Bot will parse the user code [S2]. Bot finds related libraries and posts link related to each recommendations [S3].
#### 3 Subflows:
[S1] User initiates the process by submitting a pull request, with the code, to remote repository.
  
[S2] Bot parses the code to find the patterns as per the defined rules in the database. Bot retrieves the list of recommendations corresponding to the matched rules.
  
[S3] Bot displays the recommendations as: Library Name, Library access link(How to use this library), Description, Recommendation type(API code/UI library).
#### 4 Alternative Flows:
[E1] No recommendations are found if repository does not exist.  

[E2] No recommendations are found if non-Android code files are committed.  


### 2. Use Case: Get recommendations for UI libraries.
#### 1 Preconditions :
Specifically, for Android projects only. User must have understanding of Android design components. User must provide GitHub credentials. User must have a public repo on github and must configure it with the bot.
#### 2 Main Flow:
User will ask for UI library recommendations  [S1]. Bot will act to parse the current user repository code [S2]. Bot displays the recommendations as links related to each recommendation [S3].
#### 3 Subflows:
[S1] User asks for the recommendations related to UI library after submitting a pull request to the remote repository.
 
[S2] Bot identifies list of all recommendations for the user code and filters the list to give specific result. 
 
[S3] Once done, Bot displays the recommendations as: Library Name, Images, Library access link(How to use this library),     Description, Recommendation type(API code/UI library).
#### 4 Alternative Flows:
[E1] No recommendations are found if repository does not exist.  

[E2] No recommendations are found if non-Android code files are committed.  

 

### 3. Use Case: Get static analysis for the code (code refactoring) .
#### 1 Preconditions:
Specifically, for Android projects only. User must have understanding of Android design components. User must provide GitHub credentials. User must have a public repo on github and must configure it with the bot.
#### 2 Main Flow:
User asks for code refactoring recommendations  [S1]. Bot will read and parse the current user code in the repository [S2]. Based on the good Android application development principles, Bot will suggest recommendations [S3].
#### 3 Subflows:
[S1] User asks for code refactoring recommendations. 
  
[S2] Bot parses the code. Based on the restricted options we provide for code refactoring, the Bot lists those applicable for the user’s code.
  
[S3] Bot displays the recommendations as: Recommendation, Description.
#### 4 Alternative Flows:
[E1] No recommendations are found if repository does not exist.  

[E2] No recommendations are found if non-Android code files are committed.  



## Design Sketches

### Wireframe mockup of the Droid bot in action:
This wireframe shows the sequence of steps needed to configure the github repository containing the android project to the slackbot so that it can access it.



![alt text](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/configuration_wireframe.gif)






The following wireframe shows the different use cases. In the first case, if a pull request is created for the code to be merged with the remote repo, the bot parses the code to provides all the necessary recommendations so that the user can make those changes, if necessary, before making changes to the remote repository. Next, user can explicitly mention the type of recommendation he requires. It can be either a recommendation for a java library or a UI library or any necessary code refactoring.



![alt text](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/functionality_wireframe.gif)










### Storyboard: 

![alt text](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Storyboard.PNG)








## Architecture Design:



### Component Diagram:

Following is the architecture diagram along with the components:


![alt text](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Component_Diagram.png)


### Description of Components:

In the above diagram, the top part (one with the ANDROID BOT) is a high-level overview of the system.
The diagram below describes the internal components of the bot and how they interact with each other.

In the internal functioning, the different modules are 

* Git Module
* Code Parser
* Pattern Matching Module
* Output Formatting Module and
* Data stores for Rules, user preferences and git credentials. 

##### User Preferences and Git Credentials(Pre-requisites) – 
When the bot is installed and setup, the bot will ask the user his/her git credentials and repository which he wants to monitor. This will be stored in the Git Credentials data store for the user. Preferences of the user, i.e. whether he wants only library API recommendations or UI library recommendations or coding guidelines suggestions will also be stored in the User Preferences data store.

##### Git Module: 
The Git Module takes git repository data as input.  This can be triggered either explicitly by the user when he wants to receive the recommendations or indirectly by the user when he submits a pull request.  When the user directly requests recommendations, the bot will make a call to the git repository to fetch the latest commit, whereas when he/she submits a pull request, the Git module will automatically receive the latest code either via Webhook or any CI. The Git module will then fetch the recently pushed code and pass it onto the next module which is Code Parser. This is the code on which the static analysis will be performed.

##### Code Parser: 
Since we are only dealing with android JAVA code, we will use a library called “javaparser” to parse the java code. This parser will create an Abstract Syntax Tree which will have the parsed code in an object tree format, i.e. at the top-level will be packages, inside packages will be classes, then we will have methods, and lines and so on. This information will be in an object format with its attributes which can be easily processed by the Pattern Matching module.

##### Pattern Matcher: 
Pattern matcher will receive the AST(Abstract Syntax Tree) created by the Code Parser module. This module will work closely with the “Rules” data store. The rules data store will have a set of rules and a suggestion corresponding to every rule. An example format of the rules data store will be as shown in the following table:


 
| Rule     | Recommendation | Recommendation types |
| ------------- |:-------------:|:-------------:|
| “android. ListView” object created in Activity class in onCreate method | Use [FlabbyListView](https://github.com/jpardogo/FlabbyListView) library for fancy listview | UI Recommendation |
| BitmapFactory.decodeFile is invoked on a “File” object | Use [Glide](https://github.com/bumptech/glide) library | API Code Recommendation |
| jsonObject import found in any class | Use Google’s [gson](https://github.com/google/gson) library | API Code Recommendation |
| Log.v or Log.i or Log.e invocation found | Use Jake Wharton’s [Hugo](https://github.com/JakeWharton/hugo) library | API Code Recommendation |
| Dimensions defined in “px” units | Dimensions should be defined in “dp” | Code Convention / Coding Guidelines Recommendation |

 
 
##### Data Stores for Rules
In the implementation for rules, we can have a Rule object which can have multiple “Assertion” object. The “Assertion” object can take one or more objects. Hence, for example to define the fourth rule for jsonObject we will have an assertion object which has object as “import” and value as “jsonObject”. We will check the code to scan for object of type “import” with value as “jsonObject” in every class. If we find a hit, we will output the recommendation corresponding to this rule. Similarly, we can encode all the textual rules into assertions and rule objects. Note that the rule definition process is a manual process which will be embedded in the code. Since rule definition is a crucial part of the process, we will make sure that the rules are unambiguous such that we do not get any false positives and at the same time are not matched every time. Pattern matcher will give all the recommendations which are matched for the rules defined after scanning the input abstract syntax tree.


##### Output Formatting Module:
This module will receive a list of all the recommendations from the pattern matcher module. All the recommendations will also have a type associated with it. The final filtered list of recommendations will be decided based on the preferences of the user for the recommendation type.


### Constraints and Guidelines:
1. The bot will provide static analysis for Android JAVA code, XML files and would not work with any other files.

2. Bot works with git repository, for now.

3. Slack will be used as a platform for the bot.

4. This bot  will give recommendations only for those rules which are matched unambiguously. If there is any library which can be recommended for android as a whole and not for a specific piece of code or functionality, such libraries will not be considered.  


### Relevant Design patterns:

* Patterns which are relevant to this bot design are event systems.  The functionalities provided by the bot are such that both, explicit and implicit invocation is relevant. For eg. User can either explicitly request for recommendations or is implicitly notified of recommendations whenever he/she pushes the code into the repository.

* Also, internally we have made use of batch sequential design pattern. i.e. the input code is converted to an AST and then processed to find rule matches. Also, the recommendations are also filtered based on the user preferences to output the final preferences.

