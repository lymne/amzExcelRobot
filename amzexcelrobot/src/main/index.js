'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import dayjs from 'dayjs'
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
ipcMain.on('downloadExcelFile', (event, filepath, data) => {
  try {
    let workbookHead = new Excel.Workbook()
    workbookHead.xlsx.readFile('static/head.xlsx').then(function () {
      let worksheetHead = workbookHead.getWorksheet(1)
      let row1 = worksheetHead.getRow(1)
      let workbook = new Excel.Workbook()
      let worksheet = workbook.addWorksheet('sheet 1')
      row1.getCell('B').value = `Version=${dayjs().format('YYYY.MMDD')}`
      worksheet.addRow(worksheetHead.getRow(1).values)
      worksheet.addRow(worksheetHead.getRow(2).values)
      worksheet.addRow(worksheetHead.getRow(3).values)
      data.map(item => {
        let rowValues = []
        worksheet.addRow(rowValues)
        let row = worksheet.lastRow
        row.getCell('A').value = item.feed_product_type
        row.getCell('B').value = item.item_sku
        row.getCell('D').value = item.external_product_id_type
        row.getCell('E').value = item.brand_name
        row.getCell('F').value = item.item_name
        row.getCell('G').value = item.manufacturer
        row.getCell('H').value = item.part_number
        row.getCell('I').value = item.standard_price
        row.getCell('J').value = item.quantity
        row.getCell('K').value = item.merchant_shipping_group_name
        row.getCell('M').value = item.main_image_url
        row.getCell('N').value = item.other_image_url1
        row.getCell('O').value = item.other_image_url2
        row.getCell('P').value = item.other_image_url3
        row.getCell('Q').value = item.other_image_url4
        row.getCell('R').value = item.other_image_url5
        row.getCell('S').value = item.other_image_url6
        row.getCell('T').value = item.other_image_url7
        row.getCell('U').value = item.other_image_url8
        row.getCell('Y').value = item.parent_child
        row.getCell('Z').value = item.parent_sku
        row.getCell('AA').value = item.relationship_type
        row.getCell('AB').value = item.variation_theme
        row.getCell('AC').value = item.product_description
        row.getCell('AD').value = item.item_type
        row.getCell('AI').value = item.bullet_point1
        row.getCell('AJ').value = item.bullet_point2
        row.getCell('AK').value = item.bullet_point3
        row.getCell('AL').value = item.bullet_point4
        row.getCell('AM').value = item.bullet_point5
        row.getCell('AS').value = item.generic_keywords1
        row.getCell('AT').value = item.generic_keywords2
        row.getCell('AU').value = item.generic_keywords3
        row.getCell('AV').value = item.generic_keywords4
        row.getCell('AW').value = item.generic_keywords5
        row.getCell('BC').value = item.wattage_unit_of_measure
        row.getCell('BD').value = item.color_name
        row.getCell('BE').value = item.color_map
        row.getCell('BF').value = item.material_type
        row.getCell('BG').value = item.size_name
        row.getCell('BO').value = item.wattage
        row.getCell('FH').value = item.condition_type
        row.getCell('FP').value = item.fulfillment_latency
      })
      try {
        workbook.xlsx.writeFile(filepath.replace('.xlsx', '-template.xlsx')).then(function () {
          event.returnValue = 'done'
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
