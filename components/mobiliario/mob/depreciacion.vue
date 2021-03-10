<template>
<v-card>
  <v-toolbar flat color="grey lighten-5">
    <h6>Depreciación del Mobiliario</h6>
    <v-spacer></v-spacer>
    <v-btn color="indigo" dark small tile >Establecer Saldo Actual</v-btn>
  </v-toolbar>
  <v-card flat v-if="MOBILIARIO.is_depreciacions === 1">
    <v-simple-table dense class="rowsTable">
      <template v-slot:default>
        <tbody>
        <tr>
          <th>Año de Depreciación</th>
          <td>{{MOBILIARIO.anio_depre}}</td>
        </tr>
        <tr>
          <th>Saldo Actual</th>
          <td>L {{MOBILIARIO.precio_actual}}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-simple-table dense class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>#</th>
          <th>Año</th>
          <th>Precio</th>
          <th>Nuevo Precio</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in JSON.parse(MOBILIARIO.depreciacion)">
          <td>{{i + 1}}</td>
          <td>{{item.anio}}</td>
          <td>L {{item.precio}}</td>
          <td>L {{item.nuevoP}}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
  <v-card flat v-else>
    <h5>No hay depreciación para este mobiliario</h5>
  </v-card>
</v-card>
</template>

<script>
export default {
  name: "depreciacion",
  created() {
    if (this.MOBILIARIO.is_depreciacions === 1){
      let f = new Date();
      if (f.getFullYear() > this.MOBILIARIO.anio_depre)
        this.$store.commit('notificacion',{
          texto:'El saldo actual es incorrecto al año de depreciaciación',
          color:'warning'
        })
      else
        this.$store.commit('notificacion',{
          texto:'El saldo actual es el correcto al año de depreciaciación',
          color:'success'
        })
    }
  },
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
