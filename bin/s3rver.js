#!/usr/bin/env node
'use strict';
var pkg     = require('../package.json'),
    version = pkg.version,
    program = require('commander'),
    fs      = require('fs'),
    S3rver  = require('../lib');

program.version(version, '--version');
program.option('-h, --hostname [value]', 'Set the host name or ip for the server', 'localhost')
  .option('-p, --port <n>', 'Set the port of the http server', 4568)
  .option('-s, --silent', 'Suppress log messages', false)
  .option('-i, --indexDocument [path]', 'Index Document for Static Web Hosting', '')
  .option('-e, --errorDocument [path]', 'Custom Error Document for Static Web Hosting', '')
  .option('-d, --directory [path]', 'Data directory')
  .option('-c, --cors', 'Enable CORS', false)
  .option('--selfSignedCert', 'Run with TLS, using a self-signed certificate', false)
  .parse(process.argv);

if (program.directory === undefined) {
  console.error('Data directory is required');
  process.exit();
}

try {
  var stats = fs.lstatSync(program.directory);
  if (stats.isDirectory() === false) {
    throw Error();
  }
}
catch (e) {
  console.error('Directory does not exist. Please create it and then run the command again');
  process.exit();
}

var s3rver = new S3rver(program).run(function (err, host, port) {
  if (err) {
    console.error(err)
  } else {
    console.log('now listening on host %s and port %d', host, port);
  }
});
