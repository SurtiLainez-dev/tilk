<template>
  <v-card class="pl-2 pr-2">
    <div v-if="!select">
      <v-card-title>Trasnferencias de Artículos</v-card-title>
      <hr>
      <v-row class="d-flex justify-end">
        <v-col cols="4">
          <v-text-field v-model="search" label="Buscar Trasnferencia"></v-text-field>
        </v-col>
      </v-row>
      <v-data-table :headers="header"
                    :search="search"
                    @click:row="goTraslado"
                    class="rowsTable"
                    :items="Traslados">
        <template v-slot:item.estado="{item}">
          <v-chip v-if="item.estado === 1" small color="success">Aceptado</v-chip>
          <v-chip v-else-if="item.estado === 0" color="red" small dark>Rechazado</v-chip>
          <v-chip v-else color="orange" small dark>Pendiente</v-chip>
        </template>
        <template v-slot:item.estado_remision="{item}">
          <v-chip v-if="item.estado_remision === 1" color="green accent-3" dark small>Aceptada sin Movimiento</v-chip>
          <v-chip v-else-if="item.estado_remision === 2" color="success" small dark>Entregado</v-chip>
          <v-chip v-else-if="item.estado_remision === 3" color="red" small dark>Rechazado</v-chip>
          <v-chip v-else-if="item.estado_remision === 4" color="orange" small dark>Pendiente</v-chip>
        </template>
        <template v-slot:item.fecha_creado="{item}">
          {{item.fecha_creado.split('-')[2]}}/{{item.fecha_creado.split('-')[1]}}/{{item.fecha_creado.split('-')[0]}}
        </template>
      </v-data-table>
    </div>
    <div v-else>
      <v-row>
        <v-col cols="1">
          <v-btn fab x-small color="orange" dark @click="select = false">
            <v-icon>fa fa-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="11" class="d-flex justify-center">
          <h3>Transferencia {{Traslado.codigo}}</h3>
        </v-col>
      </v-row>
      <hr>
      <traslado :traslado="Traslado"/>
    </div>
  </v-card>
</template>

<script>
  import traslado from "../../../components/facturacion/traslados/traslado";
  export default {
    components:{traslado},
    name: "pendientes",
    data(){
      return{
        search:'',
        select: false,
        Traslado: null,
        header:[
          {text:'Código',value:'codigo'},
          {text:'Sucursal de Origen',value:'sucursal.nombre'},
          {text:'Sucursal de Destino',value:'destino.nombre'},
          {text:'Motivo de Traslado',value:'destino.nombre'},
          {text:'Usuario Solicitante',value:'user.usuario'},
          {text:'Estado',value:'estado'},
          {text:'Estado Remisión',value:'estado_remision'},
          {text:'Solicitudo',value:'fecha_creado'},
        ]
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Transferencias Pendientes');
    },
    methods:{
      goTraslado(val){
        this.Traslado = val;
        this.select = true;
      }
    },
    asyncData({$axios, store}){
      return $axios.get('traslados_pendientes',{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then(res =>{
        return{
          Traslados: res.data.traslados
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
