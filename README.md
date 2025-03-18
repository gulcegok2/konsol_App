# Log Analysis Desktop Application

A desktop application built with Electron for analyzing system log files and visualizing memory usage and load average metrics.

## Features

- 📊 Interactive data visualization using Chart.js
- 📈 Memory usage percentage tracking
- 📈 Load average monitoring
- ⏰ Time-based filtering capabilities
- 📑 Excel export functionality
- 🎨 Modern and responsive UI


## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/konsol_App.git
```

2. Navigate to the project directory:
```bash
cd konsol_App
```

3. Install dependencies:
```bash
npm install
```

## Usage

1. Start the application:
```bash
npm start
```

2. Click the "Select Log File" button to choose your log file
3. View the generated visualizations in the Memory and Load Average tabs
4. Use the time filters to analyze specific time periods
5. The application will automatically generate an Excel report on your desktop

## Project Structure

```
konsol_App/
├── elektron.js      # Main Electron process
├── index.html       # Application UI
├── package.json     # Project dependencies
└── README.md        # Project documentation
```

## Dependencies

- electron
- xlsx
- chart.js

## Acknowledgments

- Electron team for the amazing framework
- Chart.js for the visualization library
- XLSX library for Excel file handling 
