<template>
  <v-container class="pl-2 pr-2">
    <v-card class="pr-2 pl-2">
      <v-row>
        <v-col cols="8"><v-card-title>Cotizaciones Existentes</v-card-title></v-col>
        <v-col cols="4">
          <v-text-field v-model="search" append-icon="mdi-magnify"
                        label="Buscar cotización" single-line hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-data-table :headers="header" :items="Cotizaciones" class="rowsTable" @click:row="pdf" :search="search">
        <template v-slot:item.proveedor.nombre="{item}" >
          <v-avatar v-if="item.proveedor.logo" size="25"><img :src="item.proveedor.logo"></v-avatar>
          <v-avatar size="25" v-else><v-icon>fa fa-user</v-icon></v-avatar>
          {{item.proveedor.nombre}}
        </template>
      </v-data-table>

      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-card>
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
    name: "index",
    data(){
      return{
        overlay: false,
        search: '',
        header:[
          {text:'Código de Cotización', value:'cod_cotizacion'},
          {text:'Proveedor de Solicitúd', value:'proveedor.nombre'},
          {text:'Usuario Creador', value:'user.usuario'},
          {text:'Fecha de Creación', value:'fecha_creacion'},
        ]
      }
    },
    methods:{
      pdf(val){
        this.overlay = true
        this.$axios.get('proveedores/cotizacion/'+val.id,{
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
    asyncData({$axios, store, route}){
      return $axios.get('cotizaciones',{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then(res =>{
        return{
          Cotizaciones: res.data.cotizaciones,
        }
      })
    },
    created() {
      this.$store.commit('guardarTitulo', 'Proveedores > Cotizaciones');
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
