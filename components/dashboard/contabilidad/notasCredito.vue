<template>
  <div>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-tooltip top>
          <span>Notas de Crédtio</span>
          <template v-slot:activator="{on, attrs}"><v-list-item-title v-on="on" v-bind="attrs">NC</v-list-item-title></template>
        </v-tooltip>
      </template>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/notas_credito/proveedor/nuevo')">
        Nueva NC Proveedor
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/notas_credito/proveedor/')">
        NC Proveedores
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/notas_credito/cliente/nueva')">
        NC Cliente x Anticipo
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/notas_credito/cliente/')">
        NC Clientes
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
  export default {
    name: "notasCredito",
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
