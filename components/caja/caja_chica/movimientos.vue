<template>
  <v-card flat>
    <v-data-table dense :headers="headers" :items="historial" :items-per-page="50">
      <template v-slot:item.ct_libro_diario.referencia="{item}">
        <b-link @click="printPartida(item.ct_libro_diario.referencia)">{{item.ct_libro_diario.referencia}}</b-link>
      </template>
      <template v-slot:item.saldo_ant="{item}">L. {{int.format(item.saldo_ant)}}</template>
      <template v-slot:item.saldo_transaccion="{item}">L. {{int.format(item.saldo_transaccion)}}</template>
      <template v-slot:item.saldo_actual="{item}">L. {{int.format(item.saldo_actual)}}</template>
      <template v-slot:item.tipo="{item}">
        <v-chip x-small v-if="item.tipo === 0" dark color="success">+</v-chip>
        <v-chip x-small v-else-if="item.tipo === 1" dark color="orange">-</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "movimientos",
  props:{historial: Array},
  data(){
    return{
      int: Intl.NumberFormat(),
      headers:[
        {text:'Fecha', value:'fecha'},
        {text:'Tipo de Gasto', value:'gasto.tipo_gasto.nombre'},
        {text:'Partida', value:'ct_libro_diario.referencia'},
        {text:'Detalle del Gasto', value:'observacion'},
        {text:'S. Inicial', value:'saldo_ant'},
        {text:'S. Movimiento', value:'saldo_transaccion'},
        {text:'S. Final', value:'saldo_actual'},
        {text:'Tipo', value:'tipo'},
      ]
    }
  },
  computed:{
    USUARIO(){
      return this.$store.state.usuario;
    },
  },
  methods:{
    abrirNavegador(clave, referencia){
      let url = this.$axios.defaults.baseURL+'documentos/partida/usuario='+this.USUARIO+'/partida='+referencia+'/'+clave;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    printPartida(referencia){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave, referencia);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      });
    },
  }
}
</script>

<style scoped>

</style>
