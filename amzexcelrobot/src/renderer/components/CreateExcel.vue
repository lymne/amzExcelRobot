<template>
<div>

  <div class="input-suffix"> <div class="label">账户模板</div> 
    <el-select v-model="tempname" placeholder="请选择账户模板" @change="changeTemp">
      <el-option v-for="item in excelTemplates" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
  <div class="input-suffix"> <div class="label">sku前缀</div> 
    <el-input placeholder="请输入sku前缀" v-model="skuPrefix">
    </el-input>

  </div>
  <div class="label"></div> 
  <el-upload class="mt10 upload-excel" :limit=1 :on-exceed="handleExceed" action="https://jsonplaceholder.typicode.com/posts/" :on-success="handleSuccess" drag>

    <i class="el-icon-upload"></i>

    <div class="el-upload__text">将待上架产品的Excel文件拖到此处，或<em>点击上传</em></div>

    <div class="el-upload__tip" slot="tip">只能上传Excel文件</div>

  </el-upload>
  <el-button style="margin-top:10px" type="primary" @click="previewExcel">预览库存模板文件</el-button>
  <el-table :data="tableData" border class="mt10" style="width: 100%">
    <el-table-column width="250" prop="feed_product_type" label="feed_product_type"></el-table-column>
    <el-table-column width="250" prop="item_sku" label="item_sku"></el-table-column>
    <el-table-column width="250" prop="external_product_id_type" label="external_product_id_type"></el-table-column>
    <el-table-column width="250" prop="brand_name" label="brand_name"></el-table-column>
    <el-table-column width="250" prop="item_name" label="item_name"></el-table-column>
    <el-table-column width="250" prop="manufacturer" label="manufacturer"></el-table-column>
    <el-table-column width="250" prop="part_number" label="part_number"></el-table-column>
    <el-table-column width="250" prop="standard_price" label="standard_price"></el-table-column>
    <el-table-column width="250" prop="quantity" label="quantity"></el-table-column>
    <el-table-column width="250" prop="merchant_shipping_group_name" label="merchant_shipping_group_name"></el-table-column>
    <el-table-column width="250" prop="main_image_url" label="main_image_url"></el-table-column>
    <el-table-column width="250" prop="other_image_url1" label="other_image_url1"></el-table-column>
    <el-table-column width="250" prop="other_image_url2" label="other_image_url2"></el-table-column>
    <el-table-column width="250" prop="other_image_url3" label="other_image_url3"></el-table-column>
    <el-table-column width="250" prop="other_image_url4" label="other_image_url4"></el-table-column>
    <el-table-column width="250" prop="other_image_url5" label="other_image_url5"></el-table-column>
    <el-table-column width="250" prop="other_image_url6" label="other_image_url6"></el-table-column>
    <el-table-column width="250" prop="other_image_url7" label="other_image_url7"></el-table-column>
    <el-table-column width="250" prop="other_image_url8" label="other_image_url8"></el-table-column>
    <el-table-column width="250" prop="parent_child" label="parent_child"></el-table-column>
    <el-table-column width="250" prop="parent_sku" label="parent_sku"></el-table-column>
    <el-table-column width="250" prop="relationship_type" label="relationship_type"></el-table-column>
    <el-table-column width="250" prop="variation_theme" label="variation_theme"></el-table-column>
    <el-table-column width="250" prop="product_description" label="product_description"></el-table-column>
    <el-table-column width="250" prop="item_type" label="item_type"></el-table-column>
    <el-table-column width="250" prop="bullet_point1" label="bullet_point1"></el-table-column>
    <el-table-column width="250" prop="bullet_point2" label="bullet_point2"></el-table-column>
    <el-table-column width="250" prop="bullet_point3" label="bullet_point3"></el-table-column>
    <el-table-column width="250" prop="bullet_point4" label="bullet_point4"></el-table-column>
    <el-table-column width="250" prop="bullet_point5" label="bullet_point5"></el-table-column>
    <el-table-column width="250" prop="generic_keywords1" label="generic_keywords1"></el-table-column>
    <el-table-column width="250" prop="generic_keywords2" label="generic_keywords2"></el-table-column>
    <el-table-column width="250" prop="generic_keywords3" label="generic_keywords3"></el-table-column>
    <el-table-column width="250" prop="generic_keywords4" label="generic_keywords4"></el-table-column>
    <el-table-column width="250" prop="generic_keywords5" label="generic_keywords5"></el-table-column>
    <el-table-column width="250" prop="wattage_unit_of_measure" label="wattage_unit_of_measure"></el-table-column>
    <el-table-column width="250" prop="color_name" label="color_name"></el-table-column>
    <el-table-column width="250" prop="color_map" label="color_map"></el-table-column>
    <el-table-column width="250" prop="material_type" label="material_type"></el-table-column>
    <el-table-column width="250" prop="size_name" label="size_name"></el-table-column>
    <el-table-column width="250" prop="wattage" label="wattage"></el-table-column>
    <el-table-column width="250" prop="fulfillment_latency" label="fulfillment_latency"></el-table-column>
  </el-table>
</div>
</template>

<style>
.mt10 {
  margin-top: 10px;
}
.input-suffix {
  width: 300px;
  display: inline-block;
}

</style>

<script>
const {
  ipcRenderer
} = require('electron')
const SETTING = require('../assets/setting.js').SETTING
export default {
  data () {
    return {
      skuPrefix: '',
      tableData: [],
      excelTemplates: [],
      tempname: '',
      filePath: '',
      currentTemplate: null
    }
  },
  methods: {
    handleSuccess (response, file, fileList) {
      this.filePath = file.raw.path
    },
    handleExceed () {
      this.$message('每次只能选择一个模板文件')
    },
    previewExcel () {
      if (!this.tempname) {
        this.$message('请选择模板')
        return
      }
      if (!this.skuPrefix) {
        this.$message('请输入sku前缀')
        return
      }
      if (!this.filePath) {
        this.$message('请选择模板文件')
        return
      }
      let result = ipcRenderer.sendSync('previewExcelFile', this.filePath)
      console.log(result)
      this.createTable(result)
    },
    changeTemp (val) {
      this.currentTemplate = this.excelTemplates.find(m => m.value === val)
      this.skuPrefix = this.currentTemplate.skuPrefix
    }
  },
  createTable (data) {
    this.tableData = []
  },
  mounted () {
    let that = this
    Object.getOwnPropertyNames(SETTING).forEach(function (key) {
      SETTING[key].templates.map(item => {
        that.excelTemplates.push({
          value: item.name,
          label: item.name,
          skuPrefix: item.skuPrefix
        })
      })
    })
  }
}
</script>
