<template>
  <v-card flat>
    <v-container>
      <table>
        <caption>Documentos adjuntos al cliente</caption>
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Link</th>
        </tr>
        </thead>
        <tbody v-if="!LOAD">
        <tr v-if="!LOAD && VENTA.cliente.archivos" v-for="item in JSON.parse(VENTA.cliente.archivos)">
          <td>{{item.detalle}}</td>
          <td v-if="item.estado === 1"><b-link @click="verDocumento(item.dir)">Ver</b-link></td>
          <td v-else>No hay documentos</td>
        </tr>
        </tbody>
      </table>

      <v-divider></v-divider>

      <table>
        <caption>Documentos de la venta</caption>
        <thead>
        <tr>
          <td>Nombre</td>
          <td>Estado</td>
        </tr>
        </thead>
        <tbody v-if="!LOAD && VENTA.documento_ventas">
        <tr>
          <td>Contrato</td>
          <td v-if="VENTA.documento_ventas.contrato"><b-link @click="verDocumento(VENTA.documento_ventas.contrato)">Ver</b-link></td>
          <td v-else>No cargado</td>
        </tr>
        <tr>
          <td>Pagaré</td>
          <td v-if="VENTA.documento_ventas.garantia_prendaria"><b-link @click="verDocumento(VENTA.documento_ventas.garantia_prendaria)">Ver</b-link></td>
          <td v-else>No cargado</td>
        </tr>
        <tr>
          <td>TraspaSo vehícular</td>
          <td v-if="VENTA.documento_ventas.traspaso"><b-link @click="verDocumento(VENTA.documento_ventas.traspaso)">Ver</b-link></td>
          <td v-else>No cargado</td>
        </tr>
        <tr>
          <td>Carta poder</td>
          <td v-if="VENTA.documento_ventas.carta_poder"><b-link @click="verDocumento(VENTA.documento_ventas.carta_poder)">Ver</b-link></td>
          <td v-else>No cargado</td>
        </tr>
        <tr>
          <td>Hoja de conocimiento de trámites</td>
          <td v-if="VENTA.documento_ventas.conocimiento_tramite"><b-link @click="verDocumento(VENTA.documento_ventas.conocimiento_tramite)">Ver</b-link></td>
          <td v-else>No cargado</td>
        </tr>
        <tr>
          <td>Hoja de garantía de motocicleta</td>
          <td v-if="VENTA.documento_ventas.garantia_motocicleta"><b-link @click="verDocumento(VENTA.documento_ventas.garantia_motocicleta)">Ver</b-link></td>
          <td v-else>No cargado</td>
        </tr>
        <tr>
          <td>Hoja de garantía del artículo</td>
          <td v-if="VENTA.documento_ventas.garantia_articulo"><b-link @click="verDocumento(VENTA.documento_ventas.garantia_articulo)">Ver</b-link></td>
          <td v-else>No cargado</td>
        </tr>
        <tr>
          <td>Factura SAR</td>
          <td v-if="VENTA.documento_ventas.factura_sar"><b-link @click="verDocumento(VENTA.documento_ventas.factura_sar)">Ver</b-link></td>
          <td v-else>No cargado</td>
        </tr>
        <tr>
          <td>Tarjeta Fisica</td>
          <td v-if="VENTA.documento_ventas.tarjeta_fisica"><b-link @click="verDocumento(VENTA.documento_ventas.tarjeta_fisica)">Ver</b-link></td>
          <td v-else>No cargado</td>
        </tr>
        <tr>
          <td>Expediente Completo</td>
          <td v-if="VENTA.documento_ventas.expediente"><b-link @click="verDocumento(VENTA.documento_ventas.expediente)">Ver</b-link></td>
          <td v-else>No cargado</td>
        </tr>
        </tbody>
      </table>

      <v-divider></v-divider>

      <table>
        <caption>Orden de entrega</caption>
        <thead>
        <tr>
          <th>#</th>
          <th>Orden</th>
          <th>Estado</th>
        </tr>
        </thead>
        <tbody v-if="!LOAD">
        <tr v-if="VENTA.orden_entrega">
          <td>1</td>
          <td>{{VENTA.orden_entrega.cod}}</td>
          <td v-if="VENTA.orden_entrega.estado === 1"><b-link @click="verDocumento(VENTA.orden_entrega.file)">Ver</b-link></td>
          <td v-else>No se ha cargado</td>
        </tr>
        <tr v-else>
          <td colspan="">No hay orden de entrega asociada a esta venta</td>
        </tr>
        </tbody>
      </table>

      <v-divider></v-divider>

      <table>
        <caption>Facturación</caption>
        <thead>
        <tr>
          <td>Factura</td>
          <td>Ver</td>
        </tr>
        </thead>
        <tbody v-if="!LOAD">
        <tr v-if="VENTA.factura_ventas.length > 0" v-for="item in VENTA.factura_ventas">
          <td>{{item.contador}}</td>
          <td><b-link @click="solicitarClave(item.contador)">Ver factura</b-link></td>
        </tr>
        <tr v-else>
          <td colspan="2">No se ha facturado aún</td>
        </tr>
        </tbody>
      </table>

      <v-divider></v-divider>

      <v-card-actions class="d-flex justify-end">
        <v-btn v-if="viewBtn && VENTA.revision_documentos === 0" @click="registrarValidacion"
               color="success" dark tile small>Revsión OK</v-btn>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "revision_docs_vista",
  computed:{
    LOAD(){
      return this.$store.state.cuentas.LOAD_CUENTAS_REV_DOC;
    },
    VENTA(){
      return this.$store.state.cuentas.VENTA_REV_DOC;
    },
    USUARIO(){
      return this.$store.state.usuario;
    }
  },
  data(){
    return{
      viewBtn: true,
    }
  },
  methods:{
    abrirNavegador(clave, data){
      let url = '';
      url = this.$axios.defaults.baseURL+'documentos/cajas/factura/usuario='+this.USUARIO+'/factura='+data+'/'+clave;

      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    registrarValidacion(){
      this.$store.commit('activarOverlay', true)
      this.$axios.put('ventas/revision_documentos/'+this.VENTA.id,{
        id: this.VENTA.id
      }).then((res)=>{
        this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
        this.$store.commit('cuentas/cargar_VENTAS_REV_DOC');
        this.viewBtn = false;
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })
    },
    solicitarClave(data){
      this.$store.commit('activarOverlay', true);
      this.fac = data;
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave, data);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Ocurrio un error', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
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
table{
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  padding: 2px;
}
table thead{
  background: #e8e5e5;
}
table thead tr th{
  font-size: 12px;
}
table tbody tr td{
  font-size: 11px;
}
table tbody tr td:nth-child(even){
  background-color: #f2f2f2;
}
table tbody tr:hover{
  background: #f2f2f2;
  border: 1px solid;
  cursor: pointer;
}
table caption{
  font-size: 13px;
  caption-side: top;
}
table thead tr td{
  font-size: 12px;
}
</style>
