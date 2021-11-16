<template>
  <div>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Gastos</v-list-item-title>
      </template>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/gastos/')">
        Ver Gastos
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/gastos/nuevo')">
        Crear Gastos
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
export default {
  name: "gastos",
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
