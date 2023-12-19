class Publisher {
    constructor(channel, name) {
        this.channel = channel;
        this.name = name;
        console.log(`Publisher ${name} instance created`);
    }

    publish(message) {
        console.log('\x1b[33m', 'EmailsPublisher: message published ...');

        Promise.resolve(this.channel).then(async channel => {
            await this._publish(channel, message);
        });
    }

    async _publish(channel, message) {
        await channel.sendToQueue(this.name, Buffer.from(JSON.stringify(message)));
    }
}

module.exports = Publisher;
