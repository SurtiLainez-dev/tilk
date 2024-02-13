<template>
<v-card flat>
  <v-simple-table  dense class="rowsTable">
    <template v-slot:default>
      <thead>
      <tr>
        <th>Proveedor</th>
        <th>Marca</th>
        <th>Modelo</th>
        <th>Articulo</th>
        <th>Cantidad</th>
        <th>Serie Sistema</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in CUENTA.facturas_contados" v-if="CUENTA.facturas_contados">
        <td>{{item.articulo.marca.proveedor.nombre}}</td>
        <td>{{item.articulo.marca.nombre}}</td>
        <td>{{item.articulo.modelo}}</td>
        <td>{{item.articulo.nombre_articulo}}</td>
        <td>{{item.cantidad}}</td>
        <td v-if="item.remision_articulo_id && item.remision_articulo_id > 0">{{item.remision_articulo.serie_fabricante}}</td>
      </tr>
<!--      <tr>-->
<!--        <th>Nombre del Artículo</th>-->
<!--        <td>{{CUENTA.contrato_cliente.remision_articulo.articulo.nombre_articulo}}</td>-->
<!--      </tr>-->
<!--      <tr>-->
<!--        <th>Descripción del artículo</th>-->
<!--        <td>{{CUENTA.contrato_cliente.remision_articulo.articulo.descripcion_corta}}</td>-->
<!--      </tr>-->
<!--      <tr>-->
<!--        <th>Proveedor</th>-->
<!--        <td>{{CUENTA.contrato_cliente.remision_articulo.articulo.marca.proveedor.nombre}}</td>-->
<!--      </tr>-->
<!--      <tr>-->
<!--        <th>Marca</th>-->
<!--        <td>{{CUENTA.contrato_cliente.remision_articulo.articulo.marca.nombre}}</td>-->
<!--      </tr>-->
<!--      <tr>-->
<!--        <th>Módelo</th>-->
<!--        <td>{{CUENTA.contrato_cliente.remision_articulo.articulo.modelo}}</td>-->
<!--      </tr>-->
<!--      <tr>-->
<!--        <th>Código del Proveedor</th>-->
<!--        <td>{{CUENTA.contrato_cliente.remision_articulo.articulo.codigo_proveedor}}</td>-->
<!--      </tr>-->
<!--      <tr>-->
<!--        <th>Código del sistema</th>-->
<!--        <td>{{CUENTA.contrato_cliente.remision_articulo.articulo.codigo_sistema}}</td>-->
<!--      </tr>-->
<!--      <tr>-->
<!--        <th>Serie del sistema</th>-->
<!--        <td>{{CUENTA.contrato_cliente.remision_articulo.serie_sistema}}</td>-->
<!--      </tr>-->
<!--      <tr>-->
<!--        <th>Serie del fabricante</th>-->
<!--        <td>{{CUENTA.contrato_cliente.remision_articulo.serie_fabricante}}</td>-->
<!--      </tr>-->
      </tbody>
    </template>
  </v-simple-table>
</v-card>
</template>

<script>
export default {
  name: "articulo_cuenta",
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
