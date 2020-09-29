<template>
  <div>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Proveedores</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/proveedores/')">
        Ver Proveedores
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/proveedores/nuevo')">
        Crear Proveedor
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/proveedores/contactos')">
        Contactos
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/proveedores/marcas')">
        Marcas
      </v-list-item>
    </v-list-group>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Cotizaciones</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/proveedores/cotizaciones')">
        Ver Cotizaciones
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/proveedores/cotizaciones/nueva')">
        Crear Cotizacion
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
  export default {
    name: "sideProveedores",
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
