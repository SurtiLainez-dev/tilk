<template>
  <v-card>
    <v-toolbar flat >
      <h6>Recibos de hoy</h6>
      <v-spacer></v-spacer>
      <div class="d-flex align-center">
        <h6>Total de Recibos: L. {{total}}</h6>
      </div>
    </v-toolbar>

    <v-data-table dense
                  :loading="LOAD_RECIBOS"
                  loading-text="Cargando facturas"
                  :items="RECIBOS"
                  class="rowsTable"
                  :headers="header">
      <template v-slot:item.recibo.codigo="{item}">
        <b-link v-if="item.recibo" @click="verDocumento(item.recibo.file)">{{item.recibo.codigo}}</b-link>
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
  name: "recibos_hoy",
  computed:{
    total(){
      let total = 0;
      this.RECIBOS.forEach((i)=>{
        total = parseFloat(total) + parseFloat(i.total);
      });
      return total;
    },
    RECIBOS(){
      return this.$store.state.caja.RECIBOS_HOY;
    },
    LOAD_RECIBOS(){
      return this.$store.state.caja.LOADRECIBOS_HOY;
    },
    CAJA(){
      return this.$store.state.caja.CAJA;
    },
  },
  data(){
    return{
      header:[
        {text:'Número', value:'recibo.codigo'},
        {text:'Caja', value:'cajas.codigo'},
        {text:'Forma de pago', value:'forma_pago.nombre'},
        {text:'Venta', value:'recibo.venta.cod'},
        {text:'Usuario', value:'recibo.user.usuario'},
        {text:'Total', value:'total'},
      ]
    }
  },
  created() {
    let     f = new Date();
    let fecha = f.getFullYear()+'-'+(f.getMonth() + 1)+'-'+f.getDate();
    this.$store.commit('caja/cargar_DOCUMENTOS',{fecha: fecha, caja: this.CAJA.id, tipo: 2});
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
