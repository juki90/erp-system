const di = require('../di');

const emailsWorker = require('../services/Queues/Workers/EmailsWorker.js');

emailsWorker(di);
