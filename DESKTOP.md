# Desktop Version Instructions

To install this application as a desktop version on Windows machines, you have two main options:

## Option 1: Progressive Web App (PWA) - Recommended
Since this is a web application, you can install it directly from your browser:
1. Open the application in **Google Chrome** or **Microsoft Edge**.
2. Look for the **Install** icon in the address bar (usually a small computer screen with an arrow).
3. Click **Install**.
4. The application will now appear in your Start Menu and on your Desktop as a standalone app.

## Option 2: Electron Wrapper
If you need a native `.exe` installer, you can wrap the application using Electron:
1. Install Electron: `npm install --save-dev electron`
2. Create a `main.js` file to load the application URL or local build.
3. Use `electron-builder` to package it for Windows.

## Option 3: WebView2 Wrapper (C# / .NET)
For a lightweight Windows-native experience:
1. Create a new **WinForms** or **WPF** project in Visual Studio.
2. Add the **Microsoft.Web.WebView2** NuGet package.
3. Set the `Source` property of the WebView2 control to your application URL.
4. Build the project to generate a native `.exe`.
