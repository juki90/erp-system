module.exports = di => {
    const emailConsumer = di.get('queues.consumers.emails');

    emailConsumer.consume();
};
