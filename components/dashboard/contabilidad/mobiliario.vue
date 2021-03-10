<template>
  <div>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Mobiliario</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/contabilidad/mobiliario/modelos')">
        Familías
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/contabilidad/mobiliario/')">
        Mobiliario
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/contabilidad/mobiliario/usos')">
        Usos de Consumibles
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/contabilidad/mobiliario/traslados')">
        Traslados
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/contabilidad/mobiliario/nuevo_traslado')">
        Nuevo Traslado
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/contabilidad/mobiliario/nueva_entrada')">
        Entrada de Mobiliario
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/contabilidad/mobiliario/reportes')">
        Reportes
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
export default {
  name: "mobiliario",
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
