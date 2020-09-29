<template>
    <v-container class="pl-2 pr-2">
      <v-card>
        <v-row>
          <v-col cols="2">
            <v-btn class="ma-2" @click="goBack" fab x-small dark color="orange"><v-icon>fa fa-arrow-left</v-icon></v-btn>
          </v-col>
          <v-col cols="8" class="d-flex justify-center"><v-card-title>Guía de Remisión {{Guia.num_guia}}</v-card-title></v-col>
          <v-col cols="2" class="d-flex justify-end">
            <v-btn @click="goFile" class="ma-2" fab x-small color="red" dark>
              <v-icon>fa fa-file-pdf</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <div  class="pl-3 bordes">
          <v-row>
            <v-col cols="4"><small><strong>Proveedor: </strong>{{Guia.orden_entrada.proveedor.nombre}}</small></v-col>
            <v-col cols="4"><small><strong>Sucursal de Entrada: </strong>{{Guia.orden_entrada.sucursal.nombre}}</small></v-col>
            <v-col cols="4"><small><strong>Código Orden: </strong>{{Guia.orden_entrada.codigo}}</small></v-col>
          </v-row>
          <v-row>
            <v-col cols="4"><small><strong>Tipo de Ingreso: </strong>{{Guia.orden_entrada.tipo_entrada_articulo.nombre}}</small></v-col>
            <v-col cols="4"><small><strong>Colaborador Responsable: </strong>{{Guia.colaborador.nombres}} {{Guia.colaborador.apellidos}}</small></v-col>
            <v-col cols="4"><small><strong>Fecha de Creación: </strong>{{Guia.orden_entrada.fecha_creacion}}</small></v-col>
          </v-row>
          <v-row>
            <v-col v-if="Guia.tipo === 1" cols="4"><small><strong>Tipo de Guía de Remisión: </strong>Consignada</small></v-col>
            <v-col v-else-if="Guia.tipo === 0" cols="4"><small><strong>Tipo de Guía de Remisión: </strong>Facturada</small></v-col>
            <v-col cols="4"><small><strong>Número de Guía: </strong>{{Guia.num_guia}}</small></v-col>
          </v-row>
        </div>
        <div class="bordes">
          <v-data-table :headers="header" :items="Guia.motocicletas" class="rowsTable">
            <template v-slot:item.remision_articulo.sucursal.abreviatura="{item}">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">{{item.remision_articulo.sucursal.abreviatura}}</span>
                </template>
                <span>{{item.remision_articulo.sucursal.nombre}}</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </v-container>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    data(){
      return{
        header:[
          {text:'Marca', value:'remision_articulo.articulo.marca.nombre'},
          {text:'Módelo', value:'remision_articulo.articulo.modelo'},
          {text:'Chasis', value:'chasis'},
          {text:'Motor', value:'motor'},
          {text:'CC', value:'cilindraje'},
          {text:'Año', value:'anio'},
          {text:'Color', value:'color'},
          {text:'Ubicación Actual', value:'remision_articulo.sucursal.abreviatura', align:'center'},
        ]
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Inventario > Ingresos > Guía de Remsión > '+this.Guia.num_guia);
    },
    methods:{
      goFile(){
        this.$store.commit('activarOverlay', true);
        this.$axios.get('guia_remision/file/'+this.$route.params.remision,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url)
            this.$store.commit('activarOverlay', false);
          }
        })
      },
      goBack(){
        this.$router.replace({path:'/inventario/ingresos/'+this.$route.params.remision})
      }
    },
    asyncData({store, $axios, route}){
      return $axios.get('guia_remision/'+route.params.remision,{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then(res =>{
        return{
          Guia: res.data.guia
        }
      })
    }
  }
</script>

<style scoped>
  .bordes{
    border: solid #000 1px;
  }
  .rowsTable{
    cursor: pointer;
  }
</style>
