<template>
<v-card flat>
  <v-card flat height="100" color="grey lighten-5">
    <v-toolbar color="grey lighten-5" flat dense>
      <v-toolbar-title>Todas las Notificaciones Generadas</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-row no-gutters >
      <v-col cols="8"></v-col>
      <v-col cols="4" class="d-flex justify-end">
        <v-text-field v-model="search" label="Buscar notificaciones"
                      append-outer-icon="mdi-magnify"></v-text-field>
      </v-col>
    </v-row>
  </v-card>

  <notificaciones :notificaciones="data" :usuario="USUARIO_ID" :load="load" :search="search"/>
</v-card>
</template>

<script>
import notificaciones from "@/components/tablas/colaboradores/notificaciones.vue";
export default {
  name: "all_norificaciones",
  components:{notificaciones},
  created() {
    this.$store.commit('guardarTitulo','Colaboradores > Notificaciones > Todas las Notificaciones');
    this.cargarNotificaciones();
  },
  data(){
    return{
      load: true,
      data: [],
      search: '',
    }
  },
  computed:{
    USUARIO_ID() {
      return parseInt(this.$store.state.usuario_id);
    }
  },
  methods:{
    cargarNotificaciones() {
      this.$axios.get('memo/notificaciones').then((res)=>{
        this.data = res.data.notificaciones;
        this.load = false;
      })
    }
  }
}
</script>

<style scoped>

</style>