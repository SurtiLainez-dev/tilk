<template>
  <v-card flat>
    <v-toolbar flat >
      <h6>Realizar Egreso por Depósito</h6>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-btn @click="new_deposito.dialogo = true" color="indigo" small dark text>Subir Depósito de un Día Anterior</v-btn>
    </v-toolbar>
    <v-card-text>Este egreso solo se hace cuando se mandó a depósitar efectivo que hay en la caja.</v-card-text>
    <v-divider></v-divider>

    <v-form ref="FormNuevoEgreso">
      <v-row no-gutters>
        <v-col>
          <v-text-field dense label="Total de Efectivo en Caja" class="ma-2"
                        suffix="lps" :value="TOTAL_CAJA" disabled></v-text-field>
        </v-col>
        <v-col>
          <v-autocomplete :items="ccCuentasB" :item-value="'id'" :item-text="'nombre'" class="ma-2"
                          :loading="loadccBancos" label="Seleccionar al Banco en que se va a Depósitar"
                          dense :rules="[rules.req.req]" v-model="egreso.ccBanco"></v-autocomplete>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col>
          <v-text-field dense label="Total a Depósitar" class="ma-2" :rules="[rules.req.req, rules.efectivo.min]"
                        suffix="lps" v-model="egreso.total"></v-text-field>
        </v-col>
        <v-col>
          <v-file-input :rules="[rules.req.req]" accept="image/*, .pdf" class="ma-2"
                        dense label="Comprobante" v-model="egreso.file"></v-file-input>
        </v-col>
      </v-row>

      <v-text-field dense :rules="[rules.req.req]" label="Referencia del Depósito" class="ma-2"
                    v-model="egreso.referencia" persistent-hint
                    hint="Puedes agregar una observación despues de la referencia"></v-text-field>

      <v-divider></v-divider>

      <v-card-actions class="d-flex justify-end">
        <v-btn dark color="success" class="ma-2" small @click="validarForm" tile>Registrar Egreso</v-btn>
      </v-card-actions>
    </v-form>

    <v-dialog v-model="new_deposito.dialogo" width="80%">
      <v-card>
        <v-toolbar color="gray lighten-3" flat dense>
          <v-toolbar-title>Cargando Depósito</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-form ref="FormDepositoOtroDia">
            <v-row>
              <v-col>
                <v-autocomplete class="ma-2" v-model="new_deposito.dia" :loading="new_deposito.loadinHistorial"
                                label="Seleccionar Día" :items="dias"></v-autocomplete>
              </v-col>
              <v-col>
                <v-autocomplete class="ma-2" v-model="new_deposito.mes" :loading="new_deposito.loadinHistorial"
                                label="Seleccionar Mes" :items="mes"></v-autocomplete>
              </v-col>
              <v-col>
                <v-text-field class="ma-2" disabled label="Año" :value="new_deposito.anio"></v-text-field>
              </v-col>
            </v-row>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="red" small dark tile class="ma-2" @click="new_deposito.dialogo = false">Cerrar</v-btn>
              <v-btn color="success" dark tile small class="ma-2" @click="cargarHistorial">Consultar</v-btn>
            </v-card-actions>
            <v-divider></v-divider>
            <v-simple-table dense fixed-header class="rowsTable">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>Tipo de Documento</th>
                  <th>Referencia</th>
                  <th>Forma de Pago</th>
                  <th>Tipo</th>
                  <th>Archivo</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in new_deposito.Historial">
                  <td>
                    <v-chip x-small dark color="indigo" v-if="item.tipo_documento === 1">FACTURA</v-chip>
                    <v-chip x-small dark color="indigo" v-else-if="item.tipo_documento === 2">RECIBO</v-chip>
                    <v-chip x-small dark color="indigo" v-else-if="item.tipo_documento === 3">PAGO AGREGADO</v-chip>
                    <v-chip x-small dark color="red" v-else-if="item.tipo_documento === 4">EGRESO</v-chip>
                    <v-chip x-small dark color="indigo" v-else-if="item.tipo_documento === 5">ANTICIPO DE CLIENTE</v-chip>
                  </td>
                  <td v-if="(item.tipo_documento === 2 || item.tipo_documento === 3 || item.tipo_documento || 5) && item.recibo">{{item.recibo.codigo}}</td>
                  <td v-else-if="item.tipo_documento === 1">{{item.factura.contador}}</td>
                  <td v-else-if="item.tipo_documento === 4">{{item.referencia}}</td>
                  <td>{{item.forma_pago.nombre}}</td>
                  <td v-if="item.tipo === 0">+</td>
                  <td v-else>-</td>
                  <td>L. {{int.format(item.total)}}</td>
                  <td>
                    <b-link v-if="item.tipo_documento === 1 && item.factura" @click="solicitarClave(1, 0, item, 1)">Ver</b-link>
                    <b-link v-else-if="item.tipo_documento === 2 && item.recibo" @click="solicitarClave(2,2,item.recibo, 1)">Ver</b-link>
                    <b-link v-else-if="item.tipo_documento === 3 && item.recibo" @click="solicitarClave(2,3,item.recibo, 1)">Ver</b-link>
                    <b-link v-else-if="item.tipo_documento === 4" @click="verDocumento(item.historial)">Ver Egreso</b-link>
                    <b-link v-else-if="item.tipo_documento === 5 && item.recibo" @click="solicitarClave(2,5,item.recibo, 1)">Ver</b-link>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider></v-divider>
            <v-row v-if="new_deposito.Historial.length > 0">
              <v-col>
                <v-text-field dense label="Total de Egresos" prefix="L." v-model="new_deposito.egresos" class="ma-2" disabled></v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense label="Total de Ingresos" prefix="L." v-model="new_deposito.ingresos" class="ma-2" disabled></v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense label="Diferencia" prefix="L." v-model="new_deposito.total" class="ma-2" disabled></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="new_deposito.Historial.length > 0">
              <v-col cols="7">
                <v-text-field label="Referencia" class="ma-2" :rules="[rules.req.req]" dense v-model="egreso.referencia"></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-autocomplete :items="ccCuentasB" :item-value="'id'" :item-text="'nombre'" class="ma-2"
                                :loading="loadccBancos" label="Seleccionar al Banco en que se va a Depósitar"
                                dense :rules="[rules.req.req]" v-model="egreso.ccBanco"></v-autocomplete>
              </v-col>
            </v-row>
            <v-row v-if="new_deposito.Historial.length > 0">
              <v-col cols="3">
                <v-text-field label="Saldo Acumulado" :value="$store.state.caja.CAJA.saldo_acumulado"
                              hint="Es el total de efectivo de esta caja que no se ha depositado"
                              persistent-hint
                              dense class="ma-2" prefix="L." disabled></v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="Total a Depositar" v-model="egreso.total" :rules="[rules.req.req]"
                              class="ma-2" dense prefix="L."></v-text-field>
              </v-col>
              <v-col>
                <v-file-input :rules="[rules.req.req]" accept="image/*, .pdf" class="ma-2"
                              dense label="Comprobante" v-model="egreso.file"></v-file-input>
              </v-col>
            </v-row>
            <v-card-actions v-if="new_deposito.Historial.length > 0" class="d-flex justify-end">
              <v-btn color="red" small dark tile class="ma-2" @click="new_deposito.dialogo = false">Cerrar</v-btn>
              <v-btn color="success" small dark tile class="ma-2" @click="validarForm2">Registrar</v-btn>
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  data(){
    return{
      int: Intl.NumberFormat(),
      new_deposito:{
        dialogo: false,
        dia: 0,
        mes: 0,
        anio: 0,
        loadinHistorial: false,
        Historial: [],
        egresos: 0,
        ingresos: 0,
        total: 0,
        referencia: '',
        cc_id: 0
      },
      mes: [1,2,3,4,5,6,7,8,9,10,11,12],
      dias: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
      loadccBancos: false,
      ccCuentasB: [],
      egreso:{
        total: 0,
        ccBanco: '',
        referencia: '',
        file: null
      },
      rules: {
        req: {
          req: v => !!v || 'Campo requerido',
        },
        efectivo:{
          min: v => v <= this.TOTAL_CAJA || 'No puede ser mayor al total que hay en efectivo',
        },
      },
    }
  },
  computed:{
    TOTAL_CAJA(){
      return this.$store.state.caja.CAJA_EFECTIVO;
    },
    CAJA(){
      return this.$store.state.caja.CAJA_ID;
    },
    USUARIO(){
      return this.$store.state.usuario;
    },
  },
  name: "egreso",
  created() {
    this.cargarCcCuentasBancos();
    let f = new Date();
    this.new_deposito.dia = f.getDate();
    this.new_deposito.mes = (f.getMonth() + 1);
    this.new_deposito.anio = f.getFullYear();
  },
  methods:{
    abrirNavegador(clave, tipo, recibo){
      let url = '';
      if (tipo === 1)
        url = this.$axios.defaults.baseURL+'documentos/cajas/factura/usuario='+this.USUARIO+'/factura='+this.fac.factura.contador+'/'+clave;
      else if(tipo === 2 && recibo === 2)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibos/usuario=' + this.USUARIO + '/recibo=' + this.fac.codigo + '/' + clave;
      else if(tipo === 2 && recibo === 3)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibo_dxc/usuario=' + this.USUARIO + '/recibo=' + this.fac.codigo + '/' + clave;
      else if (tipo === 2 && recibo === 5)
        url = this.$axios.defaults.baseURL+'documentos/cajas/recibo_anticipo/usuario='+this.USUARIO+'/recibo='+this.fac.codigo+'/'+clave;

      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
      this.new_deposito.dialogo = true;
    },
    cargarCcCuentasBancos(){
      this.loadccBancos = true;
      this.$axios.get('contabilidad/2.0/cargando_cuentas/1113').then((res)=> {
        this.ccCuentasB = res.data.cuentas;
        this.loadccBancos = false
      });
    },
    cargarCierre(clave){
      let fecha = this.anio+'-'+this.mes+'-'+this.dia;
      let url = this.$axios.defaults.baseURL+`documentos/cajas/cierre/usuario=${this.USUARIO}/caja=${this.HISTORIAL.cajas.codigo}/fecha=${fecha}/${clave}`;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
      this.new_deposito.dialogo = true;
    },
    cargarHistorial(){
      this.new_deposito.loadinHistorial = true;
      this.new_deposito.ingresos = 0;
      this.new_deposito.egresos  = 0;
      this.$axios.get(`caja/${this.CAJA}/historial/${this.new_deposito.anio}-${this.new_deposito.mes}-${this.new_deposito.dia}`).then((res)=>{
        this.new_deposito.Historial = res.data.historial;
        res.data.historial.forEach((item)=>{
          if (item.tipo === 0)
            this.new_deposito.ingresos = parseFloat(this.new_deposito.ingresos) + parseFloat(item.total);
          else
            this.new_deposito.egresos = parseFloat(this.new_deposito.egresos) + parseFloat(item.total);
        })
        this.new_deposito.total = parseFloat(this.new_deposito.ingresos) - parseFloat(this.new_deposito.egresos);
        this.new_deposito.loadinHistorial = false;
      })
    },
    solicitarClave(tipo, recibo, data, soli){
      this.$store.commit('activarOverlay', true);
      this.fac = data;
      this.new_deposito.dialogo = false;
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        if (soli === 1)
          this.abrirNavegador(res.data.clave, tipo, recibo);
        else
          this.cargarCierre(res.data.clave)
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Ocurrio un error', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    registrarDepoito(){
      let f = new Date();
      this.$store.commit('activarOverlay', true);
      this.new_deposito.dialogo = false;
      let data = new FormData();
      data.append('caja_id',    this.CAJA);
      data.append('total',      this.egreso.total);
      data.append('referencia', this.egreso.referencia);
      data.append('cc_id',      this.egreso.ccBanco);
      data.append('file',       this.egreso.file);
      data.append('fecha', f.getFullYear()+'-'+this.new_deposito.mes+'-'+this.new_deposito.dia);
      this.$axios({
        method: 'post',
        url:    'caja/subir/egreso',
        data:data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$store.commit('caja/cambiar_VISTA', 1);
      }).catch((error)=>{
        if (error.response.status === 422)
          this.$store.commit('notificacion',{texto:error.response.data.msj, color:'success'});

        this.$store.commit('activarOverlay', false);
      });
    },
    registrarEgreso(){
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      data.append('caja_id',    this.CAJA);
      data.append('total',      this.egreso.total);
      data.append('referencia', this.egreso.referencia);
      data.append('cc_id',      this.egreso.ccBanco);
      data.append('file',       this.egreso.file)
      this.$axios({
        method: 'post',
        url:    'caja/egreso',
        data:data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$store.commit('caja/cambiar_VISTA', 1);
      }).catch((error)=>{
        if (error.response.status === 422)
          this.$store.commit('notificacion',{texto:error.response.data.msj, color:'success'});

        this.$store.commit('activarOverlay', false);
      });
    },
    validarForm2(){
      if (this.$refs.FormDepositoOtroDia.validate())
        this.registrarDepoito();
    },
    validarForm(){
      if (this.$refs.FormNuevoEgreso.validate())
        this.registrarEgreso();
    },
    verDocumento(URL){
      this.new_deposito.dialogo = false;
      this.$store.commit('activarOverlay',  true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
          this.new_deposito.dialogo = true;
        }
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento',color:'error'})
        this.$store.commit('activarOverlay', false);
      })
    }
  }
}
</script>

<style scoped>

</style>
