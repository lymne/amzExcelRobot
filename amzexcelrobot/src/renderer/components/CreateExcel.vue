<template>
  <div class="panel">
    <div class="input-suffix">
      <el-divider>账户</el-divider>

      <el-select v-model="tempname" placeholder="请选择账户" @change="changeTemp">
        <el-option
          v-for="item in accounts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>

    <div class="label" v-if="currentAccount">
      <el-divider>品类</el-divider>
      <el-checkbox-group v-model="checkedTypes">
        <el-checkbox v-for="style in types" border :label="style" :key="style">{{style}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="label" v-if="currentAccount">
      <el-divider>站点</el-divider>
      <el-checkbox-group v-model="checkedSites" @change="handleCheckedSitesChange">
        <el-checkbox v-for="site in sites" :label="site" :key="site">{{site}}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >全选</el-checkbox>
    </div>
    <el-divider>上传产品</el-divider>

    <el-upload
      class="mt10 upload-excel"
      :limit="1"
      :on-exceed="handleExceed"
      action
      :auto-upload="false"
      :on-change="handlePreview"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将待上架产品的Excel文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传Excel文件</div>
    </el-upload>
    <el-button style="margin-top:10px" type="success" @click="downloadExcel">生成template</el-button>
  </div>
</template>


<script>
import preview from '../assets/excelHelper.js'
import { Loading } from 'element-ui'
const { ipcRenderer } = require('electron')
const request = require('request')

export default {
  data () {
    return {
      excelTemplates: [],
      tempname: '',
      filePath: '',
      currentAccount: null,
      templateContent: '',
      showDownload: false,
      setting: '',
      checkAll: false,
      accounts: [],
      checkedTypes: [],
      checkedSites: [],
      types: [],
      sites: [],
      isIndeterminate: true,
      isCreating: false
    }
  },
  methods: {
    handlePreview (file, fileList) {
      console.log(file)
      this.filePath = file.raw.path
      this.showDownload = false
    },
    handleCheckAllChange (val) {
      this.checkedSites = val ? this.sites : []
      this.isIndeterminate = false
    },
    handleCheckedSitesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.sites.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.sites.length
    },
    handleExceed () {
      this.$message('每次只能选择一个模板文件')
    },
    // previewExcel () {
    //   if (!this.tempname) {
    //     this.$message('请选择模板')
    //     return
    //   }
    //   if (!this.filePath) {
    //     this.$message('请选择模板文件')
    //     return
    //   }
    //   let result = ipcRenderer.sendSync('previewExcelFile', this.filePath)
    //   this.createTable(result)
    // },
    async downloadExcel () {
      if (!this.tempname) {
        this.$message('请选择账户')
        return
      }
      if (!this.checkedTypes.length) {
        this.$message('请选择品类')
        return
      }
      if (!this.checkedSites.length) {
        this.$message('请选择站点')
        return
      }
      if (!this.filePath) {
        this.$message('请上传产品文件')
        return
      }
      this.isCreating = true
      // let result = ipcRenderer.sendSync('previewExcelFile', this.filePath)
      // this.createTable(result)
      await this.downloadTemplateSetting()
      let templateUrls = []
      this.checkedTypes.map(item => {
        templateUrls.push(
          {
            account: this.currentAccount.value,
            type: item
          }
        )
      })
      // let result = ipcRenderer.sendSync('downloadExcelHeaders', templateUrls)
      // console.log(, result)

      // let previewdata = preview(this.templateContent, data)
      let result = ipcRenderer.sendSync(
        'downloadExcelFile2',
        this.filePath,
        this.setting,
        this.checkedSites,
        templateUrls
      )
      // let result = ipcRenderer.sendSync(
      //   'downloadExcelFile',
      //   this.filePath,
      //   this.templateContent
      // )
      if (result === 'done') {
        this.$message('已生成，请查看上传文件时的文件夹')
      } else {
        this.$message(`生成失败：${result}`)
      }
    },
    async downloadTemplateSetting () {
      let that = this
      return new Promise((resolve, reject) => {
        let url = `https://excelrobot.oss-cn-shenzhen.aliyuncs.com/${that.currentAccount.value}.txt`
        request(
          url,
          function (error, response, body) {
            console.log(error, response)
            that.setting = JSON.parse(response.body)
            resolve(that.setting)
          }
        )
      })
    },
    changeTemp (val) {
      this.currentAccount = this.accounts.find(m => m.value === val)
      //  this.templateContent = this.setting.templates.find(m => m.name === this.currentTemplate.label)
      this.types = this.currentAccount.types
      this.sites = this.currentAccount.sites
      this.checkAll = false
      this.checkedTypes = []
      this.checkedSites = []
    },
    createTable (data) {
      if (!data || !data.length) {
        this.$message('导入文件里没有内容')
        this.showDownload = false
        return
      }
      let result = preview(this.templateContent, data)
      this.tableData = result.previewData
      this.excelData = result.realData
      this.showDownload = true
    }
  },

  mounted () {
    let that = this
    let loadingInstance = Loading.service()
    request(
      'https://excelrobot.oss-cn-shenzhen.aliyuncs.com/setting_v2',
      function (error, response, body) {
        console.log(error, response)
        loadingInstance.close()
        let setting = JSON.parse(response.body)
        console.log(setting)
        that.setting = setting
        setting.account.map(item => {
          that.accounts.push({
            value: item,
            label: item,
            types: setting.template[item].type,
            sites: setting.template[item].site
          })
        })
      }
    )
  }
}
</script>

<style>
.panel {
  text-align: center;
}
.label {
  margin: 10px;
}
.mt10 {
  margin-top: 10px;
}
.upload-excel {
  width: 600px;
  text-align: center;
  margin: auto;
}
.input-suffix {
  width: 300px;
  display: inline-block;
}
</style>