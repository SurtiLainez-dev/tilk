<template>
  <div>
    <v-list-group color="green"  v-if="PERMISOS.includes(8)">
      <template v-slot:activator value="true">
        <v-list-item-title>Transferencias</v-list-item-title>
      </template>
      <v-list-item v-if="PERMISOS.includes(82)" class="itemOpciones" @click="go('/inventario/traslados/')">
        Transferencias
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(81)" class="itemOpciones" @click="go('/inventario/traslados/nuevo')">
        Crear Transferencia
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(83)" class="itemOpciones" @click="go('/inventario/traslados/pendientes')">
        Transferencias Pendientes
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(84)" class="itemOpciones" @click="go('/inventario/traslados/remisiones')">
        Remisiones de Transferencias
      </v-list-item>
    </v-list-group>
    <v-list-group color="green"  v-if="PERMISOS.includes(6)">
      <template v-slot:activator value="true">
        <v-list-item-title>Ventas</v-list-item-title>
      </template>
      <v-list-item v-if="PERMISOS.includes(63)" class="itemOpciones" @click="anadirPestana(27,'Solicitudes de Credito - Facturación')">
        Solicitudes de Crédito
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(62)" class="itemOpciones" @click="go('/ventas/pendientes')">
        Ventas Pendientes
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(61)" class="itemOpciones" @click="go('/ventas/prospectos')">
        Prospectos
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(61)" class="itemOpciones" @click="anadirPestana(28,'Revisión de Documentos')">
        Revision de DOC.
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(61)" class="itemOpciones" @click="go('/ventas/revision_documentos_ok')">
        Revision de DOC. TER.
      </v-list-item>
      <v-list-item  class="itemOpciones" @click="go('/ventas/motocicletas')">
        Notificar Moto
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
  export default {
    name: "sideFacturacion",
    methods:{
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
      go(url){
        this.$router.push(url)
      }
    },
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
