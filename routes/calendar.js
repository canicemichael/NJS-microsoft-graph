const router = require('express-promise-router')();
const graph = require('../graph.js');
const addDays = require('date-fns/addDays');
const formatISO = require('date-fns/formatISO');
const startOfWeek = require('date-fns/startOfWeek');
const zonedTimeToUtc = require('date-fns-tz/zonedTimeToUtc');
const iana = require('windows-iana');
const { body, validationResult } = require('express-validator');
const validator = require('validator');

/* GET /calendar */
router.get('/',
    async function(req, res) {
        if (!req.session.userId) {
            // Redirect unauthenticated requests to home page
            res.redirect('/')
        } else {
            const params = {
                active: { calendar: true }
            };

            // Get the user
            const user = req.app.locals.users[req.session.userId];
            // Convert user's Windows time zone ("Pacific Standard Time")
            // to IANA format ("America/Los_Angeles")
            const timeZoneId = iana.findIana(user.timeZone)[0];
            console.log(`Time zone: ${timeZoneId.valueOf()}`);

            var weekStart = zonedTimeToUtc(startOfWeek(new Date()), timeZoneId.valueOf());
            var weekEnd = addDays(weekStart, 7);
            console.log(`Start: ${formatISO(weekStart)}`);

            try {
                // Get the events
                const events = await graph.getCalendarView(
                    req.app.locals.msalClient,
                    req.session.userId,
                    formatISO(weekStart),
                    formatISO(weekEnd),
                    user.timeZone );
                
                res.json(events.value);
            } catch (err) {
                res.send(JSON.stringify(err, Object.getOwnPropertyNames(err)));
            }
        }
    }
);

module.exports = router;