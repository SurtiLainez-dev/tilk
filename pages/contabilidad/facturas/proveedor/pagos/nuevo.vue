<template>
  <v-card>
    <v-card-title class="grey lighten-2">Nuevo Pago a Proveedores</v-card-title>
    <nuevo-pago class="pl-2 pr-2 pt-2 pb-2"></nuevo-pago>
  </v-card>
</template>

<script>
  import nuevoPago from "../../../../../components/contabilidad/nuevoPago";
  export default {
    components:{nuevoPago},
    name: "nuevo",
    created() {
      this.$store.commit('guardarTitulo', 'Contabilidad > Facturas > Proveedores > Pagos Realizados');
    },
  }
</script>

<style scoped>

</style>
