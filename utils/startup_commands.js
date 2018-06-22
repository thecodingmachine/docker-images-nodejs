/**
 * A very simple script in charge of generating the startup commands based on environment variables.
 * The script is run on each start of the container.
 */


let envVars = Object.keys(process.env),
    commands = envVars.filter(command => command.indexOf('STARTUP_COMMAND') >= 0).sort();

console.log('set -e');

// Let's run the commands as user $UID if env variable UID is set.
let prepend = '';
if (envVars.indexOf('UID') >= 0) {
    prepend = 'sudo -u \\#' + process.env.UID + ' ';
}

commands.forEach((command) => {
    console.log(prepend + process.env[command]);
});