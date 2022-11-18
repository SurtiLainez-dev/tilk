<template>
<v-card>

</v-card>
</template>

<script>
export default {
  name: "to_do_inicio",
  created() {
    this.$store.commit('todo/asignar_TITULO', '')
  }
}
</script>

<style scoped>

</style>
