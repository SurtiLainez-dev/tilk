<template>
  <v-card flat :loading="LOADGESTION || LOAD_VENTA">
    <v-card-title>{{GESTION.venta.cod}} - {{GESTION.venta.cliente.nombres}} {{GESTION.venta.cliente.nombres}}</v-card-title>

    <v-tabs dark color="orange" fixed-tabs v-model="tab">
      <v-tab>Datos de la Gestión</v-tab>
      <v-tab :disabled="LOAD_VENTA" >Datos de la Venta</v-tab>
      <v-tab @click="cliente">Datos del Cliente</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-row no-gutters>
          <v-col cols="2">
            <v-card-title>Opciones</v-card-title>
            <v-divider></v-divider>
            <v-btn block dark tile small class="ma-2" @click="goVista(1)">Datos Generales</v-btn>
            <v-btn block tile small color="black" class="ma-2 white--text" :disabled="LOAD_VENTA" @click="goVista(2)">Gestiones</v-btn>

          </v-col>
          <v-col cols="10">
            <general v-if="vista === 1"/>
            <gestion v-else-if="vista === 2"/>
          </v-col>
        </v-row>

      </v-tab-item>
      <v-tab-item >
        <cuenta/>
      </v-tab-item>
      <v-tab-item>
        <cliente/>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import cuenta from "@/components/Ventas/cuenta";
import general from "@/components/cobros/portafolios/gestiones/general";
import comentarios from "@/components/cobros/portafolios/gestiones/comentarios";
import cliente from "@/pages/clientes/_cliente";
export default {
  components:{cuenta, general, gestion:comentarios, cliente},
  name: "page_gestion",
  data(){
    return{
      tab: 0,
      vista: 1,
    }
  },
  computed:{
    GESTION(){
      return this.$store.state.cobros.portafolios.GESTION;
    },
    LOAD_VENTA(){
      return this.$store.state.cuentas.LOADCUENTA;
    },
    LOADGESTION(){
      return this.$store.state.cobros.portafolios.LOADGESTION;
    },
    Venta(){
      return this.$store.state.cuentas.CUENTA;
    }
  },
  created() {
    this.$route.params.gestion = this.GESTION.id;
    this.$store.commit('cobros/portafolios/cargar_GESTION');
    this.$store.commit('cuentas/cargar_CUENTA', this.GESTION.venta_id);
  },
  methods:{
    cliente(){
      this.$route.params.cliente = this.Venta.cliente_id;
    },
    goVista(val){
      this.vista = val;
    },
  }
}
</script>

<style scoped>

</style>
