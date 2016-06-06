var builder = require('botbuilder');
var restify = require('restify');
var weatherClient = require('./wunderground-client');

var bot = new builder.BotConnectorBot({
    appId: 'YourAppId',
    appSecret: 'YourAppSecret'
});

var dialog = new builder.LuisDialog('https://api.projectoxford.ai/luis/v1/application?id=ID&subscription-key=KEY&q=');

bot.add('/', dialog);

dialog.on('builtin.intent.weather.check_weather', [
    (session, args, next) => {
        var locationEntity = builder.EntityRecognizer.findEntity(args.entities, 'builtin.weather.absolute_location');
        if (locationEntity) {
            return next({ response: locationEntity.entity });
        } else {
            builder.Prompts.text(session, 'What location?');
        }
    },
    (session, results) => {
        weatherClient.getCurrentWeather(results.response, (responseString) => {
            session.send(responseString);
        });
    }
]);

dialog.onDefault(builder.DialogAction.send("I don't understand."));

var server = restify.createServer();
server.post('/v1/messages', bot.verifyBotFramework(), bot.listen());

server.listen(process.env.port || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});
