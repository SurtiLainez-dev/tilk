<template>
<v-card>
  <v-toolbar color="grey lighten-4">
    <h5>Reportes</h5>
  </v-toolbar>
  <v-row>
    <v-col>
      <v-card-text>Cargar Reporte por Sucursales</v-card-text>
    </v-col>
    <v-col>
      <v-autocomplete :items="Sucursales" :item-value="'id'" :loading="loadSucursales"
                      label="Seleccionar Sucursal"
                      :item-text="'nombre'" v-model="sucursal" loader-height="3">
      </v-autocomplete>
    </v-col>
    <v-col class="d-flex align-center">
      <v-btn small tile dark color="indigo" @click="generarReporte" block>Crear Reporte de Mobiliario</v-btn>
    </v-col>
  </v-row>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";
export default {
  name: "reportes",
  data(){
    return{
      loadSucursales: false,
      Sucursales: [],
      sucursal: null
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Mobilirio > Reportes');
    this.cargarSucursales();
  },
  computed:{
    USER(){
      return this.$store.state.usuario_id;
    }
  },
  methods:{
    cargarSucursales(){
      this.loadSucursales = true;
      this.$axios.get('sucursales').then((res)=>{
        this.Sucursales     = res.data.suc;
        this.loadSucursales = false
      })
    },
    generarReporte(){
      if (this.sucursal) {
        let url = this.$axios.defaults.baseURL+'mob/mobiliarios/reporte/suc/' + this.sucursal + '/' + this.USER;
        ipcRenderer.send('pint_navegador', url);
      }else
        this.$store.commit('notificacion',{texto:'No seleccionaste una sucursal',color:'warning'})
    }
  }
}
</script>

<style scoped>

</style>
