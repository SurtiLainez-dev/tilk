<template>
  <v-card flat>
    <table>
      <thead>
      <tr>
        <th colspan="6" >Ficha de la Motocicleta</th>
      </tr>
      </thead>
      <thead>
      <tr>
        <th colspan="2">Ubicación Actual</th>
        <th colspan="2">Estado</th>
        <th>Codigo del Sistema</th>
        <th>Ingreso</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="2">{{moto.remision_articulo.sucursal.nombre}}</td>
        <td colspan="2">{{moto.remision_articulo.estado_articulo.nombre}}</td>
        <td>{{moto.remision_articulo.serie_sistema}}</td>
        <td>
          {{moto.guia_remision.orden_entrada.fecha_creacion.split('-')[2]}}/{{moto.guia_remision.orden_entrada.fecha_creacion.split('-')[1]}}/{{moto.guia_remision.orden_entrada.fecha_creacion.split('-')[0]}}
        </td>
      </tr>
      </tbody>
      <thead>
        <tr>
          <th colspan="2">Proveedor</th>
          <th >Marca</th>
          <th>Modelo</th>
          <th colspan="2">Nombre</th>
        </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="2">{{moto.remision_articulo.articulo.marca.proveedor.nombre}}</td>
        <td>{{moto.remision_articulo.articulo.marca.nombre}}</td>
        <td>{{moto.remision_articulo.articulo.modelo}}</td>
        <td colspan="2">{{moto.remision_articulo.articulo.nombre_articulo}}</td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th>Chasis</th>
        <th>Motor</th>
        <th>Color</th>
        <th>CC</th>
        <th>Año</th>
        <th>Placa</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{moto.chasis}}</td>
        <td>{{moto.motor}}</td>
        <td>{{moto.color}}</td>
        <td>{{moto.cilindraje}} </td>
        <td>{{moto.anio}}</td>
        <td>{{moto.placa}}</td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th >Guía de Remisión</th>
        <th >Orden de Entrada</th>
        <th >Orden de Entrada Firmada</th>
        <th >Notificada</th>
        <th>Facturada</th>
        <th>Factura Proveedor</th>
      </tr>
      </thead>
      <tbody>
        <tr>
          <td><b-link @click="verDocumento(moto.guia_remision.file)">{{moto.guia_remision.num_guia}}</b-link></td>
          <td><b-link @click="verDocumento(moto.guia_remision.orden_entrada.file)">{{moto.guia_remision.orden_entrada.codigo}}</b-link></td>
          <td>
            <b-link v-if="moto.guia_remision.orden_entrada.file_subido" @click="verDocumento(moto.guia_remision.orden_entrada.file_subido)">{{moto.guia_remision.orden_entrada.codigo}}</b-link>
            <span v-else>No se ha cargado</span>
          </td>
          <td>
            <v-chip x-small color="success" v-if="moto.estado_notificar == 1">Notificada</v-chip>
            <v-chip x-small color="warning" v-else-if="moto.estado_notificar == 0 || !moto.estado_notificar">Sin Notificar</v-chip>
          </td>
          <td>
            <v-chip x-small color="success" v-if="moto.facturado == 1">Facturado</v-chip>
            <v-chip x-small color="warning" v-else-if="moto.facturado == 0 || !moto.facturado">Sin Facturar</v-chip>
          </td>
          <td>
            <v-chip x-small color="warning" v-if="!moto.factura_proveedor">Sin Facturar</v-chip>
            <span v-else>{{moto.factura_proveedor.num_factura}}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "info_moto",
  props:{
    moto: Object
  },
  methods:{
    verDocumento(dir){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',{
        ubicacion: dir
      },{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      }).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('open-nav', res.data.url)
          this.$store.commit('activarOverlay', false);
        }
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
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
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