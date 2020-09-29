import Swal from "sweetalert2";
<template>
  <v-container class="pl-2 pr-2 d-flex justify-center">
    <v-card width="800px" class="pl-2">
      <v-row>
        <v-col cols="7"><v-card-title>Cajas Generales</v-card-title></v-col>
        <v-col cols="5" class="d-flex justify-end">
          <v-btn class="ma-2" tile outlined small color="orange" @click="side = true" dark >Crear Caja</v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="4">
          <v-text-field v-model="search" append-icon="mdi-magnify"
                        label="Buscar caja" single-line hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-data-table :items-per-page="10" :items="Cajas" :search="search"
                    :headers="header" :loading="isPeticion" class="rowsTable"
                    loading-text="Cargando cajas... por favor espere un momento">
        <template v-slot:item.caja="{item}">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="popurEdit(item.suc,item.nombre, item.caja)"   v-on="on" v-bind="attrs" color="success" fab x-small dark>
                <v-icon >fa fa-retweet</v-icon>
              </v-btn>
            </template>
            <span>Cambiar Responsable de la Caja</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="irCajas(item.caja)" v-on="on" v-bind="attrs" color="orange" fab x-small dark>
                <v-icon >fa fa-eye</v-icon>
              </v-btn>
            </template>
            <span>Ver Caja</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <v-navigation-drawer v-model="side" right absolute width="450px" dark color="black" id="side">
      <v-card class="pl-2 pr-2" height="100%">
        <v-row>
          <v-col class="d-flex justify-start" cols="2">
            <v-btn color="red"  x-small dark @click="side = false">x</v-btn>
          </v-col>
          <v-col cols="10">
            <small><strong>Creando Caja Nueva</strong></small>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-form ref="FormCajaNueva">
          <v-select v-model="caja.sucursal" :items="Sucursales" :item-text="'nombre'"
                    :item-value="'id'" label="Sucursal" :rules="rule" @change="buscarUser"></v-select>
          <v-select v-if="Users.length > 0" v-model="caja.user" :items="Users[0].users" :item-text="'usuario'"
                    :item-value="'id'" label="Usuario Responsable" :rules="rule">
          </v-select>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn color="deep-orange" dark @click="saveCaja">Registrar Caja</v-btn>
            </v-col>
          </v-row>
        </v-form>
        <Errores422 v-if="erroresServidor" :errores="erroresServidor"/>
      </v-card>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
  import Errores422 from "../../components/Errores422";
  import Swal from 'sweetalert2'
  export default {
    name: "cajas",
    components:{Errores422},
    data(){
      return{
        tipo: 1,
        rule:[
          value => !!value || 'Campo requerido',
        ],
        search: '',
        overlay: false,
        side: false,
        header:[
          {text:'Sucursal', value:'nombre'},
          {text:'Usuario Responsable', value:'usuario'},
          {text:'Código', value:'codigo'},
          {text:'#', value:'num_caja'},
          {text:'Acciones', value:'caja'},
        ],
        isPopup:         false,
        prompt:          {
          state: false,
          msg:   '',
        },
        isBtn:           true,
        erroresServidor: [],
        isPeticion:      true,
        Sucursales:      null,
        Users:           [],
        caja:            {
          sucursal:    null,
          user: null,
          nombre: null,
          caja: null
        },
        editUser:        null,
        Cajas:           []
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Contabilidad > Cajas Generales');
      this.cargarCajas();
      this.cargarSucursales()
    },
    methods:{
      irCajas(id){
        this.$router.replace({path:'/contabilidad/cajas/'+id})
      },
      popurEdit(suc,nombre, caja){
        this.tipo = 2
        this.side       = true;
        this.caja.sucursal = suc
        this.caja.nombre   = nombre
        this.caja.caja     = caja
        this.buscarUser();
      },
      saveCaja(){
        if (this.$refs.FormCajaNueva.validate()){
          this.overlay = true
          this.erroresServidor = []
          this.isBtn = true
          this.$axios.post('cajas',{
            sucursal:    this.caja.sucursal,
            user_id:     this.caja.user,
            abreviatura: this.Users[0].abreviatura,
            tipo:        this.tipo,
            caja:        this.caja.caja
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            this.side = false
            this.overlay = false
            console.log(res.status)
            this.caja.user = ''
            if (this.tipo === 1){
              Swal.fire(
                'Caja Registrada',
                `La caja se ha registrado exitosamente.`,
                'success'
              )
            }else if (this.tipo === 2){
              Swal.fire(
                'Caja Actaulizada',
                `La caja en ${this.Users.nombre} ha sido actualizada exitosamente.`,
                'success'
              )
            }
            this.tipo = 1
            this.cargarCajas()
          }).catch((error)=>{
            this.isBtn = false
            this.overlay = false
            if (error.response.status === 422){
              this.erroresServidor = error.response.data.errors
              console.log(this.erroresServidor)
            }
          })
        }
      },
      buscarUser(){
        this.isPeticion = true
        this.Users = []
        this.$axios.get('buscar_user/'+this.caja.sucursal,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.isBtn = false
            this.Users= res.data.users
            this.isPeticion = false
          }
        })
      },
      cargarCajas(){
        this.$axios.get('cajas',{
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.isPeticion = false
          this.Cajas = res.data.cajas
        })
      },
      cargarSucursales(){
        this.$axios.get('/sucursales',{
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Sucursales = res.data.suc
        })
      }
    },
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
