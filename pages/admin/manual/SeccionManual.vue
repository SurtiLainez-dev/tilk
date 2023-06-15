<template>
  <v-card flat>
    <v-card v-if="VISTA === 1">
      <v-card flat height="100" color="grey lighten-5">
        <v-toolbar color="grey lighten-5" flat dense>
          <v-toolbar-title>Secciones del Manual</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn small color="indigo" @click="VISTA = 2" class="text-white" tile>Crear Sección</v-btn>
        </v-toolbar>

        <v-row no-gutters >
          <v-col cols="8"></v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-text-field v-model="search" label="Buscar sección"
                          append-outer-icon="mdi-magnify"></v-text-field>
          </v-col>
        </v-row>
      </v-card>
    </v-card>

    <v-card flat v-else-if="VISTA === 2">
      <v-toolbar color="grey lighten-5" flat dense>
        <v-btn fab small color="orange" text icon @click="VISTA = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-card-title>Creando Nueva Sección del Manual</v-card-title>
      </v-toolbar>
      <NuevaSeccion/>
    </v-card>

  </v-card>
</template>

<script>
import NuevaSeccion from "@/components/manual/NuevaSeccion.vue";
export default {
  name: "SeccionManual",
  created() {
    this.$store.commit('guardarTitulo','Administrador > Manual > Secciones')
  },
  components:{NuevaSeccion},
  computed:{
    VISTA:{
      get: function (){
        return this.$store.state.manual.manual.VISTA;
      },
      set: function (vista){
        this.$store.commit('manual/manual/cambiarVISTA', vista);
      }
    }
  },
  data(){
    return{
      search: ''
    }
  }
}
</script>

<style scoped>

</style>