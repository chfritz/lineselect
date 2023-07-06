#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App from './app.js';
import fs from 'fs';
import tty from 'tty';

const usage = () => {
  console.log(`
  lineselect is a shell utility to interactively select lines from stdin and output them to stdout.
  It requires stdin to be a readable pipe.

  Usage:

    some-command | lineselect | some-other-command

    or

    some-other-command $(some-command | lineselect)

  Example:

    List the 10 largest files, interactively select from them which ones to delete:
      ls -S *.log | head -n 10 | lineselect | xargs rm
    `);
  process.exit(1);
};

let data
try {
  data = fs.readFileSync(process.stdin.fd, 'utf-8');
} catch (e) {
  usage();
}

const ttyOut = new tty.WriteStream(fs.openSync('/dev/tty', 'w'));
const ttyIn = new tty.ReadStream(fs.openSync('/dev/tty'));
ttyIn.setRawMode(false);

render(<App lines={data.split('\n')} />, {stdout: ttyOut, stdin: ttyIn});
