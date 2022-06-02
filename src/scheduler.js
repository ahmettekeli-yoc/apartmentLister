const schedule = require('node-schedule');

const scheduleJob = (jobFn, time) => {
    const job = schedule.scheduleJob(time, jobFn);
};

const shutdownJob = () => {
    schedule.gracefulShutdown().then((value) => {
        console.log('Shutdown complete');
    });
};

process.on('SIGINT', function () {
    schedule.gracefulShutdown().then(() => process.exit(0));
});

module.exports = { scheduleJob, shutdownJob };
