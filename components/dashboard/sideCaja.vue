<template>
  <div>
    <v-container style="color: #FFF">
      <strong>Caja</strong>
    </v-container>
    <v-list-group>


      <template v-slot:activator value="true">
        <v-list-item-title>Recibos</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/caja/recibos')">
        Recibos
      </v-list-item>
    </v-list-group>


    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Facturas</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/caja/facturas/pendientes')">
        Pendientes
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/caja/facturas/')">
        Facturas
      </v-list-item>
    </v-list-group>

    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Calendario</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/caja/calendario/pagos_hoy')">
        Pagos de Hoy
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/caja/calendario/calendario')">
        Todos los Pagos
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/caja/calendario/pagos_atrasados')">
        Pagos Atrásados
      </v-list-item>
    </v-list-group>

    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Administrador</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/caja/admin/historial')">
        Historial de Cierres
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/caja/admin/recibos')">
        Recibos
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/caja/admin/cajas')">
        Cajas Hoy
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/caja/admin/configuracion')">
        Configuración
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/caja/admin/documentos')">
        Configuración de Impresión
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
export default {
  name: "sideCaja",
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
