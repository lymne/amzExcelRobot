let dayjs = require('dayjs')
function getStringOrEmpty (data) {
  return data || ''
}
function padding (num, length) {
  for (var len = (num + '').length; len < length; len = num.length) {
    num = '0' + num
  }
  return num
}
function preview (template, data) {
  let tableData = []
  let realData = []

  data.map((item, index) => {
    // 父变体sku 定义

    let tempParentSku = template.skuPrefix + template.parentSkuFormat
      .replace('{PARENT_NUM}', padding(index + 1, 2))
      .replace('{MMDD}', dayjs().format('MMDD'))
      .replace('{CHILD_NUM}', '00')

    let parent = {
      feed_product_type: template.feed_product_type,
      item_sku: tempParentSku,
      external_product_id_type: '',
      brand_name: template.brand_name,
      item_name: template.parent_name.replace('{NAME_TEXT}', item.productName).replace('{SKU_TEXT}', `${template.skuPrefix}-${item.code}`),
      manufacturer: template.manufacturer,
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
      variation_theme: template.variation_theme,
      product_description: '',
      item_type: '',
      update_delete: template.update_delete || '',
      bullet_point1: '',
      bullet_point2: '',
      bullet_point3: '',
      bullet_point4: '',
      bullet_point5: '',
      generic_keywords: '',
      wattage: '',
      wattage_unit_of_measure: '',
      color_name: '',
      color_map: '',
      material_type: '',
      size_name: '',
      condition_type: 'New',
      fulfillment_latency: ''
    }
    if (index === 0) {
      tableData.push(parent)
    }
    realData.push(parent)
    let total = 0
    for (let sizeIndex = 0; sizeIndex < template.skus[item.size].length; sizeIndex++) {
      for (let colorIndex = 0; colorIndex < template.colors.length; colorIndex++) {
        total++
        let tempChildSku = template.skuPrefix + template.childSkuFormat
          .replace('{PARENT_NUM}', padding(index + 1, 2))
          .replace('{MMDD}', dayjs().format('MMDD'))
          .replace('{CHILD_NUM}', padding(total, 2))

        let child = {
          feed_product_type: template.feed_product_type,
          item_sku: tempChildSku,
          origin_sku: `${template.skus[item.size][sizeIndex]}-${item.code}-${template.colors[colorIndex]}`,
          external_product_id_type: 'EAN',
          brand_name: template.brand_name,
          item_name: template.variation_name.replace('{NAME_TEXT}', item.productName).replace('{SKU_TEXT}', `${template.skus[item.size][sizeIndex]}-${item.code}-${template.colors[colorIndex]}`).replace('{SIZE_TEXT}', template.size_text[template.skus[item.size][sizeIndex]]).replace('{COLOR_TEXT}', template.color_text[template.colors[colorIndex]]),
          manufacturer: template.manufacturer,
          part_number: tempChildSku,
          standard_price: template.standard_price[template.skus[item.size][sizeIndex]],
          quantity: template.quantity[template.skus[item.size][sizeIndex]],
          update_delete: template.update_delete,
          merchant_shipping_group_name: template.merchant_shipping_group_name[template.skus[item.size][sizeIndex]],
          main_image_url: template.main_image_url.replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `st6-${item.code}-${template.colors[colorIndex]}`),
          other_image_url1: template.other_image_urls[template.colors[colorIndex]][0] ? template.other_image_urls[template.colors[colorIndex]][0].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
          other_image_url2: template.other_image_urls[template.colors[colorIndex]][1] ? template.other_image_urls[template.colors[colorIndex]][1].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
          other_image_url3: template.other_image_urls[template.colors[colorIndex]][2] ? template.other_image_urls[template.colors[colorIndex]][2].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
          other_image_url4: template.other_image_urls[template.colors[colorIndex]][3] ? template.other_image_urls[template.colors[colorIndex]][3].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
          other_image_url5: template.other_image_urls[template.colors[colorIndex]][4] ? template.other_image_urls[template.colors[colorIndex]][4].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
          other_image_url6: template.other_image_urls[template.colors[colorIndex]][5] ? template.other_image_urls[template.colors[colorIndex]][5].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
          other_image_url7: template.other_image_urls[template.colors[colorIndex]][6] ? template.other_image_urls[template.colors[colorIndex]][6].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
          other_image_url8: template.other_image_urls[template.colors[colorIndex]][7] ? template.other_image_urls[template.colors[colorIndex]][7].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
          swatch_image_url: template.swatch_image_url[template.colors[colorIndex]] ? template.swatch_image_url[template.colors[colorIndex]].replace('{domain}', template.imageDomain).replace('{CHAR}', `${item.codePrefix}`).replace('{SKU}', `${item.code}`) : '',
          parent_child: 'child',
          parent_sku: parent.item_sku,
          relationship_type: 'Variation',
          variation_theme: template.variation_theme,
          product_description: template.product_description,
          item_type: template.item_type[template.colors[colorIndex]],
          bullet_point1: template.bullet_points[template.colors[colorIndex]][0] ? template.bullet_points[template.colors[colorIndex]][0].replace('{overallsize_text}', template.overallsize_text[template.skus[item.size][sizeIndex]]) : '',
          bullet_point2: template.bullet_points[template.colors[colorIndex]][1] ? template.bullet_points[template.colors[colorIndex]][1].replace('{overallsize_text}', template.overallsize_text[template.skus[item.size][sizeIndex]]) : '',
          bullet_point3: template.bullet_points[template.colors[colorIndex]][2] ? template.bullet_points[template.colors[colorIndex]][2].replace('{overallsize_text}', template.overallsize_text[template.skus[item.size][sizeIndex]]) : '',
          bullet_point4: template.bullet_points[template.colors[colorIndex]][3] ? template.bullet_points[template.colors[colorIndex]][3].replace('{overallsize_text}', template.overallsize_text[template.skus[item.size][sizeIndex]]) : '',
          bullet_point5: template.bullet_points[template.colors[colorIndex]][4] ? template.bullet_points[template.colors[colorIndex]][4].replace('{overallsize_text}', template.overallsize_text[template.skus[item.size][sizeIndex]]) : '',
          generic_keywords: item.keyword ? item.keyword + ' ' + template.generic_keywords : template.generic_keywords,
          platinum_keywords1: getStringOrEmpty(template.platinum_keywords1),
          platinum_keywords2: getStringOrEmpty(template.platinum_keywords2),
          platinum_keywords3: getStringOrEmpty(template.platinum_keywords3),
          platinum_keywords4: getStringOrEmpty(template.platinum_keywords4),
          platinum_keywords5: getStringOrEmpty(template.platinum_keywords5),
          wattage: getStringOrEmpty(template.wattage[template.skus[item.size][sizeIndex]]),
          wattage_unit_of_measure: getStringOrEmpty(template.wattage_unit_of_measure),
          color_name: template.color_name[template.colors[colorIndex]],

          material_type: template.material_type,
          size_name: getStringOrEmpty(template.size_name[template.skus[item.size][sizeIndex]]),
          condition_type: 'New',
          fulfillment_latency: getStringOrEmpty(template.fulfillment_latency[template.skus[item.size][sizeIndex]]),

          list_price: getStringOrEmpty(template.list_price[template.skus[item.size][sizeIndex]])
        }
        realData.push(child)
        // 预览数据只取第一个产品作为例子，不需要渲染太多数据
        if (index === 0) {
          tableData.push(child)
        }
      }
    }
  })
  return {
    previewData: tableData,
    realData: realData
  }
}

module.exports = preview
