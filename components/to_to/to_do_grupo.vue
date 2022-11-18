<template>
  <v-card flat>
    <v-data-table dense :headers="headers" :loading="LOAD_GRUPOS" :items="GRUPOS">
      <template v-slot:item.id="{item}">
        <v-btn x-small fab text color="indigo" @click="goEdit(item)"><v-icon>fa fa-edit</v-icon></v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "to_do_grupo",
  data(){
    return{
      headers:[
        {text: 'Nombre del Grupo', value:'nombre'},
        {text: 'Color', value:'color'},
        {text: '# Tareas', value:''},
        {text: 'Editar', value:'id'},
      ],
    }
  },
  created() {
    this.$store.commit('todo/asignar_TITULO', 'Grupos de Tareas')
    this.$store.commit('todo/cargar_GRUPOS');
  },
  computed:{
    LOAD_GRUPOS(){
      return this.$store.state.todo.LOAD_GRUPOS;
    },
    GRUPOS(){
      return this.$store.state.todo.GRUPOS;
    },
    GRUPO:{
      get: function (){
        return this.$store.state.todo.GRUPO;
      },
      set: function (val){
        return this.$store.commit('todo/asignar_GRUPO', val);
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
  methods:{
    goEdit(val){
      this.GRUPO.id = val.id;
      this.GRUPO.color = val.color;
      this.GRUPO.nombre =  val.nombre;
      this.GRUPO.tipo =  2;
      this.VISTA = 2;
    }
  }
}
</script>

<style scoped>

</style>
