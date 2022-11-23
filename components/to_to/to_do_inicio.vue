<template>
<v-card flat>

  <v-tabs-items v-model="VISTA_TAREA">
    <v-tab-item :key="0"><to_do_tarea/></v-tab-item>
    <v-tab-item :key="1"></v-tab-item>
  </v-tabs-items>
</v-card>
</template>

<script>
import to_do_tarea from "@/components/to_to/tarea/to_do_tarea";
export default {
  name: "to_do_inicio",
  components:{to_do_tarea},
  created() {
    this.$store.commit('todo/asignar_TITULO', 'Tareas');
    this.VISTA_TAREA = 0;
    // this.$store.commit('todo/cambiar_VISTAVIEW', 1)
  },
  data(){
    return{
      tab: 0
    }
  },
  computed:{
    VISTA_TAREA: {
      get: function (){
        return this.$store.state.todo.VISTA_TAREA;
      },
      set: function (vista){
        return this.$store.commit('todo/asignar_VISTATAREA', vista);
      }
    },
  }
}
</script>

<style scoped>

</style>
