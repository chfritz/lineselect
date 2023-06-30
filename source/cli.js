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

const data = fs.readFileSync(process.stdin.fd, 'utf-8');

const ttyOut = new tty.WriteStream(fs.openSync('/dev/tty', 'w'));
const ttyIn = new tty.ReadStream(fs.openSync('/dev/tty'));
ttyIn.setRawMode(false);

render(<App lines={data.split('\n')} />, {stdout: ttyOut, stdin: ttyIn});
