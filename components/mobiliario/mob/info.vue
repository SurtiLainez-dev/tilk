<template>
  <v-card >
    <v-toolbar flat color="grey lighten-5">
      <h6>Información General</h6>
    </v-toolbar>

    <v-simple-table dense class="rowsTable">
      <template v-slot:default>
        <tbody>
        <tr>
          <th>Sucursal Asignada</th>
          <td>
            <v-chip x-small color="success" v-if="MOBILIARIO.estado === 1" dark>Activo</v-chip>
            <v-chip x-small color="red" v-else-if="MOBILIARIO.estado === 2" dark>Fuera de Servicio</v-chip>
            <v-chip x-small color="indigo" v-else-if="MOBILIARIO.estado === 3" dark>Almacenado</v-chip>
            <v-chip x-small color="orange" v-else-if="MOBILIARIO.estado === 4" dark>Movimiento</v-chip>
            <v-chip x-small color="orange" v-else-if="MOBILIARIO.estado === 5" dark>Dañado</v-chip>
            <v-chip x-small color="orange" v-else-if="MOBILIARIO.estado === 6" dark>Mantenimiento</v-chip>
          </td>
        </tr>
        <tr>
          <th>Sucursal Asignada</th>
          <td>{{MOBILIARIO.sucursal.nombre}}</td>
        </tr>
        <tr>
          <th>Colaborador Responsable</th>
          <td>{{MOBILIARIO.colaborador.nombres}} {{MOBILIARIO.colaborador.apellidos}}</td>
        </tr>
        <tr>
          <th>Nombre</th>
          <td>{{MOBILIARIO.nombre}}</td>
        </tr>
        <tr>
          <th>Modelo</th>
          <td>{{MOBILIARIO.mob_modelo.nombre}}</td>
        </tr>
        <tr>
          <th>Marca</th>
          <td>{{MOBILIARIO.mob_modelo.mob_marca.nombre}}</td>
        </tr>
        <tr>
          <th>Familía</th>
          <td>{{MOBILIARIO.mob_modelo.mob_familia.nombre}}</td>
        </tr>
        <tr>
          <th>Sub-familía</th>
          <td>{{MOBILIARIO.mob_modelo.sub_f}}</td>
        </tr>
        <tr>
          <th>Serie del Sistema</th>
          <td>{{MOBILIARIO.serie_s}}</td>
        </tr>
        <tr>
          <th>Serie del Fabricante</th>
          <td>{{MOBILIARIO.serie_f}}</td>
        </tr>
        <tr>
          <th>Precio de Costo</th>
          <td>L {{MOBILIARIO.precio_costo}}</td>
        </tr>
        <tr>
          <th>Precio Actual</th>
          <td>L {{MOBILIARIO.precio_actual}}</td>
        </tr>
        <tr>
          <th>Es Depreciable</th>
          <td>
            <v-chip x-small dark color="indigo" v-if="MOBILIARIO.is_depreciacions === 1">Sí</v-chip>
            <v-chip x-small dark color="orange" v-else-if="MOBILIARIO.is_depreciacions === 0">No</v-chip>
          </td>
        </tr>
        <tr>
          <th>Es Pieza</th>
          <td>
            <v-chip x-small dark color="indigo" v-if="MOBILIARIO.is_pieza === 1">Sí</v-chip>
            <v-chip x-small dark color="orange" v-else-if="MOBILIARIO.is_pieza === 0">No</v-chip>
          </td>
        </tr>
        <tr>
          <th>Medida en Unidades</th>
          <td>
            <v-chip x-small dark color="indigo" v-if="MOBILIARIO.is_unidades === 1">Sí</v-chip>
            <v-chip x-small dark color="orange" v-else-if="MOBILIARIO.is_unidades === 0">No</v-chip>
          </td>
        </tr>
        <tr v-if="MOBILIARIO.is_unidades === 1">
          <th>Cantidad de Unidades</th>
          <td>{{MOBILIARIO.unidades}} {{MOBILIARIO.unidad}}</td>
        </tr>
        <tr>
          <th>Es Consumible</th>
          <td>
            <v-chip x-small dark color="indigo" v-if="MOBILIARIO.is_consumible === 1">Sí</v-chip>
            <v-chip x-small dark color="orange" v-else-if="MOBILIARIO.is_consumible === 0">No</v-chip>
          </td>
        </tr>
        <tr>
          <th>Etiquetas Hechas</th>
          <td>
            <v-chip x-small dark color="success" v-if="MOBILIARIO.is_etiquetas === 1">Sí</v-chip>
            <v-chip x-small dark color="orange" v-else-if="MOBILIARIO.is_etiquetas === 0">Sin Hacer</v-chip>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>

  </v-card>
</template>

<script>
export default {
  name: "info",
  computed:{
    MOBILIARIO(){
      return this.$store.state.mob.familias.MOBILIARIO;
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
