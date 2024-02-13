<template>
  <v-card flat tile>
    <v-toolbar dense flat>
      <h6>Arqueo de Caja</h6>
    </v-toolbar>

    <v-card flat>
      <v-card-text>Todas las Transacciones Detalladas</v-card-text>
      <v-data-table dense :items="TRANSACCIONES" :headers="headers">
        <template v-slot:item.tipo_doc="{item}">
          <v-chip dark x-small v-if="item.tipo_doc === 1" color="success">Factura</v-chip>
          <v-chip dark x-small v-else-if="item.tipo_doc === 2" color="indigo">Recibo</v-chip>
          <v-chip dark x-small v-else-if="item.tipo_doc === 3" color="pink">DXC</v-chip>
          <v-chip dark x-small v-else-if="item.tipo_doc === 4" color="orange">Egreso</v-chip>
          <v-chip dark x-small v-else-if="item.tipo_doc === 5" >Anticipo</v-chip>
        </template>
        <template v-slot:item.tipo="{item}">
          <span v-if="item.tipo === 0">+</span>
          <span v-else-if="item.tipo === 1">-</span>
        </template>
        <template v-slot:item.saldoA="{item}">L {{int.format(item.saldoA)}}</template>
        <template v-slot:item.total="{item}">L {{int.format(item.total)}}</template>
        <template v-slot:item.saldoNuevo="{item}">L {{int.format(item.saldoNuevo)}}</template>
        <template v-slot:item.detalle="{item}">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <span v-on="on" v-bind="attrs">{{item.detalle.substr(0,15)}} ...</span>
            </template>
            <span>{{item.detalle}}</span>
          </v-tooltip>
        </template>
      </v-data-table>

      <v-divider></v-divider>
      <v-card-text>Resumen de las Formas de Pago</v-card-text>
      <v-data-table :items="FORMA_PAGOS" :loading="LOAD_FORMA_PAGOS"
                    loading-text="Cargando Datos"
                    :headers="headerFP" dense>
        <template v-slot:item.total="{item}">
          L {{int.format(item.total)}}
        </template>
      </v-data-table>

      <v-divider></v-divider>
      <v-form ref="FormCajaCierre">
        <v-card-text>Resumen de Totales</v-card-text>
        <v-row no-gutters>
          <v-col>
            <v-text-field class="ma-2" dense label="Total de documentos ingresado"
                          disabled :value="total" suffix="lps"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field class="ma-2" dense label="Total de efectivo ingresado"
                          disabled :value="TOTAL_CAJA" suffix="lps"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field class="ma-2" dense label="Total de efectivo egresado"
                          disabled :value="EGRESO" suffix="lps"></v-text-field>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-text-field class="ma-2" dense label="Efectivo Disponible"
                          :value="TOTAL_CAJA - EGRESO" disabled suffix="lps"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field class="ma-2" dense label="Total de efectivo declarado" @keyup="cuadrarSaldo"
                          v-model="cierre.declarado" suffix="lps" :rules="[rules.req.dec, rules.req.tel]"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field class="ma-2" dense label="Descuadre"
                          v-model="cierre.descuadre" disabled suffix="lps"></v-text-field>
          </v-col>
        </v-row>
        <v-text-field class="ma-2" dense label="Observación" :rules="[rules.req.req]"
                      v-model="cierre.observacio"></v-text-field>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn small tile :disabled="cierre.vista" color="success" @click="dialogoCierre = true"
               class="ma-2 text-white">Registrar Cierre de Caja</v-btn>
      </v-card-actions>

      <v-divider></v-divider>

      <div v-if="cierre.vista">
        <v-file-input dense label="Documento" v-model="cierre.file" accept=".pdf"></v-file-input>
        <v-card-actions>
          <v-btn dark color="success" tile small @click="culminarCierre">Registrar Documento</v-btn>
        </v-card-actions>
      </div>

    </v-card>

    <v-dialog v-model="dialogoCierre" width="30%">
      <v-card >
        <v-toolbar flat color="grey lighten-3"><h5>Verificación de Cierre</h5></v-toolbar>
        <v-card-text>Por favot, revisa los siguientes datos antes de que cierrer caja</v-card-text>
        <div class="ma-4">
          <h6>Total de efectivo que debería haber en caja: <strong>L. {{TOTAL_CAJA}}</strong></h6>
          <h6>Total de efectivo que declaraste: <strong>L. {{cierre.declarado}}</strong></h6>
          <h6>Tienes un descuadre de: <strong>L. {{cierre.descuadre}}</strong></h6>
        </div>
        <br>
        <v-card-text>Para que tengas un cierre de caja sin problemas deberías de tener un descuadre de L 0.</v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" dark tile small @click="dialogoCierre = false">Verificar </v-btn>
          <v-btn color="success" dark tile small @click="validarForm">Registrar Cierre</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "creando_cierre",
  props:{
    fecha: String
  },
  computed:{
    CAJA(){
      return this.$store.state.caja.CAJA_ID;
    },
    DOCUMENTOS(){
      return this.$store.state.caja.DOCUMENTOS_HOY;
    },
    EGRESO(){
      let transacciones = this.$store.state.caja.TRANSACCIONES;
      let egreso = 0;
      transacciones.forEach((item)=>{
        if (item.tipo === 1)
          egreso = parseFloat(egreso) + parseFloat(item.total);
      })
      return egreso;
    },
    TOTAL_CAJA(){
      let total = 0;
      this.TRANSACCIONES.forEach((i)=>{
        if (i.tipo === 0 && i.forma_pago_id === 3)
          total = parseFloat(total) + parseFloat(i.total);
      });
      return total.toFixed(2);
    },
    total(){
      let total = 0;
      this.TRANSACCIONES.forEach((i)=>{
        if (i.tipo === 0)
          total = parseFloat(total) + parseFloat(i.total);
      });
      return total.toFixed(2);
    },
    LOAD_TRANSACCIONES(){
      return this.$store.state.caja.LOAD_TRANSACCIONES;
    },
    TRANSACCIONES(){
      let transacciones = this.$store.state.caja.TRANSACCIONES;
      let datos         = [];
      let saldo         = 0, detalle = '', saldoA = 0, fecha= new Date();
      transacciones.forEach((item)=>{
        if (item.tipo_documento === 1)
          detalle = `Pago de Factura de ${item.factura.venta.cliente.nombres} ${item.factura.venta.cliente.apellidos}, de venta # ${item.factura.venta.cod}`;
        else if(item.tipo_documento === 2)
          detalle = `Pago de Recibo de ${item.recibo.venta.cliente.nombres} ${item.recibo.venta.cliente.apellidos}, de venta # ${item.recibo.venta.cod}`;
        else if (item.tipo_documento === 3)
          detalle = `Pago de documento por cobrar de ${item.recibo.venta.cliente.nombres} ${item.recibo.venta.cliente.apellidos}, de venta # ${item.recibo.venta.cod}`;
        else if (item.tipo_documento === 4)
          detalle = `Egreso a depósito`;
        else if (item.tipo_documento === 5)
          detalle = 'Anticipo de cliente'

        if (item.tipo === 0)
          saldo = parseFloat(saldo) + parseFloat(item.total);
        else
          saldo = parseFloat(saldo) - parseFloat(item.total);

        fecha = new Date(item.created_at)
        datos.push({
          detalle:    detalle,
          tipo_doc:   item.tipo_documento,
          tipo:       item.tipo,
          saldoA:     saldoA.toFixed(2),
          total:      item.total,
          saldoNuevo: saldo.toFixed(2),
          hora:       fecha.getHours()+':'+fecha.getMinutes()+':'+fecha.getSeconds(),
          forma_pago: item.forma_pago.nombre,
          forma_pago_id: item.forma_pago_id
        });

        saldoA = saldo;
      })
      return datos;
    },
    FORMA_PAGOS(){
      return this.$store.state.caja.HISTORIAL;
    },
    LOAD_FORMA_PAGOS(){
      return this.$store.state.caja.LOAD_HISTORIAL;
    },
    INFOCAJA(){
      return this.$store.state.caja.CAJA;
    },
    USUARIO(){
      return this.$store.state.usuario;
    },
  },
  data(){
    return{
      dialogoCierre:  false,
      cierre:{
        descuadre: 0,
        declarado: 0,
        vista: false,
        observacio: '',
        file: null,
        cc_banco: '',
        cierre: null
      },
      rules: {
        req: {
          req: v => !!v || 'Campo requerido',
          dec: v => v >= 0 || 'Tiene que ser igual o mayor a 0',
          tel: v => (v === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Tienes datos diferentes a números'
        },
      },
      int: Intl.NumberFormat(),
      headerFP:[
        {text:'Nombre',value:'nombre'},
        {text:'Total',value:'total'},
      ],
      headers:[
        {text:'Tipo Doc.', value:'tipo_doc'},
        {text:'Tipo', value:'tipo'},
        {text:'Hora', value:'hora'},
        {text:'Forma Pago', value:'forma_pago'},
        {text:'Detalle', value:'detalle'},
        {text:'Saldo Ant.', value:'saldoA'},
        {text:'Total', value:'total'},
        {text:'Saldo Nuevo', value:'saldoNuevo'},
      ],
    }
  },
  methods:{
    abrirNavegador(clave){
      let     f = new Date();
      let url = this.$axios.defaults.baseURL+`documentos/cajas/cierre/usuario=${this.USUARIO}/caja=${this.INFOCAJA.codigo}/fecha=${this.fecha}/${clave}`;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
      this.dialogoPartida = true;
    },
    cuadrarSaldo(){
      if (this.cierre && this.cierre.declarado >= 0){
        this.cierre.descuadre = (this.TOTAL_CAJA - this.EGRESO) - this.cierre.declarado;
      }
    },
    culminarCierre(){
      if (this.cierre.file){
        let data = new FormData();
        let     f = new Date();
        data.append('caja_id', this.CAJA);
        data.append('cierre_id',this.cierre.cierre);
        data.append('file', this.cierre.file);
        data.append('ccBanco', this.cierre.cc_banco);
        data.append('fecha', this.fecha);
        this.$store.commit('activarOverlay', true);
        this.$axios({
          method: 'post',
          url:    'caja/cierre/culminar/otro_dia',
          data:   data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          this.$store.commit('notificacion',{texto:'Se ha cerrado la caja, por el día de hoy ya pondrás acceder',color:'warning'});
          this.$store.commit('activarOverlay', false);
          this.$store.commit('quitar_pestania', 1);
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un errror en el servidor', color:'error'});
        })
      }else{
        this.$store.commit('notificacion',{texto:'Tienes que subir un documento', color:'error'});
      }
    },
    printPartida(){
      this.$store.commit('activarOverlay', true);
      this.dialogoPartida = false;
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave);
      }).catch((error)=>{
        this.dialogoPartida = true;
        this.$store.commit('activarOverlay', false);
      });
    },
    registrarCierre(){
      this.dialogoCierre = false;
      let     f = new Date();
      this.$store.commit('activarOverlay', true);
      this.$axios.post('caja/cierre',{
        caja_id: this.CAJA,
        resumen_fp: JSON.stringify(this.FORMA_PAGOS),
        resumen:    JSON.stringify(this.TRANSACCIONES),
        total:      this.total,
        ingreso:    (parseFloat(this.TOTAL_CAJA) + parseFloat(this.EGRESO)),
        egreso:     this.EGRESO,
        efectivo:   (this.TOTAL_CAJA - this.EGRESO),
        efectivo_declarado: this.cierre.declarado,
        descuadre:          this.cierre.descuadre,
        fecha:              this.fecha,
        observacion:        this.cierre.observacio
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj,color:'success'});
        this.cierre.vista = true;
        this.cierre.cierre = res.data.cierre;
        this.printPartida();
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Ha ocurrido un error en el servidor',color:'error'});
      })
    },
    validarForm(){
      if (this.$refs.FormCajaCierre.validate()){
        this.registrarCierre();
      }
    }
  }
}
</script>

<style scoped>

</style>
