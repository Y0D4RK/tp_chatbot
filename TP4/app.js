
var restify = require('restify');
var botbuilder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

// setup restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3991, function() {
    console.log('% bot started at %', server.name, server.url)
});
// create chat connector
var connector = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});
// listening inputs
server.post('/api/messages', connector.listen());
var bot = new botbuilder.UniversalBot(connector, [
    function(session) {
        session.beginDialog('/');
    }
]);
var recognizer = new cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId : 'ffbfa4d9-26f2-4ce5-a097-23537389c547',
    subscriptionKey : '58912106296c45c1bbf3fd4bbe6ad9e6'
});
var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage : "Pas de correspondance",
    qnaThresholf: 0.3
});
bot.dialog('default', basicQnAMakerDialog);