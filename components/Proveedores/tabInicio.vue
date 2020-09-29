<template>
  <v-card class="pl-2 pr-2">
    <v-progress-linear indeterminate color="green" v-if="$fetchState.pending"></v-progress-linear>
    <v-container v-else>
      <v-card-title>{{Proveedor.nombre}}</v-card-title>
      <v-divider></v-divider>
      <v-row>
        <v-col md="6" class="" cols="12">
          <v-card class="pl-2 pr-2" :elevation="5">
            <v-row>
              <v-col md="8" cols="12"><v-card-title>Datos del Proveedor</v-card-title></v-col>
              <v-col md="4" cols="12" class="d-flex justify-end">
                <v-switch v-model="editProveedor" label="Editar Datos"></v-switch>
              </v-col>
            </v-row>
            <v-divider> </v-divider>
            <v-form ref="FormEditarProveedor" :disabled="!editProveedor">
              <v-row>
                <v-col>
                  <v-text-field  :counter="100" v-model="proveedorDatos.nombre"
                                 :rules="[rules.nombre.req,rules.nombre.min,rules.nombre.max]"
                                 label="Nombre del Proveedor"  required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="4" cols="6">
                  <v-text-field  :counter="20"  v-model="proveedorDatos.rtn"
                                 :rules="[rules.identidad.some, rules.nombre.req]"
                                 label="Rtn del Proveedor"  required></v-text-field>
                </v-col>
                <v-col md="4" cols="6">
                  <v-text-field  :counter="20"  v-model="proveedorDatos.telefono"
                                 :rules="[rules.nombre.req, rules.tel.min, rules.tel.max]"
                                 label="Telefono del Proveedor"  required></v-text-field>
                </v-col>
                <v-col md="4" cols="6">
                  <v-text-field  :counter="9"  v-model="proveedorDatos.swift" :rules="[rules.swift.some]"
                                 label="Swift del Proveedor"  required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="4" cols="6">
                  <v-text-field  :counter="60"  v-model="proveedorDatos.email"
                                 :rules="[rules.email.email, rules.email.max]"
                                 label="E-mail del Proveedor"  required></v-text-field>
                </v-col>
                <v-col md="4" cols="6">
                  <v-text-field  :counter="30"  v-model="proveedorDatos.pais" disabled
                                 label="País"  required></v-text-field>
                </v-col>
                <v-col md="4" cols="6">
                  <v-text-field  :counter="7"  v-model="proveedorDatos.postal"
                                 :rules="[rules.nombre.req, rules.postal.min, rules.postal.max]"
                                 label="Código Postal"  required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-textarea  :counter="450"  v-model="proveedorDatos.direccion" :rows="2"
                               :rules="[rules.nombre.req, rules.dir.min, rules.dir.max]"
                               label="Dirección Completa"  required></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-end">
                  <v-btn color="orange" :disabled="!editProveedor" @click="validate"  dark small>Registrar Cambios</v-btn>
                </v-col>
              </v-row>
              <errores422 v-if="erroresServidor" :errores="erroresServidor"></errores422>
            </v-form>
          </v-card>
        </v-col>
        <v-col md="6" cols="12">
          <v-row>
            <v-col md="12" class="pt-0">
              <v-card :elevation="5">
                <v-card-title>Contactos del Proveedor</v-card-title>
                <v-divider></v-divider>
                <v-list-item two-line v-for="i in Proveedor.contacto_proveedors">
                  <v-list-item-content>
                    <v-row>
                      <v-col cols="10"><v-list-item-title>{{i.nombre_completo}}</v-list-item-title></v-col>
                      <v-col cols="2">
                        <v-btn x-small color="orange" dark>Ver</v-btn>
                      </v-col>
                    </v-row>
                    <v-list-item-subtitle>{{i.puesto}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="12">
              <v-card :elevation="5">
                <v-row>
                  <v-col md="10">
                    <v-card-title>Cuentas Bancarias</v-card-title>
                  </v-col>
                  <v-col md="2" class="d-flex align-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="popupBancos = true" v-on="on" v-bind="attrs" color="success" fab x-small dark>
                          <v-icon >fa fa-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Añadir Cuenta Bancaria</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-list-item two-line v-for="i in Cuentas">
                  <v-list-item-content>
                    <v-row>
                      <v-col cols="8"><v-list-item-title>{{i.banco.nombre}}</v-list-item-title></v-col>
                      <v-col cols="4">
                        <v-chip class="ma-2" color="dark" outlined>
                          <v-icon left>fa fa-dollar-sign</v-icon>
                          L. {{i.total_transferido}}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-list-item-subtitle>{{i.num}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="popupBancos" width="400px">
      <v-card class="pl-5 pr-5">
        <v-card-title>Agregar Cuenta</v-card-title>
        <v-divider></v-divider>
        <v-form ref="FormNuevaCuentaProveedor">
          <v-select :rules="[rules.nombre.req]" v-model="cuenta.banco" :items="Bancos"
            :item-text="'nombre'" :item-value="'id'" label="Seleccionar un Banco">
          </v-select>
          <v-text-field  :counter="30"  v-model="cuenta.num"
                         :rules="[rules.nombre.req, rules.tel.min]"
                         label="Número de Cuenta"  required></v-text-field>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn @click="addcuentas" color="orange" dark small>Registrar Cuenta</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
    import Swal from 'sweetalert2'
    import Errores422 from "../Errores422";
    export default {
      watch: {
        overlay (val) {
          val && setTimeout(() => {
          }, 1500)
        },
      },
      name: "tabInicio",
      components:{Errores422},
      data(){
        return{
          overlay: false,
          editProveedor: false,
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
          prompt:{
            state: false,
            msg: null
          },
          isPeticionEditar: false,
          erroresServidor:{},
          Proveedor: null,
          sideProveedor: false,
          proveedorDatos: {
            nombre: '',
            telefono: '',
            direccion: '',
            postal:'',
            rtn:'',
            email:'',
            swift:''
          },
          Bancos: null,
          popupBancos: null,
          cuenta:{
            banco:'',
            num:'',
            error: false,
          },
          Cuentas: null,
          isPeticionCuenta:false
        }
      },
      methods:{
        validate(){
          if (this.$refs.FormEditarProveedor.validate())
            this.editandoProveedor()
        },
        addcuentas(){
          if (this.$refs.FormNuevaCuentaProveedor.validate()){
            this.popupBancos = false
            this.overlay = true
            this.$axios.post('proveedores_cuentas_bancos',{
              proveedor: this.Proveedor.id,
              banco:     this.cuenta.banco,
              num:       this.cuenta.num
            },{
              headers: {
                'Authorization': 'Bearer ' + this.$store.state.token
              }
            }).then((res)=>{
              if (res.status === 200){
                this.overlay = false
                Swal.fire({
                  title: 'Registro Exitoso',
                  text: 'Se ha registrado la cuenta '+this.cuenta.num+' correctamente.',
                  icon: 'success',
                })
                this.cuenta.banco = null;
                this.cuenta.num = ''
                this.isPeticionCuenta = false
                this.popupBancos = false
                this.erroresServidor = {}
                this.cargarCuentas()
              }
            }).catch((error)=>{
              this.isPeticionCuenta = false
              if (error.response.status === 422){
                this.erroresServidor = {}
                this.erroresServidor = error.response.data.errors
              }
            })
          }
        },
        cargarCuentas(){
          this.$axios.get('proveedores_cuentas_bancos/'+this.$route.params.proveedor,{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status = 200){
              this.Cuentas = res.data.cuentas
            }
          })
        },
        pasarDatos(){
          this.proveedorDatos.nombre    = this.Proveedor.nombre
          this.proveedorDatos.telefono  = this.Proveedor.telefono
          this.proveedorDatos.direccion = this.Proveedor.direccion
          this.proveedorDatos.postal    = this.Proveedor.codigo_postal
          this.proveedorDatos.rtn       = this.Proveedor.rtn
          this.proveedorDatos.email     = this.Proveedor.email
          if (this.Proveedor.swift)
            this.proveedorDatos.swift     = this.Proveedor.swift
          else
            this.proveedorDatos.swift = ''
        },
        editandoProveedor(){
          this.overlay = true
          this.isPeticionEditar = true
          this.$axios.put('proveedores/'+this.Proveedor.id,{
            nombre:        this.proveedorDatos.nombre,
            rtn:           this.proveedorDatos.rtn,
            pais:          this.Proveedor.pais,
            codigo_postal: this.proveedorDatos.postal,
            direccion:     this.proveedorDatos.direccion,
            email:         this.proveedorDatos.email,
            telefono:      this.proveedorDatos.telefono,
            swift:         this.proveedorDatos.swift,
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.$fetch()
              this.overlay = false
              Swal.fire({
                title: 'Registro de Cambios Exitoso',
                text: `Los cambios que realizastes en el proveedor ${this.proveedorDatos.nombre} se realizaron correctamente`,
                icon: 'success',
              })
            }
          }).catch((error)=>{
            this.overlay = false
            this.isPeticionEditar = false
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
      async fetch (){
        this.Proveedor =(await this.$axios.get('/proveedores/'+this.$route.params.proveedor, {
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        })).data.proveedor
        this.$store.commit('guardarTitulo', 'Proveedor > '+this.Proveedor.nombre)
        this.pasarDatos()
        this.Bancos = (await this.$axios.get('/bancos',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        })).data.bancos
        this.cargarCuentas()
      }
    }
</script>

<style scoped>

</style>
