/*

bot qui va gérer les alarmes :
 - créer une alarme (prendre la date et nommer l'alame : ex : réveil pour le samedi 19 septembre à 5h00)
 - consulter une alarme active
 - consulter l'historique des alarmess
 - implémenter des waterfall, triggeraction, cancelaction, etc...)
 - quand tu les affichent, soit en rich card soit en liste de texte
 - quand clique dessus >> détails avec personne qui l'a créer, date de création, nom de l'alarme et heure à laquelle elle doit sonner
 */

var builder = require('botbuilder');

const library = new builder.Library('app');

var alarms = {
        1:{
            name: "reveil",
            datetime: "05/05/2019 07:30:00",
            frequency: "every day",
            status: "enabled"
        },
        2:{
            name: "sport",
            datetime: "10/10/2020 21:30:00",
            frequency: "every sunday",
            status: "disabled"
        }
    };

library.dialog('main', [
    function (session) {
        session.send("# Welcome to Alarm Handler #");
        session.beginDialog('alarmMenu');
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.time = builder.EntityRecognizer.resolveTime([results.response]);
        }

        // Return alarm to caller
        if (session.dialogData.name && session.dialogData.time) {
            session.endDialogWithResult({
                response: { name: session.dialogData.name, time: session.dialogData.time }
            });
        } else {
            session.endDialogWithResult({
                resumed: builder.ResumeReason.notCompleted
            });
        }
    }

]).endConversationAction('cancelAction', 'Très bien, la conversation est terminé.', {
    matches: /^exit$|^goodbye$|^aurevoir$|^salut$/i,
    confirmPrompt: "Vraiment, souhaitez vous quitter la conversation ?"
});


library.dialog('alarmMenu', [
    function(session){
        builder.Prompts.choice(session, "Bonjour, je m'appel Andrea. \n Comment puis-je vous aider ?", "Lister les alarmes|Créer une alarme|Afficher l'aide", {listStyle: 3});
    },
    function(session, results){
        session.userData.menu = results.response;

        var regx1 = /^Lister$/i;

        if(results.response){
            session.beginDialog('alarmList');
        }else{
            session.beginDialog('alarmCreate');
        }
    }
]);

library.dialog('alarmList', [
    function (session) {
        builder.Prompts.choice(session, "Voici vos alarmes", alarms, {listStyle:builder.ListStyle.button} );
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

library.dialog('alarmCreate', [
    function (session) {
        builder.Prompts.text(session, "Trouvez un nom d'alarme (exemple: reveil).");
    },
    function (session, results, next){
        if (results.response) {
            session.dialogData.name = results.response;
            builder.Prompts.time(session, "What time would you like to set an alarm for ?");
        } else {
            next();
        }
    }
]);

module.exports = library;