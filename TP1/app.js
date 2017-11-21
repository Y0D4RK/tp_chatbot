var restify = require('restify');
var botbuilder = require('botbuilder');


// setup restify server

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 39887, function(){
    console.log('%s bot started at %s', server.name, server.url);
});

// create chat connector
var connector = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

// listening for user inputs
server.post('/api/messages', connector.listen());

// reply by enchoing
/*var bot = new botbuilder.UniversalBot(connector, [
    function(session) {
        session.beginDialog('test', session.userData.profile);
        bot.on('typing', function () {
            session.send('U need githubhelp ?');
        });
    }
]);

bot.dialog('test', function(session){
    session.send(`You say : ${session.message.text} | [length: ${session.message.text.length}]`);
    session.send(`Type : ${session.message.type}`);
    session.endDialog();
});*/

var bot = new botbuilder.UniversalBot(connector, function(session){
    session.send(`You say : ${session.message.text}`);

    bot.on('typing', function () {
        session.send('U need github help ?');
    });

    bot.on('conversationUpdate', function(message) {

    if (message.membersAdded && message.membersAdded.length > 0) {

        var membersAdded = message.membersAdded.map(function (x) {
                var isSelf = x.id == message.address.dbot.id;
                return (isSelf ? message.address.bot.name : x.name) || ' ' + '(Id=' + x.id + ' )'
            }).join(', ');

        bot.send(new botbuilder.Message()
            .address(message.address)
            .text('Bienvenue ' + membersAdded));
        }

    });
});


// bot doit capter que le user ecrit
// ajout user bot doit renvoyer les informations du user nom / id
// remove user / bot - informations
// and welcome message