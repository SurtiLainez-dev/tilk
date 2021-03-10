<template>
<v-card flat class="pb-10">
  <v-simple-table dense class="rowsTable">
    <template v-slot:default>
      <thead>
      <tr>
        <th>Nombre del Artículo</th>
        <th>Módelo</th>
        <th>Marca</th>
        <th>Código del Sistema</th>
        <th>Cantidad</th>
        <th>Precio</th>
        <th>Total</th>
        <th>Remisión</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in CUENTA.facturas_contados">
        <td>{{item.articulo.nombre_articulo}}</td>
        <td>{{item.articulo.modelo}}</td>
        <td>{{item.articulo.marca.nombre}}</td>
        <td>{{item.articulo.codigo_sistema}}</td>
        <td>{{item.cantidad}}</td>
        <td>L {{item.precio}}</td>
        <td>L {{item.total}}</td>
        <td>
          <v-chip dark x-small color="success" v-if="item.is_remision === 1">Sí</v-chip>
          <v-chip dark x-small color="red" v-else-if="item.is_remision === 0">No</v-chip>
        </td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
  <v-divider></v-divider>
  <div v-if="remisiones">
    <h6 class="grey--text pl-5">Remisiones en la Factura</h6>
    <v-simple-table class="rowsTable" dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th>Nombre del Artículo</th>
            <th>Código del Sistema</th>
            <th>Seríe del Sistema</th>
            <th>Seríe del Fabricante</th>
          </tr>
        </thead>
        <tbody>
        <tr v-for="item in CUENTA.facturas_contados" v-if="item.is_remision === 1">
          <td>{{item.articulo.nombre_articulo}}</td>
          <td>{{item.articulo.codigo_sistema}}</td>
          <td>{{item.remision_articulo.serie_sistema}}</td>
          <td>{{item.remision_articulo.serie_fabricante}}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
  <v-divider></v-divider>
  <div v-if="motos">
    <h6 class="grey--text pl-5">Motocicletas en la Factura</h6>
    <v-simple-table dense class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>Chasis</th>
          <th>Motor</th>
          <th>CC</th>
          <th>Color</th>
          <th>Año</th>
          <th>Notificada</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in CUENTA.facturas_contados" v-if="item.articulo.is_motocicleta === 1">
          <td>{{item.remision_articulo.motocicleta.chasis}}</td>
          <td>{{item.remision_articulo.motocicleta.motor}}</td>
          <td>{{item.remision_articulo.motocicleta.cilindraje}}</td>
          <td>{{item.remision_articulo.motocicleta.color}}</td>
          <td>{{item.remision_articulo.motocicleta.anio}}</td>
          <td>
            <v-chip color="success" x-small dark v-if="item.remision_articulo.motocicleta.estado_notificar === 1">Sí</v-chip>
            <v-chip color="red" x-small dark v-else-if="item.remision_articulo.motocicleta.estado_notificar === 1">No</v-chip>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</v-card>
</template>

<script>
export default {
  name: "articulos_contado" ,
  data(){
    return {
      motos: false,
      remisiones: false,
    }
  },
  created() {
    this.CUENTA.facturas_contados.forEach((i)=>{
      if (i.is_remision === 1)
        this.remisiones = true;

      if (i.articulo.is_motocicleta === 1)
        this.motos = true;
    })
  },
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
