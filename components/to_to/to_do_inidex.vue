<template>
<v-card flat>
  <v-card flat>
    <v-toolbar color="primary" dark extended flat>
      <v-toolbar-title>To-Do Surtidora Laínez</v-toolbar-title>
    </v-toolbar>

    <v-card class="mx-auto" max-width="97%" style="margin-top: -64px;">
      <v-toolbar flat>
        <v-toolbar-title class="grey--text">
          {{TITULO}}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
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
              <v-list-item><v-list-item-title @click="goVista(6)">Crear Nueva Tarea</v-list-item-title></v-list-item>
              <v-list-item><v-list-item-title >Crear Nueva Reunión</v-list-item-title></v-list-item>
              <v-list-item><v-list-item-title @click="goVista(1)">Inicio</v-list-item-title></v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-toolbar>

      <v-divider></v-divider>

      <v-card-text style="height: 560px;"
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
</v-card>
</template>

<script>
import to_do_grupo from "@/components/to_to/to_do_grupo";
import to_do_grupo_nuevo from "@/components/to_to/to_do_grupo_nuevo";
import to_do_inicio from "@/components/to_to/to_do_inicio";
import to_do_estado from "@/components/to_to/to_do_estado";
import to_do_estado_nuevo from "@/components/to_to/to_do_estado_nuevo";
import to_do_tarea from "@/components/to_to/to_do_tarea";
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
    }
  },
  created() {
    this.TITULO = 'Tareas - Inicio'
  },
  methods:{
    goVista(val){
      console.log(this.VISTA)
      console.log(val)
      this.VISTA  = val;
      console.log(this.VISTA)
    }
  }
}
</script>

<style scoped>

</style>
