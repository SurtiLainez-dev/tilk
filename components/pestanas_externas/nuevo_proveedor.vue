<template>
<v-card flat tile class="pl-2 pr-2 d-flex justify-center">
  <v-card flat tile :elevation="3" class="pl-2 pr-2" width="70%">
  <v-card-title>Creando Proveedor</v-card-title>
  <v-divider></v-divider>
  <v-form ref="FormNuevoProveedor">
    <v-row>
      <v-col md="7" cols="12">
        <v-text-field  :counter="100" v-model="proveedor.nombre"
                       :rules="[rules.nombre.req,rules.nombre.min,rules.nombre.max]"
                       label="Nombre del Proveedor"  required></v-text-field>
      </v-col>
      <v-col md="5" cols="12">
        <v-text-field  :counter="20"  v-model="proveedor.rtn"
                       :rules="[rules.identidad.some, rules.nombre.req]"
                       label="Rtn del Proveedor"  required></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4" cols="12">
        <v-text-field  :counter="9"  v-model="proveedor.swift" :rules="[rules.swift.some]"
                       label="Swift del Proveedor"  required></v-text-field>
      </v-col>
      <v-col md="4" cols="12">
        <v-text-field  :counter="60"  v-model="proveedor.email"
                       :rules="[rules.email.email, rules.email.max]"
                       label="E-mail del Proveedor"  required></v-text-field>
      </v-col>
      <v-col md="4" cols="12">
        <v-text-field  :counter="20"  v-model="proveedor.telefono"
                       :rules="[rules.nombre.req, rules.tel.min, rules.tel.max]"
                       label="Telefono del Proveedor"  required></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4" cols="12">
        <v-text-field  :counter="30"  v-model="proveedor.pais"
                       :rules="[rules.nombre.req]"
                       label="País"  required></v-text-field>
      </v-col>
      <v-col md="4" cols="12">
        <v-text-field  :counter="7"  v-model="proveedor.postal"
                       :rules="[rules.nombre.req, rules.postal.min, rules.postal.max]"
                       label="Código Postal"  required></v-text-field>
      </v-col>
      <v-col md="4" cols="12">
        <v-file-input accept="image/*"  v-model="logoP"
                      label="Logo del Proveedor"></v-file-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea  :counter="450"  v-model="proveedor.direccion"
                     :rules="[rules.nombre.req, rules.dir.min, rules.dir.max]"
                     label="Dirección Completa"  required></v-textarea>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end">
        <v-btn color="orange" dark small @click="validate">Registrar Proveedor</v-btn>
      </v-col>
    </v-row>
  </v-form>
  <errores422 v-if="erroresServidor" :errores="erroresServidor"></errores422>
  </v-card>
  <v-overlay :value="overlay">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</v-card>
</template>

<script>
import Swal from "sweetalert2";
import Errores422 from "@/components/Errores422.vue";

export default {
  watch: {
    overlay (val) {
      val && setTimeout(() => {
      }, 500)
    },
  },
  components:{Errores422},
  name: "nuevo_proveedor",
  data(){
    return{
      overlay: false,
      rules:{
        nombre:{
          req: v => !!v || 'Campo requerido',
          min:v => (v && v.length >= 2) || 'Tiene que ser mayor a 2 carácteres.',
          max:v => (v && v.length <= 100) || 'Tiene que ser menor o igual a 100 carácteres.',
        },
        identidad:{
          some:v => (v.length === 14) || 'Tiene que ser de 14 carácteres.',
        },
        swift:{
          some:v => (v.length === 0 ||  v.length === 9) || 'Tiene que ser de 9 carácteres.',
        },
        email:{
          max:v => (v.length <= 60) || 'Tiene que ser menor o igual a 60 números.',
          email:v => (v.length === 0 ||  /.+@.+\..+/.test(v)) || 'Tiene que ser un e-mail válido.',
        },
        tel:{
          min:v => (v && v.length >= 8) || 'Tiene que ser mayor a 8 números.',
          max:v => (v && v.length <= 20) || 'Tiene que ser menor o igual a 20 números.',
          tel: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Campo no válido, tienes datos diferentes a números'
        },
        postal:{
          min:v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 números.',
          max:v => (v && v.length <= 7) || 'Tiene que ser menor o igual a 7 números.',
        },
        dir:{
          min:v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 números.',
          max:v => (v && v.length <= 400) || 'Tiene que ser menor o igual a 400 carácteres.',
        }
      },
      proveedor:{
        nombre: '',
        rtn:    '',
        pais: 'Honduras',
        postal: '',
        direccion: '',
        email:  '',
        telefono: '',
        swift: '',
      },
      erroresServidor:{},
      logoP:null,
      isPeticion: false
    }
  },
  methods:{
    validate(){
      if (this.$refs.FormNuevoProveedor.validate())
        this.registrarProveedor()
    },
    registrarProveedor(){
      this.overlay = true
      this.erroresServidor = {}
      let data = new FormData();
      data.append('nombre', this.proveedor.nombre);
      data.append('rtn', this.proveedor.rtn);
      data.append('pais', this.proveedor.pais);
      data.append('codigo_postal', this.proveedor.postal);
      data.append('direccion', this.proveedor.direccion);
      data.append('email', this.proveedor.email);
      data.append('telefono', this.proveedor.telefono);
      data.append('swift', this.proveedor.swift);
      data.append('logo', this.logoP);
      this.$axios({
        method: 'post',
        url: 'proveedores',
        data:data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        if (res.status === 200){
          this.overlay = false
          Swal.fire(
              'Registro Exitoso',
              `Se ha registrado el proveedor ${this.proveedor.nombre} exitosamente.`,
              'success'
          )
          this.isPeticion = false
        this.$store.commit('quitarPestanaKey', 23)
        }
      }).catch((error)=>{
        this.overlay = false
        if (error.response.status === 422){
          this.erroresServidor = error.response.data.errors
        }
      })
    }
  },
}
</script>

<style scoped>

</style>
