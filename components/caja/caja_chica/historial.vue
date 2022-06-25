<template>
  <v-card flat>
    <v-data-table dense :headers="headers" :items="historial" :items-per-page="25">
      <template v-slot:item.total="{item}">L. {{int.format(item.total)}}</template>
      <template v-slot:item.file="{item}"><b-link @click="verDocumento(item.file)">Ver documento</b-link></template>
      <template v-slot:item.created_at="{item}">{{item.created_at.split('T')[0]}}</template>
    </v-data-table>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "historial",
  props:{
    historial: Array
  },
  data(){
    return{
      int: Intl.NumberFormat(),
      headers:[
        {text:'Fecha', value:'created_at'},
        {text:'Tipo de Gasto', value:'tipo_gasto.nombre'},
        {text:'Detalle', value:'detalle'},
        {text:'Usuario', value:'user.usuario'},
        {text:'Total', value:'total'},
        {text:'Documento', value:'file'},
      ]
    }
  },
  methods:{
    verDocumento(URL){
      this.$store.commit('activarOverlay',  true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento',color:'error'})
        this.$store.commit('activarOverlay', false);
      })
    }
  }
}
</script>

<style scoped>

</style>
