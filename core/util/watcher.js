class Watcher {
    constructor(client, message, userID, behavior, map) {
        this.client = client;
        this.message = message;
        this.channelID = message.channel.id;
        this.messageID = message.id;
        this.userID = userID;
        this.behavior = behavior;
        this.map = map;
        this.delete = setTimeout(() => {
            delete client.watchers[this.messageID];
        }, 600000);

        if (behavior == "p/n") {
            this.position = map.length - 1;
            this.previousEmoji = "◀";
            this.nextEmoji = "▶";
            this.client.addMessageReaction(this.channelID, this.messageID, this.previousEmoji);
            this.client.addMessageReaction(this.channelID, this.messageID, this.nextEmoji);
        }
    }

    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    edit(emoji, userID) {
        this.client.removeMessageReaction(this.channelID, this.messageID, emoji, userID).catch((err) => {
            this.client.helper.log(this.message, err);
        });
        this.client.editMessage(this.channelID, this.messageID, this.map[this.position]).catch((err) => {
            this.client.helper.handle(this.message, err);
        });
    }

    handle(message, emoji, userID) {
        if (message.id !== this.messageID) return;
        if (userID !== this.userID) return;
        emoji = emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;

        if (this.behavior == "p/n") {
            if (emoji == this.previousEmoji && this.position > 0) {
                this.sleep(250).then(() => {
                    this.position -= 1;
                    this.edit(emoji, userID);
                });
            }

            if (emoji == this.nextEmoji && this.position + 1 < this.map.length) {
                this.sleep(250).then(() => {
                    this.position += 1;
                    this.edit(emoji, userID);
                });
            }
        }
    }
}

module.exports = Watcher;
