/**
 * Enables or disables Apache extensions based on environment variables set.
 */

let envVars = Object.keys(process.env);

if (envVars.indexOf('APACHE_EXTENSIONS') >= 0) {
    let defaultExtensions = ['access_compat', 'alias', 'auth_basic', 'authn_core', 'authn_file', 'authz_core', 'authz_host', 'authz_user', 'autoindex', 'deflate', 'dir', 'env', 'expires', 'filter', 'mime', 'mpm_prefork', 'negotiation', 'reqtimeout', 'rewrite', 'setenvif', 'status'],
        availableExtensions = ['access_compat', 'actions', 'alias', 'allowmethods', 'asis', 'auth_basic', 'auth_digest', 'auth_form', 'authn_anon', 'authn_core', 'authn_dbd', 'authn_dbm', 'authn_file', 'authn_socache', 'authnz_fcgi', 'authnz_ldap', 'authz_core', 'authz_dbd', 'authz_dbm', 'authz_groupfile', 'authz_host', 'authz_owner', 'authz_user', 'autoindex', 'buffer', 'cache', 'cache_disk', 'cache_socache', 'cgi', 'cgid', 'charset_lite', 'data', 'dav', 'dav_fs', 'dav_lock', 'dbd', 'deflate', 'dialup', 'dir', 'dump_io', 'echo', 'env', 'ext_filter', 'file_cache', 'filter', 'headers', 'heartbeat', 'heartmonitor', 'ident', 'include', 'info', 'lbmethod_bybusyness', 'lbmethod_byrequests', 'lbmethod_bytraffic', 'lbmethod_heartbeat', 'ldap', 'log_debug', 'log_forensic', 'lua', 'macro', 'mime', 'mime_magic', 'mpm_event', 'mpm_prefork', 'mpm_worker', 'negotiation', 'php7', 'proxy', 'proxy_ajp', 'proxy_balancer', 'proxy_connect', 'proxy_express', 'proxy_fcgi', 'proxy_fdpass', 'proxy_ftp', 'proxy_html', 'proxy_http', 'proxy_scgi', 'proxy_wstunnel', 'ratelimit', 'reflector', 'remoteip', 'reqtimeout', 'request', 'rewrite', 'sed', 'session', 'session_cookie', 'session_crypto', 'session_dbd', 'setenvif', 'slotmem_plain', 'slotmem_shm', 'socache_dbm', 'socache_memcache', 'socache_shmcb', 'speling', 'ssl', 'status', 'substitute', 'suexec', 'unique_id', 'userdir', 'usertrack', 'vhost_alias', 'xml2enc'];

    let delimiter = [',', '|', ';', ':'],
        replace = process.env['APACHE_EXTENSIONS'].replace(/,|\||;|:/g, ' '),
        apacheExtensions = replace.split(' ');

    for (let i = 0; i < apacheExtensions.length; ++i) {
        apacheExtensions[i] = apacheExtensions[i].trim().toLowerCase();
    }

    let enableExtension = (extensionName) => {
        // If an extension name is set explicitly to "0" or "false" or "no", then it is not enabled.
        // This has priority.
        let envName = 'APACHE_EXTENSION_' + extensionName.toUpperCase(),
            env = envVars.indexOf(envName) === -1 ? false : process.env[envName].toLowerCase().trim();

        if (env === false) {
            return false;
        }

        if (env === '0' || env === 'false' || env === 'no' || env === 'off') {
            return false;
        }

        if (apacheExtensions.indexOf(extensionName) === -1) {
            return true;
        }

        if (env === '1' || env === 'true' || env === 'yes' || env === 'on') {
            return true;
        }

        if (defaultExtensions.indexOf(extensionName) === -1) {
            return true;
        }

        if (env === '') {
            return false;
        }

        process.stderr.write('Invalid environment variable value found for ' + envName + '. Value: "' + env + '". Valid values are "0", "1", "yes", "no", "true", "false", "on", "off".' + "\n");
        process.exit(1);
    };

    // Validate the content of PHP_EXTENSIONS
    apacheExtensions.forEach((apacheExtension) => {
       if (availableExtensions.indexOf(apacheExtension) === -1) {
           process.stderr.write("Invalid extension name found in APACHE_EXTENSIONS environment variable. Found: '" + apacheExtension + '". Available extensions: "' + availableExtensions.join(', ') + ".\n");
           process.exit(1);
       }
    });

    let toEnableExtensions = '',
        toDisableExtensions = '';

    availableExtensions.forEach((apacheExtension) => {
        if (enableExtension(apacheExtension)) {
            toEnableExtensions += apacheExtension + ' ';
        } else {
            toDisableExtensions += apacheExtension + ' ';
        }
    });

    console.log('a2enmod ' + toEnableExtensions  + ' > /dev/null && a2dismod ' + toDisableExtensions + ' > /dev/null');
}