<template>
  <v-container class="pt-2 pr-2 pl-2 d-flex justify-center">
    <v-card width="55%">
      <v-progress-linear indeterminate color="green" v-if="isPeticion"></v-progress-linear>
      <v-row>
        <v-col cols="10"><v-card-title>Colaborador Nuevo</v-card-title></v-col>
        <v-col cols="2" class="d-flex align-center justify-end">
          <div class="pr-2">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="dialogPuesto = true" v-on="on" v-bind="attrs" color="success" fab x-small dark>
                  <v-icon >fa fa-briefcase</v-icon>
                </v-btn>
              </template>
              <span>Agregar Puesto de Trabajo</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-form ref="FormNuevoColaborador" class="pl-2 pr-2">
        <small>Datos Generales</small>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="colaborador.nombres"
                          :counter="50" :rules="[rule.nombres.req,rule.nombres.min, rule.nombres.max]"
                          label="Nombres del Colaborador" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field  v-model="colaborador.apellidos"
                            :counter="50" :rules="[rule.nombres.req,rule.nombres.min, rule.nombres.max]"
                           label="Apellidos del Colaborador" required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field  :counter="14" :rules="[rule.num.req, rule.identidad.some, rule.identidad.id]"
                           v-model="colaborador.identidad" label="Identidad" required></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="colaborador.correo" :rules="rule.email"
              label="E-mail" required></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field  :counter="8"  v-model="colaborador.telefono"
                           :rules="[rule.num.req, rule.telefono.tel, rule.telefono.some]"
                           label="Telefono" required></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select v-model="colaborador.puesto" :items="puestos" :item-text="'nombre'" :item-value="'id'"
                      label="Puesto de Trabajo" :rules="[rule.num.req]" ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select v-model="colaborador.sucursal" :items="sucursales" :item-text="'nombre'" :item-value="'id'"
                      label="Sucursal Asignada" :rules="[rule.num.req]"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-file-input accept="image/*" v-model="colaborador.foto"
                          :rules="[rule.num.req]" label="Foto del Colaborador"></v-file-input>
          </v-col>
        </v-row>
        <small>Datos Financieros</small>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="6">
            <v-select v-model="colaborador.banco" :items="Bancos" :item-text="'nombre'" :item-value="'id'"
                      label="Seleccione un Banco" :rules="[rule.num.req]"></v-select>
          </v-col>
          <v-col>
            <v-text-field  :counter="25" :rules="[rule.num.req, rule.num.min, rule.num.max]"
                           label="Número de Cuenta" required v-model="colaborador.numBanco"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex flex-row-reverse">
            <v-btn @click="validate" :disabled="isPeticion" color="warning" dark>Registrar Colaborador</v-btn>
          </v-col>
        </v-row>
      </v-form>
      <errores422 v-if="erroresServidor" :errores="erroresServidor"/>
    </v-card>

    <v-dialog v-model="dialogPuesto" width="400px">
      <v-card>
        <v-progress-linear indeterminate color="green" v-if="isPeticionPuestos"></v-progress-linear>
        <v-card-title>
          Agregar Puesto de Trbajo
        </v-card-title>
        <v-container>
          <v-form ref="FormNuevoPuestoTrabajo">
            <v-text-field v-model="nombrePuesto"
                          :counter="30" :rules="[rule.puesto.req,rule.puesto.min, rule.puesto.max]"
                          label="Nombre del Puesto" required></v-text-field>
            <v-row>
            <v-col class="d-flex flex-row-reverse">
              <v-btn @click="validate2" :disabled="isPeticionPuestos" color="warning" dark>Registrar Colaborador</v-btn>
            </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  import Errores422 from "../../components/Errores422";
  export default {
    name: "nuevo",
    components: {Errores422},
    data(){
      return{
        dialogPuesto: false,
        rule:{
          nombres:{
            req: v => !!v || 'Campo requerido',
            min:v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
            max:v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
          },
          puesto:{
            req: v => !!v || 'Campo requerido',
            min:v => (v && v.length >= 2) || 'Tiene que ser mayor a 2 carácteres.',
            max:v => (v && v.length <= 30) || 'Tiene que ser menor o igual a 30 carácteres.',
          },
          email:[
            v => (v.length === 0 || /.+@.+\..+/.test(v)) || 'E-mail no valido',
          ],
          num: {
            req: v => !!v || 'Campo requerido',
            min: v => (v && v.length >= 7) || 'Tiene que ser mayor a 7 carácteres.',
            max: v => (v && v.length <= 25) || 'Tiene que ser menor o igual a 25 carácteres.',
          },
          telefono: {
            some:v => (v.length === 0 || v.length === 8) || 'Tiene que ser de 8 carácteres.',
            tel: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Telefono no válido, tienes datos diferentes a números'
          },
          identidad: {
            some:v => (v.length === 0 || v.length === 13 || v.length === 14) || 'Tiene que ser de 13 o 14 carácteres.',
            id: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Identidad no válida, tienes datos diferentes a números'
          },
        },
        popupActivo:       false,
        puestos:           [],
        sucursales:        [],
        colaborador:       {
          puesto:    '',
          sucursal:  '',
          nombres:   '',
          apellidos: '',
          correo:    '',
          telefono:  '',
          identidad: '',
          banco:     '',
          numBanco:  '',
          foto:      [],
        },
        Bancos:            [],
        isPeticion:        false,
        isPeticionPuestos: false,
        nombrePuesto:      '',
        resPuesto:         [],
        erroresServidor:   [],
        foto: null
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Colaborador > Nuevo')
      this.cargarSucursales()
      this.cargarBancos()
      this.cargarPuesto()
    },
    methods:{
      agregarPuesto: function () {
        this.isPeticionPuestos = true
        this.$axios.post('/puesto_colaborador',{
          nombre: this.nombrePuesto
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.data.status){
            Swal.fire(
                'Registro Exitoso',
                `Se registro exitosamente el puesto de trabajo ${this.nombrePuesto}.`,
                'success'
            )
            this.dialogPuesto = false
            this.isPeticionPuestos = false
          }
          this.cargarPuesto()
        })
      },
      cargarBancos(){
        this.$axios.get('bancos',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Bancos = res.data.bancos
          }
        })
      },
      cargarPuesto: function () {
        this.$axios.get('/puestos_colaborador',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.puestos = res.data.puestos
        })
      },
      cargarSucursales(){
        this.isPeticion = true
        this.$axios.get('/sucursales',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.isPeticion = false
            this.sucursales = res.data.suc
          }
        })
      },
      registrarColaborador: function(){
        this.isPeticion = true
        let data = new FormData();
        data.append('nombres', this.colaborador.nombres);
        data.append('apellidos', this.colaborador.apellidos);
        data.append('identidad', this.colaborador.identidad);
        data.append('email', this.colaborador.correo);
        data.append('sucursal', this.colaborador.sucursal);
        data.append('puesto', this.colaborador.puesto);
        data.append('telefono', this.colaborador.telefono);
        data.append('banco', this.colaborador.banco);
        data.append('numBanco', this.colaborador.numBanco);
        data.append('foto', this.colaborador.foto);
        this.$axios({
          method: 'post',
          url: '/colaboradores',
          data:data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.isPeticion = false
          if (res.status === 200){
            Swal.fire(
                'Registro Exitoso',
                `Se registro exitosamente el colaborador ${this.colaborador.nombres} ${this.colaborador.apellidos}.`,
                'success'
            )
            this.$router.replace({path:"/colaborador/"})
          }
        }).catch( (error)=> {
          this.isPeticion = false
          if (error.response.status === 422){
            this.erroresServidor = error.response.data.errors
          }else if (error.response.status === 400){
            Swal.fire(
                'Registro Exitoso',
                error.response.data.error,
                'success'
            )
          }

        })
      },
      validate2(){
        if (this.$refs.FormNuevoPuestoTrabajo.validate())
          this.agregarPuesto()
      },
      validate(){
        if (this.$refs.FormNuevoColaborador.validate()) {
          this.erroresServidor = []
          this.registrarColaborador()
        }
      }
    },
  }
</script>

<style scoped>

</style>
