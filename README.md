# CSC 510 Fall 2017 Project- Milestone II (Bot)

## Droid: An Android library recommender Bot.


#### Team Details:     

| Team Member   | Unity Id   | 
| ------------- | ------------  | 
| Omkar Joshi | onjoshi |
| Gautami Khandekar | gmkhande | 
| Sneha Kulkarni | skkulkar | 
| Urmil Parikh | uparikh |
| Shriyansh Yadav | scyadav |  

## 1. Use Cases:  


   The refined Use cases can be found at [Use Cases](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/usecases.md)   
   
   
## 2. Mocking Service Component:    


## 3. Bot Implementation:  

#### Bot Platform:

   Hooks have been implemented in the code which listen for specific keywords and on occurance of such words, the  execution sequence is    transfered to the callback function corresponding to those listeners. The callback functions provide output for the option chosen by    user. Thus, a series of inputs and outputs lead to an interaction between bot and user. The functions haven't been implemented for      this milestone but their functionality has been tested using mocked objects.


#### Bot Integration:    

   The bot has been implemented in Slack. Our bot has an interactive communication with the user, whereby the user asks suggestions for    his Android code. This help is restricted to just recommendations regarding Android API libraries, UI libraries, and refactoring of      code for selected instances.


## 4. Selenium Testing:  
   To support testing of our bot, we have used Selenium testing to verify that the bot is returning the correct response based on a input message.
   Pre-requisite: Setup the environment variables in the Run Configurations of Eclipse for user email and password with variable name as SLACK_EMAIL and SLACK_PASSWORD.

## 5. Task Tracking:  
   
   
   The progress of each week (iteration), describing the tasks completed for the slack bot, can be found at [Worksheet.md](https://github.ncsu.edu/uparikh/CSC-510-Bot-Controller/blob/master/Worksheet.md)


## 6. Screencast:  

Here is a link to our [screencast]().
