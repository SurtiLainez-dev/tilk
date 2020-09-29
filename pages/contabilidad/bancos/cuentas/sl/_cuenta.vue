<template>
  <v-container class="pl-2 pr-2">
    <h5>estan en una cuenta de banco</h5>
  </v-container>
</template>

<script>
  export default {
    data(){
      return{
        flf:''
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Cuenta')
      console.log(this.$route.params.cuenta)
    }
  }
</script>

<style scoped>

</style>
