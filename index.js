const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    movable: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', function () {
  createWindow();

  // 读取单词文件
  fs.readFile(path.join(__dirname, 'words.txt'), 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      return;
    }

    const words = data.split('\n').filter(word => word.trim() !== '');

    let currentIndex = 0;
    setInterval(() => {
      mainWindow.webContents.send('playWord', words[currentIndex]);
      currentIndex = (currentIndex + 1) % words.length;
    }, 2000); // 每2秒播放一个单词
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});