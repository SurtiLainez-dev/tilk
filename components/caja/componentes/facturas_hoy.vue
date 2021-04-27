<template>
<v-card>
  <v-toolbar flat >
    <h6>Facturas de hoy</h6>
    <v-spacer></v-spacer>
    <div class="d-flex align-center">
      <h6>Total de Facturas: L. {{total}}</h6>
    </div>
  </v-toolbar>

  <v-data-table dense
                :loading="LOAD_FACTURAS"
                loading-text="Cargando facturas"
                :items="FACTURAS"
                class="rowsTable"
                :headers="header">
    <template v-slot:item.factura.contador="{item}">
      <b-link v-if="item.factura" @click="verDocumento(item.factura.file)">{{item.factura.contador}}</b-link>
    </template>
    <template v-slot:item.total="{item}">
      L {{item.total}}
    </template>
  </v-data-table>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "facturas_hoy",
  computed:{
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
      header:[
        {text:'Número', value:'factura.contador'},
        {text:'Caja', value:'cajas.codigo'},
        {text:'Forma de pago', value:'forma_pago.nombre'},
        {text:'Venta', value:'factura.venta.cod'},
        {text:'Usuario', value:'factura.user.usuario'},
        {text:'Total', value:'total'},
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
