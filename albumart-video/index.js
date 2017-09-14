const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

app.on('ready', () => {
  const { argv } = process;
  const unparsedArgv = argv.slice(argv.indexOf('--') + 1);
  const window = new BrowserWindow({ show: false });

  window.loadURL(url.format({
    hash: '#' + unparsedArgv.map(encodeURIComponent).join('&'),
    pathname: path.join(__dirname, 'renderer.html'),
    protocol: 'file:',
  }));
});

app.on('window-all-closed', app.quit.bind(app));
