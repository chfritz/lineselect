#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
import fs from 'fs';
import tty from 'tty';

const cli = meow(
	`
		Usage
		  $ node-line-select

		Options
			--name  Your name

		Examples
		  $ node-line-select --name=Jane
		  Hello, Jane
	`,
	{
		importMeta: import.meta,
	},
);

const mytty = fs.createWriteStream('/dev/tty', { flags: 'w' });
mytty.columns = process.stdout.columns;

const data = fs.readFileSync(process.stdin.fd, 'utf-8');
const ttyIn = new tty.ReadStream(fs.openSync('/dev/tty'))
ttyIn.setRawMode(false);

render(<App name={cli.flags.name} lines={data.split('\n')} />,
  {stdout: mytty, stdin: ttyIn});
