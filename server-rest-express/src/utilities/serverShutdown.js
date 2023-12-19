module.exports = (httpServer) => {
    console.log('API shutting down ...');
    httpServer.close();
};
