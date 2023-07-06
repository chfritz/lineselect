import React, {useState, useEffect} from 'react';
import {Text, useInput, useStdout} from 'ink';
import Color from 'ink-color-pipe';

// Regex to detect color escape patterns, from
// https://stackoverflow.com/a/18000433/1087119
const removeColorRegEx = /\x1B\[([0-9]{1,3}(;[0-9]{1,2};?)?)?[mGK]/g;

export default function App({lines, color}) {
	const [line, setLine] = useState(0);
	const [x, setX] = useState(0); // column offset
	const [selected, setSelected] = useState({});
	const {stdout} = useStdout();

  useInput((input, key) => {
    if (key.return) {
      const filtered = lines.filter((l, i) => selected[i])
        .map(l => l.replace(removeColorRegEx, ''));
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
		}
	});

  const visibleRows = (stdout.rows || 20) - 1;
  const offset = Math.max(0, line - visibleRows + 1);

  return lines.slice(offset, offset + visibleRows).map((l, i) => {
    const row = i + offset;
    return <Text key={i} wrap="truncate">
      {line == row ? <Color styles='green'>→</Color>: ' '} {selected[row]
        ? '+' : ' '} <Color styles={selected[row] ? 'inverse' : ''}>
        {l.slice(x)}</Color>
    </Text>;
  });
}
