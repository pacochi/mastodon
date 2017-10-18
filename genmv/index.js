const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

app.on('ready', () => {
  const window = new BrowserWindow({ show: false });

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'renderer.html'),
    protocol: 'file:',
  }));
});

app.on('window-all-closed', app.quit.bind(app));
