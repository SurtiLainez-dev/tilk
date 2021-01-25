<template>
  <v-card>
    <v-toolbar flat>
      <h6>Ordenes de Entregas de Surtidora Laínez</h6>
      <v-spacer></v-spacer>
      <v-text-field dense label="Buscar" v-model="search"></v-text-field>
    </v-toolbar>
    <v-data-table dense
                  :search="search"
                  :headers="header"
                  :items="DATA_ORDENES"
                  class="rowsTable"
                  @click:row="goOrden"
                  loading-text="Cargando Ordenes de Entrega"
                  :loading="LOAD_ORDENES">
      <template v-slot:item.venta.cliente.nombres="{item}">
        {{item.venta.cliente.nombres}} {{item.venta.cliente.apellidos}}
      </template>
      <template v-slot:item.venta.colaborador.nombres="{item}">
        {{item.venta.colaborador.nombres}} {{item.venta.colaborador.nombres}}
      </template>
      <template v-slot:item.estado="{item}">
        <v-chip dark color="success" x-small v-if="item.estado ===1 ">Entregado</v-chip>
        <v-chip dark color="red" x-small v-else>Pendiente</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "index",
  data(){
    return{
      header:[
        {text:'Codigo de la Orden',value:'cod'},
        {text:'Venta',value:'venta.cod'},
        {text:'Nombre del Cliente',value:'venta.cliente.nombres'},
        {text:'Vendedor',value:'venta.colaborador.nombres'},
        {text:'Sucursal',value:'venta.colaborador.sucursal.nombre'},
        {text:'Estado',value:'estado'},
      ],
      search: ''
    }
  },
  computed:{
    DATA_ORDENES(){
      return this.$store.state.ordenes_entrega.DATA_ORDENES;
    },
    LOAD_ORDENES(){
      return this.$store.state.ordenes_entrega.LOAD_ORDENES;
    },
  },
  created() {
    this.$store.commit('guardarTitulo', 'Ventas > Ordenes de Entrega');
    this.$store.commit('ordenes_entrega/cargar_DATA_ORDENES')
  },
  methods:{
    goOrden(orden){
      this.$router.replace({path:'/ventas/ordenes_entrega/'+orden.id})
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
