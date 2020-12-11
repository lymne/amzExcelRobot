<template>
  <div id="wrapper">
    <el-tabs >
      <el-tab-pane label="库存文件生成">
        <CreateExcel />
      </el-tab-pane>
     <el-tab-pane label="etsy批量上架文件生成">
        <CreateEtsyExcel />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import CreateExcel from './CreateExcel'
  import CreateEtsyExcel from './CreateEtsyExcel'
  export default {
    name: 'landing-page',
    components: {
      CreateExcel,
      CreateEtsyExcel
    }

  }
</script>
