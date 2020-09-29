<template>
  <v-container class="pl-2 pr-2">
    <v-card>
      <v-tabs>
        <v-tabs-slider></v-tabs-slider>
        <v-tab href="#TabInicio" :key="1">Inicio</v-tab>
        <v-tab href="#TabInventario" :key="2">Inventario</v-tab>
        <v-tab href="#TabFacturas">Facturas</v-tab>
        <v-tab href="#TabTransacciones">Transacciones</v-tab>

        <v-tab-item :key="1" value="TabInicio">
          <tab-inicio/>
        </v-tab-item>
        <v-tab-item :key="2" value="TabInventario">
          inicio 2
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
  import tabInicio from "../../components/Proveedores/tabInicio";
  export default {
    components:{tabInicio}
  }
</script>

<style scoped>

</style>
