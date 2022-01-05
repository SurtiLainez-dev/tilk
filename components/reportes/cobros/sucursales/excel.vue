<template>
  <v-card flat>
    <v-row no-gutters>
      <v-col cols="9">
        <v-card :height="600" class="ma-2 pa-2">
          <v-card-title>Datos del Reporte</v-card-title>
          <v-divider></v-divider>
<!--          <pre>{{datos}}</pre>-->
        </v-card>
      </v-col>
      <v-col cols>
        <v-btn dark small tile block color="green" class="pa-2 ma-2">Importar a Excel</v-btn>
        <v-btn dark small tile block color="red" class="pa-2 ma-2" @click="solicitarClave">Importar a Pdf</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "excel",
  props: {
    datos: Array,
    sucursal: String,
    sucursal_id: Number
  },
  methods:{
    abrirNavegador(clave){
      let url = this.$axios.defaults.baseURL+'documentos/reportes/cobros/sucursales/usuario='+this.$store.state.usuario+'/sucursal='+this.sucursal_id+'/'+clave;

      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    solicitarClave(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave)
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      });
    }
  }
}
</script>

<style scoped>

</style>
