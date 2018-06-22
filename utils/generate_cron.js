/**
 * A very simple script in charge of generating the CRON configuration based on environment variables.
 * The script is run on each start of the container.
 */

let tiniPid = process.argv[2],
    envVars = Object.keys(process.env);

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

        // Note: this is a bit cryptic so here is what is going on:
        // First the command is piped into "sed" and we add [Cron]
        // In case there is an error message (on stderr), this will not be handled by sed.
        // So we switch output and error streams using "3>&2 2>&1 1>&3"
        // And we apply again sed on stdout (which is the past stderr)
        // Finally we switch back to stderr and stdout: 4>&2 2>&1 1>&4
        // and we put the output in /proc/xxx/fd1|2 which are the processes output for the Docker container.
        console.log(schedule + ' ' + user + ' ((((' + command + ") | sed -e 's/^/[Cron] /' ) 3>&2 2>&1 1>&3 | sed -e 's/^/[Cron error] /') 4>&2 2>&1 1>&4) > /proc/" + tiniPid + "/fd/1 2> /proc/" + tiniPid + "/fd/2");
    }
});