<template>
<v-card flat>
  <v-card flat v-if="VISTA === 1">
    <v-toolbar flat dense color="grey lighten-3">
      <h6>{{TITULO}}</h6>
    </v-toolbar>

    <div class="d-flex justify-center">
      <v-card class="mx-auto ma-3" height="150" width="150" flat v-for="item in items">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-btn height="150" width="150" tile v-on="on" v-bind="attrs"
                   :color="item.color" dark @click="cambiarVista(item.titulo,item.vista)">{{item.titulo}}</v-btn>
          </template>
          <span>{{item.des}}</span>
        </v-tooltip>
      </v-card>
    </div>
  </v-card>

  <v-card flat v-else>

    <mi_portafolios v-if="VISTA === 2"/>
  </v-card>

</v-card>
</template>

<script>
import mi_portafolios from "@/components/cobros/mi_portafolio/mi_portafolios";
export default {
  name: "inicio",
  components:{mi_portafolios},
  data(){
    return{
      items:[
        {titulo:'Mis Portafolios', color:'indigo', vista:2, des:'Son mis portafolios asignados'},
      ]
    }
  },
  computed:{
    TITULO:{
      get: function (){
        return this.$store.state.cobros.cobros.TITULO;
      },
      set: function (val){
        this.$store.commit('cobros/cobros/cambiar_TITULO', val);
      }
    },
    VISTA:{
      get: function (){
        return this.$store.state.cobros.cobros.VISTA;
      },
      set: function (vista){
        this.$store.commit('cobros/cobros/cambiar_VISTA', vista);
      }
    }
  },
  created() {
    this.VISTA = 1;
  },
  methods:{
      cambiarVista(titulo,vista){
        this.TITULO = titulo;
        this.VISTA  = vista;
      }
  }
}
</script>

<style scoped>
</style>
