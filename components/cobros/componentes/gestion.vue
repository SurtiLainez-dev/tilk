<template>
  <v-card>
    <v-toolbar color="grey lighten-4" flat>
      <v-btn color="warning" fab x-small dark @click="volverGestion"><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-card-title>{{TITULO}}</v-card-title>
      <template v-slot:extension>
        <v-tabs v-model="tab" fixed-tabs background-color="gray lighten-3">
          <v-tab :key="0">Información de la Gestión</v-tab>
          <v-tab :key="1"  :disabled="LOAD_VENTA">Información de la Cuenta</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="tab">
      <v-tab-item :key="0"><pre>{{GESTION}}</pre></v-tab-item>
      <v-tab-item :key="1"><cuenta/></v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import cuenta from "@/components/Ventas/cuenta";
export default {
  name: "gestion",
  components:{cuenta},
  data(){
    return{
      tab: 0
    }
  },
  computed:{
    LOAD_VENTA(){
      return this.$store.state.cuentas.LOADCUENTA;
    },
    GESTION(){
      return this.$store.state.cobros.portafolios.GESTION;
    },
    VENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
    TITULO:{
      get: function (){
        return this.$store.state.cobros.cobros.TITULO;
      },
      set: function (val){
        this.$store.commit('cobros/cobros/cambiar_TITULO', val);
      }
    },
  },
  created() {

  },
  methods:{
    volverGestion(){
      this.TITULO = 'Gestiones del Portafolio '+this.$store.state.cobros.portafolios.PORTAFOLIO.nombre;
      this.$store.state.cobros.portafolios.VISTAGESTION = 1
    },
  }
}
</script>

<style scoped>

</style>
