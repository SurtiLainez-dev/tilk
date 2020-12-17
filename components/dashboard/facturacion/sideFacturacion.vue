<template>
  <div>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Transferencias</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/inventario/traslados/')">
        Transferencias
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/inventario/traslados/nuevo')">
        Crear Transferencia
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/inventario/traslados/pendientes')">
        Transferencias Pendientes
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/inventario/traslados/remisiones')">
        Remisiones de Transferencias
      </v-list-item>
    </v-list-group>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Ventas</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/solicitudes_redito/')">
        Solicitudes de Crédito
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/solicitudes_redito/')">
        Solicitudes de Crédito Pendientes
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
  export default {
    name: "sideFacturacion",
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
