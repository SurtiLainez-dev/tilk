<template>
  <v-card flat>
    <v-toolbar flat>
      <h6>Cuentas Asociadas al cliente</h6>
      <v-spacer></v-spacer>
      <v-text-field label="Buscar" dense v-model="search"></v-text-field>
    </v-toolbar>

    <v-data-table :items="CUENTAS"
                  :search="search"
                  :loading="Load"
                  loading-text="Cargando Cuentas"
                  @click:row="goCuenta"
                  :headers="header"
                  class="rowsTable">
      <template v-slot:item.estado="{item}">
        <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
        <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
        <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
        <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
      </template>
      <template v-slot:item.is_aceptado="{item}">
        <v-chip color="success" x-small v-if="item.is_aceptado === 1" dark>Sí</v-chip>
        <v-chip color="red" x-small v-else-if="item.is_aceptado === 2" dark>No</v-chip>
        <v-chip color="orange" x-small v-else-if="item.is_aceptado === 3" dark>Pendiente</v-chip>
      </template>

    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "cuentas_clientes",
  computed:{
    CLIENTE(){
      return this.$store.state.cliente.CLIENTE;
    },
    CUENTAS: {
      get: function(){
        return this.$store.state.cliente.CUENTAS;
      },
      set: function(cuentas){
        this.$store.commit('cliente/agregar_CUENTAS', cuentas);
      }
    }
  },
  data(){
    return{
      Load:    true,
      search: '',
      header:[
        {text: 'Código', value: 'cod'},
        {text: 'Nombre del Cliente', value: 'cliente.nombres'},
        {text: 'Artículo', value: 'remision_articulo.articulo.nombre_articulo'},
        {text: 'total', value: 'total'},
        {text: 'Saldo Actual', value: 'saldo_actual'},
        {text: 'Estado', value: 'estado'},
        {text: 'Fue Aceptada', value: 'is_aceptado'},
      ]
    }
  },
  created() {
    this.cargarCuentas();
  },
  methods:{
    cargarCuentas(){
      this.Load = true;
      this.$axios.get('cuentas_clientes/'+this.CLIENTE.id).then((res)=>{
        this.CUENTAS = res.data.cuentas;
        this.Load    = false;
      })
    },
    goCuenta(data){
      if (data.is_aceptado === 1)
        alert("paso")
      else
        alert("No se puede acceder a esta cuenta, porque fue rechazada.")
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
