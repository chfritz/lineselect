import React, { useState } from 'react';
import { Text, useInput, useStdout } from 'ink';
import Color from 'ink-color-pipe';


export default function App({lines, color}) {
	const [line, setLine] = useState(0);
	const [x, setX] = useState(0); // column offset
	const [selected, setSelected] = useState({});
	const {stdout} = useStdout();

  useInput((input, key) => {
    if (key.return) {
      const filtered = lines.filter((l, i) => selected[i]);
      process.stdout.write(filtered.join('\n'));
      process.stdout.end('\n');
      process.exit();
    } else if (key.escape) {
      process.exit();
    } else if (key.upArrow) {
			setLine(l => Math.max(0, l - 1));
		} else if (key.downArrow) {
			setLine(l => Math.min(lines.length - 1, l + 1));
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

  const visibleRows = (stdout.rows || 20) - 1;
  const offset = Math.max(0, line - visibleRows + 1);

  return <>
  <Text><Color styles='cyan'>
      Use ↑↓ keys to move cursor, [space] to toggle line
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
