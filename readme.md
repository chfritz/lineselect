# LineSelect

A shell utility to interactively select lines from stdin and output them to stdout. This allows you to effectively pause the pipeline to make a manual selection before the pipeline, or other composed command, continues.

```mermaid
graph LR;
  a[some pipeline]-->|some lines| lineselect;
  lineselect-->|a subset of those lines| b[some other pipeline];
```


Now that I have this I can't believe something like this doesn't already exist as part of the standard set of shell scripting tools available on Linux/MacOS.

## Install

```bash
$ npm install -g lineselect
```

## Demo Video

[![Demo](https://img.youtube.com/vi/dm6ju1SixIQ/0.jpg)](https://www.youtube.com/watch?v=dm6ju1SixIQ)

## The applications are end-less

For example, select some files to delete from a list
```
ls *.log | lineselect | xargs rm
```

Select docker containers to stop:
```
docker stop $(docker ps | lineselect  | cut -d ' ' -f 1 )
```

(z)Grep some log files:
```
ls dpkg.log* | lineselect | xargs zgrep upgrade
```
