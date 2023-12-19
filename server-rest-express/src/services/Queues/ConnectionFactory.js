class ConnectionFactory {
    static async create(amqlib, rabbitMqConfig) {
        const connection = await amqlib.connect(rabbitMqConfig.url);

        console.log('\x1b[36m', 'Queue connection instance created');

        return connection;
    }
}

module.exports = ConnectionFactory;
