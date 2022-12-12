<template>
<v-card flat>
  <v-row no-gutters>
    <v-col cols="8">
      <v-card-text>{{TAREA.detalle}}</v-card-text>
      <div style="height: 1px; width: 100%; background-color: #aaaaaa"></div>
      <v-card-text>{{TAREA.comentario? TAREA.comentario : 'No hay comentario del creador'}}</v-card-text>

      <v-divider></v-divider>

      <v-row>
        <v-col>
          <v-card flat>
            <v-card-subtitle>Check Lista</v-card-subtitle>
            <v-divider></v-divider>
            <v-progress-linear
                :dark="porcentajeTarea > 54"
                v-model="porcentajeTarea"
                :color="porcentajeTarea === 100? 'green' : 'blue-grey'"
                height="20"
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}%</strong>
              </template>
            </v-progress-linear>
            <table>
              <tbody>
              <tr v-if="USUARIO == TAREA.user_id && item.usuarios.length === 0 && item.usuariosInfo.length === 0"
                  v-for="(item, i) in checks">
                <td style="width: 70%; font-size: 12px">{{item.check}}</td>
                <td style="width: 20%; font-size: 12px">Propia </td>
                <td style="width: 10%">
                  <v-checkbox height="8" :disabled="item.disponible === 0"  dense v-model="item.estado"></v-checkbox>
                </td>
              </tr>
              <tr v-for="(item) in tareasNP" v-if="TAREA.user_id == USUARIO">
                <td style="width: 70%; font-size: 12px">{{item.check}}</td>
                <td style="width: 20%; font-size: 12px">{{item.user}}</td>
                <td style="width: 10%">
                  <v-checkbox height="8" disabled  dense v-model="item.estado"></v-checkbox>
                </td>
              </tr>
              <tr v-for="(item) in tareasPropia">
                <td style="width: 70%; font-size: 12px">{{item.check}}</td>
                <td style="width: 20%; font-size: 12px">{{item.user}}</td>
                <td style="width: 10%">
                  <v-checkbox height="8"  dense v-model="item.estado"></v-checkbox>
                </td>
              </tr>
              </tbody>
            </table>
          </v-card>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
          <v-card flat>
            <v-card-subtitle>Comentarios</v-card-subtitle>
            <v-divider></v-divider>
            <v-simple-table>
              <template >
                <thead>
                <tr>
                  <td>Comentario</td>
                  <td>Usuario</td>
                </tr>
                </thead>
                <tbody>
                <tr v-if="TAREA.comentarios" v-for="item in JSON.parse(TAREA.comentarios)">
                  <td style="width: 85%; font-size: 11px">{{item.comentario}}</td>
                  <td style="width: 15%; font-size: 10px">{{item.usuario}}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>
    </v-col>


    <v-col cols="4">
      <v-row no-gutters>
        <v-col class="d-flex justify-end">
          <v-chip class="ma-2" dark small :style="'background-color: '+TAREA.todo_grupo.color.substr(0,7)+' !important'">{{TAREA.todo_grupo.nombre}}</v-chip>
          <v-chip class="ma-2" dark small :style="'background-color: '+TAREA.todo_estado.color.substr(0,7)+' !important'">{{TAREA.todo_estado.nombre}}</v-chip>
        </v-col>
      </v-row>
      <v-card class="ma-2" outlined height="100%">
        <v-toolbar dense flat>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon v-on="on" v-bind="attrs"
                     @click="VISTA_INFO = 1"
                     color="pink"><v-icon small>fa fa-user</v-icon></v-btn>
            </template>
            <span>Información de Usuarios</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon v-on="on" v-bind="attrs"
                     @click="goEdit(TAREA)" v-if="parseInt(USUARIO) === parseInt(TAREA.user_id)"
                     color="warning"><v-icon small>mdi-circle-edit-outline</v-icon></v-btn>
            </template>
            <span>Editar Tarea</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon  v-on="on" v-bind="attrs"
                     @click="VISTA_INFO = 2"
                     color="orange"><v-icon small>fa fa-history</v-icon></v-btn>
            </template>
            <span>Ver Historial</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon v-on="on" v-bind="attrs"
                     @click="VISTA_INFO = 3"
                     color="red"><v-icon small>fa fa-file-pdf</v-icon></v-btn>
            </template>
            <span>Ver Archivos PDF</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile text icon v-on="on" v-bind="attrs"
                     @click="VISTA_INFO = 4" disabled
                     color="indigo"><v-icon small>fa fa-file-image</v-icon></v-btn>
            </template>
            <span>Ver Fotos</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon v-on="on" v-bind="attrs"
                     @click="VISTA_INFO = 5"
                     color="indigo"><v-icon small>fa fa-file</v-icon></v-btn>
            </template>
            <span>Agregar Documento</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon v-on="on" v-bind="attrs" @click="VISTA_INFO = 6"
                     color="indigo"><v-icon small>mdi-comment-text-outline</v-icon></v-btn>
            </template>
            <span>Agregar Comentario</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn small tile dark text icon v-on="on" v-bind="attrs"
                     @click="VISTA_INFO = 7"
                     v-if="estadoSave === 1"
                     color="success"><v-icon small>mdi-content-save</v-icon></v-btn>
            </template>
            <span>Guardar Cambios</span>
          </v-tooltip>
        </v-toolbar>

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
                <th>{{i+1}}: {{item.user.usuario}} </th>
                <th>
                  <v-chip x-small dark v-if="item.estado === 1" color="red">Pendiente</v-chip>
                  <v-chip x-small dark v-else-if="item.estado === 0" color="success">Terminada</v-chip>
                </th>
                <th>
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-if="item.estado === 0" small tile icon text @click="cambiarEstado(item.user_id)"
                             color="success" v-on="on" v-bind="attrs">
                        <v-icon small>mdi-content-save</v-icon>
                      </v-btn>
                    </template>
                    <span>Cambiar a estedo pendiente</span>
                  </v-tooltip>
                </th>
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
        <v-card flat v-else-if="VISTA_INFO === 2">
          <v-card-subtitle>Historial de la Tarea</v-card-subtitle>

          <v-data-table dense :headers="headerHistorial" :items="historial" >
            <template v-slot:item.comentario="{item}"><span style="font-size: 10px !important;">{{item.comentario}} - {{item.usuario}}</span></template>
            <template v-slot:item.fecha="{item}"><span style="font-size: 9px">{{item.fecha}}</span></template>
          </v-data-table>
        </v-card>
        <v-card flat v-else-if="VISTA_INFO === 3">
          <v-card-subtitle>Archivos PDFs</v-card-subtitle>
          <v-divider></v-divider>
          <v-simple-table class="ma-2">
            <template>
              <thead><tr>Documentos</tr></thead>
              <tbody>
                <tr v-for="(item, i) in pdfs">
                  <td><b-link @click="verDocumento(item)">Documento {{i+1}}</b-link></td>
                </tr>
              </tbody>
            </template>
            <template>
              <thead><tr>Links</tr></thead>
              <tbody>
              <tr v-if="TAREA.links" v-for="(item, i) in JSON.parse(TAREA.links)">
                <td><b-link @click="verLink(item.link)">Link {{i+1}}</b-link></td>
              </tr>
              </tbody>
            </template>
            <template>
              <thead><tr>Fotos</tr></thead>
              <tbody>
              <tr v-for="(item, i) in imgs">
                <td><b-link @click="verDocumento(item)">Foto {{i+1}}</b-link></td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
        <v-card flat v-else-if="VISTA_INFO === 4">
          <v-card-subtitle>Imagenes</v-card-subtitle>
          <v-divider></v-divider>


        </v-card>
        <v-card flat v-else-if="VISTA_INFO === 5">
          <v-card-subtitle>Agregando un Documentos</v-card-subtitle>
          <v-file-input label="Cargar documento" accept="application/pdf, image/*" class="ma-2" v-model="file" dense></v-file-input>
          <v-card-actions class="d-flex justify-end">
            <v-btn small dark tile color="success" class="ma-2" @click="addFile">Cargar Documento</v-btn>
          </v-card-actions>
        </v-card>
        <v-card flat v-else-if="VISTA_INFO === 6">
          <v-card-subtitle>Agregar Comentario</v-card-subtitle>
          <v-divider></v-divider>
          <v-text-field dense class="ma-2" label="Comentario" v-model="comentario"></v-text-field>

          <v-card-actions class="d-flex justify-end">
            <v-btn class="ma-2" dark small tile color="success" @click="addComentario">Registrar Comentario</v-btn>
          </v-card-actions>
        </v-card>
        <v-card flat v-else-if="VISTA_INFO === 7">
          <v-card-subtitle>Guardar Registro</v-card-subtitle>
          <v-divider></v-divider>
          <v-textarea dense class="ma-2" label="Comentario del Creador"
                      :counter="10"
                      v-model="TAREA.comentario" outlined rows="3"
                      v-if="parseInt(USUARIO) === parseInt(TAREA.user_id)"></v-textarea>
          <v-select dense label="Tarea Cerrada" class="ma-2" :items="itemsCierre"
                    v-model="cierre" outlined ></v-select>
          <v-autocomplete dense label="Seleccionar un Estado" :items="ESTADOS"
                          :item-value="'id'" :item-text="'nombre'"
                          v-model="estado"
                          v-if="parseInt(USUARIO) === parseInt(TAREA.user_id)"
                          class="ma-2" outlined></v-autocomplete>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn small dark color="success" @click="redireccionarFormulario" tile>Registrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-col>
  </v-row>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "to_do_tarea_info",
  created() {
    this.VISTA_INFO = 1;
    this.acomodarArchivos();
    if (this.TAREA.todo_tarea_user){
      this.TAREA.todo_tarea_user.forEach((item)=>{
        if (this.USUARIO == this.TAREA.user_id){
          if (item.checks){
            JSON.parse(item.checks).forEach((i)=>{
              this.tareasNP.push({
                user: item.user.usuario,
                check: i.check,
                estado: i.estado,
                user_id: item.user_id,
                id_tarea: i.id_tarea
              })
              if (i.estado === true || i.estado === 'true' || i.estado === 1)
                this.tareasHechas = parseInt(this.tareasHechas) + 1;
            })
          }
        }else if (this.USUARIO == item.user_id){
          if (item.checks){
            JSON.parse(item.checks).forEach((i)=>{
              this.tareasPropia.push({
                user: item.user.usuario,
                check: i.check,
                estado: i.estado,
                user_id: item.user_id,
                id_tarea: i.id_tarea
              })
              if (i.estado === true || i.estado === 'true' || i.estado === 1)
                this.tareasHechas = parseInt(this.tareasHechas) + 1;
            })
          }
        }
      });
    }

    this.$store.state.todo.TAREA.tipo = 1;
    this.$store.commit('todo/cargar_ESTADOS');
    this.estado = this.TAREA.todo_estado_id;
    this.cierre = this.TAREA.estado;

    if (this.TAREA.check_list)
      this.checks = JSON.parse(this.TAREA.check_list)

    this.calcularPorcentajeTareas();

    if (this.USUARIO == this.TAREA.user_id)
      this.estadoSave = this.TAREA.estado;
    else{
      let tareaUser = this.TAREA.todo_tarea_user.filter((item)=>item.user_id == this.USUARIO);
      this.estadoSave = tareaUser[0].estado;
    }

    if (this.estadoSave === 0)
      this.$store.commit('notificacion',{texto:'Esta tarea esta cerrada para tí.', color:'warning'})

  },
  data(){
    return{
      porcentajeTarea: 0,
      totalTareas: 0,
      tareasHechas: 0,
      headerHistorial:[
        {text:'Historial', value: 'comentario'},
        {text:'Fecha', value: 'fecha'},
      ],
      pdfs: [],
      imgs: [],
      tareasNP: [],
      tareasPropia: [],
      tareasCreador: [],
      comentario: '',
      load: false,
      file: null,
      foto: null,
      estado: 0,
      cierre: 0,
      itemsCierre:[
        {text:'Cerrada', value:0},
        {text:'Pendiente', value:1},
      ],
      checks: [],
      estadoSave: 0,
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
    historial(){
      return JSON.parse(this.TAREA.historial);
    },
    ESTADOS() {
      return this.$store.state.todo.ESTADOS;
    },
  },
  methods:{
    acomodarArchivos(){
      if (this.TAREA.archivos){
        let files = JSON.parse(this.TAREA.archivos);
        files.forEach((item)=>{
          if (item.split('.')[1] == 'pdf') {
            this.pdfs.push(item);
          }else {
            this.imgs.push(item);
          }
        })
      }
    },
    addComentario(){
      if (this.comentario.length > 7){
        this.$store.commit('activarOverlay', true);
        this.$axios.post(`to_do/tarea/edit/${this.TAREA.id}/comentario`,{
          comentario: this.comentario
        }).then((res)=>{
          this.VISTA_INFO = 1;
          this.$store.commit('todo/asignar_TAREAINFO', res.data.tarea);
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          this.comentario = '';
          this.$store.commit('activarOverlay', false);
        })
      }else{
        this.$store.commit('notificacion',{texto:'El comentario tiene que ser mayor a 8 letras.', color:'warning'});
      }
    },
    addFile(){
      if (this.file){
        this.$store.commit('activarOverlay', true);
        let data = new FormData();
        data.append('id', this.TAREA.id);
        data.append('file', this.file);
        this.$axios({
          method: 'post',
          url: `to_do/tarea/${this.TAREA.id}/documento`,
          data: data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.VISTA_INFO = 1;
          this.$store.commit('todo/asignar_TAREAINFO', res.data.tarea);
          this.acomodarArchivos();
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          this.file = null;
        })
      }else{
        this.$store.commit('notificacion',{texto:'No se ha seleccionado un documento', color:'warning'});
      }
    },
    calcularPorcentajeTareas(){
      if (this.USUARIO == this.TAREA.user_id) {
        this.totalTareas = this.tareasNP.length;
        if (this.TAREA.check_list){
          JSON.parse(this.TAREA.check_list).forEach((item)=>{
            if (item.estado == true || item.estado == 1)
              this.tareasHechas = parseInt(this.tareasHechas) + 1;
            if (item.usuarios.length === 0)
              this.totalTareas = parseInt(this.totalTareas) + 1;
          })
        }
      }else
        this.totalTareas = this.tareasPropia.length;

      if (this.totalTareas > 0)
        this.porcentajeTarea = ((this.tareasHechas * 100)/this.totalTareas).toFixed(2);
      else
        this.porcentajeTarea = 100;
    },
    cambiarEstado(user){
      this.$store.commit('activarOverlay',  true);
      this.$axios.put(`to_do/tarea/${this.TAREA.id}/cambiar_estado/usuario/${user}`).then((res)=>{
        this.$store.commit('todo/asignar_TAREAINFO', res.data.tarea);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
      })
    },
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

      let tareasChecks  = []
      if (this.TAREA.check_list){
        let tareas = JSON.parse(this.TAREA.check_list);
        tareas.forEach((item, i)=>{
          tareasChecks.push({
            key: i,
            check: item.check,
            estado: item.estado,
            users: item.users,
            usuarios: item.usuarios,
            usuariosInfo: item.usuariosInfo,
            disponible: item.disponible
          })
        })
      }
      this.TAREAE.checklist   = tareasChecks;
      this.TAREAE.tareasUsers = this.tareasNP;

      this.$store.commit('todo/asignar_TITULO', 'Editanto Tarea: #'+data.titulo);
      this.$store.commit('todo/cambiar_VISTA', 6);
    },
    redireccionarFormulario(){
      if (this.TAREA.user_id == this.USUARIO){
        if (this.cierre === 1 || ((this.TAREA.comentario || this.TAREA.comentario.length > 10) && this.cierre === 0))
          this.registrarTareaUsuarioCreador();
        else
          this.$store.commit('notificacion',{texto:'Escribir un comentario de cierre explicativo', color:'warning'})
      }else
        this.registrarTareaUsuarioAsignada();
    },
    registrarTareaUsuarioCreador(){
      this.$store.commit('activarOverlay', true);
      this.$axios.put(`to_do/tarea/${this.TAREA.id}/cierre/usuario_creador`, {
        cierre: this.cierre,
        estado: this.estado,
        comentario: this.TAREA.comentario,
        tareas:     JSON.stringify(this.checks)
      }).then((res)=>{
        this.$store.commit('todo/cargar_TAREAS', this.USUARIO);
        this.$store.state.todo.VISTA_VIEW = 1;
        this.$store.state.todo.TITULO     = 'Tareas';
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    registrarTareaUsuarioAsignada(){
      this.$store.commit('activarOverlay', true);
      this.$axios.put(`to_do/tarea/${this.TAREA.id}/cierre/usuario/${this.USUARIO}`,{
        tareasP: this.tareasPropia,
        tareas:  this.checks,
        cierre: JSON.stringify(this.cierre)
      }).then((res)=>{
        this.$store.commit('todo/cargar_TAREAS', this.USUARIO);
        this.$store.state.todo.VISTA_VIEW = 1;
        this.$store.state.todo.TITULO     = 'Tareas';
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay',  true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento',color:'error'})
        this.$store.commit('activarOverlay', false);
      })
    },
    verLink(URL){
      ipcRenderer.send('pint_navegador', URL);
    }
  }
}
</script>

<style scoped>

</style>
