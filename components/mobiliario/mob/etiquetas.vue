<template>
<v-card flat>
  <v-toolbar color="grey lighten-3" flat>
    <h5>Etiquetas</h5>
    <v-spacer></v-spacer>
    <v-btn color="indigo" class="text-white" small tile @click="generarEtiquetas"
           >Generar Etiquetas</v-btn>
  </v-toolbar>

  <v-simple-table dense class="rowsTable">
    <template v-slot:default>
      <thead>
      <tr>
        <th>#</th>
        <th>Nombre</th>
        <th>Imprimir</th>
      </tr>
      </thead>
      <tbody v-if="estado">
      <tr v-for="(item, i) in JSON.parse(MOBILIARIO.etiquetas)">
        <td>{{i + 1}}</td>
        <td>{{item.nombre}}</td>
        <td><b-link @click="verDocumento(item.dir)">Imprimir</b-link></td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>

</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "etiquetas",
  computed:{
    MOBILIARIO:{
      get: function (){
        return this.$store.state.mob.familias.MOBILIARIO;
      },
      set: function (val){
        this.$store.commit('mob/familias/asignar_etiquetas_MOBILIARIO', val)
      }
    },
  },
  data(){
    return{
      estado: false
    }
  },
  created() {
    this.estado = this.MOBILIARIO.is_etiquetas === 1;
  },
  methods:{
    generarEtiquetas(){
      this.$store.commit('activarOverlay', true);
      this.$axios.get('mob/mobiliarios/etiquetas/'+this.MOBILIARIO.id).then((res)=>{
        this.$store.commit('mob/familias/cargar_MOBILIARIOS');
        this.MOBILIARIO.etiquetas = res.data.dir;
        this.MOBILIARIO.is_etiquetas = 1;
        this.estado = true;
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        }, 3500);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor',color:'error'});
      })
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
      })
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
