<template>
<v-card flat>
  <v-simple-table dense>
    <template>
      <thead>
      <tr>
        <th colspan="2">Codigo  del Combo</th>
        <th colspan="1">Nombre  del Combo</th>
        <th colspan="3">Detalle del Combo</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="2">{{combo.codigo}}</td>
        <td colspan="1">{{combo.nombre}}</td>
        <td colspan="3">{{combo.detalle}}</td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th>#</th>
        <th>Código</th>
        <th>Articulos Incluidos</th>
        <th>Modelo</th>
        <th>Marca</th>
        <th>Sub Familia</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in combo.detalle_combo">
        <td>{{i+1}}</td>
        <td>{{item.articulo.codigo_sistema}}</td>
        <td>{{item.articulo.nombre_articulo}}</td>
        <td>{{item.articulo.modelo}}</td>
        <td>{{item.articulo.marca.nombre}}</td>
        <td>{{item.articulo.sub_familia_articulo.nombre}}</td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
  <hr>
  <small>Datos del precio</small>
  <v-row class="grey lighten-5">
    <v-col>
      <table>
        <tbody>
        <tr>
          <th>Tipo de compra: </th>
          <td>
            <input disabled v-if="precio.s_contado" value="Contado" type="text">
            <input disabled v-else-if="!precio.s_contado" value="Financiado" type="text">
          </td>
        </tr>
        <tr>
          <th>Precio de contado: </th>
          <td>
            <input disabled :value="'L '+precio.contado" type="text">
          </td>
        </tr>
        <tr>
          <th>Mínimo de prima: </th>
          <td>
            <input disabled :value="'L '+precio.min_prima" type="text">
          </td>
        </tr>
        <tr>
          <th>Prima acordada: </th>
          <td>
            <input disabled :value="'L '+precio.prima" type="text">
          </td>
        </tr>
        <tr>
          <th>Saldo a financiar: </th>
          <td>
            <input disabled :value="'L '+precio.saldo_nuevo" type="text">
          </td>
        </tr>
        </tbody>
      </table>
    </v-col>
    <v-col>
      <table class="rowsTable">
        <tbody>
        <tr>
          <th>Total de crédito: [prima + (cuota*pagos)]</th>
          <td>
            <input disabled :value="'L '+(parseFloat(precio.total_credito) + parseFloat(precio.prima)).toFixed(2)" type="text">
          </td>
        </tr>
        <tr>
          <th>Tiempo del crédito: </th>
          <td>
            <input disabled :value="precio.meses+' meses'" type="text">
          </td>
        </tr>
        <tr>
          <th>Cuota: </th>
          <td>
            <input disabled :value="'L '+precio.cuota" type="text">
          </td>
        </tr>
        <tr>
          <th>Forma de pago: </th>
          <td>
            <input v-if="precio.forma_pago === 1" disabled value="Semanal" type="text">
            <input v-if="precio.forma_pago === 2" disabled value="Quincenal" type="text">
            <input v-if="precio.forma_pago === 3" disabled value="Mensual" type="text">
          </td>
        </tr>
        <tr>
          <th>Cantidad de pagos: </th>
          <td>
            <input v-if="precio.forma_pago === 1" disabled :value="precio.meses * 4+' pagos'" type="text">
            <input v-if="precio.forma_pago === 2" disabled :value="precio.meses * 2+' pagos'" type="text">
            <input v-if="precio.forma_pago === 3" disabled :value="precio.meses+' pagos'" type="text">
          </td>
        </tr>
        </tbody>
      </table>
    </v-col>
  </v-row>
  <hr>
  <v-card-actions class="d-flex justify-end">
    <v-btn small color="warning" dark @click="vistaSolicitud = 1">Volver</v-btn>
    <v-btn small color="success" dark @click="vistaSolicitud = 3">Seguir</v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
export default {
  name: "combo",
  props: {
    precio:   Object,
    combo: Object
  },
  created() {
    this.Solicitud.Precio   = this.precio;
    this.Solicitud.Articulo = this.combo;
  },
  computed:{
    Solicitud:{
      get:function () {
        return this.$store.state.solicitud_credito.data;
      }
    },
    vistaSolicitud:{
      get:function () {
        return this.$store.state.solicitud_credito.SolicitudCredito_vista;
      },
      set:function (val) {
        return this.$store.commit('solicitud_credito/cambiarVista', val)
      }
    },
  }
}
</script>

<style scoped>

</style>