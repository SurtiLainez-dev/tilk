<template>
    <v-container class="mt-2">
      <v-card>
        <div v-if="$fetchState.pending">
          <v-progress-linear indeterminate color="success"></v-progress-linear>
        </div>
        <div v-else class="pr-2 pl-2 pb-5">
          <v-row>
            <v-col cols="9">
              <strong>{{User.colaborador.nombres}} {{User.colaborador.apellidos}}</strong>
            </v-col>
            <v-col cols="3" class="d-flex justify-end">
              <div class="pl-1 pr-1">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn  @click="redirecCol"  v-on="on" v-bind="attrs" color="success" fab x-small dark>
                      <v-icon >fa fa-user</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Colaborador</span>
                </v-tooltip>
              </div>
              <div class="pl-1 pr-1">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn  @click="estadoPermisos"  v-on="on" v-bind="attrs" color="dark" fab x-small dark>
                      <v-icon v-if="isPermisos">fa fa-lock</v-icon>
                      <v-icon v-else>fa fa-lock-open</v-icon>
                    </v-btn>
                  </template>
                  <span v-if="isPermisos">Habilitar Edición de Permisos </span>
                  <span v-else>Deshabilitar Edición de Permisos</span>
                </v-tooltip>
              </div>
              <div class="pl-1 pr-1">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn  v-on="on" v-bind="attrs" color="amber " fab x-small dark>
                      <v-icon>fa fa-edit</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar Usuario</span>
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3" cols="4">
              <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="pink">
                <v-row>
                  <v-col cols="10"><strong>Correo</strong></v-col>
                  <v-col cols="2"><v-icon>fa fa-envelope</v-icon></v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex justify-center">{{User.email}}</v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col md="3" cols="4">
              <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="deep-orange ">
                <v-row>
                  <v-col cols="10"><strong>Usuario</strong></v-col>
                  <v-col cols="2"><v-icon>fa fa-user</v-icon></v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex justify-center">{{User.usuario}}</v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col md="3" cols="4">
              <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="purple">
                <v-row>
                  <v-col cols="10"><strong>Grupo</strong></v-col>
                  <v-col cols="2">
                    <v-icon>fa fa-users</v-icon>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex justify-center">{{User.tipo_usuario.nombre}}</v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col md="3" cols="4">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-card v-on="on" v-bind="attrs" @click="cambiarEstado"
                          hover class="pl-2 pr-2 pb-2 pt-2" dark color="light-blue">
                    <v-row>
                      <v-col cols="10"><strong>Estado</strong></v-col>
                      <v-col cols="2">
                        <v-icon v-if="User.estado === 1">fa fa-check</v-icon>
                        <v-icon v-if="User.estado === 0">fa fa-times</v-icon>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col v-if="estado" class="d-flex justify-center">Activo</v-col>
                      <v-col v-else class="d-flex justify-center">Inactivo</v-col>
                    </v-row>
                  </v-card>
                </template>
                <span>Cambiar Estado del Usuario</span>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-card :disabled="!estado">
            <v-row class="pr-2">
              <v-col cols="8">
                <v-card-title>
                  Permisos del usuario
                  <div v-if="addPermisos.length > 0" class="pl-3">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="guardarPermisos"  v-on="on" v-bind="attrs" color="success" fab x-small dark>
                          <v-icon>fa fa-paper-plane</v-icon>
                        </v-btn>
                      </template>
                      <span>Guardar Permisos</span>
                    </v-tooltip>
                  </div>
                </v-card-title>
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="search" append-icon="mdi-magnify"
                  label="Buscar Módulo" single-line hide-details>
                </v-text-field>
              </v-col>
            </v-row>
            <v-card :disabled="isPermisos">
              <v-data-table  :dense="true" @click:row="anadirPermisos"
                             :items-per-page="15" class="rowsTable" :search="search"
                             :items="modulos" :headers="headerPermisos" fixed-heade>
                <template v-slot:item.user_id="{item}">
                  {{User.usuario}}
                </template>
                <template v-slot:item.nombre="{item}">
                  <strong>{{item.nombre}}</strong> - {{item.modulo}}
                </template>
                <template v-slot:item.estado="{item}" >
                  <div class="d-flex justify-center">
                    <v-checkbox v-model="item.estado" @click="item.estado = !item.estado"></v-checkbox>
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-card>
        </div>
      </v-card>
    </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
    export default {
      data(){
        return{
          search: '',
          isPermisos:true,
          permisoTable:[],
          addPermisos: [],
          modulos:         null,
          isPeticion:      false,
          estado:          null,
          User:            null,
          erroresServidor: [],
          headerPermisos:  [
            {text:'Módulo', value:'nombre'},
            {text:'Usuario', value: 'user_id'},
            {text:'Estado', value:'estado', align:'center'}
          ]
        }
      },
      methods:{
        estadoPermisos(){
          this.isPermisos = !this.isPermisos
          this.addPermisos = []
        },
        anadirPermisos(val){
          if (!this.isPermisos){
            val.estado = !val.estado
            let existe = false
            for(let item in this.addPermisos){
              if (this.addPermisos[item].id === val.id){
                existe = true
                this.addPermisos.splice(item, 1)
                break
              }
            }
            if (!existe){
              this.addPermisos.push(val)
            }
          }
        },
        guardarPermisos(){
          this.isPeticion = true
          this.isPermisos = false
          this.$axios.post('save_permisos',{permisos: this.addPermisos},{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            this.isPeticion = false
            if (res.status === 200){
              Swal.fire(
                'Permisos Registrados',
                'Se registrarón los permisos del usuario exitosamente. Para que el usuario tenga los cambios ' +
                'debe cerrar sesión y luego volver a ingresas.',
                'success'
              )
            }
          }).catch((error)=>{
            if (error.response.data === 422){
              Swal.fire(
                'Error al Registrar Permisos',
                'Los permisos no se pudierón asignar al usuario, intenta nuevamente, si el error persiste, ' +
                'ponte en contacto con soporte técnico.',
                'error'
              )
            }
          })
        },
        redirecCol(){
          this.$router.replace({path:'/colaborador/'+this.User.colaborador.id})
        },
        cambiarEstado: function(){
          this.erroresServidor = []
          this.estado = !this.estado
          this.isPeticion = true
          this.$axios.post('/cambiar_estado_user',{
            id:     this.User.colaborador.id,
            estado: this.estado,
            user:   this.User.id
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            this.isPeticion = false
            if (res.status ===200){
              Swal.fire(
                'Nuevo Estado Registrado',
                'El estado del usuario se ha cambiado exitosamente',
                'success'
              )
            }
          }).catch((error)=>{
            Swal.fire(
              'Fallo en el Cambio de Estado',
              error.response.data.eror,
              'error'
            )
            this.estado = this.User.estado
          })
        },
        cambiarTitulo(){
          this.$store.commit('guardarTitulo', 'Usuarios > Perfil > '+this.User.usuario)
        }
      },
      async fetch (){
        this.isPeticion = true
        this.activePrompt = false,
          this.User =(await this.$axios.get('/usuarios/'+this.$route.params.user, {
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          })).data
        this.modulos = this.User.sub
        this.User = this.User.user
        this.isPeticion = false
        if (this.User.estado === 1)
          this.estado = true
        else
          this.estado = false
        this.cambiarTitulo()
      }
    }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
