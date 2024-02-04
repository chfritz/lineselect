import React, { useState } from 'react';
import { Text, Box, useInput, useStdout } from 'ink';
import Color from 'ink-color-pipe';
import fs from 'fs';

const OUT_FILE = '/tmp/lineselect';

export default function App({lines, color}) {
	const [line, setLine] = useState(0);
	const [x, setX] = useState(0); // column offset
	const [selected, setSelected] = useState({});
	const [exit, setExit] = useState(false);
	const {stdout} = useStdout();

  const visibleRows = (stdout.rows || 20) - 1;

  useInput((input, key) => {
    // keep for debugging:
    // fs.writeFileSync('/tmp/key', JSON.stringify(key, true, 2));
    if (key.return) {
      const filtered = lines.filter((l, i) => selected[i]);
      setExit(true);
      const output = filtered.join('\n')
      fs.writeFileSync(OUT_FILE, output);
      process.stdout.write(output);
      process.stdout.end('\n');
      process.exit();
    } else if (key.escape) {
      process.exit();
    } else if (key.upArrow) {
			setLine(l => Math.max(0, l - 1));
		} else if (key.downArrow) {
			setLine(l => Math.min(lines.length - 1, l + 1));
    } else if (key.pageUp) {
			setLine(l => Math.max(0, l - visibleRows));
		} else if (key.pageDown) {
			setLine(l => Math.min(lines.length - 1, l + visibleRows));
		} else if (key.end) {
			setLine(l => lines.length - 1);
		} else if (key.rightArrow) {
			setX(x => x + 1);
		} else if (key.leftArrow) {
			setX(x => Math.max(0, x - 1));
		} else if (input == ' ') {
			setSelected(current => {
        const copy = {...current};
        copy[line] = !copy[line];
        return copy;
      });
			setLine(l => Math.min(lines.length - 1, l + 1));
		}
	});

  const offset = Math.max(0, line - visibleRows + 3);

  // clear output before exiting, needed when input exceeds terminal rows
  if (exit) return <Box marginTop={2}><Text><Color styles='green'>
      Selected lines are also written to {OUT_FILE}
    </Color></Text></Box>;

  return <>
  <Text><Color styles='cyan'>
      Use ↑↓ keys to move cursor, [space] to toggle line, [enter] to submit, [esc] to abort
    </Color></Text>
  {lines.slice(offset, offset + visibleRows).map((l, i) => {
    const row = i + offset;
    return <Text key={i} wrap="truncate">
      {line == row ? <Color styles='green'>→</Color>: ' '} {selected[row]
        ? '+' : ' '} <Color styles={selected[row] ? 'inverse' : ''}>
        {l.slice(x)}</Color>
    </Text>;
  })}</>
}
