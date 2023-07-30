const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    frame: false,
    movable: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.setAlwaysOnTop(true);
  app.on('browser-window-created', (event, window) => {
    window.on('enter-full-screen', () => {
      // 当其他窗口进入全屏模式时，将当前窗口置顶
      mainWindow.setAlwaysOnTop(true);
    });
  });
}

app.on('ready', function () {
  createWindow();

  // 读取单词文件
  fs.readFile(path.join(__dirname, 'words.txt'), 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      return;
    }
    const wordPairs = data.split('\n'); // 将data字符串按行拆分为单词与解释的对
    const wordsWithMeanings = [];

    // 将单词与解释按格式组合成一个新的字符串数组
    for (const pair of wordPairs) {
      const firstSpaceIndex = pair.indexOf(' '); // 找到第一个空格的位置
      if (firstSpaceIndex !== -1) {
        const word = pair.substring(0, firstSpaceIndex); // 提取第一个空格之前的部分作为word
        const meaning = pair.substring(firstSpaceIndex + 1); // 提取第一个空格之后的部分作为meaning
        wordsWithMeanings.push(`${word}:${meaning}`);
      } else {
        const word = pair.trim(); // 如果没有空格，直接使用trim()方法去除首尾空格
        const meaning = '';
        wordsWithMeanings.push(`${word}:${meaning}`);
      }
    }

    // 使用换行符连接数组中的所有元素，形成一个以每行一个单词与解释的新字符串
    const formattedData = wordsWithMeanings.join('\n');


    // 接下来，使用formattedData生成单词数组并继续原始代码
    const words = formattedData.split('\n').filter(word => word.trim() !== '');

    let currentIndex = 0;
    setInterval(() => {
      mainWindow.webContents.send('playWord', words[currentIndex]);
      currentIndex = (currentIndex + 1) % words.length;
    }, 5000); // 每隔5秒播放一个单词
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