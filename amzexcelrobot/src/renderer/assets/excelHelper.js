function getStringOrEmpty (data) {
  if (data) {
    return data
  } else {
    return ''
  }
}
function preview (skuprefix, template, data) {
  let tableData = []
  let realData = []
  data.map((item, index) => {
    let parent = {
      feed_product_type: template.feed_product_type,
      item_sku: `${skuprefix}-${index + 1}`,
      external_product_id_type: 'EAN',
      brand_name: template.brand_name,
      item_name: template.parent_name.replace('{NAME_TEXT}', item.productName),
      manufacturer: template.manufacturer,
      part_number: `${skuprefix}-${index + 1}`,
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
      item_type: template.item_type,
      bullet_point1: '',
      bullet_point2: '',
      bullet_point3: '',
      bullet_point4: '',
      bullet_point5: '',
      generic_keywords1: '',
      generic_keywords2: '',
      generic_keywords3: '',
      generic_keywords4: '',
      generic_keywords5: '',
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
    for (let sizeIndex = 0; sizeIndex < template.skus[item.size].length; sizeIndex++) {
      for (let colorIndex = 0; colorIndex < template.colors.length; colorIndex++) {
        let child = {
          feed_product_type: template.feed_product_type,
          item_sku: `${skuprefix}-${index + 1}${sizeIndex + 1}-${template.colors[colorIndex]}`,
          origin_sku: `${template.skus[item.size][sizeIndex]}-${item.code}-${template.colors[colorIndex]}`,
          external_product_id_type: 'EAN',
          brand_name: template.brand_name,
          item_name: template.variation_name.replace('{NAME_TEXT}', item.productName).replace('{SIZE_TEXT}', template.size_text[template.skus[item.size][sizeIndex]]).replace('{COLOR_TEXT}', template.color_text[template.colors[colorIndex]]),
          manufacturer: template.manufacturer,
          part_number: `${skuprefix}-${index + 1}${sizeIndex + 1}-${template.colors[colorIndex]}`,
          standard_price: template.standard_price[template.skus[item.size][sizeIndex]],
          quantity: template.quantity[template.skus[item.size][sizeIndex]],
          merchant_shipping_group_name: template.merchant_shipping_group_name[template.skus[item.size][sizeIndex]],
          main_image_url: template.main_image_url.replace('{domain}', template.imageDomain).replace('{SKU}', `${skuprefix}-${index + 1}${sizeIndex + 1}-${template.colors[colorIndex]}`),
          other_image_url1: template.other_image_urls[template.colors[colorIndex]][0] ? template.other_image_urls[template.colors[colorIndex]][0].replace('{domain}', template.imageDomain).replace('{SKU}', `${skuprefix}-${index + 1}${sizeIndex + 1}-${template.colors[colorIndex]}`) : '',
          other_image_url2: template.other_image_urls[template.colors[colorIndex]][1] ? template.other_image_urls[template.colors[colorIndex]][1].replace('{domain}', template.imageDomain).replace('{SKU}', `${skuprefix}-${index + 1}${sizeIndex + 1}-${template.colors[colorIndex]}`) : '',
          other_image_url3: template.other_image_urls[template.colors[colorIndex]][2] ? template.other_image_urls[template.colors[colorIndex]][2].replace('{domain}', template.imageDomain).replace('{SKU}', `${skuprefix}-${index + 1}${sizeIndex + 1}-${template.colors[colorIndex]}`) : '',
          other_image_url4: template.other_image_urls[template.colors[colorIndex]][3] ? template.other_image_urls[template.colors[colorIndex]][3].replace('{domain}', template.imageDomain).replace('{SKU}', `${skuprefix}-${index + 1}${sizeIndex + 1}-${template.colors[colorIndex]}`) : '',
          other_image_url5: template.other_image_urls[template.colors[colorIndex]][4] ? template.other_image_urls[template.colors[colorIndex]][4].replace('{domain}', template.imageDomain).replace('{SKU}', `${skuprefix}-${index + 1}${sizeIndex + 1}-${template.colors[colorIndex]}`) : '',
          other_image_url6: template.other_image_urls[template.colors[colorIndex]][5] ? template.other_image_urls[template.colors[colorIndex]][5].replace('{domain}', template.imageDomain).replace('{SKU}', `${skuprefix}-${index + 1}${sizeIndex + 1}-${template.colors[colorIndex]}`) : '',
          other_image_url7: template.other_image_urls[template.colors[colorIndex]][6] ? template.other_image_urls[template.colors[colorIndex]][6].replace('{domain}', template.imageDomain).replace('{SKU}', `${skuprefix}-${index + 1}${sizeIndex + 1}-${template.colors[colorIndex]}`) : '',
          other_image_url8: template.other_image_urls[template.colors[colorIndex]][7] ? template.other_image_urls[template.colors[colorIndex]][7].replace('{domain}', template.imageDomain).replace('{SKU}', `${skuprefix}-${index + 1}${sizeIndex + 1}-${template.colors[colorIndex]}`) : '',
          parent_child: 'child',
          parent_sku: parent.item_sku,
          relationship_type: 'Variation',
          variation_theme: template.variation_theme,
          product_description: template.product_description,
          item_type: template.item_type,
          bullet_point1: template.bullet_points[template.colors[colorIndex]][0] ? template.bullet_points[template.colors[colorIndex]][0].replace('{SIZE_TEXT}', template.size_text[template.skus[item.size][sizeIndex]]) : '',
          bullet_point2: template.bullet_points[template.colors[colorIndex]][1] ? template.bullet_points[template.colors[colorIndex]][1].replace('{SIZE_TEXT}', template.size_text[template.skus[item.size][sizeIndex]]) : '',
          bullet_point3: template.bullet_points[template.colors[colorIndex]][2] ? template.bullet_points[template.colors[colorIndex]][2].replace('{SIZE_TEXT}', template.size_text[template.skus[item.size][sizeIndex]]) : '',
          bullet_point4: template.bullet_points[template.colors[colorIndex]][3] ? template.bullet_points[template.colors[colorIndex]][3].replace('{SIZE_TEXT}', template.size_text[template.skus[item.size][sizeIndex]]) : '',
          bullet_point5: template.bullet_points[template.colors[colorIndex]][4] ? template.bullet_points[template.colors[colorIndex]][4].replace('{SIZE_TEXT}', template.size_text[template.skus[item.size][sizeIndex]]) : '',
          generic_keywords1: item.keyword ? item.keyword : template.generic_keywords[0],
          generic_keywords2: getStringOrEmpty(template.generic_keywords[1]),
          generic_keywords3: getStringOrEmpty(template.generic_keywords[2]),
          generic_keywords4: getStringOrEmpty(template.generic_keywords[3]),
          generic_keywords5: getStringOrEmpty(template.generic_keywords[4]),
          wattage: getStringOrEmpty(template.wattage[template.skus[item.size][sizeIndex]]),
          wattage_unit_of_measure: getStringOrEmpty(template.wattage_unit_of_measure),
          color_name: template.color_name[template.colors[colorIndex]],
          color_map: template.color_map[template.colors[colorIndex]],
          material_type: template.material_type,
          size_name: getStringOrEmpty(template.size_name[template.skus[item.size][sizeIndex]]),
          condition_type: 'New',
          fulfillment_latency: template.fulfillment_latency[template.skus[item.size][sizeIndex]]
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
