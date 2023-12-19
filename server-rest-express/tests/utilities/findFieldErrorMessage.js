module.exports = (response, fieldName) => response.body.find(error => error.param === fieldName).message;
