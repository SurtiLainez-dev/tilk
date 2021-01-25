<template>
  <div>

    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Clientes</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/clientes/')">
        Perfiles
      </v-list-item>
    </v-list-group>


    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Ventas</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/ventas/')">
        Todas las Cuentas
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/ventas/agregar_pagos')">
        Agregar pagos a cuentas
      </v-list-item>
    </v-list-group>

    <v-list-group>
      <template v-slot:activator value="true">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-list-item-title v-on="on" v-bind="attrs">Ordenes d..</v-list-item-title>
          </template>
          <span>Ordenes de Entrega</span>
        </v-tooltip>
      </template>
      <v-list-item class="itemOpciones" @click="go('/ventas/ordenes_entrega/')">
        Ordenes
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/ventas/ordenes_entrega/pendientes')">
        Pendientes
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
export default {
name: "sideCuentas",
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
