<template>
  <div class="ml-2 mr-2">
    <v-row>
      <v-col lg="2" cols="6">
        <v-card @click="vista = 1">
          <v-card-title>
            Inicio
          </v-card-title>
        </v-card>
      </v-col>
      <v-col  lg="2" cols="6">
        <v-card @click="vista =2">
          <v-card-title>
            Prospectos
          </v-card-title>
        </v-card>
      </v-col>
      <v-col lg="2" cols="6">
        <v-card  @click="vista = 3">
          <v-card-title>
            Tareas
          </v-card-title>
        </v-card>
      </v-col>

    </v-row>
    <v-row v-if="vista === 1">
      <v-col md="6" cols="12">
        <view_transferencias/>
      </v-col>
      <v-col>

<!--        <view_seguimientos/>-->
      </v-col>
    </v-row>

    <x_sucursal v-if="vista === 2"/>
    <tareas v-else-if="vista === 3"/>
  </div>
</template>

<script>
  import seguimiento from "../../components/Ventas/seguimiento";
  import view_transferencias from "../../components/Inicio/view_transferencias";
  import view_seguimientos from "../../components/Inicio/view_seguimientos";
  import index from "../../components/Tareas/index"
  import x_sucursal from "@/components/Ventas/seguimientos/x_sucursal";
  export default {
    components:{view_transferencias, view_seguimientos, seguimiento, tareas:index, x_sucursal},
    name: "index",
    data(){
      return{
        vista: 1
      }
    },
    created() {
      this.$store.commit('activarOverlay', false);
      this.$store.commit('guardarTitulo', 'Inicio')
      this.$store.commit('valorDialogo', false);
      this.$store.commit('col/cargar_COLABORADORES')
    },
    methods:{
      taraa(){
        this.$store.commit('tareas/cambiarTareas', 'esto es un cambio')
      }
    }
  }
</script>

<style scoped>
  .side{
    opacity: 0.99;
  }
</style>
