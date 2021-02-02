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

async function levelUp(msg) {
    console.log(msg);
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
            } else {
                database.update(
                    { userid: msg["author"]["id"] },
                    { $set:{
                        time: Date.now(),
                        xp: uxp + 1
                    }},
                    { upsert: false, multi: false }, function () {}
                );
            }
        }
    });
}

client.on("message", (msg) => {
    levelUp(msg);
    commandHandler(msg, {db: database});
});