# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a simple French food application that displays glycemic load information for various foods. It's a client-side web application that parses markdown data and displays it in a responsive grid layout.

## Architecture

- **Static Web App**: No build process or package.json - runs directly in the browser
- **Data Source**: `aliments.md` contains food data in markdown format with "## Food Name" and "Charge glycémique: X" structure
- **JavaScript Parser**: `app.js` contains markdown parsing logic to extract food names and glycemic load values
- **Display**: Responsive CSS grid layout showing food cards with glycemic load values

## Development Commands

This is a static HTML/CSS/JavaScript application with no build system:

- **Run locally**: Use any static web server (e.g., `python -m http.server 8000` or `npx serve`)
- **No compilation needed**: Edit files directly and refresh browser

## Key Files

- `index.html`: Main page structure with loading state and food grid container
- `app.js`: Core application logic including markdown parsing and DOM rendering
- `style.css`: Responsive styling with gradient header and card-based layout
- `aliments.md`: Food data in structured markdown format

## Data Structure

The markdown parser expects this format in `aliments.md`:
```markdown
## Food Name
Charge glycémique: NUMBER
```

Foods without valid glycemic load values are filtered out during parsing.