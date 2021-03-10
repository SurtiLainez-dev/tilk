<template>
  <div>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Inventario</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/inventario/')">
        Inventario
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/inventario/articulos/nuevo')">
        Crear Artículo
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/inventario/traslados/traslados_externos')">
        Transferencias Externas
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/inventario/traslados/externas')">
        Crear Transferencia Externa
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/contabilidad/notas_credito/proveedor/devoluciones')">
        Devoluciones a Proveedores
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/ventas/contado/nueva')">
        Crear Venta de Contado
      </v-list-item>
    </v-list-group>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Ordenes</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/inventario/ordenes-compra/nueva')">
        Crear Orden de Compra
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/inventario/ordenes-compra/')">
        Ver Ordenes de de Compra
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/inventario/ingresos/nuevo')">
        Crear Orden en Entrada
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/inventario/ingresos/')">
        Ver Ordenes en Entrada
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
  export default {
    name: "sideInventario",
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
