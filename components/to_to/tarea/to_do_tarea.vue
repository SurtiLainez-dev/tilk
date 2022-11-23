<template>
<v-card flat>
  <v-card flat v-if="VISTA_VIEW === 1">
    <v-data-table dense :headers="headers" :items="TAREAS"
                  loading-text="Cargando tareas ..."
                  :loading="LOAD_TAREAS" @click:row="goTarea">
      <template v-slot:item.habilitacion="{item}">
        {{item.habilitacion.split(' ')[0].split('-')[2]}}/{{item.habilitacion.split(' ')[0].split('-')[1]}}/{{item.habilitacion.split(' ')[0].split('-')[0]}}
      </template>
      <template v-slot:item.titulo="{item}">
        <v-row no-gutters>
          <v-col>
            <div v-if="item.estado === 1" :style="'height: 100%; width: 7px; background-color:  #00FF32 !important'"></div>
            <div v-else :style="'height: 100%; width: 7px; background-color:  #FF0000 !important'"></div>
          </v-col>
          <v-col cols="11">{{item.titulo}}</v-col>
        </v-row>
      </template>
      <template v-slot:item.user_id="{item}">
        <v-chip x-small dark v-if="USUARIO == item.user_id" color="success">Propia / {{item.user.usuario}}</v-chip>
        <v-chip x-small dark v-else color="warning">Asignada / {{item.user.usuario}}</v-chip>
      </template>
      <template v-slot:item.todo_estado.nombre="{item}">
        <v-row no-gutters>
          <v-col cols="11">{{item.todo_estado.nombre}}</v-col>
          <v-col cols="1">
            <div :style="'height: 100%; width: 7px; background-color: '+item.todo_estado.color.substr(0,7)+' !important'"></div>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.todo_grupo.nombre="{item}">
        <v-row no-gutters>
          <v-col cols="11">{{item.todo_grupo.nombre}}</v-col>
          <v-col cols="1">
            <div :style="'height: 100%; width: 7px; background-color: '+item.todo_grupo.color.substr(0,7)+' !important'"></div>
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </v-card>

  <v-card flat v-else-if="VISTA_VIEW === 2"><to_do_tarea_info/></v-card>
</v-card>
</template>

<script>
import to_do_tarea_info from "@/components/to_to/tarea/to_do_tarea_info";
export default {
  name: "to_do_tarea",
  components:{to_do_tarea_info},
  data(){
    return{
      color: '#ff0000',
      headers:[
        {text:'Propia', value:'user_id'},
        {text:'Título', value:'titulo'},
        {text:'Fecha de Inicio', value:'habilitacion'},
        {text:'Grupo', value:'todo_grupo.nombre'},
        {text:'Etiqueta', value:'todo_estado.nombre'},
      ]
    }
  },
  computed:{
    LOAD_TAREAS(){
      return this.$store.state.todo.LOAD_TAREAS;
    },
    TAREAS(){
      return this.$store.state.todo.TAREAS;
    },
    USUARIO(){
      return this.$store.state.usuario_id;
    },
    VISTA_VIEW:{
      get: function (){
        return this.$store.state.todo.VISTA_VIEW;
      },
      set: function (vista){
        this.$store.commit('todo/cambiar_VISTAVIEW', vista);
      }
    }
  },
  created() {
    this.$store.commit('todo/cargar_TAREAS', this.USUARIO);
  },
  methods:{
    goTarea(item){
      this.$store.commit('todo/asignar_TITULO', item.titulo);
      this.$store.commit('todo/asignar_TAREAINFO', item);
      this.VISTA_VIEW = 2;
    }
  }
}
</script>

<style scoped>

</style>
