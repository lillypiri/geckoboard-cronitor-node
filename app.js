const Express = require('express');
const app = Express();

const CronitorClient = require('cronitor-client');


const cc = new CronitorClient({ access_token: process.env.TOKEN });

app.get('/', function(req, res) {
    cc.all(function(err, result) {
        console.log('ERROR', err);
        console.log('Result', result);

        const failingCrons = result.monitors.filter(m => {
            // if a check is not running and not passing then it is borked
            return m.running == false && m.passing == false;
        });

        // All good if there are no failing crons
        const status = failingCrons.length === 0 ? 'Up' : 'Down';

        // Grab the first failing cron for the down time
        const downTime =
            failingCrons.length === 0 ? '' : failingCrons[0].status;


        /* Formatted response from API this needs to follow Geckoboard's formatting outlined at http://developer-custom.geckoboard.com/#monitoring */
        res.json({
            status,
            downTime,
            responseTime: ''
        });
    });
});

// http://localhost:3000/
app.listen(3000, () => console.log('Listening on port 3000!'));
