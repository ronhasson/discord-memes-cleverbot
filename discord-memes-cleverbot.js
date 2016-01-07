/**
 * FILL THESE    V
 */
 var USERNAME = ""
 var EMAIL    = ""
 var PASSWORD = ""
 var RESTRICT_CLEVERBOT_TO_CHANNEL = false
 var CLEVERBOT_CHANNEL_NAME = "" // required if you set the restriction to `true`
 
 
var fs = require('fs');
var DiscordClient = require('discord.io');
var cleverbot = require("cleverbot.io");
var clever = new cleverbot('t77jVhrskGDT6Dm1', 'XKmJ3XW1dQwVJVXpWfODAUQ5qKucD6tc');
var cleverON = false;
var memes = putMemes();
var regexs = {};

var bot = new DiscordClient({
    autorun: true,
    email: EMAIL,
    password: PASSWORD,
    //OR
    token: ""
});

bot.on('ready', function () {
    console.log(bot.username + " - (" + bot.id + ")");
    Object.keys(memes).forEach(function (i) {
        regexs[i] = new RegExp(i)
    });
});

bot.on('message', function (user, userID, channelID, message, rawEvent) {

    var server_channels = bot.servers[bot.serverFromChannel(channelID)].channels;
    var cID = "";
    Object.keys(server_channels).forEach(function (key) {
        if (server_channels[key].name === CLEVERBOT_CHANNEL_NAME)
            cID = key
    })

    if (message[0] == '^') {
        var command = message.slice(1, (message.indexOf(' ') != -1) ? message.indexOf(' '):message.length);
        var parm = (message.indexOf(' ') != -1) ? message.slice(message.indexOf(' ') + 1, message.length) : "";
        console.log("from:" + user);
        console.log("com:" + command + " | parm:" + parm);
        commands(command.toLowerCase(), parm, userID, channelID);
    }
    else if((message[0] === '[' && message[message.length-1] === ']') || (message[0] === ']' && message[message.length-1] === '[') || (message[0] === ']' && message[message.length-1] === ']') || (message[0] === '[' && message[message.length-1] === '['))
    {
        console.log("meme");
        var meme = message.slice(1,message.length-1);
        var found = false;
        Object.keys(memes).forEach(function (i) {
            if(regexs[i].test(meme)) {
                bot.sendMessage({
                    to: channelID,
                    message: memes[i]
                });
                found = true;
            }
        });
        if(!found)
            bot.sendMessage({
                to: channelID,
                message: "Meme was not found. Please contact your closest Certified Regular Expressionist to register your meme."
            })
    }
    else if (cleverON && (RESTRICT_CLEVERBOT_TO_CHANNEL && channelID == cID) || (!RESTRICT_CLEVERBOT_TO_CHANNEL) && user != USERNAME) {
        console.log("Them> " + message);
        clever.ask(message, function (err, response) {
            console.log(USERNAME + "> " + response);
            bot.sendMessage({
                to: channelID,
                message: response
            });
        });
    }

});

function say(ch, ms) {
    bot.sendMessage({
        to: ch,
        message: ms
    });
}

function commands(com, prm, userid, channel) {
    switch (com) {
        case "clever":
            prm = prm.toLowerCase();
            if (prm == "on")
                cleverON = true;
            if (prm == "off")
                cleverON = false;
            break;

        case "coinflip":
            console.log(prm);
            if (prm == "") {
                prm = 1;
            }
            if(prm > 10)
            {
                say(channel, "I dont want to drown you with coins, you will die.");
                return;
            }
            for (var i = 0; i < prm; i++) {
                var r = Math.floor((Math.random() * 2) + 1);
                say(channel, (r == 1) ? "Heads" : "Tails");
            }
            break;
        case "register":
            if(!(prm.indexOf('[') != -1 && prm.indexOf(']') != -1)) {
                say(channel, "Wrong format, format should be: ^register [*regular expression*] *link*");
                return;
            }
            var code = prm.substring(1, prm.indexOf(']'));
            var link = prm.substring(prm.indexOf(']') + 1);

            var roles = bot.servers[bot.serverFromChannel(channel)].roles;
            var role_id = "";
            for(var i in roles)
                if(roles[i].name === "Certified Regular Expressionist")
                    role_id = roles[i];
            var hasPermission = false;
            for(var i in bot.servers[bot.serverFromChannel(channel)].members[userid].roles)
                if(bot.servers[bot.serverFromChannel(channel)].members[userid].roles[i] === role_id.id)
                { hasPermission = true; break; }
            if(hasPermission) // the user has permission
                fs.appendFile("memes.txt", '\n' + code + '\t' + link, function (err) {
                    if(err) console.log("Error: failed to append to file.")
                    else {
                        memes[code] = link;
                        regexs[code] = new RegExp();
                    }
                });
            else
                say(channel, "You need permission to register new memes, specifically, you have to be a Certified Regular Expressionist.");
        case "help":
            prm = prm.toLowerCase();
            if(prm =="")
                say(channel, "HERE, TAKE:  clever on|off / coinflip [num] / help [memes]");
            else if(prm == "memes")
                say(channel, "You can say ^register to register new memes")
    }
}

function putMemes()
{
    var array = {};
    fs.readFile("memes.txt", "utf8", function (err,data) {
        if (err) {
            return console.log(err);
        }
        console.log(data);
        var memesplit = data.split('\n');
        for(var m in memesplit)
        {
            var split_m = memesplit[m].split('\t');
            array[split_m[0]] = split_m[1].substr(0, split_m[1].length);
        }
    });
    return array;
}
