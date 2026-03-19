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

**Always commit and push after every meaningful unit of work** — a new feature, a bug fix, a refactor, or any change the user would want to be able to revert to. Do not batch multiple unrelated changes into one commit. The goal is that GitHub always reflects the latest working state so nothing is ever lost.

- Remote: `https://github.com/cawoodea-oss/ClaudeCodeTest`
- Branch: `master`
- Git identity configured locally: `cawoodea-oss` / `cawoodea-oss@users.noreply.github.com`

Commit message format: imperative mood, short summary line, optional body with details. Always end with the co-author trailer:
```
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

## Architecture

Each project is a fully self-contained `.html` file with no external dependencies:
- **Structure**: HTML markup, `<style>` block (CSS), `<script>` block (JS) — all in one file
- **No frameworks**: Vanilla JS and CSS only
- **No build pipeline**: Files are served directly from the filesystem
