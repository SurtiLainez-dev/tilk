<template>
    <v-card class="pl-2 pr-2 pb-2">
      <div v-if="vista === 1">
        <v-row>
          <v-col cols="8"><v-card-title>Facturas a Proveedores</v-card-title></v-col>
          <v-col cols="4">
            <v-text-field v-model="search" append-icon="mdi-magnify"
                          label="Buscar factura" single-line hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-data-table class="rowsTable" :headers="header" @click:row="goFactura"
                      :search="search" :items="Facturas">
          <template v-slot:item.proveedor.nombre="{item}">
            <v-avatar v-if="item.proveedor.logo" size="25">
              <img :src="item.proveedor.logo" alt="Proveedor"></v-avatar>
            <v-avatar size="25" v-else><v-icon>fa fa-user</v-icon></v-avatar>
            {{item.proveedor.nombre}}
          </template>
          <template v-slot:item.total="{item}">
            <strong>L. {{int.format(item.total)}}</strong>
          </template>
          <template v-slot:item.estado="{item}">
            <v-chip v-if="item.estado === 0" color="orange" dark small>Al día</v-chip>
            <v-chip v-else-if="item.estado === 1" color="success" dark small>Cancelada</v-chip>
            <v-chip v-else-if="item.estado === 2" color="red" dark small>Retrasado</v-chip>
          </template>
          <template v-slot:item.fecha_limite_pago="{item}">
            {{item.fecha_limite_pago.split('-')[2]}}/{{item.fecha_limite_pago.split('-')[1]}}/{{item.fecha_limite_pago.split('-')[0]}}
          </template>
        </v-data-table>
      </div>
      <div v-else-if="vista === 2">
        <v-row>
          <v-col><v-btn color="orange" dark x-small fab @click="vista = 1">
            <v-icon>fa fa-arrow-left</v-icon>
          </v-btn></v-col>
          <v-col class="d-flex justify-end pr-5">
            <v-avatar v-if="datos.proveedor.logo" size="25">
              <img :src="datos.proveedor.logo" alt="John"></v-avatar>
            <v-avatar size="25" v-else><v-icon>fa fa-user</v-icon></v-avatar>
            <strong>{{datos.proveedor.nombre}}</strong>
          </v-col>
        </v-row>
        <Factura :factura="datos"/>
      </div>
    </v-card>
</template>

<script>
  import Factura from "../../../../components/contabilidad/Factura";
  export default {
    components:{Factura},
    name: "index",
    data(){
      return{
        int: new Intl.NumberFormat(),
        datos: [],
        vista: 1,
        search: '',
        header:[
          {text:'Proveedor', value:'proveedor.nombre'},
          {text:'Número de Factura', value:'num_factura'},
          {text:'Orden de Entrada', value:'orden_entrada.codigo'},
          {text:'Sucursal Asignada', value:'orden_entrada.sucursal.nombre'},
          {text:'Total', value:'total'},
          {text:'Estado', value:'estado'},
          {text:'Vencimiento', value:'fecha_limite_pago'},
        ]
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Contabilidad > Facturas > Proveedor');
    },
    methods:{
      goFactura(item){
        this.datos = item;
        this.vista = 2;
      }
    },
    asyncData({store, $axios}){
      return $axios.get('facturas_proveedor',{
        headers:{
          'Authorization': 'Bearer '+ store.state.token
        }
      }).then((res)=>{
        return{
          Facturas: res.data.facturas
        }
      })
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
