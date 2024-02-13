<template>
<v-card flat>
  <v-card flat v-if="VISTA === 1">
    <v-toolbar flat color="grey lighten-4" dense>
      <h6>Cartaeras Disponibles</h6>
    </v-toolbar>
    <v-toolbar dense flat>
      <v-btn small tile color="indigo" text dark @click="cambiarVista(3)">Crear Portafolio<v-icon right dark>fa fa-arrow-right</v-icon></v-btn>
      <v-btn small tile color="indigo" text dark @click="cambiarVista(4)">Editar Portafolio<v-icon right dark>fa fa-arrow-right</v-icon></v-btn>
    </v-toolbar>

    <v-data-table dense :headers="headers" :items="PORTAFOLIOS" loading-text="Cargando carteras ..."
                  :loading="LOADPORTAFOLIOS"></v-data-table>

  </v-card>

  <v-card flat v-else-if="VISTA >= 2">
    <v-toolbar flat dense color="grey lighten-4">
      <v-btn fab x-small color="warning" dark @click="back"><v-icon dark>fa fa-arrow-left</v-icon></v-btn>
      <v-spacer></v-spacer>
      <h6>{{titulo}}</h6>
    </v-toolbar>
    <portafilio :usuarios="usuarios.data" :load="usuarios.load" v-if="VISTA === 3"/>
    <editar_portafolio :usuarios="usuarios.data" :load="usuarios.load" v-else-if="VISTA === 4"/>
  </v-card>
</v-card>
</template>

<script>
import nueva from "@/components/cobros/cartera/nueva";
import portafilio from "@/components/cobros/cartera/portafilio";
import editar_portafolio from "@/components/cobros/cartera/editar_portafolio";
export default {
  components:{nueva, portafilio, editar_portafolio},
  name: "cartera",
  data(){
    return{
      titulo:'',
      headers:[
        {text: '#', value:'codigo'},
        {text: 'Sucursal', value:'sucursal.nombre'},
        {text: 'Nombre', value:'nombre'},
        {text: '# Cuentas', value:'cant_cuentas'},
      ],
      usuarios:{
        data: [],
        load: false
      }
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Cobros > Portafolios');
    this.VISTA = 1;
    this.$store.commit('cobros/cartera/cargar_PORTAFOLIOS');
  },
  computed:{
    VISTA:{
      get: function (){
        return this.$store.state.cobros.cartera.VISTA;
      },
      set: function (val){
        this.$store.commit('cobros/cartera/cambiar_VISTA', val);
      }
    },
    LOADPORTAFOLIOS(){
      return this.$store.state.cobros.cartera.LOADPORTAFOLIOS;
    },
    PORTAFOLIOS(){
      return this.$store.state.cobros.cartera.PORTAFOLIOS;
    }
  },
  methods:{
    back(){
      this.VISTA = 1;
      this.$store.commit('guardarTitulo', 'Cobros > Carteras');
    },
    cambiarVista(vista){
      this.cargarUsuarios();
      if (vista === 3)
        this.titulo = 'Creando Portafolio de Trabajo';
      else
        this.titulo = 'Editando Portafolio'

      this.VISTA = vista;
    },
  }
}
</script>

<style scoped>

</style>
