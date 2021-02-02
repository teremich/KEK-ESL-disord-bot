module.exports = function(msg, arguments) {

    function getXpToLevelUp(xp) {
        return `**${1000-(xp%1000)}** xp bis zum level **${Math.ceil(xp/1000)}**`;
    }
    let args = msg.content.split(" ");
    let command = args.shift();
    if (msg.author.bot && command.startsWith("ẞ")) return;
    command = command.substring(1);
    if (msg.channel.id == "712243995689877544" && command == "ping") {
        msg.reply("pong");
    }
    if (command == "rank") {
        let mentionedname;
        let mentionedid;
        let men = msg.mentions.users.first();
        if (men) {
            mentionedname = men.username;
            mentionedid = men.id;
        } else {
            mentionedname = msg.author.username;
            mentionedid = msg.author.id;
        }
        arguments.db.findOne({ userid: mentionedid}, function (err, doc) {
            if (err || doc == null) {
                console.warn("database error in command rank");
                return 15;
            }
            msg.channel.send(`${mentionedname} hat **${doc.xp}XP**, noch ${getXpToLevelUp(doc.xp)}`);
        });
    }
};