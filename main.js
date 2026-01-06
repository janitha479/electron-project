const { app, BrowserWindow, ipcMain } = require('electron/main')
const { exec, execFile } = require('child_process')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: `${__dirname}/preload.js`
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  // Handle renderer request to scan Wi‑Fi profiles and fetch passwords (Windows only)
  ipcMain.handle('scan-wifi', async () => {
    if (process.platform !== 'win32') {
      return { error: 'scan-wifi is supported only on Windows' }
    }

    const execPromise = (cmd, opts = {}) => new Promise((resolve, reject) => {
      exec(cmd, opts, (err, stdout, stderr) => {
        if (err) return reject({ err, stderr })
        resolve(stdout)
      })
    })

    const execFilePromise = (file, args = [], opts = {}) => new Promise((resolve, reject) => {
      execFile(file, args, opts, (err, stdout, stderr) => {
        if (err) return reject({ err, stderr })
        resolve(stdout)
      })
    })

    try {
      const out = await execPromise('netsh wlan show profile', { windowsHide: true, timeout: 15000 })
      const re = /All User Profile\s*:\s*(.+)/gi
      const profiles = []
      let m
      while ((m = re.exec(out)) !== null) {
        profiles.push(m[1].trim())
      }

      const results = []
      for (const name of profiles) {
        try {
          // Use execFile so arguments with spaces are handled safely
          const args = ['wlan', 'show', 'profile', `name=${name}`, 'key=clear']
          const details = await execFilePromise('netsh', args, { windowsHide: true, timeout: 10000 })
          const keyRe = /Key Content\s*:\s*(.+)/i
          const keyMatch = details.match(keyRe)
          const password = keyMatch ? keyMatch[1].trim() : null
          results.push({ ssid: name, password })
        } catch (e) {
          results.push({ ssid: name, password: null, error: e && e.stderr ? String(e.stderr) : (e && e.err ? String(e.err) : 'unknown') })
        }
      }

      return { profiles: results }
    } catch (e) {
      return { error: e && e.stderr ? String(e.stderr) : (e && e.err ? String(e.err) : (e && e.message ? e.message : 'unknown error')) }
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})