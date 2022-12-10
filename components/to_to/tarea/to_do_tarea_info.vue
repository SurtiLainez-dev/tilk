<template>
<v-card flat>
  <v-row no-gutters>
    <v-col cols="8">
      <v-row no-gutters>
        <v-col>
          <v-card class="ma-2" outlined>
            <v-row no-gutters>
              <v-col><v-card-subtitle>Grupo</v-card-subtitle></v-col>
              <v-col><v-card-subtitle>{{TAREA.todo_grupo.nombre}}</v-card-subtitle></v-col>
            </v-row>
            <div :style="'width: 100%; height: 5px; background-color: '+TAREA.todo_grupo.color.substr(0,7)+' !important'"></div>
          </v-card>
        </v-col>

        <v-col>
          <v-card class="ma-2">
            <v-row no-gutters>
              <v-col><v-card-subtitle>Estado</v-card-subtitle></v-col>
              <v-col><v-card-subtitle>{{TAREA.todo_estado.nombre}}</v-card-subtitle></v-col>
            </v-row>
            <div :style="'width: 100%; height: 5px; background-color: '+TAREA.todo_estado.color.substr(0,7)+' !important'"></div>
          </v-card>
        </v-col>
      </v-row>
      <v-textarea dense :value="TAREA.detalle" class="ma-2" outlined disabled rows="2" label="Detalle de la Tarea"></v-textarea>
      <v-textarea dense class="ma-2" outlined rows="4" label="Comentarios"></v-textarea>

      <v-divider></v-divider>

      <v-card flat>
        <v-row no-gutters v-if="item.usuarios.length === 0 && item.usuariosInfo.length === 0 && USUARIO == TAREA.user_id"
               v-for="(item, i) in JSON.parse(TAREA.check_list)">
          <v-col>
            <v-row no-gutters><v-col><span class="ma-1">Tareas Propias</span></v-col></v-row>
            <v-row no-gutters>
              <v-col cols="10" class="d-flex align-center"><span class="ma-2">{{item.check}}</span></v-col>
              <v-col cols="2"><v-checkbox :disabled="item.disponible === 0"  dense v-model="item.estado"></v-checkbox></v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card-actions class="d-flex justify-end">
                  <v-btn color="success" small tile dark class="ma-2">Guardar Cambios</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters v-for="(item) in TAREA.todo_tarea_user" v-if="item.user_id == USUARIO">
          <v-col>
            <v-card  flat >
              <v-row no-gutters><v-col><span class="ma-1"><strong>Tareas de {{item.user.usuario}}</strong></span></v-col></v-row>
              <v-divider></v-divider>
              <v-row no-gutters v-for="i in JSON.parse(item.checks)">
                <v-col cols="10" class="d-flex align-center"><span class="ma-2">{{i.check}}</span></v-col>
                <v-col cols="2"><v-checkbox dense v-model="i.estado" ></v-checkbox></v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row>
                <v-col>
                  <v-card-actions class="d-flex justify-end">
                    <v-btn color="success" small tile dark class="ma-2">Guardar Cambios</v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-card>

      <v-row v-if="USUARIO == TAREA.user_id" no-gutters v-for="(item) in TAREA.todo_tarea_user">
        <v-col>
          <v-card outlined flat >
            <v-row no-gutters><v-col><span class="ma-1">{{item.user.usuario}}</span></v-col></v-row>
            <v-row no-gutters v-for="i in JSON.parse(item.checks)">
              <v-col cols="10" class="d-flex align-center"><span class="ma-2">{{i.check}}</span></v-col>
              <v-col cols="2"><v-checkbox dense v-model="i.estado" disabled></v-checkbox></v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4">
      <v-card class="ma-2" outlined height="100%">
        <v-toolbar dense flat>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon v-on="on" v-bind="attrs"
                     @click="VISTA_INFO = 1"
                     color="pink"><v-icon small>fa fa-user</v-icon></v-btn>
            </template>
            <span>Información de Usuarios {{TAREA.user_id}} - {{USUARIO}}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon v-on="on" v-bind="attrs"
                     @click="goEdit(TAREA)" v-if="parseInt(USUARIO) === parseInt(TAREA.user_id)"
                     color="warning"><v-icon small>fa fa-edit</v-icon></v-btn>
            </template>
            <span>Editar Tarea</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon  v-on="on" v-bind="attrs"
                     color="grey"><v-icon small>fa fa-history</v-icon></v-btn>
            </template>
            <span>Ver Historial</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon v-on="on" v-bind="attrs" v-if="pdfs.length > 0"
                     color="red"><v-icon small>fa fa-file-pdf</v-icon></v-btn>
            </template>
            <span>Ver Archivos PDF</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon v-on="on" v-bind="attrs" v-if="imgs.length > 0"
                     color="indigo"><v-icon small>fa fa-file-image</v-icon></v-btn>
            </template>
            <span>Ver Fotos</span>
          </v-tooltip>
        </v-toolbar>
        <v-divider></v-divider>

        <v-card flat v-if="VISTA_INFO === 1">
          <v-card-subtitle>Usuario Creador</v-card-subtitle>
          <v-simple-table dense>
            <template>
              <tbody>
              <tr><th>{{TAREA.user.usuario}}</th></tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-card-subtitle>Usuarios Agregados</v-card-subtitle>
          <v-simple-table dense>
            <template>
              <tbody>
              <tr v-for="(item, i) in TAREA.todo_tarea_user">
                <th>{{i+1}}: {{item.user.usuario}}</th>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-card-subtitle>Documentos</v-card-subtitle>
          <v-simple-table dense>
            <template>
              <tbody>
              <tr>
                <th v-if="pdfs.length > 0">Pdfs: Hay {{pdfs.length}} documento(s)</th>
                <th v-else>Pdfs: No hay documentos</th>
              </tr>
              <tr>
                <th v-if="imgs.length > 0">Imagenes: Hay {{imgs.length}} item(s)</th>
                <th v-else>Imagenes: No hay fotos</th>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</v-card>
</template>

<script>
export default {
  name: "to_do_tarea_info",
  created() {
    this.VISTA_INFO = 1;
    if (this.TAREA.archivos){
      let files = JSON.parse(this.TAREA.archivos);
      files.forEach((item)=>{
        if (item.split('.')[1] == 'pdf')
          this.pdfs.push(item);
        else
          this.imgs.push(item);
      })
    }
  },
  data(){
    return{
      pdfs: [],
      imgs: []
    }
  },
  computed:{
    TAREA:{
      get: function (){
        return this.$store.state.todo.INFO;
      },
      set: function (data){
        this.$store.commit('todo/asignar_TAREA', data);
      }
    },
    VISTA_INFO:{
      get: function (){
        return this.$store.state.todo.VISTA_INFO;
      },
      set: function (vista){
        this.$store.commit('todo/cambiar_VISTAINFO', vista);
      }
    },
    TAREAE: {
      get:function (){
        return this.$store.state.todo.TAREA;
      },
      set: function (data){
        this.$store.commit('todo/asignar_TAREA', data);
      }
    },
    USUARIO(){
      return this.$store.state.usuario_id;
    },
  },
  methods:{
    goEdit(data){
      this.TAREAE.titulo = data.titulo;
      this.TAREAE.detalle = data.detalle;
      this.TAREAE.fecha_inicio = data.habilitacion;
      this.TAREAE.fecha_finalizacion = data.finalizacion;
      this.TAREAE.user    = JSON.parse(data.usuarios);
      this.TAREAE.grupo = data.todo_grupo_id;
      this.TAREAE.estado = data.todo_estado_id;
      this.TAREAE.links     = JSON.parse(data.links);
      let files = [];
      if (data.archivos){
        let f = JSON.parse(data.archivos);
        f.forEach((item, i)=>{
          files.push({
            key: i,
            file: item,
            cargado: 1
          })
        })
        this.TAREAE.archivos = files;
      }else{
        this.TAREAE.arhivos = [];
      }
      this.TAREAE.checklist    = JSON.parse(data.check_list);
      this.TAREAE.tipo      = 2;
      this.TAREAE.tarea     = data.id;
      // this.$store.commit('todo/asignar_TITULO', 'Editanto Tarea: #'+this.TAREA.titulo);
      // this.$store.commit('todo/cambiar_VISTA', 6);
      console.log(this.TAREA.todo_tarea_user)

    }
  }
}
</script>

<style scoped>

</style>
