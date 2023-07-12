<template>
<v-card>
  <v-card flat tile class="ma-4">
    <table>
      <thead><tr><th style="border-bottom: solid #efeded 1px" colspan="5">Datos del Documento por Cobrar</th></tr></thead>
      <thead>
      <tr>
        <th style="border-top: 0px" colspan="3">Observación</th>
        <th style="border-top: 0px">Total</th>
        <th style="border-top: 0px">Estado</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="3">{{DXC.descripcion}}</td>
        <td>L. {{Intl.NumberFormat().format(DXC.total)}}</td>
        <td>
          <v-chip x-small color="success" dark v-if="DXC.estado === 2">Cancelado</v-chip>
          <v-chip x-small color="error" dark v-else-if="DXC.estado === 1">Pendiente</v-chip>
          <v-chip x-small color="orange" dark v-else-if="DXC.estado === 3">De baja por usuario</v-chip>
        </td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th colspan="4">Detalle</th>
        <th>Fecha de Pago</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="4">{{DXC.observacion}}</td>
        <td>{{DXC.fecha_pago.split('-')[2]}}/{{DXC.fecha_pago.split('-')[1]}}/{{DXC.fecha_pago.split('-')[0]}}</td>
      </tr>
      </tbody>
      <thead><tr><th style="border-bottom: solid #efeded 1px" colspan="5">Datos del Artículo</th></tr></thead>
      <thead>
      <tr>
        <th>Articulo</th>
        <th>Marca</th>
        <th>Modelo</th>
        <th>Serie</th>
        <th>Color</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="DXC.venta.facturas_contados.remision_articulo && (!DXC.venta.is_combo || DXC.venta.is_combo === 0)" v-for="item in DXC.venta.facturas_contados">
        <td>{{item.remision_articulo.articulo.nombre_articulo}}</td>
        <td>{{item.remision_articulo.articulo.marca.nombre}}</td>
        <td>{{item.remision_articulo.articulo.modelo}}</td>
        <td>{{item.remision_articulo.serie_fabricante}}</td>
        <td>{{item.remision_articulo.color}}</td>
      </tr>
      <tr v-else-if="DXC.venta.is_combo === 1">
        <td colspan="5">Este es un combo, aun no aparecen</td>
      </tr>
      <tr v-else>
        <td colspan="5">No se pueden mostrar los articulos de esta venta.</td>
      </tr>
      </tbody>
      <thead><tr><th style="border-bottom: solid #efeded 1px" colspan="5">Datos de la Venta</th></tr></thead>
      <thead>
      <tr>
        <th>Codigo</th>
        <th>Saldo Actual</th>
        <th>Cliente</th>
        <th>Sucursal</th>
        <th>Estado</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{DXC.venta.cod}}</td>
        <td>L. {{Intl.NumberFormat().format(DXC.venta.saldo_actual)}}</td>
        <td>{{DXC.venta.cliente.nombres}} {{DXC.venta.cliente.apellidos}}</td>
        <td>{{DXC.venta.sucursal.nombre}}</td>
        <td>
          <v-chip color="orange" x-small v-if="DXC.venta.estado === 1" dark>Al día</v-chip>
          <v-chip color="red" x-small v-else-if="DXC.venta.estado === 2" dark>Mora</v-chip>
          <v-chip color="success" x-small v-else-if="DXC.venta.estado === 3" dark>Cancelada</v-chip>
          <v-chip color="success" x-small v-else-if="DXC.venta.estado === 5" dark>Condonado</v-chip>
          <v-chip color="red" x-small v-else-if="DXC.venta.estado === 6" dark>Cancelado por Falta de Pago</v-chip>
          <v-chip color="indigo" x-small v-else-if="DXC.venta.estado === 4" dark>Pendiente por aceptar</v-chip>
        </td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th>#</th>
        <th colspan="2">Documento</th>
        <th>Fecha</th>
        <th colspan="2">Total</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in DXC.venta.recibos">
        <td>{{index + 1}}</td>
        <td colspan="2"><b-link @click="solicitarClave(item.codigo, item.file)">{{item.codigo}} {{item.file}}</b-link></td>
        <td>{{item.fecha.split('-')[2]}}/{{item.fecha.split('-')[1]}}/{{item.fecha.split('-')[0]}}</td>
        <td colspan="2">L. {{Intl.NumberFormat().format(item.total)}}</td>
      </tr>
      </tbody>
    </table>
  </v-card>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "vista_dxc",
  computed:{
    DXC(){
      return this.$store.state.contabilidad.dxc.DXC;
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
table{
  width: 100%;
  border: solid #b2b0b0 1px;
}

table thead tr th{
  padding: 5px;
  font-size: 14px;
  border-left: solid #b2b0b0 1px;
  border-top: solid #b2b0b0 1px;
  border-right: solid #b2b0b0 1px;;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  border-right: solid #b2b0b0 1px;;
  font-size: 12px;
  cursor: pointer;
}
table tbody tr td table{
  width: 80%;
}
table tbody tr td table thead tr th{
  font-size: 10px;
  padding: 2px;
}
table tbody tr td table tbody tr td{
  font-size: 9px;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr td:hover{
  background-color: #f6f6f6;
}
</style>