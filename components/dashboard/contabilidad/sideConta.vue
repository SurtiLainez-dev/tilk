<template>
  <div>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Contabilidad</v-list-item-title>
      </template>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/')">
        Catálogo
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/caja')">
        Cajas Generales
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/caja_chicas')">
        Cajas Chicas
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/banco')">
        Bancos
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/colaborador/planillas/pagos')">
        Pago a Colaboradores
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/libro_diario')">
        Libro Díario
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/cheques')">
        Cheques
      </v-list-item>
    </v-list-group>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Facturas</v-list-item-title>
      </template>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/facturas/proveedor/')">
        Facturas
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/facturas/proveedor/pendientes')">
        Facturas Pendientes
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/facturas/proveedor/registrar')">
        Registrar Factura
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/calendarios/contabilidad/pagos_proveedores')">
        Calendario de Pagos Pendientes
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/facturas/proveedor/pagos/')">
        Pagos Realizados
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/facturas/proveedor/pagos/nuevo')">
        Realizar Pago a Proveedor
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/facturas/proveedor/pagos/lista')">
        Crear Lista de Pagos
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/facturas/proveedor/ingreso_manual')">
        Ingreso Manual a CC
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
    export default {
      name: "sideConta",
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
