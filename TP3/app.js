var restify = require('restify');
var builder = require('botbuilder');

// restify server setup
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8999, function(){
    console.log(`${server.name} bot started at ${server.url}`);
});

// create chat connector
var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

// listening for user inputs
server.post('/api/messages', connector.listen());

// reply by echoing
var bot = new builder.UniversalBot(connector, [
    function(session) {
        session.beginDialog('app:main');
        bot.on('typing', function(response) {
            session.send(response); // Rajouter cette ligne corrige le Bug de messages dupliqués
            session.send("ah tu es encore en train de taper..");
        });
        bot.on('conversationUpdate', function(message) {
            if(message.membersAdded && message.membersAdded.length > 0) {
                var membersAdded = message.membersAdded.map(function (x) {
                    var isSelf = x.id === message.address.bot.id;
                    return (isSelf ? message.address.bot.name : x.name) || ' ' + 'Id = ' + x.id + ')'
                }).join(', ');
                bot.send(new builder.Message()
                    .address(message.address)
                    .text('Bienvenue' + membersAdded)
                );
            }
        });
    },
    function(session, results) {
        for(var i = 0; i < session.userData.length; i++)
        builder.Prompts.text(session, `- ${session.userData[i]}`);
        session.endConversation("Ci-dessus les informations concernants vos alarmes");
    }
]);

/* HELP - Trigger */
bot.dialog('help', function (session, args, next) {
    session.endDialog("Je suis un BOT. Je suis ici pour vous aider à gérer vos alarmes.");
}).triggerAction({
    matches: /^help$/i,
});

// bot.dialog('hotel', require('./dialog/hotel')).endConversationAction('cancelAction', 'Ok, cancel order.', {
//     matches: /^cancel$|^goodbye$/i,
//     confirmPrompt: "Are you sure?"
// });

bot.library(require('./dialog/alarm'));