<template>
  <v-container class="pl-2 pr-2 ">
    <v-card flat v-if="cuenta">
      <v-toolbar flat color="grey lighten-3">
        <v-btn color="orange" dark tile fab x-small @click="$router.replace({path:'/contabilidad/banco'})"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-spacer></v-spacer>
        <h5>{{cuenta.descripcion}}</h5>
      </v-toolbar>

      <v-row no-gutters>
        <v-col cols="4">
          <v-card height="100%" class="ma-2">
            <v-card-title>Información de la Cuenta</v-card-title>
            <v-divider></v-divider>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Banco</v-list-item-title>
                <v-list-item-subtitle>{{cuenta.banco.nombre}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Tipo de Cuenta</v-list-item-title>
                <v-list-item-subtitle>{{cuenta.tipo_cuenta_banco.nombre}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Número de Cuenta</v-list-item-title>
                <v-list-item-subtitle>{{cuenta.num}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Cuenta Contable</v-list-item-title>
                <v-list-item-subtitle v-if="CuentaContable">{{CuentaContable.cod}} {{CuentaContable.nombre}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title><strong>TOTAL EN LA CUENTA</strong></v-list-item-title>
                <v-list-item-subtitle><strong>L {{int.format(cuenta.total)}}</strong></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card height="100%" class="ma-2">
            <v-card-title>Acciones</v-card-title>
            <v-divider></v-divider>
            <v-list dense>
              <v-subheader>ACCIONES DISPONIBLES PARA ESTA CUENTA</v-subheader>
              <v-list-item-group  color="primary">
                <v-list-item  @click="montoInicial.dialogo = true">
                  <v-list-item-icon>
                    <v-icon>fa fa-money-bill-wave</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Registrar Monto Inicial</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="abrirDialogoTransferencia">
                  <v-list-item-icon>
                    <v-icon>fa fa-exchange-alt</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Transferir a Otra Cuenta</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>fa fa-cash-register</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Transferir a Caja Chica</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="abrirDialogoDebito">
                  <v-list-item-icon>
                    <v-icon>fa fa-exchange-alt</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Debitar de la Cuenta</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="cuenta.tipo_cuenta_banco_id === 2" @click="cheques.dialogo = true">
                  <v-list-item-icon>
                    <v-icon>fa fa-money-check-alt</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Crear Cheques</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item @click="historial.dialogo = true">
                  <v-list-item-icon>
                    <v-icon>fa fa-history</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Historial Completo de la Cuenta</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

              </v-list-item-group>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="ma-2" height="100%">
            <v-card-title>Últimas Transacciones</v-card-title>
            <v-divider></v-divider>
            <v-list-item two-line v-if="i < 5" v-for="(item, i) in cuenta.historial_bancos">
              <v-list-item-content>
                <v-list-item-title>{{item.detalle}}</v-list-item-title>
                <v-list-item-subtitle>
                  Total de transacción {{int.format(item.total)}} lps
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
      <br>
      <v-card height="500" class="ma-2">
        <v-toolbar flat>
          <h6>Historial de la Cuenta Contable</h6>
          <v-spacer></v-spacer>
          <v-text-field class="ma-2" label="Buscar Registro" dense v-model="searchCuentaC"></v-text-field>
        </v-toolbar>
        <v-row no-gutters >
          <v-col cols="2">
            <v-text-field class="ma-2" disabled dense label="Código de la Cuenta Contable"
                          :value="CuentaContable ? CuentaContable.cod: ''"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field class="ma-2" disabled dense label="Nombre de la Cuenta Contable"
                          :value="CuentaContable ? CuentaContable.nombre : ''"></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field suffix="lps" class="ma-2" disabled dense label="Total de la Cuenta Contable"
                          :value="CuentaContable ? CuentaContable.total : 0"></v-text-field>

          </v-col>
        </v-row>

        <v-data-table dense :headers="headerCuentaC"
                      :loading="Cuentas.load"
                      :search="searchCuentaC"
                      :items="RegistrosCuentaContable"
                      loading-text="Carrgando Registros Contables de la Cuenta"
                      :items-per-page="5">
          <template v-slot:item.tipo="{item}">
            <v-chip dark color="success" x-small v-if="item.tipo === 0">Crédito</v-chip>
            <v-chip dark color="orange" x-small v-else-if="item.tipo === 1">Débito</v-chip>
          </template>
          <template v-slot:item.total="{item}">
            L {{int.format(item.total)}}
          </template>
        </v-data-table>
      </v-card>
      <v-card :loading="cheques.load" class="ma-2" v-if="cuenta.tipo_cuenta_banco_id === 2">
        <cheques/>
      </v-card>

      <v-dialog width="30%" v-model="montoInicial.dialogo">
        <v-card>
          <v-toolbar flat color="grey-lighten-5">
            <h6>Registrando Monto Inicial</h6>
          </v-toolbar>
          <v-alert v-if="cuenta.total > 0" color="orange" dark dense class="ma-2">Esta cuenta no tiene permitida esta opción.</v-alert>
          <v-form ref="FormCTBancoMontoInicial">
            <v-text-field class="ma-2" dense label="Monto Inicial" :rules="[rules.req, rules.num]"
                          prefix="L" v-model="montoInicial.total">
            </v-text-field>
            <v-text-field class="ma-2" dense label="Detalle" counter
                          :rules="[rules.req, rules.min8, rules.max30]"
                          v-model="montoInicial.detalle">
            </v-text-field>
          </v-form>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange"  tile small dark @click="montoInicial.dialogo = false">Cerrar</v-btn>
            <v-btn color="success" tile small dark @click="registrarMontoInicial">Registrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog width="60%" v-model="Cuentas.dialogo">
        <v-card>
          <v-toolbar color="grey lighten-5">
            <h6>Partida de Transferencia Entre Cuentas de Bancos</h6>
          </v-toolbar>

          <v-form class="pl-5 pr-5 pb-5 pt-5" ref="FormContabilidadBancosTransferencias">
            <v-row no-gutters>
              <v-col>
                <v-text-field dense label="Cuenta de Banco de Origen" disabled
                              class="ma-2" :value="cuenta.num"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense label="Nombre de la Contra Cuenta Contable" disabled :loading="Cuentas.load"
                              class="ma-2" :value="Cuentas.contracuentaString"></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-select dense label="Cuenta de Banco de Destino" class="ma-2" :items="cuentas_bancos"
                          :loading="Cuentas.load" v-model="Cuentas.cuenta_banco_id2" :disabled="Cuentas.load"
                          @change="asignarCuentaDestino" :rules="[rules.req, rules.dif]">
                </v-select>
              </v-col>
              <v-col>
                <v-text-field dense label="Nombre de la Cuenta Contable" disabled
                              class="ma-2" v-model="Cuentas.cuentaString" :rules="[rules.req]">
                </v-text-field>
              </v-col>
            </v-row>

            <v-row no-gutters>
              <v-col>
                <v-text-field label="Total de la Cuenta de Origen" dense v-model="cuenta.total"
                              disabled prefix="L" class="ma-2">
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="Total de la Partida" dense v-model="Cuentas.total" type="number"
                              class="ma-2" prefix="L" :min="1" :max="cuenta.total" :rules="[rules.req, rules.max]">
                </v-text-field>
              </v-col>
            </v-row>
            <v-text-field dense label="Detalle de la Partida" :rules="[rules.req, rules.min8, rules.max200]"
                          v-model="Cuentas.detalle" counter class="ma-2">
            </v-text-field>
          </v-form>

          <v-divider></v-divider>

          <v-container>
            <small>Demostración de la Partida</small>
            <table>
              <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Ref.</th>
                <th>Crédito</th>
                <th>Débito</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,i) in partida">
                <td>{{item.fecha}}</td>
                <td v-if="i === 0">(-) {{item.detalle}}</td>
                <td v-if="i === 1" >(+) {{item.detalle}}</td>
                <td>{{item.ref}}</td>
                <td v-if="i===0">L {{int.format(Cuentas.total)}}</td>
                <td v-else> </td>
                <td v-if="i === 1">L {{int.format(Cuentas.total)}}</td>
                <td v-else> </td>
              </tr>
              <tr>
                <td></td>
                <td class="text-center">{{Cuentas.detalle}}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </v-container>

          <v-divider></v-divider>

          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" dark tile small @click="Cuentas.dialogo = false">Cerrar</v-btn>
            <v-btn color="success" dark tile small @click="registrarTransferencia">Registrar Transferencia</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog width="40%" v-model="cheques.dialogo">
        <v-card>
          <v-toolbar color="grey lighten-5" flat>
            <h6>Creando Cheques Nuevos</h6>
          </v-toolbar>
          <v-form ref="FormContabilidadBancoRegistroCheques" class="ma-2">
            <v-row no-gutters>
              <v-col>
                <v-text-field dense label="Numeración Post Contador" class="ma-2"
                              v-model="cheques.postNum" :rules="[rules.req]">
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense label="Contador Inicial" class="ma-2" @keyup="calcularCantidadCheques"
                              v-model="cheques.inicial" type="number" :rules="[rules.req, rules.cero]">
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense label="Contador Final" class="ma-2" @keyup="calcularCantidadCheques"
                              v-model="cheques.final" type="number" :rules="[rules.req, rules.cero]">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-text-field dense label="Longitúd de Numeración" class="ma-2" :rules="[rules.req, rules.cero]"
                              v-model="cheques.longitud" suffix="Carácteres">
                </v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense label="Cantidad de Cheques" class="ma-2" disabled
                              v-model="cheques.cantidad" :rules="[rules.req, rules.cero]">
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>

          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" small tile dark @click="cheques.dialogo = false">Cerrar</v-btn>
            <v-btn color="success" small tile dark @click="registrarCheques">Crear Cheques</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog width="100%" v-model="historial.dialogo">
        <v-card >
          <v-toolbar flat color="grey lighten-5">
            <h6>Historial de la Cuenta</h6>
            <v-spacer></v-spacer>
            <v-text-field class="ma-2" dense v-model="historial.search" label="Buscar"></v-text-field>
          </v-toolbar>

          <v-data-table dense :items="cuenta.historial_bancos"
                        :items-per-page="10"
                        :search="historial.search"
                        :headers="historial.header">
            <template v-slot:item.tipo="{item}">
              <v-chip color="success" x-small dark v-if="item.tipo ===0">Crédito</v-chip>
              <v-chip color="orange" x-small dark v-else-if="item.tipo ===1">Débito</v-chip>
            </template>
            <template v-slot:item.saldo_actual="{item}">L. {{int.format(item.saldo_actual)}}</template>
            <template v-slot:item.saldo_inicial="{item}">L. {{int.format(item.saldo_inicial)}}</template>
            <template v-slot:item.total="{item}">L. {{int.format(item.total)}}</template>
          </v-data-table>

          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" small tile dark @click="historial.dialogo = false">Cerrar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog width="60%" v-model="debitoTrans.dialogo">
        <v-card><v-toolbar flat color="grey lighten-5">
            <h6 v-if="cuenta">Debitando de la Cuenta {{cuenta.num}} - {{cuenta.descripcion}}</h6>
          </v-toolbar>

          <v-card  class="pl-5 pr-5 pb-5 pt-5">
            <nuxt-link to="/contabilidad/cheques">Si hiciste este débito con un cheque, selecciona este link</nuxt-link>

            <v-form ref="FormDebitarCuentaBanco">
              <v-subheader>DATOS DE LA CUENTA BANCARIA</v-subheader>
              <v-row no-gutters>
                <v-col cols="9" v-if="cuenta">
                  <v-text-field dense label="Nombre de la Cuenta" :value="cuenta.banco.nombre+' - '+cuenta.descripcion+' - '+cuenta.num"
                                disabled class="ma-2"></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field dense label="Total de la Cuenta" :value="cuenta.total"
                                disabled suffix="lps" class="ma-2"></v-text-field>
                </v-col>
              </v-row>

              <v-subheader>DATOS DE LA CUENTA CONTABLE</v-subheader>
              <v-row no-gutters >
                <v-col cols="2">
                  <v-text-field class="ma-2" disabled dense label="Código de la Cuenta Contable"
                                :value="CuentaContable ? CuentaContable.cod: ''"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field class="ma-2" disabled dense label="Nombre de la Cuenta Contable"
                                :value="CuentaContable ? CuentaContable.nombre : ''"></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field suffix="lps" class="ma-2" disabled dense label="Total de la Cuenta Contable"
                                :value="CuentaContable ? CuentaContable.total : 0"></v-text-field>

                </v-col>
              </v-row>

              <v-subheader>DATOS DE LA PARTIDA</v-subheader>
              <v-row no-gutters>
                <v-col cols="9">
                  <v-text-field label="Comentario de la Partida" :rules="[rules.req]" v-model="debitoTrans.detalle"
                                dense class="ma-2"></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field label="Total de la Partida" v-model="debitoTrans.totalP" :rules="[rules.req]"
                                suffix="lps" dense class="ma-2"></v-text-field>
                </v-col>
              </v-row>


              <v-subheader>CUENTA PARA ACRÉDITAR</v-subheader>
              <v-autocomplete dense class="ma-2" :items="CC" v-model="debitoTrans.cc_val"
                              label="Buscar Cuenta del Crédito" @change="capturarCCCredito"></v-autocomplete>

              <v-row no-gutters>
                <v-col>
                  <v-text-field class="ma-2" dense label="Código de la Cuenta" disabled
                                v-model="debitoTrans.cc_cod" :rules="[rules.req]"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field class="ma-2" dense label="Nombre de la  Cuenta" disabled
                                v-model="debitoTrans.cc_nombre" :rules="[rules.req]"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field class="ma-2" dense label="Total de la Cuenta" suffix="lps"
                                v-model="debitoTrans.total" disabled :rules="[rules.req]"></v-text-field>
                </v-col>
              </v-row>
            </v-form>

            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-end">
              <v-btn dark tile small color="orange" @click="debitoTrans.dialogo = false">Cerrar</v-btn>
              <v-btn dark tile small color="success" @click="validarFormDebitar">Registrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-card>
      </v-dialog>

      <pre>{{CC}}</pre>
    </v-card>
  </v-container>
</template>

<script>
import todos from "../../../../../components/contabilidad/cheques/todos";
export default {
  computed:{
    CUENTAS(){
      return this.$store.state.contabilidad.bancos.CUENTAS;
    },
    CC(){
      return this.$store.state.contabilidad.catalogo.CC;
    },
    cuenta(){
      return this.$store.state.contabilidad.bancos.CUENTA;
    }
  },
  components:{
    cheques: todos
  },
  data(){
    return{
      int: new Intl.NumberFormat(),
      historial:{
        data:    [],
        dialogo: false,
        search: '',
        header:[
          {text:'Usuario Responsable',value:'user.usuario'},
          {text:'Partida',value:'partida.referencia'},
          {text:'Detalle',value:'detalle'},
          {text:'Saldo Inicial',value:'saldo_inicial'},
          {text:'Total de Transacción',value:'total'},
          {text:'Saldo Final',value:'saldo_actual'},
          {text:'tipo',value:'tipo'},
        ]
      },
      CuentaContable: null,
      headerCuentaC:[
        {text:'Tipo',value:'tipo'},
        {text:'Fecha',value:'fecha'},
        {text:'detalle',value:'detalle'},
        {text:'Total',value:'total'},
        {text:'Referencia Partida',value:'partida'},
      ],
      searchCuentaC: '',
      RegistrosCuentaContable: [],
      cuentas_bancos: [],
      cheques:{
        load:    false,
        data:    [],
        postNum: '',
        cantidad: 0,
        dialogo:  false,
        vista:    '',
        inicial:  0,
        final:    0,
        longitud: 0
      },
      Cuentas: {
        data:            [],
        load:            false,
        dialogo:         false,
        detalle:         '',
        cuenta_id:        0,
        cuentaString:     '',
        contracuenta_id:  0,
        contracuentaString: '',
        nivel:            0,
        total:            0,
        cuenta_banco_id2: 0
      },
      montoInicial:{
        dialogo: false,
        total:   0,
        detalle: 'Registrando Monto Inicial'
      },
      rules:{
        req:    v => !!v                            || 'Campo requerido',
        num:    v => /^[0-9]+([.][0-9]+)?$/.test(v) || 'Dato invalido',
        max30:  v => v.length <= 30                 || 'Debe se menor o igual a 30 carácteres',
        max200: v => v.length <= 200                || 'Debe se menor o igual a 200 carácteres',
        min8:   v => v.length >= 8                  || 'Debe ingresar mínimo 8 carácteres',
        dif:    v => v !== this.cuenta.id           || 'No puedes usar esta cuenta. Tiene que ser diferente la cuenta de origen',
        max:    v => v <= this.cuenta.total         || 'No puedes sobrepasar el total de la cuenta de origen',
        cero:   v => v > 0                          || 'Tiene que ser mayor a 0'
      },
      partida: [],
      transacciones: [],
      debitoTrans:{
        cc_id:       0,
        cc_nombre:   '',
        cc_cod:      '',
        cc_val:      '',
        detalle:     '',
        total:       0,
        totalP:      0,
        dialogo:     false
      }
    }
  },
  created() {
    this.$store.commit('activarOverlay', false);
    if (this.cuenta && this.cuenta.tipo_cuenta_banco_id === 2)
      this.$store.commit('contabilidad/cheques/cargar_CHEQUES', this.cuenta);

    this.acomodarCuentas();
    this.cargarCuentas();
    this.cargarCheques();
    this.$store.commit('contabilidad/catalogo/cargar_CUENTAS');
  },
  methods:{
    abrirDialogoDebito(){
      this.debitoTrans.dialogo = true;
      // this.cargarFormaPagos();
    },
    abrirDialogoTransferencia(){
      this.Cuentas.dialogo = true;
    },
    acomodarCuentas(){
      this.CUENTAS.forEach((i)=>{
        this.cuentas_bancos.push({
          value: i.id,
          text:  'Cuenta de '+i.tipo.nombre+' '+i.banco.nombre+ ' - '+i.num
        })
      })
    },
    asignarCuentaDestino(){
      if (this.partida.length > 1)
        this.partida.splice(1,1);

      this.Cuentas.data.forEach((i)=>{
        if (i.referencia_id == this.Cuentas.cuenta_banco_id2){
          this.Cuentas.cuenta_id    = i.id;
          this.Cuentas.cuentaString = i.cod+' - '+i.nombre;
          this.CuentaContable       = i;
          this.partida.push({
            fecha: '',
            detalle: '1113 - Bancos '+this.Cuentas.cuentaString,
            ref:      this.Cuentas.cuentaString.split('-')[0],
          })
        }
      })
    },
    calcularCantidadCheques(){
      if (this.cheques.inicial > 0 && this.cheques.final > 0){
        let total               = this.cheques.final - this.cheques.inicial;
        this.cheques.cantidad   = parseInt(total) + parseInt(1);
      }else{
        this.cheques.cantidad   = 0;
      }
    },
    capturarCCCredito(){
      let ccs    = this.CC.filter(i => i.value === this.debitoTrans.cc_val);
      let cuenta = [];

      this.debitoTrans.cc_cod    = ccs[0].texto.split('-')[0];
      this.debitoTrans.cc_id     = ccs[0].texto.split('-')[1];
      this.debitoTrans.cc_nombre = ccs[0].texto.split('-')[2];
      this.debitoTrans.total     = ccs[0].texto.split('-')[3];
    },
    cargarCheques(){
      this.cheques.load = true;
      this.$axios.get('cuenta/cheques/'+this.cuenta.id).then((res)=>{
        this.cheques.data = res.data.cheques;
        this.cheques.load = false;
      });
      this.$store.commit('activarOverlay', false);
    },
    cargarCuentas(){
      this.Cuentas.load = true;
      this.$axios.get('contabilidad/2.0/cargando_cuentas/1113').then((res)=>{
        let fecha = new Date();
        this.Cuentas.data = res.data.cuentas;
        this.Cuentas.data.forEach((i)=>{
          if (i.referencia_id == this.cuenta.id){
            this.CuentaContable             = i;
            if (i.registros)
              this.RegistrosCuentaContable    = JSON.parse(i.registros)
            else
              this.RegistrosCuentaContable    = [];

            this.Cuentas.contracuenta_id    = i.id;
            this.Cuentas.contracuentaString = i.cod+' - '+i.nombre;
          }
        })
        this.Cuentas.load = false;
        this.partida.push({
          fecha: fecha.getDate()+'/'+fecha.getMonth()+'/'+fecha.getFullYear(),
          detalle: '1113 - Bancos '+this.Cuentas.contracuentaString,
          ref:      this.Cuentas.contracuentaString.split('-')[0],
        })
      })
    },
    registrarDebito(){
      this.$store.commit('activarOverlay', true);
      this.debitoTrans.dialogo = false;
      this.$axios.post('contabilidad/2.0/cuenta_banco/debito',{
        CuentaBanco: this.cuenta.id,
        ccCuentaBanco: this.CuentaContable.id,
        ccDebito:      this.debitoTrans.cc_id,
        total:         this.debitoTrans.totalP,
        detalle:       this.debitoTrans.detalle
      }).then((res)=>{
        this.$nuxt.refresh();
        this.cargarCuentas();
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        },2500);
      }).catch((error)=>{
        if (error.response.status === 422)
          this.$store.commit('notificacion',{texto:res.data.msj, color:'error'});

        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
        this.debitoTrans.dialogo = true;
      })
    },
    registrarCheques(){
      if (this.$refs.FormContabilidadBancoRegistroCheques.validate()){
        this.$store.commit('activarOverlay', true);
        this.cheques.dialogo = false;
        this.$axios.post('cuenta/cheques',{
          postNum:     this.cheques.postNum,
          contInicial: this.cheques.inicial,
          limite:      this.cheques.final,
          long:        this.cheques.longitud,
          cuenta_id:   this.cuenta.id,
          cantidad:    this.cheques.cantidad,
          saldo:       this.cuenta.total
        }).then((res)=>{
          this.cheques.longitud = 0;
          this.cheques.cantidad = 0;
          this.cheques.inicial  = 0;
          this.cheques.final    = 0;
          this.cheques.postNum  = ''
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          this.$nuxt.refresh();
          setTimeout(()=>{
            this.cargarCuentas();
            this.cargarCheques();
          }, 4500);
        }).catch((error)=>{
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
          this.$store.commit('activarOverlay', false);
          this.cheques.dialogo = true;
        })
      }else{
        this.$store.commit('notificacion',{texto:'Formulario incompleto', color:'warning'});
      }
    },
    registrarMontoInicial(){
      if (this.cuenta.total <= 0){
        if (this.$refs.FormCTBancoMontoInicial.validate()){
          this.$store.commit('activarOverlay', true);
          this.montoInicial.dialogo = false;
          this.$axios.put('cuenta/'+this.cuenta.id,{
            total:     this.montoInicial.total,
            detalle:   this.montoInicial.detalle,
            cuenta_id: this.Cuentas.contracuenta_id
          }).then((res)=>{
            this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
            this.montoInicial.total = 0;
            this.$nuxt.refresh();
            setTimeout(()=>{
              this.cargarCuentas();
              this.cargarCheques();
            }, 4500);
          }).catch((error)=>{
            this.$store.commit('notificacion',{texto:'Hubo un error en el servisor', color:'error'});
            this.$store.commit('activarOverlay', false);
            this.montoInicial.dialogo = true;
          })
        }else{
          this.$store.commit('notificacion',{texto:'Tienes que llenar los datos', color:'warning'});
        }
      }else{
        this.$store.commit('notificacion',{texto:'Esta cuenta ya no se le puede ingresar monto inicial', color:'warning'});
      }
    },
    registrarTransferencia(){
      if (this.$refs.FormContabilidadBancosTransferencias.validate()){
        this.$store.commit('activarOverlay', true);
        this.Cuentas.dialogo = false;
        this.$axios.post('contabilidad/2.0/bancos/cuentas/transferencias',{
          detalle:            this.Cuentas.detalle,
          total:              this.Cuentas.total,
          stringContraCuenta: this.Cuentas.contracuentaString,
          contraCuenta_id:    this.Cuentas.contracuenta_id,
          stringCuenta:       this.Cuentas.cuentaString,
          cuenta_id:          this.Cuentas.cuenta_id,
          cuenta_banco_id:    this.cuenta.id,
          cuenta_banco_id2:   this.Cuentas.cuenta_banco_id2
        }).then((res)=>{
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          this.$store.commit('activarOverlay', false)
          this.Cuentas.cuentaString = '';
          this.Cuentas.cuenta_id    = '';
          this.Cuentas.detalle      = '';
          this.$nuxt.refresh();
          setTimeout(()=>{
            this.cargarCuentas();
          }, 4500);
        }).catch((error)=>{
          this.$store.commit('notificacion',{texto:'Hubo un error en el servisor', color:'error'});
          this.$store.commit('activarOverlay', false);
          this.Cuentas.dialogo = true;
        })
      }else{
        this.$store.commit('notificacion',{texto:'Hay datos incompletos en el formulario', color:'warning'});
      }
    },
    validarFormDebitar(){
      if (this.$refs.FormDebitarCuentaBanco.validate())
        this.registrarDebito();
      else
        this.$store.commit('notificacion',{texto:'No haz completado todos los campos', color:'warning'});
    },
  },
  asyncData({$axios,route, store}){
    return $axios.get('cuenta/'+route.params.cuenta).then((res)=>{
      store.commit('contabilidad/bancos/asignar_CUENTA', res.data.cuenta);
      return{
        cuentaasync: res.data.cuenta,
      }
    })

  },
}
</script>

<style scoped>
.campo{
  padding: 2px;
  background-color: #cccccc;
}
table{
  width: 100%;
  border: solid 0.5px #ECECEE;
  border-collapse: collapse;
}
table thead tr th{
  font-size: 15px;
  border-right: solid 0.5px #ECECEE;
  border-bottom: solid 0.5px #ECECEE;
}
table tbody tr{
  cursor: pointer;
  font-size: 13px;
}
</style>
