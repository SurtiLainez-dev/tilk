<template>
  <div>
    <div v-if="proceso">
      cargando.............
    </div>
    <div v-else class="containerP" >

      <div v-if="primeraVez" class="d-flex justify-center" width="80%">
        <inicio/>
      </div>
      <div v-else>
        <v-card class="mx-auto pt-2 pl-2 pr-2" width="500px">
          <v-row>
            <v-col cols="6" class="d-flex align-self-center"><h2>TILK</h2></v-col>
            <v-col cols="6" class="d-flex justify-end align-self-center">
              <img :src="require('~/assets/img/logo8.png')" alt="" width="100" height="50">
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col class="d-flex justify-start">
              <div class="pl-2 pr-2">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn  v-on="on" v-bind="attrs" color="pink"
                            fab x-small dark @click="dialogoServidor = true">
                      <v-icon>fa fa-server</v-icon>
                    </v-btn>
                  </template>
                  <span>Cambiar de servidor</span>
                </v-tooltip>
              </div>
              <div class="pl-2 pr-2" @click="abrirDialogUsuario">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn  v-on="on" v-bind="attrs" color="green" fab x-small dark>
                      <v-icon>fa fa-user</v-icon>
                    </v-btn>
                  </template>
                  <span>Iniciar sesión con otro suario</span>
                </v-tooltip>
              </div>
              <div class="pl-2 pr-2" @click="recuperacionPassword">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn  v-on="on" v-bind="attrs" color="orange" fab x-small dark>
                      <v-icon>fa fa-unlock-alt</v-icon>
                    </v-btn>
                  </template>
                  <span>Recuperar contraseña</span>
                </v-tooltip>
              </div>
              <div class="pl-2 pr-2">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn  v-on="on" v-bind="attrs" color="primary" fab x-small dark>
                      <v-icon>fa fa-history</v-icon>
                    </v-btn>
                  </template>
                  <span>Historial de inicios de sesión</span>
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <strong>Iniciar Sesión con:</strong>
          <v-row>
            <v-col class="d-flex justify-center flex-wrap mb-6">
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
            <login :email="this.email"/>
          </v-container>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogoServidor" width="40%">
        <v-card>
          <v-card-title>Cambiando el Servidor de Datos</v-card-title>
          <hr>
          <v-form class="pl-3 pr-3">
            <v-text-field v-model="server" label="Dirección del Servidor"></v-text-field>
          </v-form>
          <v-card-actions class="d-flex justify-end">
            <v-btn small dark color="orange" @click="cambioServidor">Cambiar de Servidor</v-btn>
          </v-card-actions>
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
      primeraVez: null,
      proceso: false,
      usuarios: [],
      dialogUsuario: false,
      email: '',
      dialogoServidor: false,
      server: this.$axios.defaults.baseURL,
      actualizacion: false,
      updater: false,
      version: ''
    }
  },
  created() {
    ipcRenderer.send('traer-usuarios', 'w')
    ipcRenderer.on('usuarios', (e, data)=>{
      this.usuarios = data
      console.log(data)
      if (data <= 0){
        this.primeraVez = true
      }else if (data.length > 0){
        this.primeraVez = false
      }
    })
    this.proceso = false;

    ipcRenderer.on('recuperar-conexion', (e, data) => {
      console.log(data)
      localStorage.setItem('guardarConexion', data.conexion);
      this.$store.commit('guardarConexion', localStorage.getItem('guardarConexion'))
      this.$axios.defaults.baseURL = data.conexion
      this.server = data.conexion
    });

    ipcRenderer.on('update_available', () => {
      console.log("")
      this.actualizacion = true;
    });

    ipcRenderer.on('update_downloaded', (e, data) => {
      this.updater = true;
    });

    ipcRenderer.send('app_version');

    ipcRenderer.on('app_version', (event, arg) => {
      console.log('Version ' + arg.version)
      this.version = arg.version;
    });

  },
  methods:{
    reiniciarApp(){
      ipcRenderer.send('restart_app', () => {

      });
    },
    cambioServidor(){
      this.dialogoServidor = false;
      ipcRenderer.send('add_conexion', (this.server));
      ipcRenderer.on('recuperar-conexion', (e, data) => {
        this.$axios.defaults.baseURL = this.server;
        localStorage.setItem('guardarConexion', this.server);
        Swal.fire(
          'Cambio Exitoso',
          `Se ha cambiado la dirección del servidor exitosamente a ${this.server}`,
          'success'
        );
      })
    },
    abrirDialogUsuario(){
      this.dialogUsuario = true
    },
    recuperacionPassword(){
      this.$router.replace({path:'/recuperacion/'})
    },
    iniciarSesion(correo){
      this.dialogUsuario = true
      this.email = correo
    }
  }
}
</script>

<style>
  .containerP{
    margin-top: 100px;
  }
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
