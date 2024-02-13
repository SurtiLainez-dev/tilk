<template>
  <v-card flat>
    <v-toolbar tile flat color="grey lighten-3">
      <v-toolbar-title>Centro de Actualizaciones de Tilk</v-toolbar-title>
    </v-toolbar>
    <v-card class="d-flex justify-center" flat tile>
      <v-card class="ma-2 border" width="40%" flat tile v-if="estado">
        <v-progress-linear indeterminate v-if="buscando"></v-progress-linear>
        <v-card-text>Hay una actualización pendiente. Presiona el botón descargar</v-card-text>
        <v-card-text>Depende el internet la descarga puede tomar de 10 a 15 minutos. Cuando la descarga finalice, el
        sisteme mostrará una notificación.</v-card-text>
        <v-divider></v-divider>
        <v-card-subtitle>Comentarios de la actualización</v-card-subtitle>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="indigo" dark small tile @click="consultarActualizacion">Consultar Actualizaciones</v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="ma-2 border" width="40%" flat tile v-else-if="!estado || buscando">
        <v-progress-linear indeterminate v-if="buscando"></v-progress-linear>
        <v-card-text>No se encontraron actualizaciones disonibles. Consulta mas tarde, contacte con soporte técnico o presiona el botón de abajo para volver a consultar.</v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="indigo" dark small tile @click="consultarActualizacion">Consultar Actualizaciones</v-btn>
        </v-card-actions>
      </v-card>
    </v-card>


  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "actualizaciones",
  computed:{
    ACTUALIZACION:{
      get: function(){
        return this.$store.state.ACTUALIZACION;
      },
      set: function(item){
        this.$store.commit('agregarACTUALIZACION', item)
      }
    },
  },
  data(){
    return{
      buscando: false,
      version: null,
      estado: false,
      descargaTerminada: false,
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Actualizaciones');
    this.consultarActualizacion();
  },
  methods:{
    consultarActualizacion(){
      this.buscando = true;
      this.$axios.get('actualizacion/'+this.$store.state.VERSION).then((res)=>{
        this.ACTUALIZACION = res.data.estado;
        this.estado        = res.data.estado;
        this.$store.commit('agregar_URLVERSION', res.data.url)
        this.version       = res.data.version;
        this.buscando      = false;
      })
    },
  }
}
</script>

<style scoped>

</style>
