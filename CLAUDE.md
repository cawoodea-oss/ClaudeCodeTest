# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a browser-based game project — no build system, no package manager, no dependencies. All projects are single-file HTML with embedded CSS and JavaScript, opened directly in a browser.

## Running the Project

Open any `.html` file directly in a browser:
```
start <filename>.html   # Windows
```

There are no build steps, no dev servers, and no tests to run.

## Git & GitHub Workflow

All changes must be committed and pushed to GitHub after each meaningful change.

- Remote: `https://github.com/cawoodea-oss/ClaudeCodeTest`
- Branch: `master`
- Git identity configured locally: `cawoodea-oss` / `cawoodea-oss@users.noreply.github.com`

Commit message format: imperative mood, short summary line, optional body with details.

## Architecture

Each project is a fully self-contained `.html` file with no external dependencies:
- **Structure**: HTML markup, `<style>` block (CSS), `<script>` block (JS) — all in one file
- **No frameworks**: Vanilla JS and CSS only
- **No build pipeline**: Files are served directly from the filesystem
