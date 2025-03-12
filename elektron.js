// main.js
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Log dosyası seçme işlemi
ipcMain.on('select-file', async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Log Dosyaları', extensions: ['txt'] },
      { name: 'Tüm Dosyalar', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    try {
      // Dosya adını al (uzantısız)
      const fileName = path.basename(filePath, path.extname(filePath));
      
      // Bugünün tarihini al ve formatla
      const today = new Date();
      const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD formatı
      
      const logData = fs.readFileSync(filePath, 'utf8');
      const processedData = processLogFile(logData);
      
      // Excel dosyası oluştur - dosya adını kullan
      const desktopPath = app.getPath('desktop');
      const excelPath = path.join(desktopPath, `${fileName}_${dateString}.xlsx`);
      createExcelFile(processedData, excelPath);
      
      event.reply('file-processed', {
        success: true,
        data: processedData,
        excelPath: excelPath,
        date: dateString,
        fileName: fileName
      });
    } catch (error) {
      event.reply('file-processed', {
        success: false,
        error: error.message
      });
    }
  }
});

function processLogFile(logData) {
  const lines = logData.split('\n').filter(line => line.trim() !== '');
  
  return lines.map(line => {
    const timeMatch = line.match(/\d{2}:\d{2}:\d{2},\d{3}/);
    const memoryMatch = line.match(/(\d+)MB\/(\d+)MB ([\d.]+)%/);
    const loadMatch = line.match(/LoadAvarage:([\d.]+)%/);
    
    return {
      'Saat': timeMatch ? timeMatch[0] : '',
      'Memory MB': memoryMatch ? `${memoryMatch[1]}/${memoryMatch[2]}` : '',
      'Memory Yüzdesi': memoryMatch ? parseFloat(memoryMatch[3]) : 0,
      'Load Average': loadMatch ? parseFloat(loadMatch[1]) : 0
    };
  });
}

function createExcelFile(data, filePath) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Log Analizi');
  XLSX.writeFile(workbook, filePath);
}