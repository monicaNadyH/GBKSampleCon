'use strict';

require('dotenv').config({
    silent: true
});

const express = require('express'); // app server
const bodyParser = require('body-parser'); // parser for post requests
const watson = require('watson-developer-cloud'); // watson sdk
const fs = require('fs'); // file system for loading JSON
const parseJson = require('parse-json');
const request = require("request");

const numeral = require('numeral');
const vcapServices = require('vcap_services');
const bankingServices = require('./banking_services');
const WatsonDiscoverySetup = require('./lib/watson-discovery-setup');
const WatsonConversationSetup = require('./lib/watson-conversation-setup');

 const DEFAULT_NAME = 'watson-banking-chatbot';


const app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());
require('cf-deployment-tracker-client').track();
require('metrics-tracker-client').track();

// setupError will be set to an error message if we cannot recover from service setup or init error.
let setupError = '';

// Credentials for services
const conversationCredentials = vcapServices.getCredentials('conversation');


// Create the service wrapper
const conversation = watson.conversation({
    url: conversationCredentials.url,
    username: conversationCredentials.username,
    password: conversationCredentials.password,
    version_date: '2016-07-11',
    version: 'v1'
});

let workspaceID; // workspaceID will be set when the workspace is created or validated.
const conversationSetup = new WatsonConversationSetup(conversation);
const workspaceJson = JSON.parse(fs.readFileSync('data/conversation/workspaces/banking bot.json'));
const conversationSetupParams = {
    default_name: DEFAULT_NAME,
    workspace_json: workspaceJson
};
conversationSetup.setupConversationWorkspace(conversationSetupParams, (err, data) => {
    if (err) {
        handleSetupError(err);
    } else {
        console.log('Conversation is ready!');
        workspaceID = data;
    }
});

// Endpoint to be called from the client side
app.post('/api/message', function(req, res) {
    if (setupError) {
        return res.json({
            output: {
                text: 'The app failed to initialize properly. Setup and restart needed.' + setupError
            }
        });
    }

    if (!workspaceID) {
        return res.json({
            output: {
                text: 'Conversation initialization in progress. Please try again.'
            }
        });
    }

    bankingServices.getPerson(7829706, function(err, person) {
        if (err) {
            console.log('Error occurred while getting person data ::', err);
            return res.status(err.code || 500).json(err);
        }

        const payload = {
            workspace_id: workspaceID,
            // context: {
            //     person: person
            // },
            context: req.body.context || {},
            input: {}
        };

        // common regex patterns
        const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
        // const regadhaar = /^\d{12}$/;
        // const regmobile = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
        if (req.body) {
            if (req.body.input) {
                let inputstring = req.body.input.text;
                //  console.log('input string ', inputstring);
                const words = inputstring.split(' ');
                //  console.log('words ', words);

                inputstring = '';
                for (let i = 0; i < words.length; i++) {
                    if (regpan.test(words[i]) === true) {
                        // const value = words[i];
                        words[i] = '1111111111';
                    }
                    inputstring += words[i] + ' ';
                }
                // words.join(' ');
                inputstring = inputstring.trim();
                //  console.log('After inputstring ', inputstring);
                // payload.input = req.body.input;
                payload.input.text = inputstring;
            }
            if (req.body.context) {
                // The client must maintain context/state
                payload.context = req.body.context;
            }
        }

        callconversation(payload);
    });

    /**
     * Send the input to the conversation service.
     * @param payload
     */
    function callconversation(payload) {
      var queryInput = JSON.stringify(payload.input);

      var str2 = queryInput;

     if (queryInput == '{"text":"Arabic"}') {
          workspaceID = '2290b4e8-1e73-47fb-ba57-0297dd7aee79';
      }
      else if (queryInput == '{"text":"English"}') {
           workspaceID = '3631c9c5-0c58-4300-9ae9-29c44da7cdf2';
       }

        if (payload.input.text != '') {

          const queryInput = JSON.stringify(payload.input);
          const context_input = JSON.stringify(payload.context);
          var str = queryInput;
          conversation.message(payload, function(err, data) {
                            if (err) {
                                return res.status(err.code || 500).json(err);
                            } else {
                                checkForLookupRequests(data, function(err, data) {
                                    if (err) {
                                        return res.status(err.code || 500).json(err);
                                    } else {
                                        return res.json(data);
                                    }
                                });
                            }
                        });

                 }
                 else {
                   console.log("no input text")
                    conversation.message(payload, function(err, data) {
                        if (err) {
                            return res.status(err.code || 500).json(err);
                        } else {
                            //  console.log('conversation.message :: ', JSON.stringify(data));
                            return res.json(data);
                        }
                    });
                }
    }
});

/**
 *
 * Looks for actions requested by conversation service and provides the requested data.
 *
 **/
 function checkForLookupRequests(data, callback) {
   console.log('checkForLookupRequests');

   if (data.context && data.context.action && data.context.action.lookup && data.context.action.lookup != 'complete') {
     const payload = {
       workspace_id: workspaceID,
       context: data.context,
       input: data.input
     };

   } else {
     callback(null, data);
     return;
   }
 }


/**
 * Handle setup errors by logging and appending to the global error text.
 * @param {String} reason - The error message for the setup error.
 */
function handleSetupError(reason) {
    setupError += ' ' + reason;
    console.error('The app failed to initialize properly. Setup and restart needed.' + setupError);
    // We could allow our chatbot to run. It would just report the above error.
    // Or we can add the following 2 lines to abort on a setup error allowing Bluemix to restart it.
    console.error('\nAborting due to setup error!');
    process.exit(1);
}

module.exports = app;
