# Food App - Glycemic Load

A simple web application to display the glycemic load of different foods.

## Description

This application allows you to easily view the glycemic load of your favorite foods in a responsive and modern web interface.

## Features

- Display foods as cards
- Glycemic load information for each food
- Responsive interface for mobile and desktop
- Dynamic data loading from a markdown file

## Installation and Usage

### Prerequisites

- A modern web browser
- A local web server (optional)

### Running the Application

#### Option 1: Simple local server

```bash
python -m http.server 8000
```

Then open http://localhost:8000

#### Option 2: With Node.js

```bash
npx serve
```

#### Option 3: Direct browser access

Open the `index.html` file directly in your browser.

## Project Structure

```
food-app/
├── index.html      # Main page
├── app.js         # Application logic
├── style.css      # CSS styles
├── aliments.md    # Food data
├── CLAUDE.md      # Claude Code guide
└── README.md      # This file
```

## Adding Foods

To add new foods, modify the `aliments.md` file following this format:

```markdown
## Food Name

Charge glycémique: NUMERIC_VALUE
```

Example:

```markdown
## Apple

Charge glycémique: 6
```

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox)
- JavaScript (ES6+, Fetch API)
- Custom Markdown parsing

## Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
