# LineSelect

A shell utility to interactively select lines from stdin and output them to stdout. This allows you to effectively pause the pipeline to make a manual selection before the pipeline, or other composed command, continues.

```mermaid
graph LR;
  a[some pipeline]-->|some lines| lineselect;
  lineselect-->|a subset of those lines| b[some other pipeline];
```

## The applications are end-less

For example, select files to delete
```
ls | lineselect | xargs rm
```

Select files from a list sorted by size and delete those files
```
ls -lS | lineselect | tr -s ' ' | cut -d ' ' -f 9 | xargs rm
```

Select docker containers to stop:
```
docker stop $(docker ps | lineselect  | cut -d ' ' -f 1)
```

(z)Grep some some log files of interest:
```
ls dpkg.log* | lineselect | xargs zgrep upgrade
```


## Demo Video

[![Demo](https://img.youtube.com/vi/dm6ju1SixIQ/0.jpg)](https://www.youtube.com/watch?v=dm6ju1SixIQ)



## Install

```bash
$ npm install -g lineselect
```

## Acknowledgements

Built using the amazing: https://github.com/vadimdemedes/ink.

With help from https://github.com/geier/choose and https://superuser.com/a/742789/282396, with the key insight of writing directly to the TTY (by-passing stdout) to render the TUI without messing up the eventual output to stdout.
