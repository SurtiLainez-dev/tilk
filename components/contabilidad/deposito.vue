<template>
  <v-card class="ma-2" flat>
    <v-card :disabled="enviado">
      <v-row no-gutters>
        <v-col>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
              <tr>
                <th>Referencia del Depósito</th>
                <td>{{DEPOSITO.referencia}}</td>
              </tr>
              <tr>
                <th>Monto del Depósito</th>
                <td>L. {{int.format(DEPOSITO.monto)}}</td>
              </tr>
              <tr>
                <th>Saldo Actual</th>
                <td>L. {{int.format(DEPOSITO.monto_actual)}}</td>
              </tr>
              <tr>
                <th>Fecha del Depósito</th>
                <td>{{DEPOSITO.fecha_deposito}}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
              <tr>
                <th>Usuario que Registró</th>
                <td>{{DEPOSITO.user.usuario}}</td>
              </tr>
              <tr>
                <th>Caja</th>
                <td>[{{DEPOSITO.caja.codigo}}]</td>
              </tr>
              <tr>
                <th>Documento</th>
                <td><b-link @click="verDocumento(DEPOSITO.file)">Ver documento</b-link></td>
              </tr>
              <tr>
                <th>Fecha Revisado</th>
                <td>{{DEPOSITO.fecha_revisado}}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
              <tr>
                <th>Estado</th>
                <td>
                  <v-chip x-small dark color="warning" v-if="DEPOSITO.estado === 1">Pendiente</v-chip>
                  <v-chip x-small dark color="success" v-else>Revisado</v-chip>
                </td>
              </tr>
              <tr>
                <th>Observaciones</th>
                <td><v-btn small tile dark text color="indigo" :disabled="DEPOSITO.estado === 1" @click="dialogoObseracion = true">Ver</v-btn></td>
              </tr>
              <tr>
                <th>Pagos Editados</th>
                <td>
                  <v-btn small tile class="text-white" text color="indigo" :disabled="DEPOSITO.estado === 1" @click="dialogo = true">Ver</v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card>


    <v-row no-gutters>
      <v-col>
        <v-card-subtitle>Pagos pendientes</v-card-subtitle>
        <v-data-table dense :headers="header" :loading="load" loading-text="Cargando pagos ..."
                      :items="pagos" show-select v-model="pagosSelect" :items-per-page="5">
          <template v-slot:item.saldo_actual="{item}">L. {{int.format(item.saldo_actual)}}</template>
          <template v-slot:item.mora="{item}">L. {{int.format(item.mora)}}</template>
        </v-data-table>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-card-subtitle>Pagos a realizar</v-card-subtitle>
        <pagos_distribuido :pagos="PagosDistrubuidos"/>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row no-gutters v-if="DEPOSITO.estado === 1">
      <v-col cols="9">
        <v-card flat class="ma-2">
          <v-card-subtitle>Datos de la cuenta</v-card-subtitle>
          <v-divider></v-divider>
          <cuenta/>
        </v-card>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-card flat class="ma-2">
          <v-card-subtitle>Formulario</v-card-subtitle>
          <v-divider></v-divider>
          <v-form ref="FormValidarDepostio">
            <v-btn small block color="success" text tile dark @click="distribuirPago">Calcular Saldos</v-btn>
            <v-autocomplete label="Seleccionar un banco" v-model="cuenta"
                            :items="Cuentas" :rules="[deposito.req]"></v-autocomplete>
            <v-textarea label="Observaciones" :rules="[deposito.req, deposito.min, deposito.max]"
                        class="ma-2" v-model="DEPOSITO.observacion"></v-textarea>
          </v-form>
          <v-divider></v-divider>
          <v-btn block color="indigo" @click="validarForm" dark tile small>Registrar Validación</v-btn>
        </v-card>
      </v-col>
    </v-row>


    <v-dialog v-model="dialogo" width="70%">
      <v-card>
        <v-toolbar color="grey lighten-3" flat>
          <v-card-title>Pagos que se editaron</v-card-title>
        </v-toolbar>
        <v-container>
          <pagos_distribuido v-if="DEPOSITO.estado === 0" :pagos="JSON.parse(DEPOSITO.pagos_editados)"/>

          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="indigo" dark small tile @click="dialogo = false">Cerrar</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoObseracion" width="30%">
      <v-card>
        <v-toolbar color="grey lighten-3">
          <v-card-text>Observación</v-card-text>
        </v-toolbar>
        <v-container>
          <v-card-text>{{DEPOSITO.observacion}}</v-card-text>
          <v-dialog></v-dialog>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="indigo" dark small tile @click="dialogoObseracion = false">Cerrar</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import cuenta from "../../components/Ventas/cuenta";
import {ipcRenderer} from "electron";
import pagos_distribuido from "@/components/caja/componentes/cuentas/pagos_distribuido";
export default {
  name: "deposito",
  components:{cuenta, pagos_distribuido},
  data(){
    return{
      dialogo: false,
      dialogoObseracion: false,
      deposito:{
        req: v => !!v || 'Campo requerido',
        min:v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
        max:v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
      },
      int: Intl.NumberFormat(),
      pagos: [],
      pagosSelect: [],
      PagosDistrubuidos: [],
      saldo_abonado: 0,
      load: true,
      header:[
        {text: 'Pago Inicial', value:'pago_inicial'},
        {text: 'Detalle', value:'detalle'},
        {text: 'Saldo Actual', value:'saldo_actual'},
        {text: 'Mora', value:'mora'},
        {text: 'Fecha de Pago', value:'fecha_pago'},
      ],
      Cuentas: [],
      loadCuentas: true,
      cuenta: '',
      moraAbonado: 0,
      enviado: false
    }
  },
  computed:{
    DEPOSITO(){
      return this.$store.state.contabilidad.depositos.DEPOSITO;
    },
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
    USUARIO(){
      return this.$store.state.usuario;
    }
  },
  created() {
    this.$axios.get('venta/pagos/'+this.DEPOSITO.venta.id).then((res)=>{
      if (res.data.pagos.length > 0){
        res.data.pagos.forEach((item)=>{
          if (item.estado < 3){
            this.pagos.push(item)
          }
        })
      }
      this.load = false;
    });
    this.cargarCuentas();
    this.$store.commit('activarOverlay', false);
  },
  methods:{
    abrirNavegador(clave, recibo){
      let url = '';
      url = this.$axios.defaults.baseURL + 'documentos/cajas/recibos/usuario=' + this.USUARIO + '/recibo=' + recibo + '/' + clave;

      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    cargarCuentas(){
      this.$axios.get('cuentas').then((res)=>{
        res.data.cuentas.forEach((i)=>{
          this.Cuentas.push({
            value: i.id,
            text: i.banco.nombre+' - '+i.num
          })
        })
        this.loadCuentas = false;
      })
    },
    distribuirPago(){
      if (this.DEPOSITO.monto_actual > 0){
        let saldo = this.DEPOSITO.monto_actual, estado = true;
        let pagos = this.pagosSelect;
        let pago = 0, saldo_p = 0;
        this.PagosDistrubuidos = [];
        pagos.forEach((item)=>{
          console.log(item)
          if (saldo > 0){
            if (item.is_mora === 1 && item.mora > 0) {
              if (saldo > item.mora) {
                pago = item.mora;
                saldo_p = 0
              }else {
                pago = saldo;
                saldo_p = (pago - item.mora).toFixed(2)
                if (saldo_p < 0)
                  saldo_p = (item.mora - pago).toFixed(2)
              }

              saldo = (saldo - pago).toFixed(2);
              if (saldo < 0)
                saldo = 0;

              this.PagosDistrubuidos.push({
                status: 2,
                pago_id: item.id,
                tipo: 'Mora',
                detalle: 'Mora ' + item.detalle,
                pendiente: item.mora,
                pagara:    pago,
                saldo:     saldo_p,
                hay:       saldo
              })
            }

            if (saldo > 0 && item.estado === 2 || item.estado === 1){
              if (saldo > item.saldo_cap){
                pago = item.saldo_cap;
                saldo_p = 0;
              }else{
                pago = (item.saldo_cap - saldo).toFixed(2);
                saldo_p = (pago - item.saldo_cap).toFixed(2);
                if (saldo_p < 0){
                  pago = saldo
                  saldo_p = (item.saldo_cap - pago).toFixed(2)
                }
              }

              saldo = (saldo - pago).toFixed(2);

              this.PagosDistrubuidos.push({
                status: 1,
                pago_id: item.id,
                tipo: 'Letra',
                detalle: item.detalle,
                pendiente: item.saldo_cap,
                pagara:    pago,
                saldo:     saldo_p,
                hay:       saldo
              })
            }
          }
        });
      }
    },
    registrarForm(){
      this.$store.commit('activarOverlay', true);
      this.$axios.put('venta/pagos/'+this.DEPOSITO.venta.id,{
        pagos: this.PagosDistrubuidos,
        observacion:   this.DEPOSITO.observacion,
        pagos_json: JSON.stringify(this.PagosDistrubuidos),
        cuenta_banco:  this.cuenta,
        deposito:      this.DEPOSITO.id,

        total:         this.DEPOSITO.monto,
        sucursal_id:   this.CUENTA.sucursal_id,
        caja_id:       this.DEPOSITO.caja_id,
      }).then((res)=>{
        this.$store.commit('contabilidad/depositos/cargar_DEPOSITOS')
        this.abrirNavegador(res.data.clave, res.data.codigo);
        this.enviado = true;
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'})
      })
    },
    validarForm(){
      if (this.$refs.FormValidarDepostio.validate())
        this.registrarForm();
      else
        this.$store.commit('notificacion',{texto:'Hace falta datos', color:'warning'});
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
      })
    }
  }
}
</script>

<style scoped>

</style>
