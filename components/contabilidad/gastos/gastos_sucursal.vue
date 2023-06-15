<template>
<v-card flat>
  <v-card v-if="VISTA === 2 || VISTA === 3" flat>
    <v-data-table dense :headers="headers" :loading="LOAD_SUCURSALES" @click:row="goGastos" :items-per-page="25"
                  loading-text="Cargando sucursales ..." :items="SUCURSALES" ></v-data-table>
  </v-card>

  <v-card flat v-else-if="VISTA >= 5">
    <gastos_pantalla v-if="VISTA === 5" :sucursal="suc" />
    <gastos_asignados_x_sucursal v-else-if="VISTA === 6" :sucursal="suc"/>
  </v-card>

</v-card>
</template>

<script>
import gastos_pantalla from "@/components/contabilidad/gastos/gastos_pantalla.vue";
import gastos_asignados_x_sucursal from "@/components/contabilidad/gastos/gastos_asignados_x_sucursal.vue";
export default {
  name: "gastos_sucursal",
  components:{gastos_pantalla, gastos_asignados_x_sucursal},
  created() {
    this.$store.commit('suc/cargar_SUCURSALES');
  },
  data(){
    return{
      headers:[
        {text:'Nombre', value:'nombre'},
        {text:'Abreviatura', value:'abreviatura'},
        {text:'Ciudad', value:'ciudad'},
        {text:'Departamento', value:'depto'},
      ],
      suc: {}
    }
  },
  computed:{
    SUCURSALES(){
      return this.$store.state.suc.SUCURSALES;
    },
    LOAD_SUCURSALES(){
      return this.$store.state.suc.LOAD_SUCURSALES;
    },
    VISTA:{
      get: function (){
        return this.$store.state.suc.VISTA_MULTIPLE;
      },
      set: function (val){
        this.$store.commit('suc/cambiar_VISTA_MULTIPLE', val);
      }
    },
  },
  methods:{
    goGastos(data){
      this.suc   = data;
      if (this.VISTA === 2)
        this.VISTA = 5
      else if (this.VISTA === 3)
        this.VISTA = 6
    }
  }
}
</script>

<style scoped>

</style>