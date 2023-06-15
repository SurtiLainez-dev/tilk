<template>
  <v-container class="pl-2 pr-2">
    <v-card flat>
      <v-toolbar flat color="grey lighten-5">
        <h6>Catálogo Contable</h6>
        <v-spacer></v-spacer>
        <v-text-field label="Buscar Cuenta" v-model="search"></v-text-field>
      </v-toolbar>
      <v-progress-linear color="success" indeterminate v-if="LOAD"></v-progress-linear>

      <v-data-table dense :search="search" :items-per-page="15" :items="CUENTAS" :headers="headerP">
        <template v-slot:item.id="{item}">
          <b-link @click="abrirDialogo(item)">Ver Datos</b-link>
        </template>
        <template v-slot:item.total="{item}">L {{int.format(item.total)}}</template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="registros.dialogo" width="100%">
      <v-card class="pb-5 pl-5 pr-5">
        <v-toolbar  flat color="grey lighten-4">
          <h6>Datos de la Cuenta <strong>{{registros.datos.nombre}}</strong></h6>
          <v-spacer></v-spacer>
          <v-btn tile color="red" fab x-small dark  @click="registros.dialogo = false"><v-icon>fa fa-times</v-icon></v-btn>
        </v-toolbar>
        <v-row no-gutters>
          <v-col cols="11">
            <v-card flat v-if="vista === 0">
              <v-card class="ma-5">
                <v-toolbar flat>
                  <h6>Registros de la Cuenta <strong>{{registros.datos.nombre}}</strong></h6>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-text-field dense label="Buscar en registros"
                                class="ma-2" v-model="registros.search"></v-text-field>
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn tile x-small fab v-on="on" v-bind="attrs"
                             @click="printRegistros" dark><v-icon>fa fa-print</v-icon></v-btn>
                    </template>
                    <span>Imprimir los Registros de la cuenta {{registros.datos.nombre}}</span>
                  </v-tooltip>
                </v-toolbar>
                <v-data-table :items-per-page="5" dense :headers="header" :items="registros.data"
                              :search="registros.search">
                  <template v-slot:item.detalle="{item}">
                    <v-tooltip top>
                      <template v-slot:activator="{on, attrs}">
                        <span v-on="on" v-bind="attrs">{{item.detalle.substr(0,60)}}</span>
                      </template>
                      <span>{{item.detalle}}</span>
                    </v-tooltip>
                  </template>
                  <template v-slot:item.tipo="{item}">
                    <v-chip v-if="item.tipo === 0" x-small color="success" dark>Crédito</v-chip>
                    <v-chip v-else-if="item.tipo === 1" x-small color="orange" dark>Débito</v-chip>
                  </template>
                  <template v-slot:item.total="{item}">L {{int.format(item.total)}}</template>
                  <template v-slot:item.totalViejo="{item}">L {{int.format(item.totalViejo)}}</template>
                  <template v-slot:item.totalNuevo="{item}">L {{int.format(item.totalNuevo)}}</template>
                </v-data-table>
              </v-card>

              <v-alert dense color="orange" class="ma-5" v-if="!registros.estado && registros.cuentas.length > 0"
                       dismissible dark>
                El total de la cuenta con el total de las sub-cuentas no es igual. Tienes
                que readecuar el total de la cuenta.
              </v-alert>

              <v-row no-gutters>
                <v-col cols="3">
                  <v-card class="ma-5">
                    <v-toolbar flat>
                      <h6>Datos</h6>
                    </v-toolbar>
                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                        <tr>
                          <th>Nombre:</th>
                          <td>{{registros.datos.nombre}}</td>
                        </tr>
                        <tr>
                          <th>Código:</th>
                          <td>{{registros.datos.cod}}</td>
                        </tr>
                        <tr>
                          <th>Código Dependiente:</th>
                          <td>{{registros.datos.cod_dep}}</td>
                        </tr>
                        <tr>
                          <th>Cuenta Dependiente:</th>
                          <td><b-link @click="abrirDialogo(registros.dep)">{{registros.dep.nombre}}</b-link></td>
                        </tr>
                        <tr>
                          <th>Total de la Cuenta:</th>
                          <td>L {{int.format(registros.datos.total)}}</td>
                        </tr>
                        <tr>
                          <th>Total de Registros:</th>
                          <td>{{registros.total}}</td>
                        </tr>
                        <tr>
                          <th>Total de Sub-cuentas:</th>
                          <td>L {{int.format(registros.totalSubs)}}</td>
                        </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                </v-col>
                <v-col cols="9">
                  <v-card class="ma-5">
                    <v-toolbar flat >
                      <h6>Sub Cuentas de la Cuenta <strong>{{registros.datos.nombre}}</strong></h6>
                    </v-toolbar>
                    <v-data-table :items-per-page="7" dense :items="registros.cuentas"
                                  :headers="registros.header">
                      <template v-slot:item.id="{item}">
                        <b-link @click="abrirDialogo(item)">Ver</b-link>
                      </template>
                      <template v-slot:item.total="{item}">
                        L {{int.format(item.total)}}
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>

            <v-card flat v-if="vista === 1">
              <v-toolbar flat>
                <h6>Registros de la Cuenta <strong>{{registros.datos.nombre}}</strong></h6>
                <v-spacer></v-spacer>
                <v-text-field dense label="Buscar en registros"
                              class="ma-2" v-model="registros.search"></v-text-field>
              </v-toolbar>
              <v-data-table :items-per-page="15" dense :headers="header" :items="registros.data"
                            :search="registros.search">
                <template v-slot:item.detalle="{item}">
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <span v-on="on" v-bind="attrs">{{item.detalle.substr(0,60)}}</span>
                    </template>
                    <span>{{item.detalle}}</span>
                  </v-tooltip>
                </template>
                <template v-slot:item.tipo="{item}">
                  <v-chip v-if="item.tipo === 0" x-small color="indigo" dark>Crédito</v-chip>
                  <v-chip v-else-if="item.tipo === 1" x-small color="success" dark>Débito</v-chip>
                </template>
                <template v-slot:item.total="{item}">
                  L {{int.format(item.total)}}
                </template>
                <template v-slot:item.totalViejo="{item}">L {{int.format(item.totalViejo)}}</template>
                <template v-slot:item.totalNuevo="{item}">L {{int.format(item.totalNuevo)}}</template>
              </v-data-table>
            </v-card>

            <v-card flat v-if="vista === 2">
              <v-toolbar flat >
                <h6>Sub Cuentas de la Cuenta <strong>{{registros.datos.nombre}}</strong></h6>
              </v-toolbar>
              <v-data-table :items-per-page="15" dense :items="registros.cuentas"
                            :headers="registros.header">
                <template v-slot:item.id="{item}">
                  <b-link @click="abrirDialogo(item)">Ver</b-link>
                </template>
                <template v-slot:item.total="{item}">
                  L {{int.format(item.total)}}
                </template>
              </v-data-table>
            </v-card>

            <vista_editar_registros v-if="vista === 3 && PERMISOS.includes(414)" :data="registros.datos"/>

            <v-card flat v-if="vista === 4" class="d-flex justify-center ma-5">
              <v-card width="70%" class="ma-5">
                <v-card-title>Creando una Obligación Nueva</v-card-title>
                <v-divider></v-divider>
                <v-card-text>Esta obligación suma el total a las cuentas que se van a modificar</v-card-text>
                <v-form ref="FormOnligacionContableNueva">
                  <v-subheader>CUENTA CONTABLES DEL DÉBITO</v-subheader>
                  <v-row no-gutters>
                    <v-col cols="3">
                      <v-text-field dense label="Código de la Cuenta" v-model="registros.datos.cod"
                                    disabled class="ma-2" :rules="[rule.nombres.req]"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field dense label="Nombre de la Cuenta" v-model="registros.datos.nombre"
                                    disabled class="ma-2" :rules="[rule.nombres.req]"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field dense label="Total de la Cuenta" v-model="registros.datos.total"
                                    disabled suffix="lps" class="ma-2" ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-subheader>CUENTA CONTABLES DEL CRÉDITO</v-subheader>
                  <v-autocomplete class="ma-2" dense :items="CC" v-model="ccCredito.datos" :rules="[rule.nombres.req]"
                                  label="Buscar Cuenta del Crédito" @change="capturarCCCredito"></v-autocomplete>
                  <v-row no-gutters>
                    <v-col cols="3">
                      <v-text-field dense label="Código de la Cuenta" v-model="ccCredito.cod"
                                    disabled class="ma-2" :rules="[rule.nombres.req]"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field dense label="Nombre de la Cuenta" v-model="ccCredito.nombre"
                                    disabled class="ma-2" :rules="[rule.nombres.req]"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field dense label="Total de la Cuenta" v-model="ccCredito.total"
                                    disabled suffix="lps" class="ma-2" :rules="[rule.nombres.req]"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="9">
                      <v-text-field label="Comentario de la Partida" class="ma-2" dense v-model="ccCredito.comentario"
                                    :rules="[rule.nombres.req, rule.nombres.min, rule.nombres.max]"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field label="Total de la Obligación" class="ma-2" dense v-model="ccCredito.totalObl"
                                    :rules="[rule.nombres.req, rule.total.min]"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-card-actions class="d-flex justify-end">
                    <v-btn color="success" @click="validarFormObligacion" tile small dark >Registrar Obligación</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-card>

            <v-card flat v-if="vista === 5" class="d-flex justify-center ma-5">
              <v-card width="30%" class="ma-5">
                <v-card-title>Cuenta Nueva</v-card-title>
                <v-form ref="FormNuevaSubCuenta">
                  <v-text-field dense disabled v-model="registros.datos.nombre"
                                :rules="[rule.nombres.req]"
                                label="Cuenta Padre" class="ma-2"></v-text-field>
                  <v-text-field dense disabled v-model="registros.datos.cod"
                                :rules="[rule.nombres.req]"
                                label="Código de Cuenta Padre" class="ma-2"></v-text-field>
                  <v-text-field dense :rules="[rule.nombres.req, rule.nombres.min, rule.nombres.max]"
                                label="Nombre de la Nueva Cuenta" v-model="nuevaC.nombre"
                                class="ma-2"></v-text-field>
                  <v-text-field dense v-model="nuevaC.comentario" :rules="[rule.nombres.req]"
                                label="Comentario de la Cuenta Nueva" class="ma-2"></v-text-field>
                  <v-checkbox label="Incluir todas las sucursales en esta cuenta" dense
                              v-model="nuevaC.sucursales"></v-checkbox>
                  <v-divider></v-divider>
                  <v-card-actions class="d-flex justify-end">
                    <v-btn color="success" @click="validarForm" tile small dark >Registrar Cuenta</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-card>

            <v-card tile  flat v-if="vista === 6" class="d-flex justify-center ma-5">
              <v-card width="30%" tile>
                <v-card-title>Cuenta Nueva Ligada a una Sucursal</v-card-title>
                <v-form ref="FormNuevaSubCuentaSucursal">
                  <v-text-field dense disabled v-model="registros.datos.nombre"
                                :rules="[rule.nombres.req]"
                                label="Cuenta Padre" class="ma-2"></v-text-field>
                  <v-text-field dense disabled v-model="registros.datos.cod"
                                :rules="[rule.nombres.req]"
                                label="Código de Cuenta Padre" class="ma-2"></v-text-field>
                  <v-text-field dense :rules="[rule.nombres.req, rule.nombres.min, rule.nombres.max]"
                                label="Nombre de la Nueva Cuenta" v-model="nuevaC.nombre"
                                class="ma-2"></v-text-field>
                  <v-text-field dense v-model="nuevaC.comentario" :rules="[rule.nombres.req]"
                                label="Comentario de la Cuenta Nueva" class="ma-2"></v-text-field>
                  <v-autocomplete label="Sucursal Enlazada" :rules="[rule.nombres.req]" :items="SUCURSALES"
                                  :item-text="'nombre'" :item-value="'id'"
                                  dense v-model="nuevaC.sucursal" class="ma-2"></v-autocomplete>
                  <v-divider></v-divider>
                  <v-card-actions class="d-flex justify-end">
                    <v-btn color="success" @click="validarFormAddCCSucursal" tile small dark >Registrar Cuenta</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-card>

          </v-col>


          <v-col cols="1">
            <v-row no-gutters v-for="item in btns"><v-col class="d-flex justify-center">
              <v-col class="d-flex justify-end">
                <v-tooltip left>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn dark class="ma-1" :color="item.color" v-on="on"
                           v-bind="attrs" fab @click="vista =item.val">
                      <v-icon>{{item.icon}}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{item.text}}</span>
                </v-tooltip>
              </v-col>
            </v-col></v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import {ipcRenderer} from "electron";
  import vista_editar_registros from "@/components/contabilidad/vista_editar_registros";
  export default {
    name: "index",
    components:{vista_editar_registros},
    computed:{
      LOAD(){
        return this.$store.state.contabilidad.catalogo.LOADCUENTAS;
      },
      CUENTAS(){
        return this.$store.state.contabilidad.catalogo.CUENTAS;
      },
      CC(){
        return this.$store.state.contabilidad.catalogo.CC;
      },
      USUARIO(){
        return this.$store.state.usuario;
      },
      PERMISOS(){
        let permisos = this.$store.state.permisosUser.split(',');
        let per = [];
        if (permisos.length > 1){
          permisos.forEach((item)=>{
            per.push(parseInt(item))
          })
          return per;
        }else
          return [];
      },
      LOAD_SUCURSALES(){
        return this.$store.state.suc.LOAD_SUCURSALES;
      },
      SUCURSALES(){
        return this.$store.state.suc.SUCURSALES;
      }
    },
    data(){
      return{
        int: new Intl.NumberFormat(),
        Cuentas: [],
        nuevaC:{
          nombre:     '',
          comentario: '',
          total:       0,
          sucursales:  false,
          sucursal: ''
        },
        field:[
          {key:'cod', label:'Código'},
          {key:'cod_dep', label:'Cuenta Dependiente'},
          {key:'nombre', label:'Nombre de la Cuenta'},
          {key:'total', label:'Total'},
          {key:'registros', label:'Datos'},
        ],
        search:'',
        registros:{
          datos: '',
          data: [],
          dialogo: false,
          search: '',
          cuentas: [],
          header:[
            {text:'Codigo', value:'cod'},
            {text:'Codigo Dependiente', value:'cod_dep'},
            {text:'Nombre', value:'nombre'},
            {text:'Total', value:'total'},
            {text:'Datos', value:'id'},
          ],
          total: 0,
          dep: {},
          select: null,
          totalSubs: 0,
          estado: false
        },
        header:[
          {text:'Tipo', value:'tipo'},
          {text:'Fecha', value:'fecha'},
          {text:'Detalle', value:'detalle'},
          {text:'Partida', value:'partida'},
          {text:'Total', value:'total'},
          {text:'Total Viejo', value:'totalViejo'},
          {text:'Total Nuevo', value:'totalNuevo'},
        ],
        headerP:[
          {text:'Código', value:'cod'},
          {text:'Cuenta Dependiente', value:'cod_dep'},
          {text:'Nombre de la Cuenta', value:'nombre'},
          {text:'Total', value:'total'},
          {text:'Datos', value:'id'},
        ],
        vista: 0,
        itemHistorial: 5,
        itemSubs:      5,
        btns:[
          {color:'pink darken-1',        text: 'Ver Historial',                            icon: 'fa fa-history',      val: 1},
          {color:'indigo darken-1',      text: 'Ver Sub-cuentas',                          icon: 'fa fa-sitemap',      val: 2},
          {color:'teal darken-1',        text: 'Crear Registro',                           icon: 'fa-solid fa-pen',    val: 3},
          {color:'deep-orange darken-1', text: 'Crear Obligación',                         icon: 'fa fa-sign-out-alt', val: 4},
          {color:'blue-grey darken-1',   text: 'Crear Sub-cuenta',                         icon: 'fa fa-plus',         val: 5},
          {color:'blue-grey darken-1',   text: 'Crear Sub-cuenta - Ligada a una sucursal', icon: 'fa fa-plus',         val: 6},
        ],
        rule:{
          nombres:{
            req: v => !!v || 'Campo requerido',
            min:v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
            max:v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
          },
          total:{
            min: v => v >=0 || 'No se aceptan totales menores a 0'
          }
        },
        ccCredito: {
          nombre:     '',
          id:         '',
          cod:        '',
          total:      0,
          datos:      null,
          comentario: '',
          totalObl:   0
        },
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Contabilidad > Catálogo Contable');
      this.$store.commit('contabilidad/catalogo/cargar_CUENTAS');
      this.$store.commit('suc/cargar_SUCURSALES');
    },
    methods:{
      abrirNavegador(clave){
        let url = this.$axios.defaults.baseURL+'documentos/registros_cuenta/usuario='+this.USUARIO+'/cod_cuenta='+this.registros.datos.cod+'/'+clave;
        ipcRenderer.send('pint_navegador', url);
        this.$store.commit('activarOverlay', false);
        this.registros.dialogo = true;
      },
      abrirDialogo(item){
        this.vista               = 0;
        this.registros.totalSubs = 0;
        this.registros.datos     = item;
        if (item.registros) {
          this.registros.data    = JSON.parse(item.registros);
          this.registros.total   = this.registros.data.length;
        }else {
          this.registros.data    = [];
          this.registros.total   = 0;
        }

        if (item.cod_dep === 0) {
          this.registros.dep = item;
        }else {
          let cuentaDep = []
          cuentaDep = this.CUENTAS.filter(i => i.cod === item.cod_dep);
          this.registros.dep = cuentaDep[0];
        }

        this.registros.cuentas = this.CUENTAS.filter(i=> i.cod_dep === item.cod);
        this.registros.cuentas.forEach((i)=>{
          if (i.cod > 0){
            if (i.total)
              this.registros.totalSubs = parseFloat(this.registros.totalSubs) + parseFloat(i.total);
            else
              this.registros.totalSubs = parseFloat(this.registros.totalSubs) + parseInt(0);
          }
        });

        this.registros.estado = this.registros.totalSubs.toFixed(2) === this.registros.datos.total.toFixed(2);
        this.registros.dialogo = true;
      },
      capturarCCCredito(){
        let ccs    = this.CC.filter(i => i.value === this.ccCredito.datos);

        this.ccCredito.cod       = ccs[0].texto.split('-')[0];
        this.ccCredito.id        = ccs[0].texto.split('-')[1];
        this.ccCredito.nombre    = ccs[0].texto.split('-')[2];
        this.ccCredito.total     = ccs[0].texto.split('-')[3];
      },
      go(url){
        this.$router.replace({path: url})
      },
      nuevaCuenta(){
        this.$store.commit('activarOverlay', true);
        this.registros.dialogo = false;
        this.$axios.post('contabilidad/2.0/cuenta',{
          cod_dep:    this.registros.datos.cod,
          nombre:     this.nuevaC.nombre,
          comentario: this.nuevaC.comentario,
          sucursales: this.nuevaC.sucursales
      }).then((res)=>{
        this.nuevaC.nombre     = '';
        this.nuevaC.comentario = '';
        this.nuevaC.sucursales = false;
        this.$store.commit('contabilidad/catalogo/cargar_CUENTAS');
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
          this.vista = 0;
        }, 3000);
      })
      },
      nuevaCuentaSucursal(){
        this.$store.commit('activarOverlay', true);
        this.registros.dialogo = false;
        this.$axios.post('contabilidad/2.0/cuenta_sucursal',{
          cod_dep:    this.registros.datos.cod,
          nombre:     this.nuevaC.nombre,
          comentario: this.nuevaC.comentario,
          sucursales: this.nuevaC.sucursales,
          sucursal:   this.nuevaC.sucursal
      }).then((res)=>{
        this.nuevaC.nombre     = '';
        this.nuevaC.comentario = '';
        this.nuevaC.sucursal   = '';
        this.$store.commit('contabilidad/catalogo/cargar_CUENTAS');
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
          this.vista = 0;
        }, 3000);
      }).catch((error)=>{
          console.log(error)
          this.registros.dialogo = true;
          this.$store.commit('activarOverlay', false);
          if (error.response.status == 422) {
            this.$store.commit('notificacion',{texto:error.response.data.msj, color:'error'});
          }
        })
      },
      printRegistros(){
        this.$store.commit('activarOverlay', true);
        this.registros.dialogo = false;
        this.$axios.post('solicitar_clave_doucmento').then((res)=>{
          this.abrirNavegador(res.data.clave);
        }).catch((error)=>{
          this.registros.dialogo = true;
          this.$store.commit('activarOverlay', false);
        })
      },
      registrarObligacion(){
        this.$store.commit('activarOverlay', true);
        this.registros.dialogo = false;

        this.$axios.post('contabilidad/2.0/cuenta/obligacion',{
          comentario: this.ccCredito.comentario,
          total:      this.ccCredito.totalObl,
          ccDebito:   this.registros.datos.id,
          ccCredito:  this.ccCredito.id,
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.$store.commit('contabilidad/catalogo/cargar_CUENTAS');
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          setTimeout(()=>{
            this.$store.commit('activarOverlay', false);
          }, 2500)
        }).catch((error)=>{
          this.registros.dialogo = true;
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        })
      },
      validarForm(){
        if (this.$refs.FormNuevaSubCuenta.validate())
          this.nuevaCuenta()
      },
      validarFormAddCCSucursal(){
        if (this.$refs.FormNuevaSubCuentaSucursal.validate())
          this.nuevaCuentaSucursal()
      },
      validarFormObligacion(){
        if (this.$refs.FormOnligacionContableNueva.validate())
          this.registrarObligacion();
        else
          this.$store.commit('notificacion',{texto:'Error en el formulario', color:'warning'})
      }
    }
  }
</script>

<style scoped>

</style>
