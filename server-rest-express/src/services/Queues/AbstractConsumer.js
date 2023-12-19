class AbstractConsumer {
    constructor(channel, name) {
        this.channel = channel;
        this.name = name;
    }

    consume() {
        console.log('\x1b[32m', 'Consumer started ...');

        Promise.resolve(this.channel).then(async channel => {
            await this._consume(channel);
        });
    }

    async _consume(channel) {
        await channel.consume(this.name, message => this._work(channel, message));
    }

    async _work(channel, message) {
        if (!message.content) {
            throw new Error("Message doesn't contain content");
        }

        try {
            const item = JSON.parse(message.content);
            await this._processing(item);
            await channel.ack(message);
        } catch (e) {
            console.error(e);
            await channel.reject(message, false);
        }
    }

    _processing(item) {
        console.log(item);
    }
}

module.exports = AbstractConsumer;
