<template>
<v-card flat>
  <h6 class="text-center">Stock</h6>
  <v-divider></v-divider>
  <v-card class="ma-4" flat>
    <v-data-table :headers="headers" dense :loading="LOAD_STOCK" loading-text="Cargando datos ..."
                  :items="STOCK">
      <template v-slot:item.total="{item}">L. {{int.format(item.total)}}</template>
      <template v-slot:item.total_cons="{item}">L. {{int.format(item.total_cons)}}</template>
    </v-data-table>
  </v-card>
</v-card>
</template>

<script>
export default {
  name: "stock",
  data(){
    return{
      int: new Intl.NumberFormat(),
      headers:[
        {text:'Sucursal',value:'sucursal'},
        {text:'Código',value:'codigo'},
        {text:'Stock Nuevo',value:'stock_actual'},
        {text:'Stock Reingreso',value:'stock_reingreso'},
        {text:'Stock consignado',value:'stock_consignado'},
        {text:'Total Costo',value:'total'},
        {text:'Total Consignado',value:'total_cons'},
      ]
    }
  },
  computed:{
    LOAD_STOCK(){
      return this.$store.state.inventario.inventario.LOAD_STOCK;
    },
    STOCK(){
      return this.$store.state.inventario.inventario.STOCK;
    }
  }
}
</script>

<style scoped>

</style>
