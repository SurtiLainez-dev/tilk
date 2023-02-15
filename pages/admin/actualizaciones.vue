<template>
<v-card flat>
  <v-card flat height="110" color="grey lighten-5">
    <v-toolbar color="grey lighten-5" flat>
      <v-toolbar-title>Actualizaciones</v-toolbar-title>
    </v-toolbar>
    <v-row no-gutters>
      <v-col cols="8"></v-col>
      <v-col cols="4" class="d-flex justify-end">
        <v-text-field v-model="search" label="Buscar ..." dense
                      append-outer-icon="mdi-magnify"></v-text-field>
      </v-col>
    </v-row>

    <v-data-table dense :headers="headers" :items="actualizaciones" :loading="load" :search="search">
      <template v-slot:item.link_page="{item}"><b-link    @click="openPagina(item.link_page)"   >{{item.link_page}}</b-link></template>
      <template v-slot:item.link_binario="{item}"><b-link @click="openPagina(item.link_binario)">{{item.link_binario}}</b-link></template>
    </v-data-table>
  </v-card>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "actualizaciones",
  data(){
    return{
      load: true,
      search: '',
      actualizaciones: [],
      headers:[
        {text: 'Version', value:'version'},
        {text: 'Link de la Pagina', value:'link_page'},
        {text: 'Link del Archivo', value:'link_binario'},
      ]
    }
  },
  created() {
    this.cargarActualizaciones();
  },
  methods:{
    cargarActualizaciones(){
      this.$axios.get('actualizaciones').then((res)=>{
        this.actualizaciones = res.data.actualizaciones;
        this.load = false;
      })
    },
    openPagina(url){
      ipcRenderer.send('pint_navegador', url);
    }
  }
}
</script>

<style scoped>

</style>