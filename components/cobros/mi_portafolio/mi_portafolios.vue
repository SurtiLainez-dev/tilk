<template>
  <v-card flat>
    <v-card flat v-if="VISTA === 1">
      <v-toolbar flat color="grey lighten-3">
        <h6>{{titulo}}</h6>
        <v-divider></v-divider>
      </v-toolbar>
      <v-data-table dense :items="PORTAFOLIOS" :loading="LOADPORTAFOLIOS" :headers="header"
                    loading-text="Cargando portafolios" @click:row="vistaPortafolio"></v-data-table>

    </v-card>

    <v-card v-else flat>
      <v-toolbar dense color="grey lighten-4" flat>
        <v-btn color="warning" fab x-small dark v-if="VISTAGESTIONPORTAFOLIO === 1" @click="VISTA = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-btn color="warning" fab x-small dark v-else-if="VISTAGESTIONPORTAFOLIO === 2" @click="VISTAGESTIONPORTAFOLIO = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-spacer></v-spacer>
        <h6>{{titulo}}</h6>
      </v-toolbar>
      <porta v-if="VISTA === 2"/>
      <portafilion :usuarios="usuarios.data" v-if="VISTA === 3"/>
    </v-card>
  </v-card>
</template>

<script>
import portafilion from "@/components/cobros/cartera/portafilio";
import editar_portafolio from "@/components/cobros/cartera/editar_portafolio";
import _portafolio from "@/pages/ventas/cobros/portafolio/_portafolio";
export default {
  name: "mi_portafolios",
  components: {
    portafilion, editar_portafolio, porta: _portafolio
  },
  data(){
    return{
      header:[
        {text:'Nombre del Portafolio', value:'nombre'},
        {text:'Cantidad de Cuentas', value:'cant_cuentas'},
        {text:'Usuario', value:'user.usuario'},
      ],
      titulo: '',
      usuarios:{
        data: [],
        load: false
      }
    }
  },
  created() {
    this.VISTA = 1;
    this.titulo = 'Portafolios';
    this.$store.commit('cobros/portafolios/cargar_PORTAFOLIOS');
    this.$store.commit('guardarTitulo', 'Cobros > Portafolios');
    this.cargarUsuarios();
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
        return this.$store.state.cobros.cartera.VISTA;
      },
      set: function (vista){
        return this.$store.commit('cobros/cartera/cambiar_VISTA', vista);
      }
    },
    VISTAGESTIONPORTAFOLIO:{
      get: function (){
        return this.$store.state.cobros.portafolios.VISTAPORTAFOLIO_GESTION;
      },
      set: function (val){
        this.$store.commit('cobros/portafolios/cambiar_VISTAGESTION_GESTION', val)
      }
    }
  },
  methods:{
    cambiar_vista(val) {
      if (val === 3)
        this.titulo = 'Creando Portafolio Nuevo'
      else
        this.titulo = 'Editando Portafolio'

      this.VISTA = val;
    },
    cargarUsuarios(){
      if (this.usuarios.data.length === 0){
        this.usuarios.load = true;
        this.$axios.get('/usuarios').then((res)=>{
          res.data.usuarios.forEach((item)=>{
            this.usuarios.data.push({
              text: item.nombres+' '+item.apellidos+' - '+item.usuario,
              value: item.user
            });
          });
          this.usuarios.load = false;
        });
      }
    },
    vistaPortafolio(val){
      this.titulo = val.nombre
      this.$store.commit('cobros/portafolios/asignar_PORTAFOLIO', val);
      this.$store.commit('cobros/portafolios/cargar_GESTIONES', val.id)
      this.VISTA = 2;
    }
  }
}
</script>

<style scoped>

</style>
