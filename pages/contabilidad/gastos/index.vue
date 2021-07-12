<template>
  <v-card>

  </v-card>
</template>

<script>
export default {
  name: "index",
  created() {
    this.$store.commit('guardarTitulo', 'Contabilidad > Gastos');
  }
}
</script>

<style scoped>

</style>
