<template>
  <div class="container mt-10">
    <v-container class="d-flex justify-center" >
      <v-card width="50%" >
        <v-card-title >
          Contraseña Nueva
        </v-card-title>
        <v-divider></v-divider>
        <div class="pl-3 pr-3">
          <v-row>
            <v-col cols="12"><strong>Usuario: </strong> {{datos.usuario}}</v-col>
          </v-row>
          <v-row><v-col><strong>Nombre: </strong> {{datos.nombres}}</v-col></v-row>
        </div>
        <v-divider></v-divider>
        <v-form class="form" ref="FormCambiocontrasena">
          <v-container>
            <v-row>
              <v-col >
                <v-text-field v-model="password" :type="show ? 'text' : 'password'"
                              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" label="Contraseña Nueva"
                              class="input-group--focused" @click:append="show = !show" :rules="[rule.required, rule.min]">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="password2" :type="show2 ? 'text' : 'password'"
                              :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" label="Repetir Contraseña"
                              class="input-group--focused" @click:append="show2 = !show2" :rules="[rule.igual]">
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions class="d-flex justify-end">
            <v-btn class="mt-3" color="orange" :disabled="isPeticion"
                   dark @click="validate">Cambiar Contraseña</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  import Swal from 'sweetalert2'
  export default {
    layout:'recuperacion',
    data(){
      return{
        repeatPassword: null,
        isPeticion:false,
        show: false,
        show2: false,
        password:'',
        password2: '',
        rule:{
          required: value => !!value || 'La contraseña es requerida',
          min: v => v.length >= 8 || 'Debe ingresar mínimo 8 carácteres',
          igual: value => this.password === value || 'Las contraseñas deben coincidir'
        },
      }
    },
    methods:{
      validate(){
        if (this.$refs.FormCambiocontrasena.validate())
          this.registrarPasswords()
      },
      registrarPasswords(){
        this.isPeticion = true
        this.$axios.post('/cambio_password',{
          usuario:        this.datos.usuario,
          password:       this.password,
          repeatPassword: this.password2
        }).then((res)=>{
          this.isPeticion = false
          if (res.status === 200){
            Swal.fire(
              'Cambío Exitoso',
              'La contraseña se ha cambiado exitosamente.',
              'success'
            )
            this.$router.replace({path:'/'})
          }
        }).catch((error)=>{
          this.isPeticion = false
          this.erroresServidor.push(error.response.data)
        })
      },
    },
    asyncData({ store, $axios, route}){
      return $axios.get('/reponer/'+route.params.recuperacion,{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then( res =>{
        return {
          datos: res.data
        }
      })
    }
  }
</script>

<style scoped>

</style>
