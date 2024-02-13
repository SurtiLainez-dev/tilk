<template>
  <v-card flat tile>
    <v-toolbar tile flat dense color="grey lighten-3">
      <v-card-title>Reporte de Ventas</v-card-title>
    </v-toolbar>
    <v-card-text></v-card-text>
    <v-progress-linear indeterminate v-if="load"></v-progress-linear>
    <v-row no-gutters class="ma-2">
      <v-col cols="2">
        <v-card>
          <v-navigation-drawer permanent width="100%">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h6">Tipo de Datos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav>
              <v-list-item link @click="vista = 1">
                <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                <v-list-item-content><v-list-item-title>Ventas por Año</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item link @click="vista = 2">
                <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                <v-list-item-content><v-list-item-title>Ventas por Mes</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item link @click="vista = 3">
                <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                <v-list-item-content><v-list-item-title>V. x Sucursal Anuales</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item link @click="vista = 4">
                <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                <v-list-item-content><v-list-item-title>V. x Sucursal Mensuales</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item link @click="vista = 5">
                <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                <v-list-item-content><v-list-item-title>Total de Cuotas</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item link @click="vista = 6">
                <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                <v-list-item-content><v-list-item-title>Cant. Cuentas</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item link @click="vista = 7">
                <v-list-item-icon><v-icon>fa fa-file-excel</v-icon></v-list-item-icon>
                <v-list-item-content><v-list-item-title>Importar Datos</v-list-item-title></v-list-item-content>
              </v-list-item>
              <v-list-item link @click="vista = 8">
                <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                <v-list-item-content><v-list-item-title>Clientes Nuevos/Recompra</v-list-item-title></v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <v-col>
        <v-card flat tile>
          <grafica_anuales :datos="datos" v-if="!load && vista === 1"></grafica_anuales>
          <grafica_meses :datos="datos" v-if="!load && vista === 2"></grafica_meses>
          <rep_clientes_nuevos_recompra v-if="!load && vista ===8"/>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import grafica_anuales from "@/components/reportes/ventas/general/grafica_anuales.vue";
import grafica_meses from "@/components/reportes/ventas/general/grafica_meses.vue";
import rep_clientes_nuevos_recompra from "@/components/reportes/ventas/general/rep_clientes_nuevos_recompra.vue";
export default {
  name: "general",
  components:{grafica_anuales, grafica_meses, rep_clientes_nuevos_recompra},
  data(){
    return{
      vista: 1,
      load: true,
      datos: []
    }
  },
  created() {
    this.cargarDatos();
  },
  methods:{
    cargarDatos(){
      this.$axios.get('reportes/ventas/global/datos_reportes_ventas').then((res)=>{
        this.datos = res.data.anios;
        this.load  = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
