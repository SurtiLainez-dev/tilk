<template>
<v-card flat class="d-flex justify-center">
  <v-card width="95%" flat>
    <v-form ref="FormNuevaTarea">
      <v-row no-gutters>
        <v-col>
          <v-dialog ref="dialogoFechaInicio" v-model="dialogoFechaI" :return-value.sync="tarea.fecha_inicio"
                    persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field dense class="ma-2" label="Fecha de inicio" v-bind="attrs" v-on="on"
                            hint="fecha en la que se habilitara la tarea al usuario asignado"
                            persistent-hint
                            v-model="tarea.fecha_inicio"></v-text-field>
            </template>
            <v-date-picker v-model="tarea.fecha_inicio" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogoFechaI = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.dialogoFechaInicio.save(tarea.fecha_inicio)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col>
          <v-dialog ref="dialogoFechaFinal" v-model="dialogoFechaF" :return-value.sync="tarea.fecha_finalizacion"
                    persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field dense class="ma-2" label="Fecha de inicio" v-bind="attrs" v-on="on"
                            hint="fecha en la que se le cierra la tarea al usuario asignado"
                            persistent-hint
                            v-model="tarea.fecha_finalizacion"></v-text-field>
            </template>
            <v-date-picker v-model="tarea.fecha_finalizacion" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogoFechaF = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.dialogoFechaFinal.save(tarea.fecha_finalizacion)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col>
          <v-autocomplete dense label="Seleccionar un Grupo" :items="GRUPOS"
                          :item-value="'id'" :item-text="'nombre'" v-model="tarea.grupo"
                          class="ma-2" :loading="LOAD_GRUPOS"></v-autocomplete>
        </v-col>
      </v-row>

      <v-text-field dense label="Título de la Tarea" v-model="tarea.titulo" counter class="ma-2"></v-text-field>
      <v-text-field dense label="Detalle de la Tarea" v-model="tarea.detalle" counter class="ma-2"></v-text-field>
      <v-autocomplete label="Seleccionar Usuarios" v-model="tarea.user" class="ma-2" :items="users"
                      :item-text="'usuario'" :item-value="'user'" dense
                      :loading="load_user" chips multiple>
        <template v-slot:selection="data">
          <v-chip color="indigo" dark small v-bind="data.attrs" :input-value="data.selected"
              @click="data.select">{{ data.item.usuario }}</v-chip>
        </template>
      </v-autocomplete>

      <v-row no-gutters>
        <v-col>
          <v-card class="ma-1">
            <v-toolbar flat dense>
              <v-card-subtitle>Arhivos</v-card-subtitle>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn color="success" dark v-on="on" v-bind="attrs" small icon @click="anadirArchivo">
                    <v-icon small>fa fa-plus</v-icon>
                  </v-btn>
                </template>
                <span>Añadir Archivo</span>
              </v-tooltip>
            </v-toolbar>
            <v-divider></v-divider>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th style="width: 10%">#</th>
                  <th>Archivos</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in tarea.archivos">
                  <td>{{i+1}}</td>
                  <td>
                    <v-file-input dense v-model="item.file"></v-file-input>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="ma-1">
            <v-toolbar flat dense>
              <v-card-subtitle>Links</v-card-subtitle>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn color="success" dark v-on="on" v-bind="attrs" small icon>
                    <v-icon small>fa fa-plus</v-icon>
                  </v-btn>
                </template>
                <span>Añadir Link</span>
              </v-tooltip>
            </v-toolbar>
            <v-divider></v-divider>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Links</th>
                </tr>
                </thead>
              </template>
            </v-simple-table>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="ma-1">
            <v-toolbar flat dense>
              <v-card-subtitle>Check Lists</v-card-subtitle>
              <v-spacer></v-spacer>
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn color="success" dark v-on="on" v-bind="attrs" small icon>
                    <v-icon small>fa fa-plus</v-icon>
                  </v-btn>
                </template>
                <span>Añadir Tarea</span>
              </v-tooltip>
            </v-toolbar>
            <v-divider></v-divider>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Tareas</th>
                </tr>
                </thead>
              </template>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</v-card>
</template>

<script>
export default {
  name: "to_do_tarea_nueva",
  created() {
    this.$store.commit('todo/asignar_TITULO','Creando Nueva Tarea');
    this.$store.commit('todo/cargar_GRUPOS');
    this.cargar_usuarios();
  },
  data(){
    return{
      dialogoFechaI: false,
      dialogoFechaF: false,
      tarea:{
        fecha_finalizacion: '',
        fecha_inicio: '',
        grupo: '',
        titulo: '',
        detalle: '',
        user: [],
        archivos: [],
        links: [],
        checklist: []
      },
      users: [],
      load_user: true,
    }
  },
  computed:{
    GRUPOS() {
      return this.$store.state.todo.GRUPOS;
    },
    LOAD_GRUPOS() {
      return this.$store.state.todo.LOAD_GRUPOS;
    }
  },
  methods:{
    anadirArchivo(){
      let long =  this.tarea.archivos.length;
      this.tarea.archivos.push({
        key: long,
        file: null
      })
    },
    anadirLink(){
      let long =  this.tarea.links.length;
      this.tarea.links.push({
        key: long,
        link: null
      })
    },
    anadirTarea(){
      let long =  this.tarea.checklist.length;
      this.tarea.checklist.push({
        key: long,
        check: ''
      })
    },
    cargar_usuarios(){
      this.$axios.get('/usuarios').then((res)=>{
        this.users = res.data.usuarios;
        this.load_user = false;
      })
    },
  }
}
</script>

<style scoped>

</style>
