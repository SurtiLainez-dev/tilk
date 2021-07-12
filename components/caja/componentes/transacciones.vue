<template>
<v-card>
  <v-toolbar flat>
    <h6>Todas las Transacciones del Día</h6>
  </v-toolbar>

  <v-data-table dense :headers="headers" :loading="LOAD_TRANSACCIONES"
                :items="TRANSACCIONES"
                loading-text="Cargando Transacciones">
    <template v-slot:item.tipo_documento="{item}">
      <v-chip dark x-small v-if="item.tipo_documento === 1" color="success">Factura</v-chip>
      <v-chip dark x-small v-else-if="item.tipo_documento === 2" color="indigo">Recibo</v-chip>
      <v-chip dark x-small v-else-if="item.tipo_documento === 3" color="pink">DXC</v-chip>
      <v-chip dark x-small v-else-if="item.tipo_documento === 4" color="orange">Egreso</v-chip>
    </template>
    <template v-slot:item.tipo="{item}">
      <v-chip dark x-small v-if="item.tipo === 0" color="success">Ingreso</v-chip>
      <v-chip dark x-small v-else-if="item.tipo === 1" color="orange">Egreso</v-chip>
    </template>
    <template v-slot:item.total="{item}">
      L {{int.format(item.total)}}
    </template>
  </v-data-table>
</v-card>
</template>

<script>
export default {
  name: "transacciones",
  data(){
    return{
      int: new Intl.NumberFormat(),
      headers:[
        {text:'Forma de Pago', value:'forma_pago.nombre'},
        {text:'Referencia x FP', value:'referencia'},
        {text:'Tipo Doc.', value:'tipo_documento'},
        {text:'Recibo', value:'recibo.codigo'},
        {text:'Factura', value:'factura.contador'},
        {text:'Tipo', value:'tipo'},
        {text:'Total', value:'total'},
      ]
    }
  },
  computed:{
    LOAD_TRANSACCIONES(){
      return this.$store.state.caja.LOAD_TRANSACCIONES;
    },
    TRANSACCIONES(){
      return this.$store.state.caja.TRANSACCIONES;
    }
  },
  created() {
    let     f = new Date();
    let fecha = f.getFullYear()+'-'+(f.getMonth() + 1)+'-'+f.getDate();
    this.$store.commit('caja/cargar_TRANSACCIONES', fecha);
  }
}
</script>

<style scoped>

</style>
