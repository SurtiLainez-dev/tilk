<template>
  <v-container class="pd-2 d-flex justify-center">
    <v-card width="70%">
      <v-card-title>
        Crear un Usuario Nuevo
      </v-card-title>
      <v-divider> </v-divider>
      <v-form ref="FormUsuarioNuevo" class="pl-5 pr-5 " >
        <v-row>
          <v-col cols="6">
            <v-select
              v-model="usuario.sucursal"
              :items="Sucursales"
              :item-text="'nombre'"
              :rules="[rule.required]"
              :item-value="'id'"
              label="Seleccionar Sucursal"
              @change="cargarColaboradores"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              :rules="[rule.required]"
              v-model="usuario.colaborador"
              :items="colaboradores"
              :item-text="'nombres'"
              :item-value="'id'"
              :disabled="isColaborador"
              label="Seleccionar Colaborador">
              <template slot='item' slot-scope='{ item }'>
                {{ item.nombres }} {{ item.apellidos }}
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="usuario.usuario"
              :rules="usuarioRules"
              :counter="25"
              label="Nombre de Usuario"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="usuario.correo" :rules="rulesEmail"
                          label="E-mail de ingreso" required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="usuario.password" :type="show ? 'text' : 'password'"
                          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" label="Contraseña"
                          class="input-group--focused" @click:append="show = !show" :rules="[rule.required, rule.min]">
            </v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select v-model="usuario.tipo" :items="tipoUsuario" :item-text="'nombre'"
              :item-value="'id'" label="Tipo de Usuario" :rules="[rule.required]"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn dark color="orange" :disabled="isPeticion" @click="validar">Registrar Usuario</v-btn>
          </v-col>
        </v-row>
      </v-form>
      <errores422 v-if="erroresServidor" :errores="erroresServidor"/>
    </v-card>
  </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  import Errores422 from "../../../components/Errores422";
    export default {
      components:{Errores422},
      name: "nuevo",
      data(){
        return{
          valid:true,
          lazy: false,
          erroresServidor: null,
          show: false,
          rule:{
            required: value => !!value || 'Campo requerido',
            min: v => v.length >= 8 || 'Debe ingresar mínimo 8 carácteres',
          },
          usuarioRules: [
            v => !!v || 'El usuario es Requerido',
            v => v.length <= 25 || 'Ingresar máximo 25 carácteres',
            v => v.length >= 5 || 'Ingresar mínimo 5 carácteres',
          ],
          rulesEmail: [
            v => !!v || 'E-mail requerido',
            v => /.+@.+\..+/.test(v) || 'E-mail no valido',
          ],
          usuario:         {
            sucursal: '',
            colaborador: '',
            tipo: '',
            usuario: '',
            correo: '',
            password: '',
          },
          Sucursales:      null,
          isPeticion:      false,
          colaboradores:   null,
          tipoUsuario:     null,
          isColaborador:   true,
        }
      },
      methods:{
        cargarColaboradores:function () {
          this.$axios.get('/colaboradores_suc/'+this.usuario.sucursal,{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            this.isPeticion = false
            if (res.status === 200){
              this.colaboradores = res.data.col
              this.isColaborador = false
            }
          })
        },
        registrarUsuario:function () {
          this.erroresServidor = []
          this.isPeticion = true
          this.$axios.post('/usuarios',{
            usuario: this.usuario.usuario,
            colaborador_id: this.usuario.colaborador,
            email: this.usuario.correo,
            password: this.usuario.password,
            tipo_usuario_id: this.usuario.tipo,
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            this.isPeticion = false
            if (res.status === 200){
              let id = res.data.id;
              Swal.fire(
                'Usuario Registrado',
                `El usuario ${this.usuario.usuario} se ha registrado exitosamente.`,
                'success'
              )
              this.$router.replace({path:"/admin/user/"+id})
            }
          }).catch((error)=>{
            this.isPeticion = false
            if (error.response.status === 422){
              this.erroresServidor = error.response.data.errors
            }
            if (error.response.status  === 400){
              this.erroresServidor = [{'error': 'Hubo un problema con el servidor al ingresa los datos, intente nuevamente. ' +
                  'Si el error persiste contacte al servicio técnico.'}]
            }

          })
        },
        validar(){
          if (this.$refs.FormUsuarioNuevo.validate()){
            this.registrarUsuario()
          }
        },
      },
      created() {
        this.$store.commit('guardarTitulo', 'Usuarios > Nuevo')
      },
      async fetch (){
        this.Sucursales =(await this.$axios.get('/sucursales', {
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        })).data.suc
        this.tipoUsuario = (await this.$axios.get('/tipos_usuarios',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        })).data.tipos
      }
    }
</script>

<style scoped>

</style>
