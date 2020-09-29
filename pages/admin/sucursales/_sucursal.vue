<template>
  <v-container class="pt-2 pr-2 pl-2 pb-5">
    <v-card class="pt-2 pr-2 pl-2">
      <v-card-title>
        {{datosSucursal.nombre}}
      </v-card-title>
      <v-row>
        <v-col md="4" cols="6">
          <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="pink">
            <v-row>
              <v-col cols="10"><strong>Correo</strong></v-col>
              <v-col cols="2"><v-icon>fa fa-envelope</v-icon></v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-center">{{datosSucursal.email}}</v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col md="4" cols="6">
          <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="deep-orange ">
            <v-row>
              <v-col cols="10"><strong>Telefono</strong></v-col>
              <v-col cols="2"><v-icon>fa fa-phone</v-icon></v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-center">{{datosSucursal.telefono}}</v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col md="4" cols="6">
          <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="purple">
            <v-row>
              <v-col cols="10"><strong>Ubicación</strong></v-col>
              <v-col cols="2">
                <v-icon>fa fa-map-marker-alt</v-icon>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-center">{{datosSucursal.ciudade.nombres}} , {{datosSucursal.ciudade.municipio.departamento.nombre}}</v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col md="7" cols="12">
          <v-card>
            <v-row class="pt-2 pr-2 pl-2">
              <v-col cols="8">
                <v-card-title>
                  Colaboradores
                </v-card-title>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="search" append-icon="mdi-magnify"
                              label="Buscar colaborador" single-line hide-details></v-text-field>
              </v-col>
            </v-row>
            <v-data-table :items-per-page="10" :headers="header" fixed-header dense
                          class="rowsTable" :items="datosSucursal.colaboradors" :search="search">
              <template v-slot:item.nombres="{item}">
                {{item.nombres}} {{item.apellidos}}
              </template>
              <template v-slot:item.estado="{item}">
                <v-icon v-if="item.estado ===1" color="success">fa fa-check-circle</v-icon>
                <v-icon v-else color="red">fa fa-times</v-icon>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col md="5" cols="12">
          <v-card>
            <v-progress-linear v-if="isSubmit" indeterminate color="green"></v-progress-linear>
            <v-card-title>
              <v-row>
                <v-col cols="10" class="d-flex align-center">
                  Editar sucursal
                </v-col>
                <v-col cols="2" class="d-flex justify-end">
                  <v-switch v-model="editarForm">
                  </v-switch>
                </v-col>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card :disabled="!editarForm">
              <v-form ref="FormActualizarSucursal" class="pl-2 pr-2" :disabled="!editarForm">
                <v-row>
                  <v-col>
                    <v-switch
                      v-model="datosSucursal.isContable" :disabled="datosSucursal.isContable"
                      label="Estado de la  Sucursal en el Catálogo Contable"
                    ></v-switch>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field v-model="datosSucursal.nombre"
                                  :rules="[rules.suc.req, rules.suc.min, rules.suc.max]"
                                  label="Nombre de la Sucursal" counter="50" required></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="5">
                    <v-text-field v-model="datosSucursal.abreviatura"
                                  :rules="[rules.abreviatura.req,rules.abreviatura.min,rules.abreviatura.max]"
                                  label="Abreviatura" counter="5" required></v-text-field>
                  </v-col>
                  <v-col cols="7">
                    <v-text-field v-model="datosSucursal.email" :rules="rules.email"
                                  label="E-mail" required></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="5">
                    <v-text-field v-model="datosSucursal.telefono"
                                  :rules="[rules.telefono.some, rules.telefono.tel]"
                                  label="Telefono" counter="8" required></v-text-field>
                  </v-col>
                  <v-col cols="7">
                    <v-text-field :value="datosSucursal.ciudade.nombres+', '+datosSucursal.ciudade.municipio.departamento.nombre"
                                  disabled label="Ubicación" required></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-textarea counter="400" :rows="3" :row-height="5" v-model="datosSucursal.direccion_completa"
                                :rules="[rules.area.req, rules.area.min, rules.area.max]"
                                label="Dirección completa de la sucursal">
                    </v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex flex-row-reverse">
                    <v-btn @click="validate" :disabled="isSubmit" color="warning" dark>Actualizar Sucursal</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
            <errores422 :errores="erroresServidor" v-if="erroresServidor"/>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  import Errores422 from "../../../components/Errores422";
  export default {
    components: {Errores422},
    data(){
      return{
        search: '',
        isSubmit: false,
        header:[
          {text:'Nombre', value:'nombres'},
          {text:'puesto', value:'puesto_colaborador.nombre'},
          {text:'Estado', value:'estado', align:'center'},
        ],
        editarForm: false,
        rules:{
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
        erroresServidor: []
      }
    },
    methods:{
      validate(){
        if (this.$refs.FormActualizarSucursal.validate())
          this.editarSucursal()
      },
      editarSucursal: function () {
        this.isSubmit = true
        this.$axios.put('/sucursales/'+this.datosSucursal.id,{
          nombre:      this.datosSucursal.nombre,
          abreviatura: this.datosSucursal.abreviatura,
          dir:         this.datosSucursal.direccion_completa,
          telefono:    this.datosSucursal.telefono,
          email:       this.datosSucursal.email,
          isContable:  this.datosSucursal.isContable
        },{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          this.isSubmit = false
          this.editarForm = false
          if (res.data.error){
            this.erroresServidor = res.data.error
          }else if (res.data.status){
            Swal.fire(
              'Cambio Exitoso',
              `Se registro el cambio exitosamente de la sucursal ${this.datosSucursal.nombre}.`,
              'success'
            )
            this.reload();
          }
        })
      },
      isReload(){
        this.$axios.get('/sucursales/'+this.$store.params.sucursal,{
          headers:{
            'Authorization': `Bearer ${this.$store.state.token}`
          },
        }).then((res)=>{
          this.datosSucursal= res.data.suc
        })
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Sucursal > '+this.datosSucursal.nombre)
      if (this.datosSucursal.isContable === 1)
        this.datosSucursal.isContable = true
      else
        this.datosSucursal.isContable = false
    },
    asyncData({$axios, store, route}){
      return $axios.get('/sucursales/'+route.params.sucursal,{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then((res)=>{
        return{
          datosSucursal: res.data.suc
        }
      })
    },
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
