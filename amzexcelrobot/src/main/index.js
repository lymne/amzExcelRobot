'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import dayjs from 'dayjs'
import path from 'path'
let Excel = require('exceljs')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })
  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function getColumnData (worksheet, colName) {
  let column = worksheet.getColumn(colName).values
  return column.slice(2, column.length)
}

ipcMain.on('previewExcelFile', (event, path) => {
  try {
    console.log(path)
    let workbook = new Excel.Workbook()
    workbook.xlsx.readFile(path).then(() => {
      let worksheet = workbook.getWorksheet(1)
      let names = getColumnData(worksheet, 'A')
      let codes = getColumnData(worksheet, 'B')
      let sizes = getColumnData(worksheet, 'C')
      let keywords = getColumnData(worksheet, 'D')
      let skuMap = []
      let numberCode = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      for (let i = 0; i < names.length; i++) {
        let codePrefix = numberCode.includes(codes[i].toString().charAt(0)) ? 'nocode' : codes[i].toString().charAt(0)
        let temp = {
          productName: names[i],
          code: codes[i],
          codePrefix: codePrefix,
          keyword: keywords[i] || '',
          size: sizes[i]
        }
        skuMap.push(temp)
      }
      event.returnValue = skuMap
    })
  } catch (err) {
    console.log(err)
    event.returnValue = null
  }
})
ipcMain.on('downloadExcelFile', (event, filepath, data, templateContent) => {
  try {
    let workbookHead = new Excel.Workbook()
    workbookHead.xlsx.readFile(path.join(__static, templateContent.headTemplate)).then(function () {
      let worksheetHead = workbookHead.getWorksheet(1)
      let row1 = worksheetHead.getRow(1)
      let workbook = new Excel.Workbook()
      let worksheet = workbook.addWorksheet('sheet 1')
      row1.getCell('B').value = `Version=${dayjs().format('YYYY.MMDD')}`
      worksheet.addRow(worksheetHead.getRow(1).values)
      worksheet.addRow(worksheetHead.getRow(2).values)
      worksheet.addRow(worksheetHead.getRow(3).values)
      let columnMapping = templateContent.columnMapping
      data.map(item => {
        let rowValues = []
        worksheet.addRow(rowValues)
        let row = worksheet.lastRow
        for (let key in columnMapping) {
          row.getCell(key).value = item[columnMapping[key]]
        }
      })
      try {
        workbook.xlsx.writeFile(filepath.replace('.xlsx', '-template.xlsx')).then(function () {
          let workbookMatch = new Excel.Workbook()
          let worksheetMatch = workbookMatch.addWorksheet('sheet 1')
          data.map(item => {
            let rowValues = []
            worksheetMatch.addRow(rowValues)
            let row = worksheetMatch.lastRow
            row.getCell('A').value = item.origin_sku
            row.getCell('B').value = item.item_sku
          })
          workbookMatch.xlsx.writeFile(filepath.replace('.xlsx', '-match.xlsx')).then(function () {
            event.returnValue = 'done'
          })
        })
      } catch (err) {
        event.returnValue = err
      }
    })
  } catch (err) {
    console.log(err)
    event.returnValue = err
  }
})

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
