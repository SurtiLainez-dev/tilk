<template>
    <div class="pl-2 pr-2">
      <v-row>
        <v-col cols="6" class="align-center">
          <v-avatar v-if="info.info.factura_proveedor.orden_entrada.proveedor.logo" size="25">
            <img :src="info.info.factura_proveedor.orden_entrada.proveedor.logo" alt="John"></v-avatar>
          <v-avatar size="25" v-else><v-icon>fa fa-user</v-icon></v-avatar>
          <strong>{{info.info.factura_proveedor.orden_entrada.proveedor.nombre}}</strong>
        </v-col>
        <v-col cols="6" class="d-flex justify-end align-center">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn @click="verFile(info.info.factura_proveedor.orden_entrada.file)"
                color="orange" fab v-on="on" v-bind="attrs" x-small dark class="ma-2">
                <v-icon>fa fa-file-pdf</v-icon>
              </v-btn>
            </template>
            <span>Orden de Ingreso</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn class="ma-2" @click="verFile(info.info.factura_proveedor.file_subir)"
                     fab dark x-small color="red" v-on="on" v-bind="attrs">
                <v-icon>fa fa-file-pdf</v-icon>
              </v-btn>
            </template>
            <span>Factura</span>
          </v-tooltip>
          <strong>Total de la Factura: L. {{info.info.factura_proveedor.total}}</strong></v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Número de Factura</v-list-item-title>
              <v-list-item-subtitle>{{info.info.factura_proveedor.num_factura}}</v-list-item-subtitle>
              <v-list-item-subtitle>
                {{info.info.factura_proveedor.codigo}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="3">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Orden de Entrada</v-list-item-title>
              <v-list-item-subtitle>{{info.info.factura_proveedor.orden_entrada.codigo}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="3">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Sucursal</v-list-item-title>
              <v-list-item-subtitle>{{info.info.factura_proveedor.orden_entrada.sucursal.nombre}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="3">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Tipo de Factura</v-list-item-title>
              <v-list-item-subtitle>{{info.info.factura_proveedor.tipo_factura.nombre}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <strong>Todos los Pagos de la Factura</strong>
      <v-simple-table class="rowsTable">
        <template v-slot:default>
          <thead>
          <tr>
            <th>#</th>
            <th>Descripción</th>
            <th>Total a Pagar</th>
            <th>Estado</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in info.pagos" v-if="item.factura_proveedor_id === info.info.factura_proveedor_id">
            <td>{{item.num_pago}}</td>
            <td>{{item.descripcion}}</td>
            <td><strong>L. {{item.total_a_pagar}}</strong></td>
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
</template>

<script>
  import {ipcRenderer} from "electron";
  export default {
    props:{info: Object,},
    name: "TablaPagoPendienteCalendario",
    methods:{
      verFile(dir){
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
  .rowsTable{
    cursor: pointer;
  }
</style>
