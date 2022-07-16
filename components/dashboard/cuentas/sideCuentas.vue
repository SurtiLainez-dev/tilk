<template>
  <div>

    <v-list-group v-if="PERMISOS.includes(141)">
      <template v-slot:activator value="true">
        <v-list-item-title>Clientes</v-list-item-title>
      </template>
      <v-list-item dense class="itemOpciones" @click="go('/clientes/')">
        Perfiles
      </v-list-item>
    </v-list-group>


    <v-list-group v-if="PERMISOS.includes(144) || PERMISOS.includes(145) || PERMISOS.includes(146)">
      <template v-slot:activator value="true">
        <v-list-item-title>Ventas</v-list-item-title>
      </template>
      <v-list-item v-if="PERMISOS.includes(144)" dense class="itemOpciones" @click="go('/ventas/')">
        Todas las Cuentas
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(145)" dense class="itemOpciones" @click="go('/ventas/agregar_pagos')">
        Agregar Pagos a Cuentas
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(146)" dense class="itemOpciones" @click="go('/ventas/nueva_venta_manual')">
        Agregar Venta Manual
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(149)" dense class="itemOpciones" @click="go('/ventas/canceladas')">
        Ventas Canceladas
      </v-list-item>
    </v-list-group>

    <v-list-group v-if="PERMISOS.includes(147)">
      <template v-slot:activator value="true">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-list-item-title v-on="on" v-bind="attrs">Ordenes d..</v-list-item-title>
          </template>
          <span>Ordenes de Entrega</span>
        </v-tooltip>
      </template>
      <v-list-item dense class="itemOpciones" @click="go('/ventas/ordenes_entrega/')">
        Ordenes
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/ventas/ordenes_entrega/pendientes')">
        Pendientes
      </v-list-item>
    </v-list-group>

    <v-list-group v-if="PERMISOS.includes(7)">
      <template v-slot:activator value="true">
        <v-list-item-title>Cobros</v-list-item-title>
      </template>
      <v-list-item v-if="PERMISOS.includes(71)" dense class="itemOpciones" @click="anadirPestana">Cobros</v-list-item>
      <v-list-item v-if="PERMISOS.includes(72)" dense class="itemOpciones" @click="go('/ventas/cobros/segmentos')">Segmentos</v-list-item>
      <v-list-item v-if="PERMISOS.includes(73)" dense class="itemOpciones" @click="go('/ventas/cobros/portafolios')">Portafolios</v-list-item>
    </v-list-group>
  </div>
</template>

<script>
export default {
name: "sideCuentas",
  computed:{
    Pes(){
      return this.$store.state.pestana
    },
    PERMISOS(){
      let permisos = this.$store.state.permisosUser.split(',');
      let per = [];
      if (permisos.length > 1){
        permisos.forEach((item)=>{
          per.push(parseInt(item))
        })
        return per;
      }else
        return [];
    },
  },
  methods:{
    anadirPestana(){
      let bandera = 0;
      this.Pes.forEach((item)=>{
        if (item.key === 2)
          bandera++;
      });
      if (bandera === 0){
        this.$store.commit('anadirCaja', {titulo:'Cobros', key: 2});
        this.$store.commit('cambiarTab', {val:2, tipo:false});
      }
    },
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
