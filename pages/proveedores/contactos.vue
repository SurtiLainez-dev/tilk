<template>
  <v-container class="pl-2 pr-2">
    <v-card>
      <v-row>
        <v-col cols="10"><v-card-title>Contactos de Proveedores</v-card-title></v-col>
        <v-col cols="2" class="d-flex justify-end align-center ">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="abrirSide" class="ma-2" v-on="on" v-bind="attrs" color="success" fab x-small dark>
                <v-icon >fa fa-plus</v-icon>
              </v-btn>
            </template>
            <span>Añadir Contactos Nuevo</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-data-table :headers="header" :loading="isPeticion" class="rowsTable"
                    loading-text="Cargando contacto... por favor espere un momento"
                    :items="Contactos" :search="search" @click:row="editContacto">
        <template v-slot:item.proveedor.nombre="{item}">
          <v-avatar v-if="item.proveedor.logo" size="25"><img :src="item.proveedor.logo" alt="John"></v-avatar>
          <v-avatar size="25" v-else><v-icon>fa fa-user</v-icon></v-avatar>
          {{item.proveedor.nombre}}
        </template>
        <template v-slot:item.estado="{item}">
          <v-icon v-if="item.estado ===1" color="success">fa fa-check-circle</v-icon>
          <v-icon v-else color="red">fa fa-times</v-icon>
        </template>
      </v-data-table>
    </v-card>


    <v-navigation-drawer v-model="sideContactos" right absolute width="450px" id="side">
      <v-card class="pl-2 pr-2" height="100%" color="black" dark>
        <v-row>
          <v-col class="d-flex justify-start" cols="2">
            <v-btn color="red"  x-small dark @click="sideContactos = false">x</v-btn>
          </v-col>
          <v-col cols="10">
            <small>{{tituloSide}}</small>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-form ref="FormNuevoContactoProveedor" class="pl-2 pr-2">
          <v-text-field  :counter="50" :rules="[rule.nombre.req, rule.nombre.min, rule.nombre.max]"
                         v-model="contactos.nombre" label="Nombre Completo" required></v-text-field>
          <v-row>
            <v-col cols="4">
              <v-text-field  :counter="13" :rules="[rule.nombre.req, rule.telefono.min, rule.telefono.max, rule.telefono.tel]"
                             v-model="contactos.telefono" label="Teléfono" required></v-text-field>
            </v-col>
            <v-col cols="8">
              <v-text-field  :counter="60" :rules="[rule.nombre.req, rule.email.max, rule.email.email]"
                             v-model="contactos.email" label="E-mail" required></v-text-field>
            </v-col>
          </v-row>
          <v-text-field  :counter="25" :rules="[rule.nombre.req, rule.nombre.min, rule.puesto.max]"
                         v-model="contactos.puesto" label="Cargo" required></v-text-field>
          <v-select v-model="contactos.proveedor" :items="Proveedores" :item-text="'nombre'" :item-value="'id'"
                    label="Proveedor"  :rules="[rule.nombre.req]"></v-select>

          <v-textarea  :counter="400" rows="2" :rules="[rule.observacion.max]"
                         v-model="contactos.observacion" label="Observación" required></v-textarea>
          <v-row v-if="contactos.tipo">
            <v-col class="d-flex align-center" cols="6"><v-switch label="Estado" v-model="contactos.estado" ></v-switch></v-col>
            <v-col cols="6" class="d-flex align-center">
              <small v-if="contactos.estado"><strong>Activo</strong></small>
              <small v-else><strong>InActivo</strong></small>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn v-if="contactos.tipo" color="orange" @click="editarContacto" dark small>Editar Contacto</v-btn>
              <v-btn v-else color="orange" @click="registrarContacto" dark small>Registrar Contacto</v-btn>
            </v-col>
          </v-row>
        </v-form>
        <Errores422 v-if="erroresServidor" :errores="erroresServidor"/>
      </v-card>
    </v-navigation-drawer>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
  import Errores422 from "../../components/Errores422";
  import Swal from 'sweetalert2'
  export default {
    watch: {
      overlay (val) {
        val && setTimeout(() => {
        }, 500)
      },
    },
    name: "contactos",
    components:{Errores422},
    created() {
      this.$store.commit('guardarTitulo', 'Proveedores > Contactos');
      this.cargarContactos()
      this.cargarProveedores()
    },
    data(){
      return{
        overlay: false,
        search: '',
        rule:{
          nombre:{
            req: v => !!v || 'Campo requerido',
            min:v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
            max:v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
          },
          telefono: {
            min:v => (v && v.length >= 8) || 'Tiene que ser mayor a 8 carácteres.',
            max:v => (v && v.length <= 13) || 'Tiene que ser menor o igual a 13 carácteres.',
            tel: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Telefono no válido, tienes datos diferentes a números'
          },
          email: {
            email: v => (v.length === 0 || /.+@.+\..+/.test(v)) || 'E-mail no valido',
            max:v => (v && v.length <= 60) || 'Tiene que ser menor o igual a 60 carácteres.',
          },
          puesto:{
            max:v => (v && v.length <= 25) || 'Tiene que ser menor o igual a 25 carácteres.',
          },
          observacion:{
            max:v => (v.length === 0 || v.length <= 400) || 'Tiene que ser menor o igual a 400 carácteres.',
          }
        },
        header:[
          {text: 'Nombre Completo', value:'nombre_completo'},
          {text: 'Proveedor', value:'proveedor.nombre'},
          {text: 'E-mail', value:'email'},
          {text: 'Teléfono', value:'telefono'},
          {text: 'Puesto', value:'puesto'},
          {text: 'Estado', value:'estado'},
        ],
        selectContacto: null,
        sideContactos: false,
        Contactos: [],
        isPeticion: false,
        isPeticionRC: false,
        Proveedores: null,
        erroresServidor:{},
        contactos:{
          nombre: '',
          proveedor: '',
          telefono: '',
          email:'',
          puesto: '',
          observacion: '',
          estado: '',
          tipo: ''
        },
        tituloSide: null,
        btnSide: null,
      }
    },
    methods:{
      abrirSide(){
        this.contactos.nombre      = ''
        this.contactos.proveedor   = ''
        this.contactos.email       = ''
        this.contactos.puesto      = ''
        this.contactos.telefono    = ''
        this.contactos.observacion = ''
        this.contactos.tipo        = ''
        this.tituloSide            = "Creando un Nuevo Contacto"
        this.btnSide               = "Registrar Contacto"
        this.contactos.tipo        = false
        this.contactos.estado      = false
        this.sideContactos         = true
      },
      editContacto(val){
        this.contactos.nombre      = val.nombre_completo
        this.contactos.proveedor   = val.id
        this.contactos.email       = val.email
        this.contactos.puesto      = val.puesto
        this.contactos.telefono    = val.telefono
        if (val.observacion)
          this.contactos.observacion = val.observacion
        else
          this.contactos.observacion = ''
        this.contactos.estado      = val.estado
        this.tituloSide            = `Editando Contacto ${val.nombre_completo}`
        this.btnSide               = "Registrar Cambios del Contacto"
        this.contactos.tipo        = true
        this.sideContactos         = true
        console.log(this.contactos)
      },
      editarContacto(){
        if (this.$refs.FormNuevoContactoProveedor.validate()){
          this.sideContactos = false
          this.overlay = true
          this.$axios.put('proveedores_contactos/'+this.contactos.proveedor,{
            nombre:      this.contactos.nombre,
            proveedor:   this.contactos.proveedor,
            telefono:    this.contactos.telefono,
            email:       this.contactos.email,
            puesto:      this.contactos.puesto,
            observacion: this.contactos.observacion,
            estado:      this.contactos.estado
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.overlay = false
              Swal.fire(
                'Registro de Cambios Exitoso',
                `Se registraron los cambios del contacto ${this.contactos.nombre} correctamente.`,
                'success'
              )
              this.cargarContactos()
            }
          }).catch((error)=>{
            this.overlay = false
            if (error.response.status === 422){
              this.erroresServidor = error.response.data.errors
            }
            if (error.response.status === 500){
              this.erroresServidor = {err: ['Hubo un error en el servidor al registrar los datos.' +
                ' Intenta de nuevo si el error persiste comuniquese con servicio técnico.']}
            }
          })
        }
      },
      cargarContactos(){
        this.isPeticion = true
        this.$axios.get('proveedores_contactos',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.isPeticion = false
            this.Contactos = res.data.contactos
          }
        })
      },
      cargarProveedores(){
        this.$axios.get('proveedores',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Proveedores = res.data.proveedores
          }
        })
      },
      registrarContacto(){
        if (this.$refs.FormNuevoContactoProveedor.validate()){
          this.sideContactos = false
          this.overlay = true
          this.$axios.post('proveedores_contactos',{
            nombre:      this.contactos.nombre,
            proveedor:   this.contactos.proveedor,
            telefono:    this.contactos.telefono,
            email:       this.contactos.email,
            puesto:      this.contactos.puesto,
            observacion: this.contactos.observacion
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.overlay = false
              Swal.fire(
                'Registro Exitoso',
                `Se registro exitosamente el contacto ${this.contactos.nombre}.`,
                'success'
              )
              this.cargarContactos()
            }
          }).catch((error)=>{
            this.isPeticionRC = false
            if (error.response.status === 422){
              this.erroresServidor = error.response.data.errors
            }
            if (error.response.status === 500){
              this.erroresServidor = {err: ['Hubo un error en el servidor al registrar los datos.' +
                ' Intenta de nuevo si el error persiste comuniquese con servicio técnico.']}
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
  #side{
    opacity: 0.8;
  }
</style>
