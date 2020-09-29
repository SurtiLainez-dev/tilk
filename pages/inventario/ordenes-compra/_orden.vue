<template>
    <v-container class="pl-2 pr-2">
      <v-card>
        <v-card-title>Orden de Compra {{Orden.codigo}}</v-card-title>
        <v-container class="bordes">
          <v-row>
            <v-col cols="3" class="d-flex align-center">Proveedor: <strong>{{Orden.proveedor.nombre}}</strong></v-col>
            <v-col cols="3" class="d-flex align-center">Fecha de Creación: <strong>{{Orden.fecha_creacion}}</strong></v-col>
            <v-col cols="3" class="d-flex align-center">Total de la Orden: <strong>L. {{Orden.total}}</strong></v-col>
            <v-col cols="3" class="d-flex justify-end align-center">
              <v-chip v-if="Orden.estado ===1" class="ma-2" color="success">Recibida</v-chip>
              <v-chip v-else color="warning" class="ma-2">Sin Acciones</v-chip>
              <v-btn @click="print" dark x-small fab color="primary">
                <v-icon>fa fa-print</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container class="bordes">
          <v-data-table :headers="header" :items="Orden.cuerpo_orden_compras" class="rowsTable">
            <template v-slot:item.id="{item}">
              L {{((item.cantidad * item.precio_costo) * ((item.impuesto/100) + 1)).toFixed(2)}}
            </template>
            <template v-slot:item.articulo_id="{item}">
              L {{((item.cantidad * item.precio_costo)).toFixed(2)}}
            </template>
            <template v-slot:item.precio_costo="{item}">
              L {{item.precio_costo}}
            </template>
            <template v-slot:item.created_at="{item}">
              L {{((item.cantidad * item.precio_costo) * (item.impuesto/100)).toFixed(2)}}
            </template>
          </v-data-table>
        </v-container>
      </v-card>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-container>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    watch: {
      overlay (val) {
        val && setTimeout(() => {
        }, 500)
      },
    },
    data(){
      return{
        overlay: false,
        header:[
          {text:'Descripción del Artículo', value:'descripcion'},
          {text:'Cantidad', value:'cantidad'},
          {text:'Precio de Costo', value:'precio_costo'},
          {text:'Precio Normal', value:'articulo_id'},
          {text:'%', value:'impuesto'},
          {text:'Total Impuesto', value:'created_at'},
          {text:'Total', value:'id'},
        ]
      }
    },
    methods:{
      print(){
        this.overlay = true
        this.$axios.get('orden-compra/pdf/'+this.$route.params.orden,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.overlay = false
            ipcRenderer.send('open-nav', res.data.url)
          }
        })
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Ordenes de Compra > '+this.Orden.codigo);
    },
    asyncData({$axios, store, route}){
      return $axios.get('orden_compra/'+route.params.orden,{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then(res =>{
        return{
          Orden: res.data.orden[0]
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
