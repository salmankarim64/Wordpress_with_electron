const { app, BrowserWindow } = require("electron");
const { exec, execSync } = require("child_process");

function installNpNowPackage() {
  try {
    execSync("npm install @wp-now/wp-now");
  } catch (err) {
    //console.error("Error installing np-now package:", err.message);
    process.exit(1);
  }
}
function runWpNowStart() {
  const wpNowProcess = exec("wp-now start");

  wpNowProcess.stdout.on("data", (data) => {
    console.log("here", data.toString());
    console.log();
    let x = data.toString();
    if (x.includes("localhost")) {
      let portLineArray = x.split(" ");
      portLineArray.map((index) => {
        if (index.includes("localhost")) {
          createWindow(index);
        }
      });
    }
    //createWindow(); // Log the output to the console or display it in your app's GUI.
  });

  wpNowProcess.stderr.on("data", (data) => {
    console.error(data.toString()); // Log any errors to the console or display them in your app's GUI.
  });

  wpNowProcess.on("close", (code) => {
    console.log(`wp-now process exited with code ${code}`);
    // Here you can handle any additional actions after the deployment process is completed.
  });
}
const createWindow = (url) => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable this with caution, read the Electron documentation for security implications.
    },
  });

  win.loadURL(url);
};

app.whenReady().then(async () => {
  await installNpNowPackage();
  runWpNowStart();

  //createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
