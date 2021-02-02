module.exports = async function(msg, arguments) {

    function getXpToLevelUp(xp) {
        console.log("xp");
        return "**sehr viel** xp bist zum level **Master Guardian**"
    }
    let args = msg.content.split(" ");
    let command = args.shift();
    if (msg.author.bot && command.startsWith("ẞ")) return;
    command = command.substring(1);
    console.log(command, args);
    if (msg.channel.id == "712243995689877544" && command == "ping") {
        msg.reply("pong");
    }
    if (command == "rank") {
        let mentioned = args[0].substring(3, args[0].length-1);
        console.log(mentioned);
        arguments.db.findOne({ userid: mentioned || msg.author.id }, function (err, doc) {
            if (err || doc == null) {
                console.warn("database error in command rank");
                return 15;
            }
            msg.channel.send(`<@!${mentioned || msg.author.id}> hat **${doc.xp}XP**, noch ${getXpToLevelUp(doc.xp)}`);
        });
    }
};