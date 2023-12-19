class ChannelFactory {
    static create(connection, name) {
        return Promise.resolve(connection).then(connection => {
            return ChannelFactory._createChannel(connection, name);
        });
    }

    static async _createChannel(connection, name) {
        const names = {
            exchange: `${name}-exchange`,
            errors: `${name}-errors`,
            errorsExchange: `${name}-errors-exchange`
        };

        const channel = await connection.createChannel();

        await channel.prefetch(10);

        await channel.assertExchange(names.exchange, 'fanout', {
            durable: true
        });
        await channel.assertExchange(names.errorsExchange, 'fanout', {
            durable: true
        });

        await channel.assertQueue(names.errors, { durable: true });
        await channel.bindQueue(names.errors, names.errorsExchange);

        await channel.assertQueue(name, {
            durable: true,
            deadLetterExchange: names.errorsExchange
        });
        await channel.bindQueue(name, names.exchange);

        console.log('\x1b[36m', `Queue channel ${name} instance created`);

        return channel;
    }
}

module.exports = ChannelFactory;
