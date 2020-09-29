import Swal from "sweetalert2";
<template>
  <v-container class="pt-2 pr-2 pl-2 d-flex justify-center">
    <v-card width="70%">
      <v-card-title>
        Sucursal Nueva
      </v-card-title>
      <v-divider></v-divider>
      <v-form ref="FormNuevaSucursal" class="pl-3 pr-3">
        <v-row>
          <v-col cols="4">
            <v-select v-model="depto" :items="Departamentos" :item-text="'nombre'" :rules="rules.required"
                      :item-value="'id'" label="Departamento" @change="cargarMunicipios"></v-select>
          </v-col>
          <v-col cols="4">
            <v-select v-model="newSucursal.municipio" :items="municipios" :item-text="'nombre'"  :rules="rules.required"
                      :item-value="'id'" label="Municipio" @change="cargarCiudades"></v-select>
          </v-col>
          <v-col cols="4">
            <v-select v-model="newSucursal.ciudad" :items="ciudades"  :rules="rules.required" :item-text="'nombres'"
                      :item-value="'id'" label="Ciudad/Aldea" ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="newSucursal.nombre" :counter="50"
                          :rules="[rules.suc.req, rules.suc.min, rules.suc.max]"
                          label="Nombre de la Sucursal" required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-text-field v-model="newSucursal.abreviatura" :counter="5"
                          :rules="[rules.abreviatura.req,rules.abreviatura.min,rules.abreviatura.max]"
                          label="Abreviatura" required></v-text-field>
          </v-col>
          <v-col cols="5">
            <v-text-field v-model="newSucursal.email" :rules="rules.email"
                          label="E-mail de la Sucursal"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="newSucursal.telefono" :counter="8"
                          :rules="[rules.telefono.some, rules.telefono.tel]"
                          label="Telefono de la Sucursal"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea v-model="newSucursal.direccion" counter="400"
                        :rules="[rules.area.req, rules.area.min, rules.area.max]"
                        label="Dirección completa de la sucursal">
            </v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex flex-row-reverse">
            <v-btn @click="validate" :disabled="isSubmit" color="warning" dark>Registrar Sucursal</v-btn>
          </v-col>
        </v-row>
      </v-form>
      <Errores422 v-if="erroresServidor" :errores="erroresServidor"/>
    </v-card>
  </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  import Errores422 from "../../../components/Errores422";
  export default {
    name: "nuevo",
    components:{Errores422},
    data(){
      return{
        rules:{
          required:[
            v => !!v || 'Campo requerido',
          ],
          suc:{
            req: v => !!v || 'Campo requerido',
            min: v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 carácteres.',
            max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
          },
          telefono: {
            some:v => (v.length === 0 || v.length === 8) || 'Tiene que ser de 8 carácteres.',
            tel: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Telefono no válido, tienes datos diferentes a números'
          },
          abreviatura:{
            req: v => !!v || 'Campo requerido',
            min:v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
            max:v => (v && v.length <= 5) || 'Tiene que ser menor o igual a 5 carácteres.',
          },
          area:{
            req: v => !!v || 'Campo requerido',
            min:v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 carácteres.',
            max:v => (v && v.length <= 400) || 'Tiene que ser menor o igual a 400 carácteres.',
          },
          email:[
            v => (v.length === 0 || /.+@.+\..+/.test(v)) || 'E-mail no valido',
          ]
        },
        erroresServidor: [],
        isAlert:true,
        depto: null,
        municipios: null,
        ciudades: null,
        newSucursal:{
          municipio:'',
          ciudad: '',
          nombre: '',
          abreviatura: '',
          email: '',
          telefono: '',
          direccion: ''
        },
        isSubmit:false,
        isAlert:null,
        isPeticion: false,
      }
    },
    asyncData({$axios, store}){
      return $axios.get('/departamentos', {
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        }
      }).then((res)=>{
        return{
          Departamentos: res.data.depto
        }
      })
    },
    methods:{
      cargarMunicipios: function () {
        this.isPeticion = true
        this.$axios.get('/municipios/'+this.depto,{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          this.municipios = res.data.municipios
          this.isPeticion = false
        })
      },
      cargarCiudades: function () {
        this.isPeticion = true
        this.$axios.get('/ciudades/'+this.newSucursal.municipio,{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          this.ciudades = res.data.ciudades
          this.isPeticion = false
        })
      },
      validate(){
        if (this.$refs.FormNuevaSucursal.validate())
          this.RegistrarSucursal()
      },
      RegistrarSucursal: function () {
        this.isPeticion = true
        this.isSubmit = true
        this.erroresServidor = []
        this.$axios.post('/sucursales',{
          nombre:      this.newSucursal.nombre,
          abreviatura: this.newSucursal.abreviatura,
          email:       this.newSucursal.email,
          telefono:    this.newSucursal.telefono,
          ciudad:      this.newSucursal.ciudad,
          direccion:   this.newSucursal.direccion
        },{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          this.erroresServidor = []
          this.isPeticion = false
          if (res.data.status){
            Swal.fire(
              'Registro Exitoso',
              `Se registro exitosamente la sucursal ${this.newSucursal.nombre}.`,
              'success'
            )
            this.$router.replace({path:"/admin/sucursales/"})
          }
          this.isSubmit = false
        }).catch((error)=>{
          if (error.response.status === 422){
            this.erroresServidor = error.response.data.error
          }
          this.isSubmit = false
        })
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Sucursal > Nuevo')
    },
  }
</script>

<style scoped>

</style>
