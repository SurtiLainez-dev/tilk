<template>
  <div>
    <v-list-group v-if="PERMISOS.includes(8)">
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
    <v-list-group v-if="PERMISOS.includes(6)">
      <template v-slot:activator value="true">
        <v-list-item-title>Ventas</v-list-item-title>
      </template>
      <v-list-item v-if="PERMISOS.includes(63)" class="itemOpciones" @click="go('/solicitudes_redito/')">
        Solicitudes de Crédito
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(63)" class="itemOpciones" @click="go('/solicitudes_redito/')">
        Solicitudes de Crédito Pendientes
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(62)" class="itemOpciones" @click="go('/ventas/pendientes')">
        Ventas Pendientes
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(61)" class="itemOpciones" @click="go('/ventas/prospectos')">
        Prospectos
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(61)" class="itemOpciones" @click="go('/ventas/revision_documentos')">
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
      go(url){
        this.$router.push(url)
      }
    },
    computed:{
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
