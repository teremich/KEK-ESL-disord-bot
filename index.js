const Discord = require("discord.js");
const Datastore = require("nedb");
const database = new Datastore("userxp.db");
const client = new Discord.Client();
require("dotenv").config();
console.log("starting");

database.loadDatabase();

client.login(process.env.TOKEN);

client.on("ready", () => {
    console.log("im ready!!");
});

function levelUp(msg) {
    database.findOne({userid: msg["author"]["id"]}, (err, data) => {
        console.log(data);
        let newXP = Math.floor(Math.random()*10)+15;
        if (err || data == null) {
            database.insert({ userid: msg["author"]["id"], xp: newXP });
        } else {
            let uxp = data["xp"];
            if (data.time - Date.now() > 1000*60) {
                database.update(
                    { userid: msg["author"]["id"] },
                    { $set:{
                        time: Date.now(),
                        xp: uxp + newXP
                    }},
                    { upsert: false, multi: false }, function () {}
                );
            }
        }
    });
}

function commands(msg) {
    if (msg.channel.id == "712243995689877544" && msg.content == "!ping") {
        msg.reply("pong");
    }
}

client.on("message", (msg) => {
    levelUp(msg);
    commands(msg);
});