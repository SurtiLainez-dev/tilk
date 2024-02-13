<template>
  <div>
    <v-list-group color="green" >
      <template v-slot:activator value="true">
        <v-list-item-title>Gastos</v-list-item-title>
      </template>
      <v-list-item dense class="itemOpciones" @click="anadirPestana(12, 'Gastos')">
        Ver Gastos
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/gastos/nuevo')">
        Crear Gastos
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/gastos/cargar_gastos')">
        Subir Facturas de Gastos
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/gastos/gastos')">
        Ver Facturas de Gastos
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/formato_pagos/nueva_solicitud_pago')">
        Nueva Solicitud de Pago
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/contabilidad/formato_pagos/solicitudes_pago')">
        Solicitudes de Pago
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
export default {
  name: "gastos",
  computed:{
    Pes(){
      return this.$store.state.pestana
    },
  },
  methods:{
    go(url){
      this.$router.push(url)
    },
    anadirPestana(key, titulo){
      let bandera = 0;
      this.Pes.forEach((item)=>{
        if (item.key === key)
          bandera++;
      });
      if (bandera === 0){
        this.$store.commit('anadirCaja', {titulo:titulo, key: key});
        this.$store.commit('cambiarTab', {val:key, tipo:false});
      }
    },
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
