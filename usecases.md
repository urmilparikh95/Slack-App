# Use Cases  

```
1. Use Case: Get recommendations for API code
   1. Preconditions:
      For Android projects only. User must have understanding of Android design components. User must provide GitHub
      credentials. User must have a public repo on github and must configure it with the bot.
   2. Main Flow:
      User submits a pull request to merge his code to the remote repository [S1]. Bot will parse the user code [S2].
      Bot finds related libraries and posts link related to each recommendations [S3].
   3. Subflows:
      [S1] User initiates the process by submitting a pull request, with the code, to remote repository.
      [S2] Bot parses the code to find the patterns as per the defined rules in the database. Bot retrieves the list 
      of recommendations corresponding to the matched rules.
      [S3] Bot displays the recommendations as: Library Name, Library access link(How to use this library), 
      Description, Recommendation type(API code/UI library).
   4. Alternative Flows:
      [E1] No repository found error if repository does not exist. Try another repository.
      [E2] No recommendations are found if non-Android code files are committed.  


 2. Use Case: Get recommendations for UI libraries.
   1. Preconditions :
      For Android projects only. User must have understanding of Android design components. User must provide GitHub
      credentials. User must have a public repo on github and must configure it with the bot.
   2. Main Flow:
      User will ask for UI library recommendations  [S1]. Bot will act to parse the current user repository code [S2].
      Bot displays the recommendations as links related to each recommendation [S3].
   3. Subflows:
      [S1] User asks for the recommendations related to UI library after submitting a pull request to the remote 
      repository.
      [S2] Bot identifies list of all recommendations for the user code and filters the list to give specific result. 
      [S3] Once done, Bot displays the recommendations as: Library Name, Images, Library access link(How to use this 
      library),     Description, Recommendation type(API code/UI library).
   4. Alternative Flows:
      [E1] No repository found error if repository does not exist. Try another repository.   
      [E2] No recommendations are found if non-Android code files are committed.  


 3. Use Case: Get static analysis for the code (code refactoring) .
   1. Preconditions:
      For Android projects only. User must have understanding of Android design components. User must provide GitHub
      credentials. User must have a public repo on github and must configure it with the bot.
   2. Main Flow:
      User asks for code refactoring recommendations  [S1]. Bot will read and parse the current user code in the 
      repository [S2]. Based on the good Android application development principles, Bot will suggest recommendations [S3].
   3. Subflows:
      [S1] User asks for code refactoring recommendations. 
      [S2] Bot parses the code. Based on the restricted options we provide for code refactoring, the Bot lists those 
      applicable for the user’s code.
      [S3] Bot displays the recommendations as: Recommendation, Description.
   4. Alternative Flows:
      [E1] No repository found error if repository does not exist. Try another repository.  
      [E2] No recommendations are found if non-Android code files are committed.  

```
