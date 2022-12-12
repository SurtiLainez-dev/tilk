<template>
<v-card flat class="d-flex justify-center">
  <v-card width="95%" flat>
    <v-form ref="FormNuevaTarea">
      <v-row no-gutters>
        <v-col>
          <v-dialog ref="dialogoFechaInicio" v-model="dialogoFechaI" :return-value.sync="TAREA.fecha_inicio"
                    persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field dense class="ma-2" label="Fecha de inicio" v-bind="attrs" v-on="on"
                            hint="fecha en la que se habilitara la tarea al usuario asignado"
                            persistent-hint
                            v-model="TAREA.fecha_inicio"></v-text-field>
            </template>
            <v-date-picker v-model="TAREA.fecha_inicio" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogoFechaI = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.dialogoFechaInicio.save(TAREA.fecha_inicio)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col>
          <v-dialog ref="dialogoFechaFinal" v-model="dialogoFechaF" :return-value.sync="TAREA.fecha_finalizacion"
                    persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field dense class="ma-2" label="Fecha de cierre" v-bind="attrs" v-on="on"
                            hint="fecha en la que se le cierra la tarea al usuario asignado"
                            persistent-hint
                            v-model="TAREA.fecha_finalizacion"></v-text-field>
            </template>
            <v-date-picker v-model="TAREA.fecha_finalizacion" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogoFechaF = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.dialogoFechaFinal.save(TAREA.fecha_finalizacion)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col>
          <v-autocomplete dense label="Seleccionar un Grupo" :items="GRUPOS"
                          :rules="[rule.req]"
                          :item-value="'id'" :item-text="'nombre'" v-model="TAREA.grupo"
                          class="ma-2" :loading="LOAD_GRUPOS"></v-autocomplete>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="8">
          <v-text-field dense label="Título de la Tarea" :rules="[rule.req, rule.min, rule.max]"
                        v-model="TAREA.titulo" counter class="ma-2"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-autocomplete :loading="LOAD_ESTADOS" :items="ESTADOS" :item-value="'id'" :item-text="'nombre'"
                          :rules="[rule.req]" v-model="TAREA.estado"
                          dense label="Seleccionar un Estado" class="ma-2"></v-autocomplete>
        </v-col>
      </v-row>
      <v-textarea rows="3" dense label="Detalle de la Tarea" hint="Es detallar la tarea"
                  persistent-hint
                  :rules="[rule.req, rule.minD, rule.maxD]"
                    v-model="TAREA.detalle" counter class="ma-2"></v-textarea>
      <v-autocomplete label="Seleccionar Usuarios" v-model="TAREA.user" class="ma-2" :items="users"
                      :item-text="'usuario'" :item-value="'user'" dense persistent-hint
                      :loading="load_user" chips multiple hint="Sino seleccionas ningún usuario la tarea
                      será asignada a tí">
        <template v-slot:selection="data">
          <v-chip color="indigo" dark small v-bind="data.attrs" :input-value="data.selected"
              @click="data.select">{{ data.item.usuario }}</v-chip>
        </template>
      </v-autocomplete>

      <v-divider></v-divider>

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
                  <th style="width: 80%">Archivos</th>
                  <th style="width: 10%"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in TAREA.archivos">
                  <td>{{i+1}}</td>
                  <td>
                    <v-file-input v-if="item.cargado === 0" :rules="[rule.req]" dense v-model="item.file"></v-file-input>
                    <span v-else>Archivo cargado</span>
                  </td>
                  <td>
                    <v-btn small icon color="red"  class="text--white"
                           :disabled="item.cargado === 1" @click="deleteArchivo(item.key)"><v-icon x-small>fa fa-times</v-icon></v-btn>
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
                  <v-btn color="success" dark v-on="on" @click="anadirLink" v-bind="attrs" small icon>
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
                  <th style="width: 10%">#</th>
                  <th style="width: 80%">Links</th>
                  <th style="width: 10%"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in TAREA.links">
                  <td>{{i+1}}</td>
                  <td>
                    <v-text-field :rules="[rule.req]" dense v-model="item.link"></v-text-field>
                  </td>
                  <td>
                    <v-btn x-small icon dark color="red" @click="deleteLink(item.key)"><v-icon x-small>fa fa-times</v-icon></v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="ma-1">
        <v-toolbar flat dense>
          <v-card-subtitle>Check Lists</v-card-subtitle>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn color="success" dark v-on="on" v-bind="attrs" @click="anadirCheck" small icon>
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
              <th style="width: 5%">#</th>
              <th style="width: 50%">Tareas</th>
              <th style="width: 10%">Usuarios</th>
              <th style="width: 30%">Usuarios Seleccionados</th>
              <th style="width: 5%"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, i) in TAREA.checklist">
              <td>{{i + 1}}</td>
              <td>
                <v-text-field :rules="[rule.req]" v-model="item.check" dense></v-text-field>
              </td>
              <td>
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn dark text fab small color="indigo" v-on="on" v-bind="attrs"
                           @click="abrirDialogoUser(item)"><v-icon x-small>fa fa-user</v-icon></v-btn>
                  </template>
                  <span>Agregar Usuarios a la Tarea de la Lista</span>
                </v-tooltip>
              </td>
              <td>
                <v-tooltip v-for="val in item.usuarios" top>
                  <template v-slot:activator="{on, attrs}">
                    <v-avatar v-on="on" v-bind="attrs" class="ma-1" size="30" color="red">
                      <img v-if="val.img" :src="val.img" :alt="val.usuario">
                      <span v-else class="white--text text-h6" style="font-size: 15px !important;">{{val.usuario.substr(0,1)}}</span>
                    </v-avatar>
                  </template>
                  <span>{{val.nombres}} {{val.apellidos}}</span>
                </v-tooltip>
              </td>
              <td>
                <v-btn fab x-small icon color="red" @click="deleteChecklist(item.key)"><v-icon x-small>fa fa-times</v-icon></v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>

      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" dark tile small class="ma-2" @click="validarForm">Registrar Tarea</v-btn>
      </v-card-actions>


      <v-dialog v-model="dialogoUser" width="50%">
        <v-card>
          <v-container>
            <v-card-title>Seleccionando Usuarios de la Tareas #{{dataCheck.check}}</v-card-title>
            <v-card-subtitle>Los usuarios que seleccione esta tarea de lista actual, serán a los unicos que les estará
            disponible</v-card-subtitle>
            <v-data-table dense :headers="headersUser" :items="dataCheck.usuariosInfo"
                          v-model="dataCheck.usuarios" show-select item-key="usuario">
                <template v-slot:item.nombres="{item}">{{item.nombres}} {{item.apellidos}}</template>
            </v-data-table>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="success" class="ma-2" dark small tile @click="dialogoUser = false">OK</v-btn>
            </v-card-actions>
          </v-container>
        </v-card>

      </v-dialog>
    </v-form>
  </v-card>
</v-card>
</template>

<script>
export default {
  name: "to_do_tarea_nueva",
  created() {
    this.$store.commit('todo/cargar_GRUPOS');
    this.$store.commit('todo/cargar_ESTADOS');
    this.cargar_usuarios();
  },
  data(){
    return{
      headersUser: [
        {text:'Usuarios Disponibles', value:'usuario'},
        {text:'Nombres', value:'nombres'},
        {text:'Cargo', value:'puesto'},
      ],
      dialogoUser:  false,
      dataCheck: {},
      dialogoFechaI: false,
      dialogoFechaF: false,
      users: [],
      load_user: true,
      rule: {
        req: v => !!v || 'Campo requerido',
        min: v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 carácteres.',
        minD: v => (v && v.length >= 15) || 'Tiene que ser mayor a 15 carácteres.',
        max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
        maxD: v => (v && v.length <= 250) || 'Tiene que ser menor o igual a 100 carácteres.',
      },
    }
  },
  computed:{
    GRUPOS() {
      return this.$store.state.todo.GRUPOS;
    },
    LOAD_GRUPOS() {
      return this.$store.state.todo.LOAD_GRUPOS;
    },
    LOAD_ESTADOS() {
      return this.$store.state.todo.LOAD_ESTADOS;
    },
    ESTADOS() {
      return this.$store.state.todo.ESTADOS;
    },
    VISTA:{
      get: function (){
        return this.$store.state.todo.VISTA;
      },
      set: function (val){
        this.$store.commit('todo/cambiar_VISTA', val)
      }
    },
    TAREA:{
      get: function (){
        return this.$store.state.todo.TAREA;
      },
      set: function (val){
        return this.$store.commit('todo/asignar_TAREA')
      }
    },
    USUARIO(){
      return this.$store.state.usuario_id;
    },
  },
  methods:{
    abrirDialogoUser(data){
      data.usuariosInfo = [];
      let user = []
      this.TAREA.user.forEach((item)=>{
        user = this.users.filter(i=> i.user === item)
        data.usuariosInfo.push(user[0]);
      });
      this.dataCheck   = data;
      this.dialogoUser = true;
    },
    anadirArchivo(){
      let long =  this.TAREA.archivos.length;
      this.TAREA.archivos.push({
        key: long,
        file: null,
        cargado: 0
      })
    },
    anadirLink(){
      let long =  this.TAREA.links.length;
      this.TAREA.links.push({
        key: long,
        link: null
      })
    },
    anadirCheck(){
      let long =  this.TAREA.checklist.length;
      this.TAREA.checklist.push({
        key: long,
        check: '',
        estado: false,
        users: [],
        usuarios: [],
        usuariosInfo: [],
        disponible: 1,
      })
    },
    deleteArchivo(key){
      this.TAREA.archivos.splice(key, 1)
      this.TAREA.archivos.forEach( (i, item) => {
        i.key = item;
      });
    },
    deleteChecklist(key){
      this.TAREA.checklist.splice(key, 1)
      this.TAREA.checklist.forEach( (i, item) => {
        i.key = item;
      });
    },
    deleteLink(key){
      this.TAREA.links.splice(key, 1)
      this.TAREA.links.forEach( (i, item) => {
        i.key = item;
      });
    },
    cargar_usuarios(){
      this.$axios.get('/usuarios').then((res)=>{
        this.users = res.data.usuarios;
        this.load_user = false;
      })
    },
    ordenarCheck(){
      let tareas = [];//declramos la variable tarea
      let tareaUser = [];
      let check  = [];
      let estado = false;
      this.TAREA.checklist.forEach((item)=>{
          item.usuarios.forEach((i)=>{
            check = tareas.filter((val=>val.id === i.user));
            if (check.length > 0){
              tareaUser = this.TAREA.tareasUsers.filter((val)=>val.id_tarea == item.key && i.user == val.user_id);
              if (tareaUser.length > 0)
                estado = tareaUser[0].estado;

              tareas[check[0].key].checks.push({
                check: item.check,
                estado: estado,
                id_tarea: item.key
              });
            }else{
              tareaUser = this.TAREA.tareasUsers.filter((val)=>val.id_tarea == item.key && i.user == val.user_id);
              if (tareaUser.length > 0)
                estado = tareaUser[0].estado;

              tareas.push({
                id: i.user,
                checks: [{
                  check: item.check,
                  estado: estado,
                  id_tarea: item.key
                }],
                key: tareas.length
              })
            }
            estado = false;
          })
      })
      return tareas;
    },
    registrarTarea(){

      let tareas = this.ordenarCheck();
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      let cont = 0;
      for (let i in this.TAREA.archivos){
        if (this.TAREA.archivos[i].file && this.TAREA.archivos[i].cargado === 0) {
          data.append(`archivos[${cont}]`, this.TAREA.archivos[i].file);
          cont++;
        }
      }
      data.append('fecha_i', this.TAREA.fecha_inicio);
      data.append('fecha_f', this.TAREA.fecha_finalizacion);
      data.append('estado_id', this.TAREA.estado);
      data.append('grupo_id', this.TAREA.grupo);
      data.append('titulo', this.TAREA.titulo);
      data.append('detalle', this.TAREA.detalle);
      data.append('links', JSON.stringify(this.TAREA.links));
      data.append('usuarios', JSON.stringify(this.TAREA.user));
      data.append('check_list', JSON.stringify(this.TAREA.checklist));
      data.append('check_list_user', JSON.stringify(tareas));

      this.$axios({
        method: 'post',
        url: 'to_do/tareas',
        data: data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
        this.$store.commit('todo/cargar_TAREAS', this.USUARIO);
        this.VISTA = 1;
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    updateTarea(){
      let tareas = this.ordenarCheck();
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      let cont = 0;
      for (let i in this.TAREA.archivos){
        if (this.TAREA.archivos[i].file && this.TAREA.archivos[i].cargado === 0) {
          data.append(`archivos[${cont}]`, this.TAREA.archivos[i].file);
          cont++;
        }
      }
      let fecha_f = this.TAREA.fecha_finalizacion? this.TAREA.fecha_finalizacion : '';

      data.append('habilitacion', this.TAREA.fecha_inicio);
      data.append('finalizacion', fecha_f);
      data.append('estado', this.TAREA.estado);
      data.append('grupo', this.TAREA.grupo);
      data.append('titulo', this.TAREA.titulo);
      data.append('detalle', this.TAREA.detalle);
      data.append('links', JSON.stringify(this.TAREA.links));
      data.append('usuarios', JSON.stringify(this.TAREA.user));
      data.append('check_list', JSON.stringify(this.TAREA.checklist));
      data.append('check_list_user', JSON.stringify(tareas));

      this.$axios({
        method: 'post',
        url: `to_do/tareas/${this.TAREA.tarea}/update`,
        data: data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
        this.VISTA = 1;
        this.$store.commit('todo/cambiar_VISTAVIEW', 1);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    validarForm(){
      if (this.$refs.FormNuevaTarea.validate()) {
        if (this.TAREA.tipo === 1)
          this.registrarTarea();
        else if (this.TAREA.tipo === 2)
          this.updateTarea();
      }else
        this.$store.commit('notificacion',{texto:'Tienes datos pendientes', color:'warning'});
    }
  }
}
</script>

<style scoped>

</style>
