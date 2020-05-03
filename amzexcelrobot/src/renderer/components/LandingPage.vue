<template>
  <div id="wrapper">
    <el-tabs >
      <el-tab-pane label="库存文件生成">
        <CreateExcel />
      </el-tab-pane>
    
    </el-tabs>
  </div>
</template>

<script>
  import CreateExcel from './CreateExcel'
  export default {
    name: 'landing-page',
    components: {
      CreateExcel
    }

  }
</script>
