<template>
  <v-container class="pl-2 pt-2 pr-2">
    <v-card>
      <v-progress-linear v-if="isPeticion" indeterminate color="green"></v-progress-linear>
      <div v-else class="pr-2 pl-2">
        <v-row>
          <v-col cols="10">
            <v-card-title>
              <v-row>
                <v-col cols="10">
                  {{datosColaborador.nombres}} {{datosColaborador.apellidos}}
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-on="on" v-bind="attrs" color="success" v-if="datosColaborador.estado">fa fa-check</v-icon>
                      <v-icon v-on="on" v-bind="attrs" color="red" v-else>fa fa-times</v-icon>
                    </template>
                    <span>Ver Colaborador</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="2"></v-col>
              </v-row>
            </v-card-title>
          </v-col>
          <v-col cols="2" class="d-flex justify-end align-center">
            <div class="pr-2">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="referencia.dialogo = true" v-on="on" v-bind="attrs" color="pink" fab x-small dark>
                    <v-icon >fa fa-file</v-icon>
                  </v-btn>
                </template>
                <span>Crear referencia de trabajo</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="popupActivo = true"  v-on="on" v-bind="attrs" color="warning" fab x-small dark>
                    <v-icon >fa fa-user-edit</v-icon>
                  </v-btn>
                </template>
                <span>Editar Colaborador</span>
              </v-tooltip>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col md="4" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="pink">
              <v-row>
                <v-col cols="10"><strong>Correo</strong></v-col>
                <v-col cols="2"><v-icon>fa fa-envelope</v-icon></v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">{{datosColaborador.email}}</v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="4" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="deep-orange ">
              <v-row>
                <v-col cols="10"><strong>Puesto</strong></v-col>
                <v-col cols="2"><v-icon>fa fa-briefcase</v-icon></v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">{{datosColaborador.puesto_colaborador.nombre}} {{datosColaborador.codigo}}</v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="4" cols="12">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="purple">
              <v-row>
                <v-col cols="10"><strong>Sucursal</strong></v-col>
                <v-col cols="2"><v-icon>fa fa-map-marker-alt</v-icon></v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">{{datosColaborador.sucursal.nombre}}</v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col lg="3" cols="6">
            <v-card>
              <v-list>
                <v-subheader>
                  <v-row>
                    <v-col cols="9">Datos del usuario</v-col>
                    <v-col cols="3" v-if="isUsuario === 0">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn @click="redirecUser"  v-on="on" v-bind="attrs" color="success" fab x-small dark>
                            <v-icon >fa fa-plus</v-icon>
                          </v-btn>
                        </template>
                        <span>Crear usuario</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-subheader>
                <v-list-item-group v-if="isUsuario === 0">
                  <v-list-item>Este colaborador no tiene usuario</v-list-item>
                </v-list-item-group>
                <v-list-item-group v-else>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Usuario'"></v-list-item-title>
                      <v-list-item-subtitle v-text="datosColaborador.users[0].usuario"></v-list-item-subtitle>
                      <v-list-item-title v-text="'E-mail'"></v-list-item-title>
                      <v-list-item-subtitle v-text="datosColaborador.users[0].email"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-col>
          <v-col lg="4" cols="6">
            <v-card>
              <v-list two-line>
                <v-subheader>
                  <v-row>
                    <v-col cols="9">Cuentas Bancarias</v-col>
                    <v-col cols="3" class="d-flex justify-end">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn @click="popupBanco = true"  v-on="on" v-bind="attrs" color="success" fab x-small dark>
                            <v-icon >fa fa-plus</v-icon>
                          </v-btn>
                        </template>
                        <span>Añadir Cuenta Bancaria</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-subheader>
                <v-list-item v-for="item in datosColaborador.cuentas_banco_colaboradors">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.banco.nombre"></v-list-item-title>
                    <v-list-item-subtitle v-text="item.cuenta"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
          <v-col lg="5" cols="12">
            <v-card>
              <v-card-title>
                Contratos
              </v-card-title>
              <v-data-table dense :headers="header" :items="datosColaborador.contratos" :items-per-page="4">
                <template v-slot:item.estado="{item}">
                  <v-icon v-if="item.estado === 1" color="success">fa fa-check-circle</v-icon>
                  <v-icon v-else color="red">fa fa-times</v-icon>
                </template>
                <template v-slot:item.pago="{item}">
                  L. {{item.pago}}
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="popupActivo" width="600px">
          <v-progress-linear indeterminate color="green" v-if="this.isPeticionPrincipal"></v-progress-linear>
          <v-card class="pl-2 pr-2">
            <v-card-title>
              Editando {{datosColaborador.nombres}} {{datosColaborador.apellidos}}
            </v-card-title>
            <v-divider></v-divider>
            <v-form ref="FormEditarColaborador" class="pl-2 pr-2">
              <v-row>
                <v-col cols="6">
                  <v-text-field v-model="datosColaborador.nombres"
                                :counter="50" :rules="[rule.nombres.req,rule.nombres.min, rule.nombres.max]"
                                label="Nombres del Colaborador" required></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field  v-model="datosColaborador.apellidos"
                                 :counter="50" :rules="[rule.nombres.req,rule.nombres.min, rule.nombres.max]"
                                 label="Apellidos del Colaborador" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-text-field  :counter="14" :rules="[rule.num.req, rule.identidad.some, rule.identidad.id]"
                                 v-model="datosColaborador.identidad" label="Identidad" required></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="datosColaborador.email" :rules="rule.email"
                                label="E-mail" required></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field  :counter="8"  v-model="datosColaborador.telefono"
                                 :rules="[rule.num.req, rule.telefono.tel, rule.telefono.some]"
                                 label="Telefono" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                  <v-col cols="6">
                    <v-select v-model="datosColaborador.puesto_colaborador_id"
                              :items="puestos" :item-text="'nombre'" :item-value="'id'"
                              label="Puesto de Trabajo" :rules="[rule.num.req]" ></v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-select v-model="datosColaborador.sucursal_id" :items="sucursales"
                              :item-text="'nombre'" :item-value="'id'"
                              label="Sucursal Asignada" :rules="[rule.num.req]"></v-select>
                  </v-col>
                </v-row>
              <v-row>
                <v-col>
                  <v-switch v-model="datosColaborador.estado" label="Estado del colaborador">
                  </v-switch>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex flex-row-reverse">
                  <v-btn @click="validateEdit" :disabled="isPeticionPrincipal" color="warning" dark>Registrar Colaborador</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </v-card>

    <v-dialog v-model="popupBanco" width="400px">
      <v-card class="pl-2 pr-2">
        <v-progress-linear indeterminate color="green" v-if="cuentaB.load"></v-progress-linear>
        <v-card-title class="d-flex justify-center">
          Agregando Cuenta de Banco
        </v-card-title>
        <v-form ref="FormNuevaCuentaBancoColaborador">
          <v-select v-model="cuentaB.banco" :items="Bancos" :item-text="'nombre'" :rules="[ruleBanco.req]"
                    :item-value="'id'" label="Banco"></v-select>
          <v-text-field v-model="cuentaB.cuenta" :counter="25"
                        :rules="[ruleBanco.req, ruleBanco.min, ruleBanco.max]"
                        label="Número de Cuenta" required></v-text-field>
          <v-col class="d-flex flex-row-reverse">
            <v-btn @click="validate" :disabled="cuentaB.load" color="warning" dark>Registrar Sucursal</v-btn>
          </v-col>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="referencia.dialogo" width="35%">
      <v-card>
        <v-toolbar dense flat color="grey lighten-4">
          <v-card-title>Creando Referencia Laboral</v-card-title>
        </v-toolbar>
        <v-container>
          <v-card-text>*Las fechas de los siguientes campos, solo se usan cuando se autoriza que la referencia laboral sea con rango de fecha.</v-card-text>
          <v-row>
            <v-col>
              <v-dialog ref="dialogoFechaInicio" v-model="referencia.dialogoI" :return-value.sync="referencia.fecha_inicial"
                        persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field dense class="ma-2" label="Fecha de inicio" v-bind="attrs" v-on="on"
                                v-model="referencia.fecha_inicial"></v-text-field>
                </template>
                <v-date-picker v-model="referencia.fecha_inicial" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="referencia.dialogoI = false">Cancelar</v-btn>
                  <v-btn text color="primary" @click="$refs.dialogoFechaInicio.save(referencia.fecha_inicial)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col>
              <v-dialog ref="dialogoFechaFinal" v-model="referencia.dialogoF" :return-value.sync="referencia.fecha_final"
                        persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field dense class="ma-2" label="Fecha de inicio" v-bind="attrs" v-on="on"
                                v-model="referencia.fecha_final"></v-text-field>
                </template>
                <v-date-picker v-model="referencia.fecha_final" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="referencia.dialogoF = false">Cancelar</v-btn>
                  <v-btn text color="primary" @click="$refs.dialogoFechaFinal.save(referencia.fecha_final)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col>
              <v-card-text>Items de la Referencia</v-card-text>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="d-flex justify-end">
              <v-btn color="success" small tile dark text @click="addItem">Añadir item</v-btn>
            </v-col>
          </v-row>

          <v-divider></v-divider>

          <v-simple-table dense height="200px" fixed-header>
            <template v-slot:default>
              <thead>
              <tr>
                <th>#</th>
                <th>Nombre del Item</th>
                <th>Quitar</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, i) in referencia.items">
                <td>{{i + 1}}</td>
                <td>
                  <v-text-field dense v-model="item.nombre"></v-text-field>
                </td>
                <td>
                  <v-btn @click="removeItem(i)" color="red" x-small fab text dark><v-icon>fa fa-times</v-icon></v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" @click="referencia.dialogo = false" dark tile small>Cerrar</v-btn>
          <v-btn color="success" dark tile small @click="solicitarClave">Crear Documento</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  import {ipcRenderer} from "electron";
  export default {
    data(){
      return{
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
        ruleBanco:{
          req: v => !!v || 'Campo requerido',
          min: v => (v && v.length >= 7) || 'Tiene que ser mayor a 7 carácteres.',
          max: v => (v && v.length <= 25) || 'Tiene que ser menor o igual a 25 carácteres.',
        },
        cuentaB:{
          load: false,
          banco: null,
          cuenta: null
        },
        header:[
          {text: 'Inicio', value:'fecha_inicio'},
          {text: 'Final', value:'fecha_final'},
          {text: 'Pago', value:'pago'},
          {text: 'Estado', value:'estado', align:'center'},
        ],
        Bancos: null,
        popupBanco: false,
        isUsuario:        0,
        activePrompt:     false,
        isPeticion:       true,
        referencia:{
          fecha_inicial: null,
          fecha_final: null,
          items: [
            {key: 0,  nombre: 'Responsablidad'},
            {key: 1,  nombre: 'Honestidad'},
            {key: 2,  nombre: 'Eficacia'},
          ],
          dialogo: false,
          dialogoF: false,
          dialogoI: false
        },
        isPeticionPrincipal: false,
        erroresServidor:  [],
        sucursales:       null,
        puestos:          null,
        editColaborador:{
          nombres:   null,
          apellidos: null,
          identidad: null,
          correo:    null,
          telefono:  null,
          sucursal:  null,
          puesto:    null,
          estado:    null,
          id:        null
        },
        popupActivo:      false,
        datosColaborador: null,
      }
    },
    computed:{
      tipoUser: function () {
        return this.$store.state.tipoUsuario
      },
      USUARIO(){
        return this.$store.state.usuario;
      },
    },
    created() {
      this.cargarColaboradores()
      this.cargarBancos();
      this.cargarPuestosColaborador();
      this.cargarSucursales();
    },
    methods:{
      abrirNavegador(clave){
        let url1 = this.$axios.defaults.baseURL + 'documentos/colaboradores/referencia_laboral/usuario=' + this.USUARIO;
        let url2 = '/colaborador=' + this.datosColaborador.id + '/'+clave
        let url3 = '/fecha_inicio='+this.referencia.fecha_inicial+'&fecha_final='+this.referencia.fecha_final;
        let url4 = '&items='+JSON.stringify(this.referencia.items)
        let url = url1+url2+url3+url4
        ipcRenderer.send('pint_navegador', url);
        this.$store.commit('activarOverlay', false);
        this.referencia.fecha_final   = null;
        this.referencia.fecha_inicial = null;
      },
      addItem(){
        let long = this.referencia.items.length;
        this.referencia.items.push({
          key: long,
          nombre: '',
        })
      },
      cambiosColaborador: function(){
        this.isPeticionPrincipal = true
        this.$axios.put('/colaboradores/'+this.datosColaborador.id,{
          nombres:   this.datosColaborador.nombres,
          apellidos: this.datosColaborador.apellidos,
          email:     this.datosColaborador.email,
          telefono:  this.datosColaborador.telefono,
          identidad: this.datosColaborador.identidad,
          estado:    this.datosColaborador.estado,
          puesto:    this.datosColaborador.puesto_colaborador_id,
          sucursal:  this.datosColaborador.sucursal_id
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.isPeticionPrincipal = false
          if (res.status === 200){
            Swal.fire(
                'Registro de Cambio Exitoso',
                `Se registraron los cambios exitosamente del
              colaborador ${this.datosColaborador.nombres} ${this.datosColaborador.apellidos}.`,
                'success'
            )
            this.popupActivo = false
          }
        }).catch((error)=>{
          this.isPeticionPrincipal = false
          this.erroresServidor = error.response.data.error
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
      cargarColaboradores(){
        this.popupActivo = false
        this.$axios.get('/colaboradores/'+this.$route.params.colaborador,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.isUsuario = res.data.isUser;
            this.datosColaborador = res.data.col;
            this.isPeticion = false
            this.isPeticionPrincipal = false
            this.$store.commit('guardarTitulo', 'Colaborador > '+this.datosColaborador.nombres +' '+this.datosColaborador.apellidos)
            if (this.datosColaborador.estado === 1)
              this.datosColaborador.estado = true
            else
              this.datosColaborador.estado = false
          }
        })
      },
      cargarPuestosColaborador: function () {
        this.$axios.get('/puestos_colaborador',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.puestos = res.data.puestos;
        })
      },
      cargarSucursales: function () {
        this.$axios.get('/sucursales',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.sucursales = res.data.suc;
        })
      },
      solicitarClave(){
        this.referencia.dialogo = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('solicitar_clave_doucmento').then((res)=>{
          this.abrirNavegador(res.data.clave)
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
        });
      },
      registrarCuentaBanco(){
        if (this.cuentaB.cuenta && this.cuentaB.banco){
          this.cuentaB.load = true
          this.$axios.post('cuenta_banco', {
            col: this.datosColaborador.id,
            cuenta: this.cuentaB.cuenta,
            banco: this.cuentaB.banco
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.cuentaB.load = false
              this.popupBanco = false
              Swal.fire(
                  'Registro Exitoso',
                  `Se registro exitosamente la cuenta de banco ${this.cuentaB.cuenta}.`,
                  'success'
              )
              this.cuentaB.cuenta = ''
              this.cargarColaboradores()
            }
          })
        }
      },
      redirecUser(){
        this.$router.replace({path:'/admin/user/nuevo'})
      },
      removeItem(fila){
        let cont = 0;
        if (this.referencia.items.length > 2){
          this.referencia.items.splice(fila, 1);
          this.referencia.items.forEach( (i) => {
            i.key = cont;
            cont++;
          })
        }else{
          this.$store.commit('notificacion',{texto:'Tienen que ir mínimo 2 items', color:'warning'})
        }
      },
      validate(){
        if (this.$refs.FormNuevaCuentaBancoColaborador.validate())
          this.registrarCuentaBanco()
      },
      validateEdit(){
        if (this.$refs.FormEditarColaborador.validate())
          this.cambiosColaborador()
      },
    },
  }
</script>

<style scoped>

</style>
