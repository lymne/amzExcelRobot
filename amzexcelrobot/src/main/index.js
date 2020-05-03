'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import dayjs from 'dayjs'
import path from 'path'

// import preview from '../renderer/assets/excelHelper.js'
let fs = require('fs')
let http = require('http')
let Excel = require('exceljs')
function getStringOrEmpty (data) {
  return data || ''
}
function padding (num, length) {
  for (var len = (num + '').length; len < length; len = num.length) {
    num = '0' + num
  }
  return num
}
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
function preview (template, data, site, type) {
  let realData = []
  switch (type) {
    case 'wpr':
      template = template.wpr
      data.map((item, index) => {
        // 父变体sku 定义

        let tempParentSku = template.skuPrefix[site] + template.parentSkuFormat
          .replace('{PARENT_NUM}', padding(index + 1, 2))
          .replace('{MMDD}', dayjs().format('MMDD'))
          .replace('{CHILD_NUM}', '00')

        let parent = {
          feed_product_type: template.feed_product_type[site],
          item_sku: tempParentSku,
          external_product_id_type: '',
          brand_name: template.brand_name[site],
          item_name: template.parent_name[site].replace('{NAME_TEXT}', item.productName),
          manufacturer: template.manufacturer[site],
          part_number: '',
          standard_price: '',
          quantity: '',
          merchant_shipping_group_name: '',
          main_image_url: '',
          other_image_url1: '',
          other_image_url2: '',
          other_image_url3: '',
          other_image_url4: '',
          other_image_url5: '',
          other_image_url6: '',
          other_image_url7: '',
          other_image_url8: '',
          parent_child: 'parent',
          parent_sku: '',
          relationship_type: '',
          variation_theme: template.variation_theme[site],
          product_description: '',
          item_type: '',
          update_delete: '',
          bullet_point1: '',
          bullet_point2: '',
          bullet_point3: '',
          bullet_point4: '',
          bullet_point5: '',
          generic_keywords: '',
          wattage: '',
          wattage_unit_of_measure: '',
          color_name: template.color_name[site],
          color_map: template.color_map[site],
          material_type: template.material_type[site],
          size_name: '',
          condition_type: site === 'jp' ? '新品' : 'New',
          fulfillment_latency: ''
        }

        realData.push(parent)
        let total = 0
        for (let sizeIndex = 0; sizeIndex < template.skus[item.size].length; sizeIndex++) {
          total++
          let tempChildSku = template.skuPrefix[site] + template.childSkuFormat
            .replace('{PARENT_NUM}', padding(index + 1, 2))
            .replace('{MMDD}', dayjs().format('MMDD'))
            .replace('{CHILD_NUM}', padding(total, 2))

          let child = {
            feed_product_type: template.feed_product_type[site],
            item_sku: tempChildSku,
            origin_sku: `${template.skus[item.size][sizeIndex]}-wpr-${item.code}-p`,
            external_product_id_type: 'EAN',
            brand_name: template.brand_name[site],
            item_name: template.variation_name[site].replace('{NAME_TEXT}', item.productName).replace('{SIZE_TEXT}', template.size_text[template.skus[item.size][sizeIndex]][site === 'jp' ? 1 : 0]),
            manufacturer: template.manufacturer[site],
            part_number: tempChildSku,
            standard_price: template.standard_price[site][template.skus[item.size][sizeIndex]],
            quantity: template.quantity[template.skus[item.size][sizeIndex]],
            merchant_shipping_group_name: template.merchant_shipping_group_name[site][template.skus[item.size][sizeIndex]],
            main_image_url: template.main_image_url[template.skus[item.size][sizeIndex]].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`),
            other_image_url1: template.other_image_urls[template.skus[item.size][sizeIndex]][0] ? template.other_image_urls[template.skus[item.size][sizeIndex]][0].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
            other_image_url2: template.other_image_urls[template.skus[item.size][sizeIndex]][1] ? template.other_image_urls[template.skus[item.size][sizeIndex]][1].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
            other_image_url3: template.other_image_urls[template.skus[item.size][sizeIndex]][2] ? template.other_image_urls[template.skus[item.size][sizeIndex]][2].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
            other_image_url4: template.other_image_urls[template.skus[item.size][sizeIndex]][3] ? template.other_image_urls[template.skus[item.size][sizeIndex]][3].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
            other_image_url5: template.other_image_urls[template.skus[item.size][sizeIndex]][4] ? template.other_image_urls[template.skus[item.size][sizeIndex]][4].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
            other_image_url6: template.other_image_urls[template.skus[item.size][sizeIndex]][5] ? template.other_image_urls[template.skus[item.size][sizeIndex]][5].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
            other_image_url7: template.other_image_urls[template.skus[item.size][sizeIndex]][6] ? template.other_image_urls[template.skus[item.size][sizeIndex]][6].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
            other_image_url8: template.other_image_urls[template.skus[item.size][sizeIndex]][7] ? template.other_image_urls[template.skus[item.size][sizeIndex]][7].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
            parent_child: 'child',
            parent_sku: parent.item_sku,
            relationship_type: 'Variation',
            variation_theme: template.variation_theme[site],
            product_description: site === 'jp' ? template.product_description[1] : template.product_description[0],
            item_type: template.item_type[site],
            bullet_point1: template.bullet_points.bullet_point1[site === 'jp' ? 1 : 0].replace('{overallsize_text}', template.overallsize_text[template.skus[item.size][sizeIndex]][site === 'jp' ? 1 : 0]),
            bullet_point2: template.bullet_points.bullet_point2[site === 'jp' ? 1 : 0].replace('{overallsize_text}', template.overallsize_text[template.skus[item.size][sizeIndex]][site === 'jp' ? 1 : 0]),
            bullet_point3: template.bullet_points.bullet_point3[site === 'jp' ? 1 : 0].replace('{overallsize_text}', template.overallsize_text[template.skus[item.size][sizeIndex]][site === 'jp' ? 1 : 0]),
            bullet_point4: template.bullet_points.bullet_point4[site === 'jp' ? 1 : 0].replace('{overallsize_text}', template.overallsize_text[template.skus[item.size][sizeIndex]][site === 'jp' ? 1 : 0]),
            bullet_point5: template.bullet_points.bullet_point5[site === 'jp' ? 1 : 0].replace('{overallsize_text}', template.overallsize_text[template.skus[item.size][sizeIndex]][site === 'jp' ? 1 : 0]),
            generic_keywords: item.keyword ? item.keyword + ' ' + template.generic_keywords[site === 'jp' ? 1 : 0] : template.generic_keywords[site === 'jp' ? 1 : 0],
            platinum_keywords1: getStringOrEmpty(template.platinum_keywords1),
            platinum_keywords2: getStringOrEmpty(template.platinum_keywords2),
            platinum_keywords3: getStringOrEmpty(template.platinum_keywords3),
            platinum_keywords4: getStringOrEmpty(template.platinum_keywords4),
            platinum_keywords5: getStringOrEmpty(template.platinum_keywords5),
            color_name: template.color_name[site],
            color_map: template.color_map[site],
            material_type: template.material_type[site],
            size_name: getStringOrEmpty(template.size_name[template.skus[item.size][sizeIndex]][site === 'jp' ? 1 : 0]),
            condition_type: site === 'jp' ? '新品' : 'New',
            fulfillment_latency: getStringOrEmpty(template.fulfillment_latency[site]),
            list_price: getStringOrEmpty(template.list_price[site][template.skus[item.size][sizeIndex]]),
            uvp_list_price: getStringOrEmpty(template.list_price[site][template.skus[item.size][sizeIndex]]),
            item_display_length: template.item_display_length[site][template.skus[item.size][sizeIndex]],
            item_display_width: template.item_display_width[site][template.skus[item.size][sizeIndex]],
            item_display_height: template.item_display_height[site][template.skus[item.size][sizeIndex]],
            item_display_length_unit_of_measure: getStringOrEmpty(template.item_display_length_unit_of_measure),
            item_display_width_unit_of_measure: getStringOrEmpty(template.item_display_width_unit_of_measure),
            item_display_height_unit_of_measure: getStringOrEmpty(template.item_display_height_unit_of_measure),
            display_dimensions_unit_of_measure: getStringOrEmpty(template.display_dimensions_unit_of_measure)

          }
          realData.push(child)
        }
      })
      break
    default:
      break
  }

  return realData
}
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

ipcMain.on('downloadExcelHeaders', (event, templateUrls) => {
  templateUrls.map(item => {
    const file = fs.createWriteStream(path.join(__static, `${item.account}-${item.type}.xlsx`))
    http.get(item.path, function (response) {
      response.pipe(file)
      file.on('finish', function () {
        let workbookHead = new Excel.Workbook()
        try {
          workbookHead.xlsx.readFile(path.join(__static, `${item.account}-${item.type}.xlsx`)).then(function () {
            let worksheetHead = workbookHead.getWorksheet(1)
            let row1 = worksheetHead.getRow(1)
            event.returnValue = row1
          })
        } catch (e) {
          console.log(e)
        }
      })
    })
  })
})
ipcMain.on('downloadExcelFile2', (event, filepath, setting, checkedsites, templateUrls) => {
  try {
    let workbook = new Excel.Workbook()
    workbook.xlsx.readFile(filepath).then(() => {
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

      templateUrls.map(template => {
        let workbookHead = new Excel.Workbook()
        // console.log(workbookHead, template.type, path.join(__static, `${template.account}-${template.type}.xlsx`))
        workbookHead.xlsx.readFile(path.join(__static, `${template.account}-${template.type}.xlsx`)).then(function () {
          // handle every site template

          checkedsites.map(async site => {
            let rawData = preview(setting, skuMap, site, template.type)
            // console.log(1111, rawData.length)

            let worksheetHead = workbookHead.getWorksheet(site)
            let row1 = worksheetHead.getRow(1)
            let workbook = new Excel.Workbook()
            let worksheet = workbook.addWorksheet('sheet 1')
            row1.getCell('B').value = `Version=${dayjs().format('YYYY.MMDD')}`
            worksheet.addRow(worksheetHead.getRow(1).values)
            worksheet.addRow(worksheetHead.getRow(2).values)
            worksheet.addRow(worksheetHead.getRow(3).values)
            const attributeColumns = worksheetHead.getRow(3).values

            let requiredColumns = setting[template.type].requiredColumn[site]
            let mapping = []
            requiredColumns.map(column => {
              let index = attributeColumns.findIndex(item => item === column)
              mapping.push({index, column})
              console.log(site, index, column)
            })
            rawData.map(item => {
              let rowValues = []
              worksheet.addRow(rowValues)
              let row = worksheet.lastRow
              requiredColumns.map(column => {
                let index = mapping.find(m => m.column === column).index
                console.log(index, item[column])
                row.getCell(index).value = item[column]
              })
            })
            try {
              await workbook.xlsx.writeFile(filepath.replace('.xlsx', `-template-${template.account}-${template.type}-${site}.xlsx`))
            } catch (e) {
              console.log(e)
            }
          })
        })
        event.returnValue = 'done'
        // try {
        //   workbook.xlsx.writeFile(filepath.replace('.xlsx', '-template.xlsx')).then(function () {
        //     let workbookMatch = new Excel.Workbook()
        //     let worksheetMatch = workbookMatch.addWorksheet('sheet 1')
        //     data.map(item => {
        //       let rowValues = []
        //       worksheetMatch.addRow(rowValues)
        //       let row = worksheetMatch.lastRow
        //       row.getCell('A').value = item.origin_sku
        //       row.getCell('B').value = item.item_sku
        //     })
        //     workbookMatch.xlsx.writeFile(filepath.replace('.xlsx', '-match.xlsx')).then(function () {
        //       event.returnValue = 'done'
        //     })
        //   })
        // } catch (err) {
        //   event.returnValue = err
        // }
      })
    })
  } catch (err) {
    console.log(err)
    event.returnValue = err
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
