<template>
    <div>
      <h5 class="text-center">Credenciales del Usuario</h5>
      <v-divider></v-divider>
      <v-form ref="formLogin" class="form" v-model="valid" :lazy-validation="lazy">
        <v-text-field value="Surtidora Laínez" label="Nombre de la Empresa" disabled></v-text-field>
        <v-text-field v-model="Email" :rules="Login.rulesEmail" label="E-mail" required>
        </v-text-field>
        <v-text-field v-model="Login.password" :type="show ? 'text' : 'password'"
                      @keyup.enter="validate"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" label="Contraseña"
                      class="input-group--focused" @click:append="show = !show" :rules="[rule.required, rule.min]">
        </v-text-field>
        <v-row>
          <v-col cols="6">
            <nuxt-link to="/recuperacion/">¿Se te olvidó tu contraseña?</nuxt-link>
          </v-col>
          <v-col cols="6" class="d-flex flex-row-reverse">
            <v-btn @click="validate" :disabled="load" tile small color="success" dark>Iniciar Sesión</v-btn>
          </v-col>
        </v-row>
        <v-progress-linear v-if="load" indeterminate color="success"></v-progress-linear>
        <v-row v-if="isError">
          <v-col>
            <v-alert dense outlined type="error">
              {{error}}
            </v-alert>
          </v-col>
        </v-row>
      </v-form>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import qs from "qs";

    import Echo from "laravel-echo";
    // window.Pusher = require('pusher-js');
    //
    // window.Echo = new Echo({
    //   broadcaster: 'pusher',
    //   key: '75f5606b4af13fd6b44d',
    //   cluster: 'us2',
    //   forceTLS: false
    // })
    export default {
        name: "login",
        props:{email: String},
        data(){
          return{
            load: false,
            Email: this.email,
            valid: true,
            lazy: false,
            show: false,
            isError: false,
            error: null,
            rule:{
              required: value => !!value || 'La contraseña es requerida',
              min: v => v.length >= 8 || 'Debe ingresar mínimo 8 carácteres',
            },
            Login:{
              rulesEmail: [
                v => !!v || 'E-mail requerido',
                v => /.+@.+\..+/.test(v) || 'E-mail no valido',
              ],
              password: '',
            },
          }
        },
        methods:{
          validate(){
            if (this.$refs.formLogin.validate()){
              this.logear()
            }
          },
          logear(){
            this.load = true;
            return this.$axios({
              method: 'post',
              url: '/login',
              data: qs.stringify({
                email: this.Email,
                password: this.Login.password,
              }),
              headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'X-Requested-With': 'XMLHttpRequest'
              }
            }).then((res)=>{
              if (res.status === 200){
                this.isError = false
                this.error = null
                let permisos = []
                //guardando token, usuario, tipoUsuario, sucursal globalmente en la app
                localStorage.setItem('token', res.data.success.token);
                localStorage.setItem('miniToken', res.data.user.mini_token);
                localStorage.setItem('usuario', res.data.user.usuario);
                localStorage.setItem('usuario_id', res.data.user.id);
                localStorage.setItem('tipoUsuario', res.data.user.tipo_usuario_id);
                localStorage.setItem('sucursal', res.data.user.colaborador.sucursal.id);
                localStorage.setItem('estadoUsuario', res.data.user.estado);
                localStorage.setItem('sucursal_id', res.data.user.colaborador.sucursal.nombre);
                localStorage.setItem('colaborador', res.data.user.colaborador.nombres+' '+res.data.user.colaborador.apellidos)
                localStorage.setItem('impuesto', res.data.impuesto);
                for (let item in res.data.permisos){
                  if (!permisos.includes(res.data.permisos[item].mod)){
                    permisos.push(res.data.permisos[item].mod)
                    console.log(res.data.permisos[item].mod)
                  }
                }
                for (let item in res.data.permisos){
                  permisos.push(res.data.permisos[item].num)
                }
                localStorage.setItem('permisosUser', permisos);
                console.log(permisos)
                //guardando las variables globales en estados de vue
                this.$store.commit("guardarToken", localStorage.getItem('token'));
                this.$store.commit("solicitud_credito/guardarToken", localStorage.getItem('token'));
                this.$store.commit("guardarUsuario", localStorage.getItem('usuario'));
                this.$store.commit("guardarTipoUsuario", localStorage.getItem('tipoUsuario'));
                this.$store.commit("guardarSucursal", localStorage.getItem('sucursal'));
                this.$store.commit("guardarEstadoUsuario", localStorage.getItem('estadoUsuario'));
                this.$store.commit("guardarPermisos",      localStorage.getItem('permisosUser'));
                this.$store.commit("guardarColaborador",   localStorage.getItem('colaborador'));
                this.$store.commit("guardarMiniToken",     localStorage.getItem('miniToken'));
                this.$store.commit("asignarIdSucursal",    localStorage.getItem('sucursal_id'));
                this.$store.commit("guardarUsuarioId",     localStorage.getItem('usuario_id'));
                this.$store.commit("agregar_IMPUESTO",     localStorage.getItem('impuesto'));
                ipcRenderer.send('crear-usuario', this.Email)
                this.$axios.setToken(this.$store.state.token, 'Bearer')
                this.load = false;


                // window.Echo.channel('channel').listen('NewMessage', (res)=>{
                //   console.log(res)
                // })


                this.$router.replace({path:'/inicio/'});
              }
            }).catch((error)=>{
              this.isError = true
              try{
                if (error.response.status === 500){
                  this.error = 'Hubo un error en el servidor. [error status:500]'
                }
                if (error.response.status === 401){
                  this.error = error.response.data
                  console.log(error.response)
                  // this.erroresServidor.push(error.response.data)
                }if (error.response.status === 422){
                  console.log(error.response)
                  this.error = error.response.data
                  // this.erroresServidor.push(error.response.data)
                }
                this.load  = false;
              }catch (e) {
                this.error = 'Tiempo de espera agotado, el servidor tardo mucho en responder.'
                this.load  = false;
              }
            })
          },
        }
    }
</script>

<style scoped>

</style>
