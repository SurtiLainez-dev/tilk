<template>
  <v-card flat>
    <v-toolbar color="primary" dark extended flat>
      <v-toolbar-title>To-Do Surtidora Laínez</v-toolbar-title>
    </v-toolbar>

    <v-card class="mx-auto" max-width="97%" style="margin-top: -64px;">
      <v-toolbar flat>
        <v-toolbar-title class="grey--text">
          {{TITULO}}
        </v-toolbar-title>

        <template v-if="VISTA === 1 && VISTA_VIEW === 1" v-slot:extension>
          <v-tabs v-model="VISTA_TAREA" fixed-tabs>
            <v-tab :key="0">Tareas</v-tab>
            <v-tab :key="1">Tareas Terminadas</v-tab>
            <v-tab :key="2" disabled>Proximas Reuniones</v-tab>
            <v-tab :key="3" disabled>Reuniones Finalizadas</v-tab>
          </v-tabs>
        </template>

        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-btn v-if="VISTA_VIEW === 2" icon v-on="on" v-bind="attrs"
                   color="pink" @click="$store.commit('todo/cargar_TAREA', INFOTAREA.id)">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
            <v-btn v-else-if="VISTA_VIEW === 1" icon v-on="on" v-bind="attrs"
                   color="pink" @click="$store.commit('todo/cargar_TAREAS', USUARIO)">
              <v-icon>mdi-reload</v-icon>
            </v-btn>
          </template>
          <span v-if="VISTA_VIEW === 1">Recargar Tareas {{VISTA_VIEW}}</span>
          <span v-else-if="VISTA_VIEW === 2">Recargar esta Tarea</span>
        </v-tooltip>
        <v-btn icon color="warning" v-if="VISTA_VIEW === 2" @click="goBack">
          <v-icon>fa fa-arrow-left</v-icon>
        </v-btn>
        <v-menu right>
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn color="primary" dark v-bind="attrs" v-on="{ ...tooltip, ...menu }" icon>
                  <v-icon>mdi-apps</v-icon>
                </v-btn>
              </template>
              <span>Abrir Menú</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item-group>
              <v-list-item><v-list-item-title @click="goVista(4)">Añadir Estado</v-list-item-title></v-list-item>
              <v-list-item><v-list-item-title @click="goVista(5)">Estados de Tarea</v-list-item-title></v-list-item>
              <v-list-item><v-list-item-title @click="goVista(2)">Añadir Grupo</v-list-item-title></v-list-item>
              <v-list-item><v-list-item-title @click="goVista(3)">Grupos de Tarea</v-list-item-title></v-list-item>
              <v-list-item><v-list-item-title @click="resetNuevaTarea">Crear Nueva Tarea</v-list-item-title></v-list-item>
              <v-list-item><v-list-item-title >Crear Nueva Reunión</v-list-item-title></v-list-item>
              <v-list-item><v-list-item-title @click="goInicio">Inicio</v-list-item-title></v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text style="height: 80vh ;"
                   class="overflow-y-auto">
        <to_do_inicio v-if="VISTA === 1"/>
        <to_do_grupo_nuevo v-else-if="VISTA === 2"/>
        <to_do_grupo v-else-if="VISTA === 3"/>
        <to_do_estado_nuevo v-else-if="VISTA === 4"/>
        <to_do_estado v-else-if="VISTA === 5"/>
        <to_do_tarea_nueva v-else-if="VISTA === 6"/>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script>
import to_do_grupo from "@/components/to_to/to_do_grupo";
import to_do_grupo_nuevo from "@/components/to_to/to_do_grupo_nuevo";
import to_do_inicio from "@/components/to_to/to_do_inicio";
import to_do_estado from "@/components/to_to/to_do_estado";
import to_do_estado_nuevo from "@/components/to_to/to_do_estado_nuevo";
import to_do_tarea_nueva from "@/components/to_to/to_do_tarea_nueva";
export default {
  name: "to_do_inidex",
  components:{
    to_do_grupo,
    to_do_grupo_nuevo,
    to_do_inicio,
    to_do_estado,
    to_do_estado_nuevo,
    to_do_tarea_nueva
  },
  data(){
    return{

    }
  },
  computed:{
    TITULO: {
      get: function (){
        return this.$store.state.todo.TITULO;
      },
      set: function (val){
        this.$store.commit('todo/asignar_TITULO', val);
      }
    },
    VISTA:{
      get: function (){
        return this.$store.state.todo.VISTA;
      },
      set: function (val){
        this.$store.commit('todo/cambiar_VISTA', val)
      }
    },
    VISTA_TAREA: {
      get: function (){
        return this.$store.state.todo.VISTA_TAREA;
      },
      set: function (vista){
        return this.$store.commit('todo/asignar_VISTATAREA', vista);
      }
    },
    VISTA_VIEW:{
      get: function (){
        return this.$store.state.todo.VISTA_VIEW;
      },
      set: function (vista){
        this.$store.commit('todo/cambiar_VISTAVIEW', vista);
      }
    },
    TAREA: {
      get:function (){
        return this.$store.state.todo.TAREA;
      },
      set: function (data){
        this.$store.commit('todo/asignar_TAREA', data);
      }
    },
    INFOTAREA(){
      return this.$store.state.todo.INFO;
    },
    USUARIO(){
      return this.$store.state.usuario_id;
    },
  },
  created() {
    this.TITULO = 'Tareas';
    this.VISTA = 1;
    this.VISTA_VIEW = 1;
  },
  methods:{
    goVista(val){
      this.VISTA  = val;
    },
    goInicio(){
      this.$store.commit('todo/cambiar_VISTAVIEW', 1);
      this.VISTA = 1;
    },
    goBack(){
      if (this.VISTA_VIEW === 2 && this.$store.state.todo.TAREA.tipo === 1){
        this.VISTA_VIEW = 1;
        this.TITULO = 'Tareas';
        this.$store.commit('todo/cargar_TAREAS', this.USUARIO);
      }
      else if (this.VISTA_VIEW === 2 && this.$store.state.todo.TAREA.tipo === 2){
        this.VISTA = 1;
        this.TITULO = this.$store.state.todo.INFO.titulo;
        this.$store.state.todo.TAREA.tipo = 1;
        this.resetTarea();
      }
    },
    resetNuevaTarea(){
      this.VISTA = 6;
      this.resetTarea();
      this.$store.commit('todo/asignar_TITULO','Creando Nueva Tarea');
      this.$store.commit('todo/cambiar_VISTAVIEW', 1);
    },
    resetTarea(){
      this.TAREA.titulo = '';
      this.TAREA.detalle = '';
      this.TAREA.fecha_inicio = '';
      this.TAREA.fecha_finalizacion = '';
      this.TAREA.user    = [];
      this.TAREA.grupo = '';
      this.TAREA.estado = '';
      this.TAREA.links     = [];
      this.TAREA.archivos   = [];
      this.TAREA.checklist = [];
      this.TAREA.tipo      = 1;
      this.TAREA.tarea     = 0;
    }
  }
}
</script>

<style scoped>

</style>
