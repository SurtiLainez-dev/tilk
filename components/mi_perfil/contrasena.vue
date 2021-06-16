<template>
  <v-card flat>
    <v-card flat class="d-flex justify-center">
      <v-card width="40%" v-if="!isPassword">
        <v-form ref="FormVerPassword" v-on:submit.prevent>
          <v-toolbar flat><h6>Cambio de Contraseña</h6></v-toolbar>
          <v-divider></v-divider>
          <v-text-field label="Contraseña Actual" v-model="password"
                        :type="show ? 'text' : 'password'" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        class="input-group--focused ma-2" @click:append="show = !show"
                        :rules="[rule.required, rule.min]" @keypress.enter="verificarPassword"></v-text-field>
        </v-form>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="success" tile small @click="verificarPassword">Verificar Contraseña</v-btn>
        </v-card-actions>
      </v-card>

      <v-card width="40%" v-else>
        <v-toolbar flat><h6>Contraseña Nueva</h6></v-toolbar>
        <v-form ref="FormCambiarPasswors">
          <v-text-field label="Contraseña Nueva" v-model="newPassword"
                        :type="show1 ? 'text' : 'password'" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        class="input-group--focused ma-2" @click:append="show1 = !show1"
                        :rules="[rule.required, rule.min]"></v-text-field>
          <v-text-field label="Repetir Contraseña" v-model="repetPassword"
                        :type="show2 ? 'text' : 'password'" :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        class="input-group--focused ma-2" @click:append="show2 = !show2"
                        :rules="[rule.required, rule.min, rule.igual]"></v-text-field>
        </v-form>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="success" tile small @click="cambiarPassword">Cambiar Contraseña</v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "contrasena",
  data(){
    return{
      show: false,
      show1: false,
      show2: false,
      password: '',
      newPassword: '',
      repetPassword: '',
      isPassword: false,
      rule:{
        required: value => !!value || 'La contraseña es requerida',
        min: v => v.length >= 8 || 'Debe ingresar mínimo 8 carácteres',
        igual: value => this.newPassword === value || 'Las contraseñas deben coincidir'
      },
    }
  },
  computed:{
    VISTA:{
      get: function (){
        return this.$store.state.perfil.VISTA;
      },
      set: function (val){
        this.$store.commit('perfil/asignar_VISTA', val)
      }
    }
  },
  created() {
    this.$store.commit('activarOverlay', false);
  },
  methods:{
    cambiarPassword(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('mi_pefil/cambio_password',{
        password: this.newPassword,
        repetPassword: this.repetPassword
      }).then((res)=>{
        this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
        this.$store.commit('notificacion', {texto:'Tienes que volver a iniciar sesión', color:'warning'});
        this.cerrarSesion();
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        if (error.response.status === 422)
          this.$store.commit('notificacion', {texto:error.response.data.error, color:'error'});
        else
          this.$store.commit('notificacion', {texto:'Ha ocurrido un error en elservidor', color:'error'});
      })
    },
    cerrarSesion(){
      this.$axios.post('logout').then((res)=>{
        this.$store.commit("guardarToken", null);
        this.$store.commit("solicitud_credito/guardarToken", null);
        this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        },2000);
        this.VISTA = 1;
        this.$router.replace({path:'/'});
      }).catch((error)=>{
        this.$store.commit("guardarToken", null);
        this.$store.commit("solicitud_credito/guardarToken", null);
        this.$store.commit('notificacion', {texto:'Se ha cerrado sesión exitosamente', color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$router.replace({path:'/'});
      })
    },
    validarForm(){
      if (this.$refs.FormCambiarPasswors.validate())
        this.cambiarPassword();
      else
        this.$store.commit('notificacion',{texto:'Intoduce los datos requeridos', color:'error'});
    },
    verificarPassword(){
      if (this.$refs.FormVerPassword.validate()){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('mi_pefil/verificar_password',{
          password: this.password
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion', {texto: res.data.msj, color:'success'});
          this.isPassword = true;
          this.password   = '';
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          if (error.response.status === 422)
            this.$store.commit('notificacion', {texto:error.response.data.error, color:'error'});
          else
            this.$store.commit('notificacion', {texto:'Hubo un error en el servidor', color:'error'});

        })
      }else{
        this.$store.commit('notificacion',{texto:'Datos incorrectos', color:'warning'});
      }
    }
  }
}
</script>

<style scoped>

</style>
