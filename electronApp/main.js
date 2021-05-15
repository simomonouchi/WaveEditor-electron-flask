const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { exec } = require('child_process')
const rq = require('request-promise');
const mainAddr = 'http://localhost:8000';

let mainWindow = null;

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';

// close app
app.on('window-all-closed', function () {
  app.quit();
});

let options = {
  pythonPath: 'python3',
};

// init app
app.on('ready', function () {
  exec('python ../flaskServer/app.py', (err, stdout, stderr) => {
    console.log(__dirname)
    if (err) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  }
  )

  const openWindow = function () {
    mainWindow = new BrowserWindow({ width: 1200, height: 900 });
    mainWindow.loadURL(mainAddr);

    // enable development tools
    mainWindow.openDevTools();

    // close window
    mainWindow.on('closed', function () {
      electron.session.defaultSession.clearCache(() => { }) // remove cache
      mainWindow = null;
    });
  };

  const startUp = function () {
    rq(mainAddr)
      .then(function (htmlString) {
        console.log('server started');
        openWindow();
      })
      .catch(function (err) {
        startUp();
      });
  };

  startUp();
});
