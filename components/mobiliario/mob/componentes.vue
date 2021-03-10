<template>
  <v-card>
    <v-toolbar flat color="grey lighten-5">
      <h6>Componenetes del Mobiliario</h6>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card flat v-if="estado">
      <v-simple-table dense class="rowsTable">
        <template v-slot:default>
          <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Código</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in JSON.parse(MOBILIARIO.componentes)">
            <td>{{i + 1}}</td>
            <td>{{item.nombre}}</td>
            <td>{{item.codigo}}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-card flat v-else>
      <h5>No hay componentes para este mobiliario</h5>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "componentes",
  data(){
    return{
      estado: false
    }
  },
  created() {
    try{
      let det = JSON.parse(this.MOBILIARIO.componentes);
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
