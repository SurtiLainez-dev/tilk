<template>
<v-card flat tile>
  <v-toolbar flat >
    <v-text-field class="ma-2" dense label="Buscar ..." v-model="search"></v-text-field>
    <v-spacer></v-spacer>
    <v-btn small class="ma-2" color="green" tile dark text @click="todasAnios(1)">Consultar todas las del año</v-btn>
    <v-btn small class="ma-2" color="indigo" tile dark text @click="todasAnios(2)">Consultar todas las del mes</v-btn>
    <div class="d-flex align-center">
      <h6>Total de Facturas: L. {{int.format(total)}}</h6>
    </div>
  </v-toolbar>

  <v-data-table dense
                :loading="LOAD_FACTURAS"
                loading-text="Cargando facturas"
                :items="FACTURAS"
                :search="search"
                class="rowsTable"
                :headers="header">
    <template v-slot:item.factura.contador="{item}">
      <b-link v-if="item.factura" @click="solicitarClave(item)">{{item.factura.contador}}</b-link>
    </template>
    <template v-slot:item.total="{item}">
      L {{item.total}}
    </template>
    <template v-slot:item.fecha="{item}">
      {{item.fecha.split('-')[2]}}/{{item.fecha.split('-')[1]}}/{{item.fecha.split('-')[0]}}
    </template>
  </v-data-table>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "facturas_hoy",
  computed:{
    USUARIO(){
      return this.$store.state.usuario;
    },
    CAJA(){
      return this.$store.state.caja.CAJA;
    },
    FACTURAS(){
      return this.$store.state.caja.FACTURAS_HOY;
    },
    LOAD_FACTURAS(){
      return this.$store.state.caja.LOADFACTURAS_HOY;
    },
    total(){
      let total = 0;
      this.FACTURAS.forEach((i)=>{
        total = parseFloat(total) + parseFloat(i.total);
      });

      return total;
    }
  },
  data(){
    return{
      int: Intl.NumberFormat(),
      fac: {},
      search: '',
      header:[
        {text:'Nombres', value:'factura.venta.cliente.nombres'},
        {text:'Apellidos', value:'factura.venta.cliente.apellidos'},
        {text:'Número', value:'factura.contador'},
        {text:'Caja', value:'cajas.codigo'},
        {text:'Forma de pago', value:'forma_pago.nombre'},
        {text:'Venta', value:'factura.venta.cod'},
        {text:'Usuario', value:'factura.user.usuario'},
        {text:'Total', value:'total'},
        {text:'Fecha', value:'fecha'},
      ]
    }
  },
  created() {
    let f = new Date();
    let fecha = f.getFullYear()+'-'+(f.getMonth() + 1)+'-'+f.getDate();
    this.$store.commit('caja/cargar_DOCUMENTOS',{fecha: fecha, caja: this.CAJA.id, tipo: 1});
    this.$store.commit('activarOverlay', false);
  },
  methods:{
    abrirNavegador(clave){
      let url = this.$axios.defaults.baseURL+'documentos/cajas/factura/usuario='+this.USUARIO+'/factura='+this.fac.factura.contador+'/'+clave;

      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    solicitarClave(data){
      console.log(data)
      this.$store.commit('activarOverlay', true);
      this.fac = data;
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Ocurrio un error', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    todasAnios(tipo){
      let fecha = new Date();
      let f = '';
      if (tipo === 1)
        f = fecha.getFullYear()+'-01-01';
      else
        f = fecha.getFullYear()+'-'+(fecha.getMonth() + 1)+'-01'

      this.$store.commit('caja/cargar_DOCUMENTOS',{fecha: f, caja: this.CAJA.id, tipo: 1});
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
