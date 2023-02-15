<template>
  <div>
    <div v-if="proceso">
      cargando.............
    </div>
    <div v-else>

      <div v-if="primeraVez" class="d-flex justify-center" width="80%">
        <inicio/>
      </div>
      <div v-else>
        <v-card class="mx-auto pt-2 pl-2 pr-2" flat>
          <v-toolbar flat>
            <v-toolbar-title><h1>TILK</h1></v-toolbar-title>
            <v-spacer></v-spacer>
            <img :src="require('~/assets/img/logo8.png')" alt="" width="100" height="50">
          </v-toolbar>
          <v-toolbar flat>
            <v-toolbar-title>Usuarios</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn  v-on="on" v-bind="attrs" color="pink" class="ma-1"
                        fab x-small dark @click="dialogoServidor = true">
                  <v-icon>fa fa-server</v-icon>
                </v-btn>
              </template>
              <span>Cambiar de servidor</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn  v-on="on" v-bind="attrs" @click="dialogUsuario = true" color="green" class="ma-1" fab x-small dark>
                  <v-icon>fa fa-user</v-icon>
                </v-btn>
              </template>
              <span>Iniciar sesión con otro suario</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn  v-on="on" @click="recuperacionPassword" v-bind="attrs" color="orange" fab class="ma-1" x-small dark>
                  <v-icon>fa fa-unlock-alt</v-icon>
                </v-btn>
              </template>
              <span>Recuperar contraseña</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn  v-on="on" v-bind="attrs" color="primary" fab x-small dark class="ma-1">
                  <v-icon>fa fa-history</v-icon>
                </v-btn>
              </template>
              <span>Historial de inicios de sesión</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="dialogo_dir = true"  v-on="on" v-bind="attrs" class="ma-1" color="red" fab x-small dark>
                  <v-icon>fa fa-folder</v-icon>
                </v-btn>
              </template>
              <span>Ruta de almacenamiento de archivos local</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="dialogoUtiliddes = true"  v-on="on" v-bind="attrs" class="ma-1" color="purple" fab x-small dark>
                  <v-icon>fa fa-folder</v-icon>
                </v-btn>
              </template>
              <span>Ruta de Utilidades de Tilk</span>
            </v-tooltip>
          </v-toolbar>
          <v-divider></v-divider>
          <v-row>
            <v-col class="d-flex justify-start flex-wrap mb-6">
              <v-card class="tarjetas" v-if="usuarios" @click="iniciarSesion(item.correo)"
                      v-for="item in usuarios" width="350px" height="80px">
                <v-row>
                  <v-col class="d-flex align-center justify-center" cols="3">
                    <v-avatar size="50" color="red">
                      <span class="white--text headline">{{item.correo}}</span>
                    </v-avatar>
                  </v-col>
                  <v-col class="correo d-flex align-center" cols="9">
                    {{item.correo}}
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </div>

      <v-dialog v-model="dialogUsuario" width="500">
        <v-card>
          <v-card-title>
            <span class="headline">Iniciar Sesión</span>
          </v-card-title>
          <v-container>
            <login v-if="dialogUsuario" :email="this.email"/>
          </v-container>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogoServidor" width="50%">
        <v-card>
          <v-card-title>Cambiando el Servidor de Datos</v-card-title>
          <hr>
          <v-form class="pl-3 pr-3">
            <v-row >
              <v-col cols="4"><v-autocomplete dense :items="servidores" label="Servidores"
                                              :item-value="'conexion'" :item-text="'alias'" v-model="server"></v-autocomplete></v-col>
              <v-col cols="5">
                <v-text-field dense disabled class="ma-1" v-model="server" label="Dirección del Servidor"></v-text-field>
              </v-col>
              <v-col cols="3" class="d-flex justify-end">
                <v-btn small dark color="success" @click="cambioServidor" tile>Cambiar de Servidor</v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="6"><v-text-field dense class="ma-2" v-model="nuevoservidor" label="IP Nueva"></v-text-field></v-col>
              <v-col cols="4"> <v-text-field dense v-model="aliasServidor" class="ma-2" label="Alias de la IP Nueva"></v-text-field></v-col>
              <v-col cols="2" class="d-flex justify-end">
                <v-btn color="success" tile small dark @click="guardarIP">Agregar IP</v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-btn color="orange" tile small dark @click="dialogoServidor = false">Cerrar</v-btn>
              </v-col>
            </v-row>
          </v-form>
          <br>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogo_dir" width="30%">
        <v-card>
          <v-toolbar color="grey lighten-3" flat>Almacenamiento Local</v-toolbar>
          <v-card-text>La ruta de almacenamiento local, es la ruta fisica del equipo donde se van almacenar
          los documentos generados por el sistema.</v-card-text>
          <v-card-text >Ruta actual: {{dir}}</v-card-text>
          <v-btn color="success" @click="open" block tile small dark>Seleccionar Carpeta</v-btn>
          <v-btn color="orange" @click="dialogo_dir = false" block tile small dark>Cerrar</v-btn>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogoUtiliddes" width="30%">
        <v-card>
          <v-toolbar color="grey lighten-3" flat>Ruta donde se encuentran las utilidades de TILK</v-toolbar>
          <v-card-text>La ruta de este programa permitira que Tilk pueda utilizar herramientas con documentos pdf.</v-card-text>
          <v-card-text >Ruta actual: {{dirUtilidades}}</v-card-text>
          <v-btn color="success" @click="openUtilidades" block tile small dark>Seleccionar Carpeta</v-btn>
          <v-btn color="orange" @click="dialogoUtiliddes = false" block tile small dark>Cerrar</v-btn>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="actualizacion" :timeout="60000">
        Se encontro una actualización. En breves momento se estará descargando.
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="actualizacion = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>

      <v-snackbar v-model="updater" :timeout="120000">
        La actualización ya se descargo completamente. Por favor reinicie la aplicación para instalar la nueva versión.
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="updater = false">
            Cerrar
          </v-btn>
          <v-btn color="pink" text v-bind="attrs" @click="reiniciarApp">
            Actualizar
          </v-btn>
        </template>
      </v-snackbar>
    </div>

  </div>
</template>

<script>
  import login from "../components/Login/login";
  import inicio from "../components/primeraVez/inicio";
  import {ipcRenderer} from 'electron'
  import Swal from 'sweetalert2'
export default {
  components:{inicio, login},
  layout:'inicio',
  data(){
    return{
      dialogoUtiliddes: false,
      nuevoservidor: '',
      primeraVez: null,
      proceso: false,
      usuarios: [],
      dialogUsuario: false,
      email: '',
      dialogoServidor: false,
      server: this.$axios.defaults.baseURL,
      actualizacion: false,
      updater: false,
      version: '',
      dialogo_dir: false,
      dir: '',
      dirUtilidades: '',
      servidores: [],
      aliasServidor: ''
    }
  },
  created() {

    this.dialogoServidor = false;
    ipcRenderer.send('traer-usuarios', 'w')
    ipcRenderer.on('usuarios', (e, data)=>{
      this.usuarios = data
      if (data <= 0){
        this.primeraVez = true
      }else if (data.length > 0){
        this.primeraVez = false
      }
    })
    this.proceso = false;

    ipcRenderer.on('recuperar-conexion-seleccionada', (e, data) => {
      localStorage.setItem('guardarConexion', data[0].conexion);
      this.$store.commit('guardarConexion', localStorage.getItem('guardarConexion'))
      this.$axios.defaults.baseURL = data[0].conexion
      this.server = data[0].conexion
    });

    ipcRenderer.on('recuperar-conexion', (e, data) => {
      this.servidores = data;
    });

    ipcRenderer.on('recuperar-almacenamiento',(e, data)=>{
      if (data) {
        this.dir = data;
        this.$store.commit('agregar_DIR', this.dir)
      }else this.dir = null
    });

    ipcRenderer.on('recuperar-almacenamientoUtil',(e, data)=>{
      if (data) {
        this.dirUtilidades = data;
        this.$store.commit('agregar_DIRUTILIDADES', this.dirUtilidades)
      }else this.dirUtilidades = null
    });

    ipcRenderer.send('app_version');

    ipcRenderer.on('app_version', (event, arg) => {
      localStorage.setItem('version', arg.version);
      this.$store.commit('guardarVERSION', localStorage.getItem('version'));
    });

  },
  methods:{
    open(){
      ipcRenderer.send('open__dialog_save_files', 1);
      ipcRenderer.on('recuperar-almacenamiento',(e, data)=>{
        this.dir = data;
        this.$store.commit('agregar_DIR', this.dir);

      })
    },
    openUtilidades(){
      ipcRenderer.send('open__dialog_save_files', 2);
      ipcRenderer.on('recuperar-almacenamiento',(e, data)=>{
        this.dir = data;
        this.$store.commit('agregar_DIRUTILIDADES', this.dirUtilidades);

      })
    },
    reiniciarApp(){
      ipcRenderer.send('restart_app', () => {

      });
    },
    cambioServidor(){
      ipcRenderer.send('addConexionSeleccionada', (this.server));
      this.$axios.defaults.baseURL = this.server;
      localStorage.setItem('guardarConexion', this.server);
      this.$store.commit('notificacion',{texto:'Se ha cambiado de IP exitosamente', color:'success'});

    },
    abrirDialogUsuario(){
      this.dialogUsuario = true
    },
    recuperacionPassword(){
      this.$router.replace({path:'/recuperacion/'})
    },
    guardarIP(){
      if (this.nuevoservidor.length > 5 && this.aliasServidor.length > 5){
        let data = {
          conexion: this.nuevoservidor,
          alias:    this.aliasServidor
        }
        ipcRenderer.send('add_conexion', (data));
        ipcRenderer.on('recuperar-conexion', (e, data) => {
          this.servidores = data
          this.nuevoservidor = '';
          this.aliasServidor = '';
          this.$store.commit('notificacion',{texto:'Se ha agregado la ip exitosamente', color:'success'});
        })
      }else{
        this.$store.commit('notificacion',{texto:'La ip del servidor y el alias deben ser mayores a 10 carácteres', color:'warning'})
      }
    },
    iniciarSesion(correo){
      this.dialogUsuario = true
      this.email = correo
    }
  }
}
</script>

<style>

  .tarjetas{
    padding: 5px;
    margin: 5px;
    cursor: pointer;
  }
  .tarjetas:hover{
    background-color: lightgrey;
  }
  .tooltip{
    margin-left: 2px;
    margin-right: 2px;
  }
</style>
