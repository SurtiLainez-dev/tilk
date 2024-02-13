<template>
  <v-card flat>
    <v-card-actions class="d-flex justify-end">
      <v-tooltip left>
        <template v-slot:activator="{on, attrs}">
          <v-btn class="ma-2" color="indigo" text small fab v-bind="attrs"
                 dark v-on="on" @click="solicitarClave"><v-icon>fa fa-print</v-icon></v-btn>
        </template>
        <span>Imprimir Estado de Cuenta Completo</span>
      </v-tooltip>
    </v-card-actions>
    <v-data-table :headers="header" dense :items-per-page="20"
                  :items="EstadoCuenta">
      <template v-slot:item.debito="{item}">{{int.format(item.debito)}}</template>
      <template v-slot:item.credito="{item}">{{int.format(item.credito)}}</template>
      <template v-slot:item.saldo="{item}">{{int.format(item.saldo)}}</template>
    </v-data-table>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "estado_cuenta",
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
    USUARIO(){
      return this.$store.state.usuario;
    }
  },
  created() {
    this.cargarEstado();
  },
  data(){
    return{
      header:[
        {text: 'Fecha', value:'fecha'},
        {text: 'Descripción', value:'descripcion'},
        {text: 'Referencia', value:'referencia'},
        {text: 'Debito', value:'debito'},
        {text: 'Crédito', value:'credito'},
        {text: 'Saldo', value:'saldo'},
      ],
      int: Intl.NumberFormat(),
      EstadoCuenta: [],
      idEstadoCuenta: 0,
      load: true
    }
  },
  methods:{
    abrirNavegador(clave){
      let url = '';
      url = this.$axios.defaults.baseURL+'documentos/ventas/usuario='+this.USUARIO+'/estado_cuenta='+this.CUENTA.id+'/'+clave;

      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    cargarEstado(){
      if (this.EstadoCuenta.length === 0){
        this.$axios.get('venta/estado_cuenta/'+this.CUENTA.id).then((res)=>{
          this.idEstadoCuenta = res.data.estado.id;
          if (res.data.estado.estado_cuenta){
            this.EstadoCuenta = JSON.parse(res.data.estado.estado_cuenta);
          }
          this.load = false;
        })
      }
    },
    solicitarClave(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave);
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
