<template>
<v-card>
  <v-toolbar flat>
    <h5>Cuentas Aceptadas</h5>
    <v-spacer></v-spacer>
    <v-text-field  label="buscar" v-model="search"></v-text-field>
  </v-toolbar>
  <v-data-table :items="CUENTAS"
                :search="search"
                dense
                :loading="LOAD"
                loading-text="Cargando Cuentas"
                :headers="header"
                class="rowsTable">
    <template v-slot:item.total="{item}">
      L {{item.total}}
    </template>
    <template v-slot:item.saldo_actual="{item}">
      L {{item.saldo_actual}}
    </template>
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
    <template v-slot:item.id="{item}">
      <div class="d-flex justify-center">
        <v-btn color="success" fab width="25" dark height="25" @click="abrirDialogo(item)">
          <v-icon x-small>fa fa-plus</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>

  <v-dialog v-model="DIALOGO" width="30%">
    <v-card>
      <v-card-title class="grey lighten-3">Agregar Pago por Cobrar a la Cuenta</v-card-title>
      <div class="pa-5"><formulario_pago_nuevo :accion="2"/></div>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import formulario_pago_nuevo from "../../components/Ventas/cuentas/formulario_pago_nuevo";
export default {
  components:{
    formulario_pago_nuevo
  },
  name: "agregar_pagos",
  data(){
    return{
      dialogo:  false,
      search: '',
      header:[
        {text: 'Código', value: 'cod'},
        {text: 'Nombre del Cliente', value: 'cliente.nombres'},
        {text: 'Artículo', value: 'remision_articulo.articulo.nombre_articulo'},
        {text: 'total', value: 'total'},
        {text: 'Saldo Actual', value: 'saldo_actual'},
        {text: 'Estado', value: 'estado'},
        {text: 'Fue Aceptada', value: 'is_aceptado'},
        {text: 'Agregar Pago',  value: 'id'}
      ],
    }
  },
  computed:{
    CUENTAS(){
      return this.$store.state.cuentas.CUENTAS_ACEPTADAS;
    },
    LOAD(){
      return this.$store.state.cuentas.LOAD;
    },
    DIALOGO:{
      get: function (){
        return this.$store.state.dialogo;
      },
      set: function (val){
        this.$store.commit('valorDialogo', val);
      }
    }
  },
  methods:{
    abrirDialogo(data){
      this.$store.commit('cuentas/agregar_CUENTA', data);
      this.DIALOGO = true;
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Cuentas > Agregar Pagos');
    this.$store.commit('cuentas/cargar_CUENTAS_ACEPTADAS')
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
