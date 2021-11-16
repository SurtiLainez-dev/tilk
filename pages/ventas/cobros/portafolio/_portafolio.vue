<template>
  <v-card flat>
    <v-progress-linear indeterminate v-if="LOADPORTAFOLIO"></v-progress-linear>
    <cuentas v-if="VISTA === 1"/>
    <gestion v-else-if="VISTA === 2"/>
  </v-card>
</template>

<script>
import cuentas from "@/components/cobros/portafolios/cuentas";
import _gestion from "@/pages/ventas/cobros/gestiones/_gestion";
export default {
  components:{cuentas, gestion: _gestion},
  name: "page_portafolio",
  computed:{
    LOADPORTAFOLIO(){
      return this.$store.state.cobros.portafolios.LOADPORTAFOLIO;
    },
    PORTAFOLIO(){
      return this.$store.state.cobros.portafolios.PORTAFOLIO;
    },
    VISTA:{
      get: function (){
        return this.$store.state.cobros.portafolios.VISTAPORTAFOLIO_GESTION;
      },
      set: function (val){
        this.$store.commit('cobros/portafolios/cambiar_VISTAGESTION_GESTION', val);
      }
    }
  },
  created() {
    this.VISTA = 1;
    this.$route.params.portafolio = this.PORTAFOLIO.id;
    this.$store.commit('cobros/portafolios/cargar_PORTAFOLIO');
  }
}
</script>

<style scoped>

</style>
