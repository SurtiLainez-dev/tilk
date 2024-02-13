<template>
  <v-card flat tile>

  </v-card>
</template>

<script>
export default {
  name: "web_all_banners",
  created() {
    this.$store.commit('guardarTitulo','Todos los Banners')
  }
}
</script>

<style scoped>

</style>
