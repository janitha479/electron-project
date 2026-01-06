# Electron Wi-Fi Scanner

A Windows desktop application built with Electron that scans and displays saved Wi-Fi networks along with their passwords.

## What Does It Do?

This application allows you to:
- Scan all saved Wi-Fi profiles on your Windows computer
- View the network names (SSIDs) and their stored passwords
- Display the information in a simple, user-friendly interface

**Note:** This application only works on Windows systems as it uses Windows-specific commands (`netsh`) to retrieve Wi-Fi information.

## Prerequisites

Before you can run or build this application, you need to have the following installed:

- **Node.js** (version 16 or higher recommended)
  - Download from: https://nodejs.org/
- **npm** (comes with Node.js)

## Installation

1. Clone or download this repository
2. Open a terminal/command prompt in the project directory
3. Install the dependencies:

```bash
npm install
```

## How to Run the Application

To run the application in development mode:

```bash
npm start
```

This will launch the Electron application window where you can:
1. Click the "Scan Wi-Fi" button
2. Wait for the scan to complete
3. View the list of saved Wi-Fi profiles with their passwords

**Important:** The application requires administrator privileges to retrieve Wi-Fi passwords on some Windows systems.

## How to Build the Executable

This project uses Electron Forge to package and build the application into an executable.

### Build for Windows (Squirrel Installer)

To create a Windows installer:

```bash
npm run make
```

This will:
1. Package the application
2. Create an installer in the `out/make/squirrel.windows/` directory
3. Generate a `.exe` installer file that you can distribute

### Package Only (Without Installer)

If you just want to package the application without creating an installer:

```bash
npm run package
```

This creates a packaged application in the `out/` directory that can be run directly.

### Build Output

After running `npm run make`, you'll find:
- **Installer**: `out/make/squirrel.windows/x64/electron-project-{version}Setup.exe`
- **Packaged App**: `out/electron-project-win32-x64/`

## Project Structure

```
electron-project/
├── main.js           # Main process - handles Wi-Fi scanning logic
├── preload.js        # Preload script - exposes safe APIs to renderer
├── renderer.js       # Renderer process - handles UI interactions
├── index.html        # Application UI
├── package.json      # Project dependencies and scripts
├── forge.config.js   # Electron Forge configuration
└── README.md         # This file
```

## Platform Support

- **Windows**: ✅ Fully supported
- **macOS**: ❌ Not supported (uses Windows-specific commands)
- **Linux**: ❌ Not supported (uses Windows-specific commands)

## Security Notes

This application:
- Uses `netsh` commands to retrieve Wi-Fi information
- Requires appropriate permissions to access saved Wi-Fi passwords
- Only accesses information stored on your local machine
- Does not transmit any data over the network

## Troubleshooting

**"Error: scan-wifi is supported only on Windows"**
- This application only works on Windows. Ensure you're running it on a Windows machine.

**No passwords displayed**
- Some Wi-Fi networks may not have passwords stored
- You may need to run the application as Administrator
- Some enterprise networks use certificate-based authentication and don't store passwords

**Build fails**
- Make sure all dependencies are installed: `npm install`
- Ensure you have Node.js 16 or higher installed
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

## License

ISC

## Author

janitha
