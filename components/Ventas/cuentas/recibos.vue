<template>
  <v-card>
    <v-simple-table dense class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>#</th>
          <th>Fecha</th>
          <th>Referencia</th>
          <th>Total</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in CUENTA.recibos">
          <th>{{i+1}}</th>
          <td>{{item.fecha}}</td>
          <td>
            <b-link @click="solicitarClave(item.codigo, item.file)">{{item.codigo}}</b-link>
          </td>
          <td>L {{item.total}}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "recibos",
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
    USUARIO(){
      return this.$store.state.usuario;
    }
  },
  methods:{
    abrirNavegador(clave, recibo, tipo){
    let url = '';
    if(!tipo || tipo == 1)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibos/usuario=' + this.USUARIO + '/recibo=' + recibo + '/' + clave;
    else if(tipo == 2)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibo_dxc/usuario=' + this.USUARIO + '/recibo=' + recibo + '/' + clave;

    ipcRenderer.send('pint_navegador', url);
    this.$store.commit('activarOverlay', false);
    },
    solicitarClave(recibo, tipo){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave, recibo, tipo);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Ocurrio un error', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
