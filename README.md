
* Create a chatbot that converses via a web UI using Watson Assistant and Node.js
* Use Watson Discovery with passage retrieval to find answers in FAQ documents
* Use Watson Tone Analyzer to detect emotion in a conversation
* Identify entities with Watson Natural Language Understanding
* Use Personality Insight to know the personality of the customer.

## Flow
1. The FAQ documents are added to the Discovery collection.
2. The user interacts with a chatbot via the app UI.
3. User input is processed with Tone Analyzer to detect anger. An anger score is added to the context.
4. User input is processed with Natural Language Understanding (NLU). The context is enriched with NLU-detected entities and keywords (e.g., a location).
5. The user inputs her Twitter ID to analyze her personality and give her relatable offers.
6. The input and enriched context is sent to Assistant. Assistant recognizes intent, entities and dialog paths. It responds with a reply and/or action.


## Included components

* [IBM Watson Assistant](https://www.ibm.com/watson/developercloud/conversation.html): Build, test and deploy a bot or virtual agent across mobile devices, messaging platforms, or even on a physical robot.



## Featured technologies
* [Node.js](https://nodejs.org/): An asynchronous event driven JavaScript runtime, designed to build scalable applications.



## Run locally

1. [Clone the repo](#1-clone-the-repo)
2. [Create Watson services with IBM Cloud](#2-create-watson-services-with-ibm-bluemix)
3. [Import the Watson Assistant workspace](#3-import-the-conversation-workspace)
4. [Load the Discovery documents](#4-load-the-discovery-documents)
5. [Configure credentials](#5-configure-credentials)
5. [Run the application](#6-run-the-application)

### 1. Clone the repo

Clone the `QNBBot` locally. In a terminal, run:

```
$ git clone https://github.com/monicaNadyH/QNBSampleConv
```

### 2. Create Watson services with IBM Cloud

Create the following services:

* [**Watson Assistant**](https://console.ng.bluemix.net/catalog/services/conversation)


### 3. Import the Assistant workspace

Launch the **Watson Assistant** tool. Use the **import** icon button on the right



Find the local version of [`data/conversation/workspaces/banking%20bot.json`](data/conversation/workspaces/banking%20bot.json) and select
**Import**. Find the **Workspace ID** by clicking on the context menu of the new
workspace and select **View details**. Save this ID for later.



### 5. Configure credentials

FILL ONLY THE CREDENTAILS FOR QATSON CONVERSATION
The credentials for IBM Cloud services (Assistant), can be found in the ``Services`` menu in IBM Cloud,
by selecting the ``Service Credentials`` option for each service.




Copy the [`env.sample`](env.sample) to `.env`.

```
$ cp env.sample .env
```
Edit the `.env` file with the necessary settings.

#### `env.sample:`

```
# Replace the credentials here with your own.
# Rename this file to .env before starting the app.

# Watson conversation
CONVERSATION_USERNAME=<add_conversation_username>
CONVERSATION_PASSWORD=<add_conversation_password>
WORKSPACE_ID=<add_conversation_workspace>

# Watson Discovery
DISCOVERY_USERNAME=<add_discovery_username>
DISCOVERY_PASSWORD=<add_discovery_password>
DISCOVERY_ENVIRONMENT_ID=<add_discovery_environment>
DISCOVERY_COLLECTION_ID=<add_discovery_collection>

# Watson Natural Language Understanding
NATURAL_LANGUAGE_UNDERSTANDING_USERNAME=<add_nlu_username>
NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD=<add_nlu_password>

# Watson Tone Analyzer
TONE_ANALYZER_USERNAME=<add_tone_analyzer_username>
TONE_ANALYZER_PASSWORD=<add_tone_analyzer_password>

# Run locally on a non-default port (default is 3000)
# PORT=3000

Add the credentials for the personality Insights in the app.js

```



### 6. put the english and arabic workspaces in the app.js

1. go to app.js to lines 233 and 236 and put your workspaces ID.





### 7. Run the application locally
1. Install [Node.js](https://nodejs.org/en/) runtime or NPM.
2. Start the app by running `npm install`, followed by `npm start`.
3. Use the chatbot at `localhost:3000`.
> Note: server host can be changed as required in server.js and `PORT` can be set in `.env`.

### 8. Deploy the application on IBM Cloud
1. cd your_new_directory
2. bluemix api https://api.ng.bluemix.net (if deployed in US South)
3. bluemix login -u UserName -o org_name -s space_name
4. bluemix app push appName

