<template>
    <div>
      <div class="bordes pl-2 pr-2">
        <v-row>
          <v-col ><strong>Número de Factura:</strong>{{Factura.num_factura}}</v-col>
          <v-col ><strong>Fecha de Vencimiento:</strong> {{Factura.fecha_limite_pago.split('-')[2]}}/{{Factura.fecha_limite_pago.split('-')[1]}}/{{Factura.fecha_limite_pago.split('-')[0]}}</v-col>
          <v-col v-if="Factura.orden_entrada"><strong>Orden de Ingreso:</strong>
            {{Factura.orden_entrada.codigo}}
            <v-btn width="22px" height="22px" @click="verOrden" color="indigo" x-small fab dark>
              <v-icon size="15px">fa fa-print</v-icon></v-btn>
          </v-col>
          <v-col ><strong>Flete:</strong><span v-if="Factura.is_flete === 0">No</span><span v-else></span>Sí</v-col>
        </v-row>
        <v-row>
          <v-col ><strong>Tipo de Factura:</strong> {{Factura.tipo_factura.nombre}}</v-col>
          <v-col ><strong>Usuario Registrador:</strong> {{Factura.user.usuario}}</v-col>
          <v-col ><strong>Estado:</strong>
            <v-chip v-if="Factura.estado === 0" color="orange" dark small>Al día</v-chip>
            <v-chip v-else-if="Factura.estado === 1" color="success" dark small>Cancelada</v-chip>
            <v-chip v-else-if="Factura.estado === 2" color="red" dark small>Retrasado</v-chip>
            <v-btn width="22px" height="22px" @click="verFile" color="red" x-small fab dark>
              <v-icon size="15px">fa fa-file-pdf</v-icon></v-btn>
          </v-col>
          <v-col><strong>Flete:</strong> L {{int.format(Factura.flete)}}</v-col>
        </v-row>
        <v-row>
          <v-col v-if="Factura.orden_entrada" cols="3"><strong>Sucursal Asignada:</strong> {{Factura.orden_entrada.sucursal.nombre}}</v-col>
          <v-col cols="3"><strong>Total de la Factura: </strong> L. {{int.format(Factura.total)}}</v-col>
          <v-col cols="3"><strong>Total Abonado: </strong> L. {{int.format(Factura.total_abonado)}}</v-col>
          <v-col cols="3"><strong>Saldo Pendiente: </strong> L. {{int.format(Factura.saldo_pendiente)}}</v-col>
        </v-row>
      </div>
      <div class="bordes pl-2 pr-2">
        <v-simple-table class="rowsTable">
          <template v-slot:default>
            <thead>
            <tr>
              <th>Artículo</th>
              <th>Código</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <td>Descuento</td>
              <th>Sub_total</th>
              <th>Impuesto</th>
              <th>Total</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in Factura.cuerpo_factura_proveedor">
              <td>{{item.articulo.nombre_articulo}}
                <br>
                <small>{{item.articulo.descripcion_corta}}</small></td>
              <td>{{item.articulo.codigo_sistema}}</td>
              <td>{{item.cantidad}}</td>
              <td><strong>L. {{int.format(item.precio_unitario)}}</strong></td>
              <td><strong>L. {{int.format(item.descuento)}}</strong></td>
              <td><strong>L. {{int.format(item.sub_total)}}</strong></td>
              <td>{{item.impuesto.nombre}} %</td>
              <td><strong>L. {{int.format(item.total)}}</strong></td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
      <div class="bordes pl-2 pr-2" >
        <strong>Pagos de la factura</strong>
        <v-simple-table class="rowsTable">
          <template v-slot:default>
            <thead>
            <tr>
              <th>#</th>
              <th>Descripción</th>
              <th>Total a Pagar</th>
              <th>Total Pagado</th>
              <th>Saldo Pendiente de la Cuota</th>
              <th>Fecha de Pago</th>
              <th>Estado</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in Factura.pagos_facturas">
              <td>{{item.num_pago}}</td>
              <td>{{item.descripcion}}</td>
              <td><strong>L. {{int.format(item.total_a_pagar)}}</strong></td>
              <td><strong>L. {{int.format(item.total_pagado)}}</strong></td>
              <td><strong>L. {{int.format(item.saldo_pendiente)}}</strong></td>
              <td>
                {{item.fecha_pago.split('-')[2]}}/{{item.fecha_pago.split('-')[1]}}/{{item.fecha_pago.split('-')[0]}}
              </td>
              <td>
                <v-chip v-if="item.estado === 1" color="success" dark small>Al día</v-chip>
                <v-chip v-else-if="item.estado === 2" color="orange" dark small>Cancelado</v-chip>
                <v-chip v-else-if="item.estado === 3" color="red" dark small>Retrasado</v-chip>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    props:{Factura:Object},
    data(){
      return{
        int: new Intl.NumberFormat()
      }
    },
    name: "Factura",
    methods:{
      verFile(){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('leer_documento/',{
          ubicacion: this.Factura.file_generado
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
      verOrden(){
        this.$store.commit('activarOverlay', true);
        this.$axios.get('orden_entrada/print/'+this.Factura.orden_entrada.id,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url)
            this.$store.commit('activarOverlay', false);
          }
        })
      }
    }
  }
</script>

<style scoped>
.bordes{
  border: solid 1px #000;
}
.rowsTable{
  cursor: pointer;
}
</style>
