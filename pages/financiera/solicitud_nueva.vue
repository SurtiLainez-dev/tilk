<template>
<v-card flat tile>
  <v-toolbar tile flat>
    <v-btn fab color="orange" text small v-if="VISTA === 2" @click="VISTA = 1" icon><v-icon>fa fa-arrow-left</v-icon></v-btn>
    <v-spacer v-if="VISTA === 2"></v-spacer>
    <v-card-title>{{titulo}}</v-card-title>
  </v-toolbar>
  <v-divider v-if="VISTA === 1"></v-divider>
  <v-data-table v-if="VISTA === 1" dense :headers="header" :items="Financiamientos" loading-text="Cargando productos ..."
                :loading="loadFinanciamientos" @click:row="goVista"></v-data-table>

  <v-card flat tile v-else-if="VISTA === 2">
    <creando_solicitud :producto="producto"/>
  </v-card>
</v-card>
</template>

<script>
import creando_solicitud from "@/components/surti_credito/creando_solicitud.vue";
export default {
  name: "solicitud_nueva",
  components:{creando_solicitud},
  created() {
    this.$store.commit('guardarTitulo','Creando Solicitúd');
    this.titulo = 'Productos Financieros Disponibles';
    this.cargarFinanciamientos();
  },
  computed:{
    VISTA:{
      get(){
        return this.$store.state.surticredito.surticredito.VISTA;
      },
      set(val){
        this.$store.commit('surticredito/surticredito/cambiar_VISTA', val)
      }
    }
  },
  data(){
    return{
      loadFinanciamientos: true,
      Financiamientos:     [],

      header:              [
        {text:'Codigo', value:'codigo_sistema'},
        {text:'Modelo', value:'modelo'},
        {text:'Nombre del Producto', value:'nombre_articulo'},
        {text:'Proveedor', value:'marca.proveedor.nombre'}
      ],
      titulo: '',
      producto: {}
    }
  },
  methods:{
    cargarFinanciamientos(){
      this.$store.$axios.get('surti_creditos/cargar_financiamientos').then((res)=>{
        this.Financiamientos     = res.data.financiamientos;
        this.loadFinanciamientos = false;
      })
    },
    goVista(data){
      this.producto = data;
      this.titulo   = 'Solicitúd para '+data.nombre_articulo;
      this.VISTA    = 2;
    }
  }
}
</script>

<style scoped>

</style>
