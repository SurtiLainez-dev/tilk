<template>
<v-card flat>
  <v-simple-table class="rowsTable">
    <template v-slot:default>
      <tbody>
      <tr>
        <th>Nombre del Artículo</th>
        <td>{{CUENTA.remision_articulo.articulo.nombre_articulo}}</td>
      </tr>
      <tr>
        <th>Descripción del artículo</th>
        <td>{{CUENTA.remision_articulo.articulo.descripcion_corta}}</td>
      </tr>
      <tr>
        <th>Proveedor</th>
        <td>{{CUENTA.remision_articulo.articulo.marca.proveedor.nombre}}</td>
      </tr>
      <tr>
        <th>Marca</th>
        <td>{{CUENTA.remision_articulo.articulo.marca.nombre}}</td>
      </tr>
      <tr>
        <th>Módelo</th>
        <td>{{CUENTA.remision_articulo.articulo.modelo}}</td>
      </tr>
      <tr>
        <th>Código del Proveedor</th>
        <td>{{CUENTA.remision_articulo.articulo.codigo_proveedor}}</td>
      </tr>
      <tr>
        <th>Código del sistema</th>
        <td>{{CUENTA.remision_articulo.articulo.codigo_sistema}}</td>
      </tr>
      <tr>
        <th>Serie del sistema</th>
        <td>{{CUENTA.remision_articulo.serie_sistema}}</td>
      </tr>
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
