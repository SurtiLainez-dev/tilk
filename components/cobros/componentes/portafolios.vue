<template>
<v-card flat>
  <v-card flat v-if="VISTA === 1">
    <v-toolbar color="grey lighten-4" dense flat>
      <v-btn color="warning" fab x-small dark @click="volverPrincipal"><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-card-title>{{TITULO}}</v-card-title>
    </v-toolbar>
    <v-data-table dense :items="PORTAFOLIOS" :loading="LOADPORTAFOLIOS" @click:row="goGestiones"
                  loading-text="Cargando portafolios ..." :headers="headers">
      <template v-slot:item.total_ingresos="{item}">L {{int.format(item.total_ingresos)}}</template>
      <template v-slot:item.valor_cuotas="{item}">L {{int.format(item.valor_cuotas)}}</template>
      <template v-slot:item.normalidad="{item}">
        <v-card flat disabled>
          <v-progress-linear :color="item.normalidad === 0?'indigo':
                            item.normalidad > 0 && item.normalidad <= 40?'red':
                            item.normalidad > 40 && item.normalidad <=70?'orange':
                            item.normalidad > 70?'success':'blue-grey'"
                             height="15" v-model="item.normalidad">
            <template>
              <strong>{{item.normalidad.toFixed(2)}}%</strong>
            </template>
          </v-progress-linear>
        </v-card>
      </template>
      <template v-slot:item.cant_cuentas="{item}">{{item.cant_cuentas}} cuentas</template>
    </v-data-table>
  </v-card>

  <v-card flat v-else>
    <gestiones/>
  </v-card>
</v-card>
</template>

<script>
import gestiones from "@/components/cobros/componentes/gestiones";
export default {
  name: "portafolios",
  components:{gestiones},
  data(){
    return{
      int: Intl.NumberFormat(),
      headers:[
        {text:'Nombre', value:'nombre'},
        {text:'Código', value:'codigo'},
        {text:'Suma Total de Créditos', value:'total_ingresos'},
        {text:'Suma Total de Cuotas', value:'valor_cuotas'},
        {text:'Normalidad', value:'normalidad'},
        {text:'Cant. Cuentas', value:'cant_cuentas'},
        {text:'Nombre de la Cartera', value:'cob_cartera.nombre'},
      ]
    }
  },
  computed:{
    PORTAFOLIOS(){
      return this.$store.state.cobros.portafolios.PORTAFOLIOS;
    },
    LOADPORTAFOLIOS(){
      return this.$store.state.cobros.portafolios.LOADPORTAFOLIOS;
    },
    VISTA:{
      get: function (){
        return this.$store.state.cobros.portafolios.VISTA;
      },
      set: function (vista){
        this.$store.commit('cobros/portafolios/cambiar_VISTA', vista);
      }
    },
    VISTAPRINCIPAL:{
      get: function (){
        return this.$store.state.cobros.cobros.VISTA;
      },
      set: function (vista){
        this.$store.commit('cobros/cobros/cambiar_VISTA', vista);
      }
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
    this.$store.commit('cobros/portafolios/cargar_PORTAFOLIOS');
  },
  methods:{
    goGestiones(data){
      this.TITULO = 'Gestiones del Portafolio '+data.nombre;
      this.VISTA  = 2;
      this.$store.commit('cobros/portafolios/asignar_PORTAFOLIO', data);
    },
    volverPrincipal(){
      this.TITULO           = 'Vista Principal';
      this.VISTAPRINCIPAL = 1;
    }
  }
}
</script>

<style scoped>

</style>
