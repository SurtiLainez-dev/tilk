<template>
<v-card flat>
  <v-card v-if="VISTAGESTION === 1">
    <v-toolbar color="grey lighten-4" flat>
      <v-btn color="warning" fab x-small dark @click="volverPortafolios"><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-card-title>{{TITULO}}</v-card-title>
      <v-spacer></v-spacer>
      <v-text-field label="Buscar..." v-model="search" dense></v-text-field>
    </v-toolbar>
    <v-row no-gutters>
      <v-col>
        <v-text-field class="ma-5" label="Suma total de todos los créditos" suffix="lps"
                      dense disabled :value="PORTAFOLIO.total_ingresos"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-5" label="Suma total de todas las cuotas" suffix="lps"
                      dense disabled :value="PORTAFOLIO.valor_cuotas"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-5" label="Cantida de cuentas" suffix="cuentas"
                      dense disabled :value="PORTAFOLIO.cant_cuentas"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-5" label="Normalidad del portafolio" suffix="%"
                      dense disabled :value="PORTAFOLIO.normalidad"></v-text-field>
      </v-col>
    </v-row>
    <v-data-table dense :loading="LOADGESTIONES" :headers="header" :items="GESTIONES"
                  loading-text="Cargando gestiones ..." :search="search" @click:row="goGestion">
      <template v-slot:item.estado="{item}">
        <v-chip dark x-small color="orange" v-if="item.estado == 1">Pendiente</v-chip>
        <v-chip dark x-small color="indigo" v-else-if="item.estado == 2">Cerrado</v-chip>
        <v-chip dark x-small color="success" v-else-if="item.estado == 3">Cuenta Cancelada</v-chip>
      </template>
      <template v-slot:item.saldo_actual="{item}">L {{int.format(item.saldo_actual)}}</template>
      <template v-slot:item.pagando="{item}">L {{int.format(item.pagando)}}</template>
      <template v-slot:item.fecha_gestion="{item}">
        {{item.fecha_gestion.split('-')[2]}}/{{item.fecha_gestion.split('-')[1]}}/{{item.fecha_gestion.split('-')[0]}}
      </template>
    </v-data-table>

  </v-card>

  <v-card v-else>
    <gestion/>
  </v-card>
</v-card>
</template>

<script>
import gestion from "@/components/cobros/componentes/gestion";
export default {
  name: "gestiones",
  components:{gestion},
  data(){
    return{
      int: Intl.NumberFormat(),
      search: '',
      header:[
        {text:'Título', value:'titulo'},
        {text:'Venta', value:'venta.cod'},
        {text:'Segmento', value:'cob_segmento.nombre'},
        {text:'Estado', value:'estado'},
        {text:'Fecha a Gestionar', value:'fecha_gestion'},
        {text:'Saldo de la Crédito', value:'saldo_actual'},
        {text:'Saldo de Cuota', value:'pagando'},
      ]
    }
  },
  computed:{
    GESTIONES(){
      return this.$store.state.cobros.portafolios.GESTIONES;
    },
    LOADGESTIONES(){
      return this.$store.state.cobros.portafolios.LOADGESTIONES;
    },
    PORTAFOLIO() {
      return this.$store.state.cobros.portafolios.PORTAFOLIO;
    },
    TITULO:{
      get: function (){
        return this.$store.state.cobros.cobros.TITULO;
      },
      set: function (val){
        this.$store.commit('cobros/cobros/cambiar_TITULO', val);
      }
    },
    VISTAGESTION:{
      get: function (){
        return this.$store.state.cobros.portafolios.VISTAGESTION;
      },
      set: function (vista){
        this.$store.commit('cobros/portafolios/cambiar_VISTAGESTION', vista);
      }
    },
    VISTAPORTAFOLIOS:{
      get: function (){
        return this.$store.state.cobros.portafolios.VISTA;
      },
      set: function (vista){
        this.$store.commit('cobros/portafolios/cambiar_VISTA', vista);
      }
    },
  },
  created() {
    this.$store.commit('cobros/portafolios/cargar_GESTIONES');
  },
  methods:{
    volverPortafolios(){
      this.TITULO           = 'Portafolios';
      this.VISTAPORTAFOLIOS = 1;
    },
    goGestion(data){
      this.TITULO = data.titulo;
      this.$store.state.cobros.portafolios.GESTION = data;
      this.$store.commit('cuentas/cargar_CUENTA', data.venta_id);
      this.VISTAGESTION = 2;
    }
  }
}
</script>

<style scoped>

</style>
