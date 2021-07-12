<template>
  <v-card flat class="pl-2 pr-2">
    <div v-if="vista === 1">
      <v-row>
        <v-col cols="9" class="d-flex align-center"><v-card-title>Mis ventas</v-card-title></v-col>
        <v-col cols="3" class="d-flex align-center">
          <v-text-field dense v-model="search" label="buscar"></v-text-field>
        </v-col>
      </v-row>

      <v-data-table :headers="header"
                    :search="search"
                    dense
                    :loading="LOAD_VENTAS"
                    loading-text="Actualizando ventas"
                    @click:row="verVista"
                    class="rowsTable"
                    :items="VENTAS">
        <template v-slot:item.colaborador.nombres="{item}">
          {{item.colaborador.nombres}} {{item.colaborador.apellidos}}
        </template>
        <template v-slot:item.cliente.nombres="{item}">
          {{item.cliente.nombres}} {{item.cliente.apellidos}}
        </template>
        <template v-slot:item.tipo_venta="{item}">
          <v-chip color="success" x-small v-if="item.tipo_venta === 1" dark>Contado</v-chip>
          <v-chip color="orange" x-small v-else-if="item.tipo_venta === 2" dark>Crédito</v-chip>
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
        <template v-slot:item.total="{item}">
          <strong>L {{item.total}}</strong>
        </template>
      </v-data-table>
    </div>
    <div v-else-if="vista === 2">
      <v-row no-gutters>
        <v-col cols="1" class="d-flex align-center">
          <v-btn color="warning" @click="vista = 1" fab x-small><v-icon>fa fa-arrow-left</v-icon></v-btn>
        </v-col>
        <v-col cols="11" class="d-flex align-center justify-center">
          <v-card-title>Datos de la venta</v-card-title>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <mis_ventas_contado v-if="tipo === 1"/>
      <mis_ventas v-else-if="tipo === 2"/>
    </div>
  </v-card>
</template>

<script>
import mis_ventas from "../../../components/Ventas/mis_ventas";
import Mis_ventas from "../../../components/Ventas/mis_ventas";
import mis_ventas_contado from "../../../components/Ventas/contado/mis_ventas_contado";
import Mis_ventas_contado from "../../../components/Ventas/contado/mis_ventas_contado";
export default {
  components: {Mis_ventas_contado, Mis_ventas},
  comments:{
    mis_ventas,
    mis_ventas_contado
},
name: "ventas",
  data(){
    return{
      search: '',
      header:[
        {text: 'Cliente',         value:'cliente.nombres'},
        {text: 'Vendedor',        value:'colaborador.nombres'},
        {text: 'Tipo de venta',   value:'tipo_venta'},
        {text: 'Código',          value:'cod'},
        {text: 'Estado',          value:'estado'},
        {text: 'Aceptado por F.', value:'is_aceptado'},
        {text: 'Total',           value:'total'},
      ],
      tipo: 0
    }
  },
  created() {
    this.$store.commit('ventas/cargar_MIS_VENTAS');
    this.vista = 1;
  },
  computed:{
    VENTAS(){
      return this.$store.state.ventas.MIS_VENTAS;
    },
    LOAD_VENTAS(){
      return this.$store.state.ventas.LOAD_MIS_VENTAS;
    },
    vista:{
      get: function (){
        return this.$store.state.ventas.VISTA;
      },
      set: function(val){
        this.$store.commit('ventas/cambiar_VISTA', val)
      }
    }
  },
  methods:{
    verVista(data){
      this.tipo = data.tipo_venta
      console.log(data.id)
      this.$store.commit('ventas/asignar_ID_VENTA', data.id);
      this.vista = 2;
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
