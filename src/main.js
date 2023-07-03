const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    maxWidth: 1280,
    maxHeight: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    })
  );

  win.webContents.on('did-finish-load', () => {
    // Codice per generare e visualizzare il grafico Plotly
    var data = [
      {
        x: ['ReportingCountry'],
        y: ['FirstDose'],
        type: 'scatter'
      }
    ];

    win.webContents.executeJavaScript(`
      var layout = {
        displayModeBar: false,
        margin: {
          t: 50, // Spazio superiore
          r: 50, // Spazio destro
        }
      };

      plotly.newPlot('graphContainer', ${JSON.stringify(data)}, layout);
    `);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
