<template>
    <v-container class="pl-2 pr-2">
      <v-card>
        <v-card-title>Crear Cotización</v-card-title>
        <v-divider></v-divider>
        <v-form >
          <div style="border: solid #000 1px" class="pl-2 pr-2">
            <small>Datos Generales de la Cotización</small>
            <v-row>
              <v-col cols="4">
                <v-select v-model="cotizacion.proveedor" :items="Proveedores" :item-text="'nombre'"
                          :item-value="'id'" label="Proveedor" @change="contactosProveedor"></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="user" disabled label="Usuario Creador"></v-text-field>
              </v-col>
              <v-col cols="3" class="d-flex align-center ">
                <v-btn @click="popupMail = true" block color="orange" dark>
                  <v-icon left>fa fa-share-square</v-icon>
                  Enviar a:
                </v-btn>
              </v-col>
              <v-col cols="1" class="d-flex align-center justify-end">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="addFilas" v-on="on" v-bind="attrs" color="success" fab x-small dark>
                      <v-icon >fa fa-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Añadir Fila</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </div>
          <div style="border: solid #000 1px">
            <v-simple-table fixed-header :height="450" dense>
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-center" >#</th>
                  <th class="text-center">Cant.</th>
                  <th colspan="2">Descripción del Artículo</th>
                  <th >Eliminar</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in cotizacion.filas">
                  <td class="text-center" width="5%"> {{index + 1}}</td>
                  <td class="d-flex justify-center" >
                    <v-text-field dense  type="number" min="1"
                                  v-model="item.cantidad" ></v-text-field>
                  </td>
                  <td>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn  v-on="on" v-bind="attrs" color="success" fab x-small dark>
                          <v-icon >fa fa-search</v-icon>
                        </v-btn>
                      </template>
                      <span>Buscar Artículos</span>
                    </v-tooltip>
                  </td>
                  <td width="80%">
                    <v-text-field dense v-model="item.descripcion" ></v-text-field>
                    <span v-if="item.required">{{errorRequired}}</span>
                  </td>
                  <td class="d-flex justify-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="removeFila(item.fila)"  v-on="on" v-bind="attrs" color="red" fab x-small dark>
                          <v-icon >fa fa-times</v-icon>
                        </v-btn>
                      </template>
                      <span>Eliminar Fila</span>
                    </v-tooltip>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
          <div style="border: solid #000 1px">
            <v-row dense>
              <v-col class="d-flex justify-end ma-2">
                <v-btn @click="registrarCotizacion" color="orange" dark small>Crear Cotización</v-btn>
              </v-col>
            </v-row>
          </div>
          <Errores422 v-if="erroresServidor" :errores="erroresServidor"/>
        </v-form>
      </v-card>

      <v-dialog v-model="popupMail" width="500px">
        <v-card class="pl-5 pr-5">
          <v-card-title>Enviar Cotización a:</v-card-title>
          <v-divider></v-divider>
          <v-container fluid>
            <div v-for="(indice,item) in Contactos">
              <v-checkbox v-model="contactosMail" class="ma-0"
                          :label="indice.nombre_completo+' '+indice.puesto" :value="indice"></v-checkbox>
            </div>
          </v-container>
          <v-divider></v-divider>
          <small>Correos a los que se enviara la cotización</small>
          <v-row class="ma-0" v-for="item in contactosMail">
            <v-col>
              <small><strong>{{item.email}}</strong></small>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn color="orange" dark small @click="popupMail = false">Registrar contactos al envio</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  import Errores422 from "../../../components/Errores422";
  export default {
    components:{Errores422},
    name: "nueva",
    computed:{
      user: function () {
        return this.$store.state.usuario
      },
    },
    watch: {
      overlay (val) {
        val && setTimeout(() => {
        }, 500)
      },
    },
    data(){
      return{
        overlay: false,
        contactosMail:[],
        popupMail: false,
        Contactos: null,
        idCotizacion: null,
        popupAcciones: false,
        erroresServidor: {},
        isPeticion: false,
        Proveedores: null,
        errorRequired: 'Este campo no puede quedar vacio o tiene que tener ser mayor a 5 carácteres',
        cotizacion:{
          proveedor: '',
          filas:[
            {fila:0,cantidad:1,descripcion:'',required:false}
          ],
          requiredPro: false
        },
        filas: 1
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Proveedores > Cotizaciones > Nueva');
      this.cargarProveedores()
    },
    methods:{
      contactosProveedor(){
        this.contactosMail = []
        this.cotizacion.filas= [{fila:0,cantidad:1,descripcion:'',required:false}]
        this.$axios.get('contactos_proveedor/'+this.cotizacion.proveedor,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Contactos = res.data.contactos
          }
        })
      },
      registrarCotizacion(){
        let estado = this.cotizacion.filas.length + 1
        let bandera = 0;
        for (let i in this.cotizacion.filas){
          if (this.cotizacion.filas[i].descripcion.length < 5){
            this.cotizacion.filas[i].required = true
          }else{
            bandera++
            this.cotizacion.filas[i].required = false
          }
        }
        if (this.cotizacion.proveedor > 0){
          bandera ++
          this.cotizacion.requiredPro = false
        }else{
          this.cotizacion.requiredPro = true
        }
        if (bandera === estado){
          this.isPeticion = true
          this.overlay = true
          this.$axios.post('proveedores/cotizaciones',{
            proveedor: this.cotizacion.proveedor,
            cuerpo:    this.cotizacion.filas,
            contactos: this.contactosMail
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            this.isPeticion = false
            this.overlay = false
            if (res.status === 200){
              this.popupAcciones = true
              this.idCotizacion = res.data.cotizacion
              Swal.fire(
                'Registro Exitoso',
                `Se ha registrado exitosamente la cotización.`,
                'success'
              )
              this.cotizacion.proveedor = null
              this.contactosMail = []
              this.cotizacion.filas= [{fila:0,cantidad:1,descripcion:'',required:false}]
              this.$router.replace({path:'/proveedores/cotizaciones'})
            }
          }).catch((error)=>{
            this.overlay = false
            if (error.response.status === 422){
              this.erroresServidor = error.response.data.errors
            }
          })
        }
      },
      acciones(accion){
        this.popupAcciones = false
        if (accion === 3){
          this.$router.replace({path:'/proveedores/cotizaciones/cotizacion/'+this.idCotizacion})
        }
      },
      addFilas(){
        let fila = this.cotizacion.filas.length
        this.cotizacion.filas.push({
          "fila": fila ,
          "cantidad": 1,
          "descripcion": '',
          "required": false
        })
      },
      removeFila(fila){
        if (this.cotizacion.filas.length < 2){
          alert("No puede elimnar la primera fila")
        }else{
          this.cotizacion.filas.splice(fila, 1)
          for (let item in this.cotizacion.filas){
            this.cotizacion.filas[item].fila = item
          }
        }
      },
      cargarProveedores(){
        this.isPeticion = true
        this.$axios.get('/proveedores',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.isPeticion = false
            this.Proveedores = res.data.proveedores
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
