<template>
<v-card flat tile>
  <pre>{{REINGRESO}}</pre>
</v-card>
</template>

<script>
export default {
  name: "solicitud_reingreso",
  computed:{
    REINGRESO(){
      return this.$store.state.inventario.reingreso.REINGRESO
    }
  }
}
</script>

<style scoped>

</style>