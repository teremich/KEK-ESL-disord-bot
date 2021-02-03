const Discord = require("discord.js");
const Datastore = require("nedb");
const database = new Datastore("userxp.db");
const client = new Discord.Client();
require("dotenv").config();

const commandHandler = require("./commands");

console.log("starting");

database.loadDatabase();

client.login(process.env.TOKEN);

client.on("ready", () => {
    console.log("im ready!!");
});

function rankUp(msg, xp) {
    const member = msg.guild.members.cache.find(mem => mem.user.id === msg.author.id);
    let role;
    switch(Math.floor(xp/1000)) {
        /*
            40 DeineMutter
            30 türkis
            20 gold
            10 blau (hihi)
            5 orange
        /**/
        case 20:
            role = msg.guild.roles.cache.find(role => role.name === 'global general');
            member.roles.remove(msg.guild.roles.cache.find(role => role.name === 'general'));
        case 40:
            role = msg.guild.roles.cache.find(role => role.name === 'general');
            member.roles.remove(msg.guild.roles.cache.find(role => role.name === 'major general'));
            break;
        case 37:
            role = msg.guild.roles.cache.find(role => role.name === 'major general');
            member.roles.remove(msg.guild.roles.cache.find(role => role.name === 'colonel'));
            break;
        case 33:
            role = msg.guild.roles.cache.find(role => role.name === 'colonel');
            member.roles.remove(msg.guild.roles.cache.find(role => role.name === 'captain'));
        case 25:
            role = msg.guild.roles.cache.find(role => role.name === 'captain');
            member.roles.remove(msg.guild.roles.cache.find(role => role.name === 'sergeant major'));
        case 17:
            role = msg.guild.roles.cache.find(role => role.name === 'sergeant major');
            member.roles.remove(msg.guild.roles.cache.find(role => role.name === 'sergeant'));
            break;
        case 9:
            role = msg.guild.roles.cache.find(role => role.name === 'sergeant');
            member.roles.remove(msg.guild.roles.cache.find(role => role.name === 'private'));
            break;
        case 1:
            role = msg.guild.roles.cache.find(role => role.name === 'private');
    }
    if (role) member.roles.add(role);
    msg.channel.send(`HGW! ${msg.author} du bist nun lvl ${Math.floor(xp/1000)}`);
}

function levelUp(msg) {
    database.findOne({userid: msg["author"]["id"]}, (err, data) => {
        let newXP = Math.floor(Math.random()*10)+15;
        if (err || data == null) {
            database.insert({ userid: msg["author"]["id"], xp: newXP });
        } else {
            let uxp = data["xp"];
            if (Date.now() - data.time < 1000*60) {
                newXP = 1;
            }
            if ((uxp + newXP) % 1000 < newXP) {
                rankUp(msg, uxp+newXP);
            }
            database.update(
                { userid: msg["author"]["id"] },
                { $set:{
                    time: newXP > 1 ? Date.now() : data.time,
                    xp: uxp + newXP
                }},
                { upsert: false, multi: false }, function () {}
            );
        }
    });
}

client.on("message", (msg) => {
    if (!msg.author.bot) {
        levelUp(msg);
        commandHandler(msg, {db: database});
    }
});