<template>
  <v-card>
    <v-toolbar flat color="grey lighten-5">
      <h6>Detalles Técnicos del Mobiliario</h6>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card flat v-if="estado">
      <v-simple-table dense class="rowsTable">
        <template v-slot:default>
          <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Detalle</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in JSON.parse(MOBILIARIO.detalles_tecnicos)">
            <td>{{i + 1}}</td>
            <td>{{item.nombre}}</td>
            <td>{{item.detalle}}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-card flat v-else>
      <h5>No hay detalles técnicos para este mobiliario</h5>
    </v-card>
  </v-card>
</template>

<script>
export default {
  data(){
    return{
      estado: false
    }
  },
  name: "detalles",
  created() {
    try{
      let det = JSON.parse(this.MOBILIARIO.detalles_tecnicos);
      console.log(det.length)
      this.estado = det.length > 0;
    }catch (e){
      this.estado = false;
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
