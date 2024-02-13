<template>
  <v-card>
    <v-toolbar flat>
      <h6>Ordenes de Entregas Pendientes de Surtidora Laínez</h6>
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
      <template v-slot:item.nombres="{item}">
        {{item.nombres}} {{item.apellidos}}
      </template>
      <template v-slot:item.nC="{item}">
        {{item.nC}} {{item.apC}}
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
  name: "pendientes",
  data(){
    return{
      header:[
        {text:'Codigo de la Orden',value:'cod'},
        {text:'Venta',value:'codV'},
        {text:'Nombre del Cliente',value:'nombres'},
        {text:'Vendedor',value:'nC'},
        {text:'Sucursal',value:'sucursal'},
        {text:'Estado',value:'estado'},
      ],
      search: ''
    }
  },
  computed:{
    DATA_ORDENES(){
      return this.$store.state.ordenes_entrega.DATA_ORDENES_PENDIENTES;
    },
    LOAD_ORDENES(){
      return this.$store.state.ordenes_entrega.LOAD_ORDENES;
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Ventas > Ordenes de Entrega > Pendientes');
    this.$store.commit('ordenes_entrega/cargar_DATA_PENDIENTES')
  },
  methods:{
    goOrden(orden){
      this.$router.replace({path:'/ventas/ordenes_entrega/'+orden.id})
    },
  }
}
</script>

<style scoped>

</style>
