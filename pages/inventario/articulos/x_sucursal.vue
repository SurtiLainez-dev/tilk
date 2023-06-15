<template>
<v-card flat>
  <v-card flat height="100" color="grey lighten-5">
    <v-toolbar color="grey lighten-5" flat dense>
      <v-toolbar-title>Sucursales</v-toolbar-title>
      <v-spacer></v-spacer>

    </v-toolbar>
  </v-card>
  <v-progress-linear indeterminate v-if="loadSucursal"></v-progress-linear>
  <table>
    <thead>
    <tr><th v-for="item in headers" v-text="item.text"></th></tr>
    </thead>
    <tbody>
      <tr v-for="item in Sucursal">
        <td v-text="item.nombre"></td>
        <td v-text="item.abreviatura"></td>
        <td v-text="item.ciudad"></td>
        <td v-text="item.depto"></td>
        <td>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn @click="solicitarClave(item.id)" v-on="on" v-bind="attrs" fab text x-small ><v-icon>fa fa-print</v-icon></v-btn>
            </template>
            <span>Imprimir Inventario</span>
          </v-tooltip>

          <b-link disabled>Ver inventario</b-link>
        </td>
      </tr>
    </tbody>
  </table>

</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "x_sucursal",
  data(){
    return{
      headers:[
        {text:'Sucursal'},
        {text:'Cod'},
        {text:'Ciudad'},
        {text:'Departamento'},
        {text:'Acciones'},
      ],
      Sucursal: [],
      loadSucursal: true
    }
  },
  computed:{
    user(){
      return this.$store.state.usuario;
    }
  },
  created() {
    this.$axios.get('sucursales').then((res)=>{
      this.Sucursal = res.data.suc;
      this.loadSucursal = false;
    })
  },
  methods:{
    imprimirInventario(clave, id){
      let url = this.$axios.defaults.baseURL+'documentos/inventario_x_sucursal/usuario='+this.user+'/sucursal='+id+'/'+clave;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    solicitarClave(id){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.$store.commit('notificacion',{texto:'Cargando inventario', color:'success'});
        this.imprimirInventario(res.data.clave, id);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'danger'});
      })
    },
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border: solid #b2b0b0 1px;
  cursor: pointer;
}
table thead tr th{
  padding: 5px;
  font-size: 12px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 10px;
  cursor: pointer;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr:hover{
  background-color: #f6f6f6;
}
</style>