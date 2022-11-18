<template>
  <v-card flat :loading="$store.state.cajas.historial.LOADCIERRE">
    <v-card-subtitle>Resumen de la Caja</v-card-subtitle>

    <v-row>
      <v-col>
        <v-simple-table class="rowsTable" dense>
          <template v-slot:default>
            <tbody>
            <tr>
              <th>Total de Ingresos</th>
              <td>L. {{int.format(HISTORIAL.total)}}</td>
            </tr>
            <tr>
              <th>Total de Ingreso de Efectivo</th>
              <td>L. {{int.format(HISTORIAL.ingreso)}}</td>
            </tr>
            <tr>
              <th>Total de Egresos</th>
              <td>L. {{int.format(HISTORIAL.egreso)}}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col>
        <v-simple-table class="rowsTable" dense>
          <template v-slot:default>
            <tbody>
            <tr>
              <th>Efectivo al Final del Día</th>
              <td>L. {{int.format(HISTORIAL.efectivo)}}</td>
            </tr>
            <tr>
              <th>Efectivo Declarado</th>
              <td>L. {{int.format(HISTORIAL.efectivo_declarado)}}</td>
            </tr>
            <tr>
              <th>Descuadre</th>
              <td>L. {{int.format(HISTORIAL.descuadre)}}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table dense class="rowsTable">
          <template v-slot:default>
            <tbody>
            <tr>
              <th>Sucursal</th>
              <td>{{HISTORIAL.cajas.sucursal.nombre}}</td>
            </tr>
            <tr>
              <th>Caja</th>
              <td>{{HISTORIAL.cajas.codigo}}</td>
            </tr>
            <tr>
              <th>Documento</th>
              <td>
                <b-link @click="verDocumento(HISTORIAL.file)" v-if="HISTORIAL.file">Ver Cierre</b-link>
                <b-link v-else @click="dialogoCierre = true">Hacer cierre (Subir documento firmado)</b-link>
<!--                <b-link  @click="dialogoCierre = true">Hacer cierre (Subir documento firmado)</b-link>-->
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col>
        <v-simple-table dense class="rowsTable">
          <template v-slot:default>
            <tbody>
            <tr>
              <th>Fecha de Cierre</th>
              <td>{{HISTORIAL.fecha}}</td>
            </tr>
            <tr>
              <th>Observación</th>
              <td>{{HISTORIAL.observacion}}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-card-subtitle>Resumen de Formas de Pago</v-card-subtitle>
    <v-simple-table dense height="150px" fixed-header class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Total</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="HISTORIAL.resumen_fp" v-for="item in JSON.parse(HISTORIAL.resumen_fp)">
          <td>{{item.nombre}}</td>
          <td>L. {{int.format(item.total)}}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-divider></v-divider>

    <v-card-subtitle>Resumen de Caja</v-card-subtitle>
    <v-simple-table dense height="250px" fixed-header class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>Hora</th>
          <th>Detalle</th>
          <th>Saldo Anterior</th>
          <th>Pago</th>
          <th>Saldo Actual</th>
          <th>Forma de Pago</th>
          <th>Tipo</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="HISTORIAL.resumen_fp" v-for="item in JSON.parse(HISTORIAL.resumen)">
          <td>{{item.hora}}</td>
          <td>{{item.detalle}}</td>
          <td>L. {{int.format(item.saldoA)}}</td>
          <td>L. {{int.format(item.total)}}</td>
          <td>L. {{int.format(item.saldoNuevo)}}</td>
          <td>{{item.forma_pago}}</td>
          <td v-if="item.tipo === 0">+</td>
          <td v-else>-</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-divider></v-divider>
    <v-card-subtitle>Historial Completo de Caja</v-card-subtitle>
    <v-progress-linear indeterminate v-if="loadHistorial"></v-progress-linear>
    <v-simple-table dense height="500px" fixed-header class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>Tipo de Documento</th>
          <th>Referencia</th>
          <th>Forma de Pago</th>
          <th>Tipo</th>
          <th>Total</th>
          <th>Archivo</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in historial">
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
    <br>
    <br>
    <br>


    <v-dialog v-model="dialogoCierre" width="40%">
      <v-card>
        <v-toolbar dense flat color="grey lighten-3">
          <v-card-title>Cargar Cierre de Caja del {{dia}} de {{mes}} de {{anio}}</v-card-title>

        </v-toolbar>

        <v-container>
          <v-card-text>
            Tienes que cargar el documento firmado del cierre. Si no tiene el documento seleccione el siguiente link.
            <b-link @click="solicitarClave(null, null, {}, 2)">Generar cierre pdf del {{dia}} de {{mes}} de {{anio}}</b-link>
          </v-card-text>

          <v-divider></v-divider>
          <v-file-input v-model="file" class="ma-2" dense label="Cargar documento firmado y escaneado"></v-file-input>
          <v-autocomplete :items="ccCuentasB" :item-value="'id'" :item-text="'nombre'" class="ma-2"
                          :loading="loadccBancos" label="Seleccionar Cuenta"
                          dense v-model="ccBanco"></v-autocomplete>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="red" dark tile small @click="dialogoCierre = false">Cerrar</v-btn>
            <v-btn color="success" dark tile small @click="culminarCierre">Registrar</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "historial",
  props:{
    anio: Number,
    mes: Number,
    dia: Number
  },
  data(){
    return{
      int:new Intl.NumberFormat(),
      historial: [],
      loadHistorial: false,
      dialogoCierre: false,
      file: null,
      loadccBancos: false,
      ccCuentasB:{},
      ccBanco: 0
    }
  },
  computed:{
    HISTORIAL(){
      return this.$store.state.cajas.historial.SUCURSAL;
    },
    USUARIO(){
      return this.$store.state.usuario;
    }
  },
  created() {
    this.cargarHistorial();

    this.cargarCcCuentasBancos()
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
    },
    cargarCcCuentasBancos(){
      this.loadccBancos = true;
      this.$axios.get('contabilidad/2.0/cargando_cuentas/1113').then((res)=>{
        this.ccCuentasB   = res.data.cuentas;
        this.loadccBancos = false
      });
    },
    cargarCierre(clave){
      let fecha = this.anio+'-'+this.mes+'-'+this.dia;
      let url = this.$axios.defaults.baseURL+`documentos/cajas/cierre/usuario=${this.USUARIO}/caja=${this.HISTORIAL.cajas.codigo}/fecha=${fecha}/${clave}`;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
      this.dialogoCierre = true;
    },
    cargarHistorial(){
      this.loadHistorial = true;
      this.$axios.get('caja/'+this.HISTORIAL.cajas.id+'/historial/'+this.anio+'-'+this.mes+'-'+this.dia).then((res)=>{
        this.loadHistorial = false;
        this.historial = res.data.historial;
      })
    },
    culminarCierre(){
      if (this.file && this.ccBanco){
        let data = new FormData();
        this.dialogoCierre = false;
        let fecha = this.anio+'-'+this.mes+'-'+this.dia;
        data.append('caja_id', this.HISTORIAL.cajas.id);
        data.append('cierre_id',this.HISTORIAL.id);
        data.append('file', this.file);
        data.append('ccBanco', this.ccBanco);
        data.append('fecha', fecha);
        this.$store.commit('activarOverlay', true);
        this.$axios({
          method: 'post',
          url:    'caja/cierre/culminar',
          data:   data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.$store.commit('cajas/historial/cargar_CIERRE', this.HISTORIAL.id);
          this.cargarHistorial();
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          this.$store.commit('notificacion',{texto:'Se ha cerrado la caja, por el día de hoy ya pondrás acceder',color:'warning'});
          this.$store.commit('activarOverlay', false);
        }).catch((error)=>{
          this.dialogoCierre = true;
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un errror en el servidor', color:'error'});
        })
      }else{
        this.$store.commit('notificacion',{texto:'Tienes que subir un documento', color:'error'});
      }
    },
    solicitarClave(tipo, recibo, data, soli){
      this.$store.commit('activarOverlay', true);
      this.fac = data;
      this.dialogoCierre = false;
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
    verDocumento(URL){
      this.$store.commit('activarOverlay',  true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
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
.rowsTable{
  cursor: pointer;
}
</style>
