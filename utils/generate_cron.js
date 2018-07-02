/**
 * A very simple script in charge of generating the CRON configuration based on environment variables.
 * The script is run on each start of the container.
 */

let envVars = Object.keys(process.env);

envVars.forEach((envVar) => {
    if (envVar.indexOf('CRON_COMMAND') >= 0) {
        let command = process.env[envVar],
            suffix = envVar.substr(12);

        if (envVars.indexOf('CRON_SCHEDULE' + suffix) === -1) {
            console.error('Environment variable "CRON_SCHEDULE' + suffix + '" is missing.');
            process.exit(1);
        }

        let user = envVars.indexOf('CRON_USER' + suffix) >= 0 ? process.env['CRON_USER' + suffix] : 'root',
            schedule = process.env['CRON_SCHEDULE' + suffix];

        if (user !== 'root') {
            command = 'sudo -E -u ' + user + ' ' + command;
        }

        console.log(schedule + ' ' + command);
    }
});