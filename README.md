# Leucine
First setup starts with backend:
As we are using node js and express framework for all the server side scripting we need to import the require packages from node package manager (NPM)
so first set the pakage.json using
"npm init"
then install all the required packages:
"npm install express nodemon cors dotenv axios"..
after setup the commands to run the server in the package.json
{"script":"node server.js",
"dev":"nodemon server.js"}
Then the command to initiate the server is:"npm run dev"
This is the upto the backend flow of initiation

Then comes to Frontend:
To get the base template of react i am using Vite
run the command:"npm create vite@latest"
this sets up the complete template of the frontend for client side
to initiate the frontend execute "npm run dev"
these are defaultly set.
This is upto the frontend commands.

When it comes to the set up of LLm integration:
I have used gemini-2.0-flash api providing free api key.
step 1:go the google ai studio
step 2:get the api key of your wish copy it.
step 3:move down to documentation to take necessary way to interact with the api and copy that and used the script in my endpoint.

After generating the summary that need to be kept in the slake channel
step 1:so first create a slake workspace.
step 2:after creating workspace you need to create slake app  by visiting https://api.slack.com/apps.
step 3:after creating app you will be initiating the incomming webhook to active state by adding it to a work space.
step 4:you will be getting a url for use to step up integration through api copy that.

Coming to the Design and Architecture Decisions:
first i went to set up the backend part written endpoints for adding,deleting,editing and getting all the tasks.
Then create the endpoint for integration of LLM for summary generation and binding it to the Slake channel specific to the pending tasks.
after this moved down to frontend using this endpoint for utility and created the ui for clients ie the users to give their tasks and do the editing,saving,updating and deleting facilities thorugh UI.
And all the UI is implemented using React Js.
