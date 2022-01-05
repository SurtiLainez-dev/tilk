<template>
  <div>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Cobros</v-list-item-title>
      </template>
      <v-list-item dense class="itemOpciones" @click="go('/reportes/cobros/sucursales')">
        Saldos por Sucursales
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/reportes/cobros/segmentos')">
        Saldos por Segmentos
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/reportes/cobros/portafolios')">
        Saldos por Portafolio
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
export default {
  name: "sideReportes",
  methods:{
    go(url){
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>
.itemOpciones{
  font-size: 10px !important;
  margin-left: 6px;
  cursor: pointer;
}
.itemOpciones:hover{
  background-color: #47494e;
  margin-left: 8px;
  font-size: 14px !important;
}
</style>
