<template>
<v-card flat>
  <v-simple-table dense class="rowsTable" v-if="CUENTA.orden_entrega">
    <template v-slot:default>
      <tbody>
      <tr>
        <th>Feha Realizada</th>
        <td v-if="CUENTA.orden_entrega.fecha_finalizada">
          {{CUENTA.orden_entrega.fecha_finalizada.split('-')[2]}}/{{CUENTA.orden_entrega.fecha_finalizada.split('-')[1]}}/{{CUENTA.orden_entrega.fecha_finalizada.split('-')[0]}}
        </td>
        <td v-else>Sin entregar aún.</td>
      </tr>
      <tr>
        <th>Estado</th>
        <td>
          <v-chip x-small color="success" dark v-if="CUENTA.orden_entrega.estado === 1">Entregado</v-chip>
          <v-chip x-small color="red" dark v-else-if="CUENTA.orden_entrega.estado === 0">Pendiente</v-chip>
        </td>
      </tr>
      <tr>
        <th>Código</th>
        <td>{{CUENTA.orden_entrega.cod}}</td>
      </tr>
      <tr>
        <th>Encargado</th>
        <td>{{CUENTA.orden_entrega.encargado}}</td>
      </tr>
      <tr>
        <th>Documento</th>
        <td v-if="CUENTA.orden_entrega.estado === 1">
          <v-btn tile small color="indigo" dark @click="verDocumento"><v-icon left>fa fa-eye</v-icon>Ver Documento</v-btn>
        </td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";
import Vue from "vue";
export default {
  name: "orden_entrega",
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
  },
  methods:{
    verDocumento(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: this.CUENTA.orden_entrega.file_save}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('open-nav', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
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
