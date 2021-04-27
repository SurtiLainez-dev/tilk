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
            <b-link @click="verDocumento(item.file)">{{item.codigo}}</b-link>
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
.rowsTable{
  cursor: pointer;
}
</style>
