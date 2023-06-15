<template>
<v-card flat>
  <v-toolbar color="grey lighten-3" flat><h6>Nueva Nota de Crédito de Cliente</h6></v-toolbar>
  <v-card color="grey lighten-4" flat class="ma-3">
    <v-card-subtitle>Datos del cliente</v-card-subtitle>
    <v-row no-gutters>
      <v-col>
        <v-form ref="FormValidarIdentidadCliente" v-on:submit.prevent>
          <v-text-field label="Identidad del cliente"
                        :rules="rulesIdentidad"
                        @keyup.enter="validarIdentidad"
                        v-model="nc.identidad"
                        class="ma-3"
                        persistent-hint
                        hint="Presione enter para buscar "
                        :loading="loadIdentidad"
                        counter dense></v-text-field>
        </v-form>
      </v-col>
      <v-col>
        <v-text-field class="ma-3" dense label="Nombre del Cliente" placeholder="Nombre del cliente"
                      disabled :value="cliente.nombres"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-3" dense label="Apellido del Cliente" placeholder="Apellidos del cliente"
                      disabled :value="cliente.apellidos"></v-text-field>
      </v-col>
    </v-row>
  </v-card>

  <v-card color="grey lighten-4" flat class="ma-3">
    <v-card-subtitle>Seleccionar cuenta del anticipo</v-card-subtitle>
    <v-data-table dense :headers="headers" :items="anticipos" :loading="loadAnticipo" class="rowsTable"
                  loading-text="Cargando cuentas de anticipo" color="grey lighten-4" @click:row="capturarCC">
      <template v-slot:item.monto="{item}">L {{int.format(item.monto)}}</template>
    </v-data-table>
    <v-row no-gutters>
      <v-col>
        <v-text-field dense label="Código de la cuenta contables" class="ma-3" disabled :value="cc.cod"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field dense label="Nombre de la cuenta contable" class="ma-3" disabled :value="cc.nombre"></v-text-field>
      </v-col>
    </v-row>
  </v-card>

  <v-card color="grey lighten-4" flat class="ma-3">
    <v-card-subtitle>Datos de la Cuenta a Modificar</v-card-subtitle>
    <v-row no-gutters>
      <v-col>
        <v-data-table :items="cuentas"
                      :loading="loadCuentas"
                      loading-text="Cargando Cuentas"
                      :headers="headersCuetas"
                      dense @click:row="capturarVenta"
                      class="rowsTable ma-2">
          <template v-slot:item.estado="{item}">
            <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
            <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
            <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
            <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
          </template>
          <template v-slot:item.total="{item}">L {{int.format(item.total)}}</template>
          <template v-slot:item.saldo_actual="{item}">L {{int.format(item.saldo_actual)}}</template>

        </v-data-table>
      </v-col>
      <v-col>
        <v-progress-linear indeterminate v-if="loadCuenta"></v-progress-linear>
        <v-simple-table dense class="ma-2 rowsTable">
          <template v-slot:default>
            <tbody>
            <tr>
              <th>Código de la venta</th>
              <td>{{cuentass.cod}}</td>
            </tr>
            <tr>
              <th>Total del crédito:</th>
              <td v-if="nc.pagos.length > 0"> L {{int.format(cuentass.total)}}</td>
            </tr>
            <tr>
              <th>Saldo actual del crédito:</th>
              <td v-if="nc.pagos.length > 0">L {{int.format(cuentass.saldo_actual)}}</td>
            </tr>
            <tr>
              <th>Ver pagos</th>
              <td>
                <v-btn small tile dark color="indigo" class="ma-2" block v-if="nc.pagos.length > 0" @click="abrirDialogo">Seleccionar pagos afectados</v-btn>
                <v-btn small tile dark color="indigo" class="ma-2" block v-if="nc.pagos.length > 0" @click="abrirDialogoDXC">Seleccionar DXC</v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-card>

  <v-card-actions class="ma-3 d-flex justify-end">
    <v-btn color="success" tile small dark @click="validarEnvio">Registrar nota de crédito</v-btn>
  </v-card-actions>

  <v-dialog v-model="dialogoPagos" width="100%" style="height: 90vh">
    <v-card>
      <v-card-title>Pagos de la cuenta</v-card-title>
      <v-card-subtitle>Seleccionar los pagos que quieres modificar</v-card-subtitle>
      <v-row no-gutters>
        <v-col>
          <v-text-field dense class="ma-3" label="Monto inicial" v-model="nc.monto" disabled suffix="lps"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense class="ma-3" label="Monto usado" v-model="nc.monto_usado" disabled suffix="lps"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense class="ma-3" label="Monto disponible" v-model="nc.monto_disponible" disabled suffix="lps"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense class="ma-3" label="Cant. de pagos afectados" v-model="nc.cant_pagos" disabled suffix="pagos"></v-text-field>
        </v-col>
      </v-row>

      <v-data-table @click:row="calcularTotal" :headers="headersPagos" dense :items="nc.pagos" :item-class="filaError">
        <template v-slot:item.saldo_actual="{item}">L {{int.format(item.saldo_actual)}}</template>
        <template v-slot:item.pago_inicial="{item}">L {{int.format(item.pago_inicial)}}</template>
        <template v-slot:item.saldo_faltante="{item}">L {{int.format(item.saldo_faltante)}}</template>
        <template v-slot:item.total_abonado="{item}">L {{int.format(item.total_abonado)}}</template>
        <template v-slot:item.total_abonado1="{item}">
          <v-text-field v-model="item.total_abonado1" @change="calcularTotal" @keyup.enter="calcularTotal"
                        dense placeholder="Escribir aca el total a abonar" ></v-text-field>
        </template>
        <template v-slot:item.mora="{item}">L {{int.format(item.mora)}}</template>
        <template v-slot:item.total_pago="{item}">L {{int.format(item.total_pago)}}</template>
        <template v-slot:item.estado="{item}">
          <v-chip color="orange" x-small dark v-if="item.estado === 1">Al día</v-chip>
          <v-chip color="success" x-small dark v-else-if="item.estado === 3">Cancelado</v-chip>
          <v-chip color="red" x-small dark v-else-if="item.estado === 2">En Mora</v-chip>
        </template>
      </v-data-table>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" tile dark small @click="dialogoPagos = false">Finalizar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogoPagoDXC" width="100%" style="height: 90vh">
    <v-card>
      <v-card-title>Documentos por Cobrar</v-card-title>
      <v-card-subtitle>Seleccionar los pagos que quieres modificar</v-card-subtitle>
      <v-row no-gutters>
        <v-col>
          <v-text-field dense class="ma-3" label="Monto inicial" v-model="nc.monto" disabled suffix="lps"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense class="ma-3" label="Monto usado" v-model="nc.monto_usado" disabled suffix="lps"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense class="ma-3" label="Monto disponible" v-model="nc.monto_disponible" disabled suffix="lps"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense class="ma-3" label="Cant. de pagos afectados" v-model="nc.cant_pagos" disabled suffix="pagos"></v-text-field>
        </v-col>
      </v-row>

      <v-data-table :headers="headerDXCS" dense :items="nc.dxc" >
        <template v-slot:item.id="{item}">{{cuentass.cod}}</template>

        <template v-slot:item.nuevo_saldo="{item}">L {{int.format(item.nuevo_saldo)}}</template>
        <template v-slot:item.total="{item}">L {{int.format(item.total)}}</template>
        <template v-slot:item.saldo_abonado="{item}">
          <v-text-field v-model="item.saldo_abonado" @change="calcularTotalDXC" @keyup.enter="calcularTotalDXC"
                        dense placeholder="Escribir aca el total a abonar" ></v-text-field>
        </template>
        <template v-slot:item.estado="{item}">
          <v-chip color="orange" x-small dark v-if="item.estado === 1">Pendiente</v-chip>
          <v-chip color="red" x-small dark v-else-if="item.estado === 2">Cancelado</v-chip>
        </template>
      </v-data-table>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" tile dark small @click="cerrarDialogoDXC">Finalizar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogoCaja" width="30%">
    <v-card>
      <v-card-title>Seleccionar caja </v-card-title>
      <v-card-text>Es la caja a la que va aparecer cargado el recibo</v-card-text>
      <v-autocomplete :items="cajas" v-model="caja" :loading="loadCajas" dense label="Seleccionar caja"
                      class="ma-3" :item-value="'caja'" :item-text="'nombre'"></v-autocomplete>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="orange" tile small dark @click="dialogoCaja = false">Cancelar</v-btn>
        <v-btn color="success" tile small dark v-if="caja > 0" @click="registrarNota">Registrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
export default {
  name: "nueva",
  data(){
    return{
      dialogoPagos: false,
      dialogoPagoDXC: false,
      int: Intl.NumberFormat(),
      cc: {},
      anticipos: [],
      loadAnticipo: false,
      headers:[
        {text:'Motivo', value:'motivo'},
        {text:'Saldo Acntual', value:'monto'},
        {text:'Recibo', value:'recibo.codigo'},
        {text:'Cuenta C.', value:'cc.cod'},
      ],
      headersCuetas:[
        {text:'Código', value:'cod'},
        {text:'Total', value:'total'},
        {text:'Saldo Actual', value:'saldo_actual'},
        {text:'Estado', value:'estado'},
      ],
      headersPagos:[
        {text:'Detalle', value:'detalle'},
        {text:'Pago Inicial', value:'pago_inicial'},
        {text:'Total Abonado', value:'total_abonado'},
        {text:'Saldo para Liquidar', value:'saldo_faltante'},
        {text:'Total Usado', value:'total_abonado1'},
        {text:'Mora', value:'mora'},
        {text:'Total del Pago', value:'total_pago'},
        {text:'Saldo Actual', value:'saldo_actual'},
        {text:'Estado', value:'estado'},
      ],
      headerDXCS:[
        {text:'Venta', value:'id'},
        {text:'Detalle', value:'detalle'},
        {text:'Total', value:'total'},
        {text:'Total a Abonar', value:'saldo_abonado'},
        {text:'Nuevo Saldo', value:'nuevo_saldo'},
        {text:'Estado', value:'estado'},
      ],
      saldoAbonarDXC: 0,
      loadIdentidad:    false,
      cliente: {},
      nc:{
        identidad: '',
        cliente_id: '',
        monto: 0,
        monto_usado: 0,
        monto_disponible: 0,
        cant_pagos: 0,
        concepto: '',
        pagos:    [],
        dxc:      [],
        pagos_afectados: [],
        is_anticipo: false,
        anticipo_id: ''
      },
      rulesIdentidad:[
        v => !!v || 'La identidad es requerida',
        v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Identidad no válida, tienes datos diferentes a números',
        v => (v.length === 0 || v.length === 13 || v.length === 14) || 'Tiene que ser de 13 o 14 carácteres.'
      ],
      loadCuentas: false,
      loadCuenta:  false,
      cuentas:     [],
      cuenta:      {},
      cuentass:    {},
      vista:       1,
      cajas:       [],
      caja:        0,
      loadCajas:   false,
      dialogoCaja: false,
      tipo:        0 //1-pagos a la cuenta normal- 2. pagos a documentos por cobrar
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Notas de Crédito > Cliente > Anticipo')
  },
  methods:{
    abrirDialogo(){
      if (this.tipo === 0 || this.tipo === 1) {
        if (this.nc.is_anticipo) {
          this.dialogoPagos = true;
          this.tipo = 1;
        }else
          this.$store.commit('notificacion',{texto:'Tienes que seleccionar un anticpo', color:'warning'});
      }else {
        this.$store.commit('notificacion', {
          texto: 'No puedes abrir aquí porque seleccionaste documentos por cobrar',
          color: 'warning'
        });
        this.$store.commit('notificacion',{texto:'Para resetear la nota, presiona enter en el campo identidad', color:'warning'});
      }
    },
    abrirDialogoDXC(){
      if (this.tipo === 0 || this.tipo === 2) {
        if (this.nc.is_anticipo) {
          this.dialogoPagoDXC = true;
          this.tipo = 2;
        }else
          this.$store.commit('notificacion',{texto:'Tienes que seleccionar un anticpo', color:'warning'});
      }else {
        this.$store.commit('notificacion', {
          texto: 'No puedes abrir aquí porque seleccionaste afectar pagos normales',
          color: 'warning'
        });
        this.$store.commit('notificacion',{texto:'Para resetear la nota, presiona enter en el campo identidad', color:'warning'});
      }
    },
    buscarcliente(){
      this.loadIdentidad = true;
      this.tipo          = 0;
      this.$axios.get('cliente_segumiento/'+this.nc.identidad)
          .then((res)=>{
            if (res.data.cliente){
              this.cliente = res.data.cliente;
              this.$store.commit('notificacion',{texto:'Se cargó la información del cliente', color:'success'});
              this.$store.commit('notificacion',{texto:'Cargando anticipos del cliente', color:'warning'});
              this.loadIdentidad = false;
              this.cargarAnticipos();
              this.cargarCuentas();
            }else{
              this.$store.commit('notificacion',{texto:'El cliente no existe',color:'warning'});
              this.loadIdentidad = false;
            }
          }).catch((error)=>{
        this.notificacion('Hubo error al cargar los datos. Presiona ENTER nuevamente','error');
        this.loadIdentidad = false;
      })
    },
    calcularTotal(){
      let cuentas = 0,monto_usado = 0;
      this.nc.pagos.forEach((item)=>{
        if (item.total_abonado1 > 0 && item.estado === 1 || item.estado === 3){
          monto_usado      = parseFloat(monto_usado) + parseFloat(item.total_abonado1);
          item.saldo_faltante = parseFloat(item.pago_inicial) - (parseFloat(item.total_abonado) + parseFloat(item.total_abonado1));
        }
        if (item.total_abonado1 === 0 && item.saldo_faltante < 0)
          item.saldo_faltante = 0;
      });
      this.nc.monto_disponible = (this.nc.monto - this.nc.monto_usado).toFixed(2);
      this.nc.cant_pagos       = cuentas;
      this.nc.monto_usado      = monto_usado.toFixed(2);
      if (this.nc.monto_disponible < 0)
        this.$store.commit('notificacion', {color:'warning', texto:'Haz sobrepaso el monto que puedes usar.'})
    },
    calcularTotalDXC(){
      let cuentas = 0,monto_usado = 0;
      this.nc.dxc.forEach((item)=>{
        item.saldo_abonado = parseFloat(item.saldo_abonado);
        if (item.estado === 1 && item.saldo_abonado > 0){
          console.log(item)
          monto_usado      = parseFloat(monto_usado) + parseFloat(item.saldo_abonado);
          console.log(item)
          item.nuevo_saldo = parseFloat(item.total) - parseFloat(item.saldo_abonado);
          console.log(item)
          item.edit        = 1;
          cuentas++;
        }else if (item.estado === 1 && item.saldo_abonado == 0 && item.edit === 1){
          item.edit = 0;
          item.nuevo_saldo = item.total;
        }
      });
      this.nc.monto_disponible = (this.nc.monto - this.nc.monto_usado).toFixed(2);
      this.nc.cant_pagos       = cuentas;
      this.nc.monto_usado      = monto_usado.toFixed(2);
      if (this.nc.monto_disponible < 0)
        this.$store.commit('notificacion', {color:'warning', texto:'Haz sobrepaso el monto que puedes usar.'})
    },
    cargarAnticipos(){
      this.loadAnticipo = true;
      this.$axios.get('contabilidad/anticipos/cliente/'+this.cliente.id).then((res)=>{
        if (res.data.anticipos.length > 0)
          this.anticipos = res.data.anticipos;
        else
          this.$store.commit('notificacion',{texto:'No hay anticipos del cliente', color:'error'});

        this.loadAnticipo = false;
      })
    },
    cargarCajas(){
      this.loadCajas = true;
      this.$axios.get('cajas').then((res)=>{
        this.cajas = res.data.cajas;
        this.loadCajas = false;
      })
    },
    cargarCuentas(){
      this.loadCuentas = true;
      this.$axios.get('cuentas_clientes/'+this.cliente.id).then((res)=>{
        if (res.data.cuentas.length > 0)
          this.cuentas = res.data.cuentas;
        else
          this.$store.commit('notificacion',{texto:'El cliente no tiene cuentas asociadas', color:'error'});

        this.loadCuentas = false;
      })
    },
    cargarPagos(){
      this.loadCuenta = true;
      this.$axios.get('venta/'+this.cuentass.id).then((res)=>{
        this.cuenta     = res.data.venta;
        res.data.venta.pagos_contratos.forEach((item)=>{
          this.nc.pagos.push({
            id: item.id,
            detalle: item.detalle,
            total_abonado: item.total_abonado,
            total_abonado1: 0,
            saldo_actual: item.saldo_actual,
            pago_inicial: item.pago_inicial,
            mora:         item.mora,
            total_pago:   item.total_pago,
            estado:       item.estado,
            saldo_faltante: item.saldo_actual
          })
        })
        this.$store.commit('notificacion',{texto:'Se han cargado los pagos', color:'success'});
        this.loadCuenta = false;
        this.cargarCajas();
      })
    },
    capturarCC(data){
      this.cc                  = data.cc;
      this.nc.monto            = data.monto;
      this.nc.monto_disponible = data.monto;
      this.nc.is_anticipo      = true;
      this.nc.anticipo_id      = data.id;
    },
    capturarVenta(data) {
      this.cuentass = data;
      if (data.pagos_extras_ventas.length > 0){
        this.nc.dxc = [];
        data.pagos_extras_ventas.forEach((item)=>{
          this.nc.dxc.push({
            id: item.id,
            total: item.total,
            detalle: item.descripcion,
            saldo_abonado: 0,
            nuevo_saldo: 0,
            estado: item.estado,
            edit: 0
          })
        })
      }
      this.cargarPagos();
    },
    cerrarDialogoDXC(){
      this.calcularTotalDXC();
      if (this.nc.monto_disponible >= 0 && this.nc.cant_pagos === 1)
        this.dialogoPagoDXC = false;
      else {
        this.$store.commit('notificacion', {
          color: 'warning',
          texto: 'Verifica el monto que estas usando, porque tu saldo usado es negativo.'
        })
        this.$store.commit('notificacion', {color: 'warning', texto: 'Verifica que solo estes editando un pago.'})
      }
    },
    filaError(item){
      return item.saldo_faltante < 0 ? 'red' : '';
    },
    isObjEmpty(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
      }
      return true;
    },
    registrarNota(){
      if (this.tipo === 1)
        this.registrarNotaPagos()
      else if (this.tipo === 2)
        this.registrarNotaPagosDXC();

    },
    registrarNotaPagos(){
      this.dialogoCaja = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('contabilidad/anticipos/nota_credito',{
        id: this.nc.anticipo_id,
        total: this.nc.monto_usado,
        venta_id: this.cuenta.id,
        cc_id_anticipo: this.cc.id,
        sucursal_id:    this.cuenta.sucursal_id,
        caja_id:        this.caja,
        pagos:          this.nc.pagos
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$router.replace({path:'/contabilidad/notas_credito/cliente/'})
      }).catch((error)=>{
        this.dialogoCaja = true;
        this.$store.commit('notificacion',{texto:'Ha ocurrido un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    registrarNotaPagosDXC(){
      console.log(this.nc.dxc)
      this.dialogoCaja = false;
      let cuenta = this.nc.dxc.filter((item)=>item.edit === 1 && item.saldo_abonado > 0);
      this.$store.commit('activarOverlay', true);
      this.$axios.post('contabilidad/anticipos/nota_credito/dxc',{
        id:             this.nc.anticipo_id,
        total:          this.nc.monto_usado,
        venta_id:       this.cuenta.id,
        cc_id_anticipo: this.cc.id,
        sucursal_id:    this.cuenta.sucursal_id,
        caja_id:        this.caja,
        dxc:            cuenta[0]
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$router.replace({path:'/contabilidad/notas_credito/cliente/'})
        this.tipo = 0;
      }).catch((error)=>{
        this.dialogoCaja = true;
        this.$store.commit('notificacion',{texto:'Ha ocurrido un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    validarEnvio(){
      if (this.nc.monto >= this.nc.monto_usado && this.nc.monto_disponible >= 0 && this.nc.monto_usado > 0){
        if (this.tipo === 2 && this.nc.cant_pagos === 1){
          if (!this.isObjEmpty(this.cliente) && this.nc.monto > 0 && !this.isObjEmpty(this.cuenta)){
            this.dialogoCaja = true;
          }else{
            this.$store.commit('notificacion',{texto:'Vetifica el monto, el cliente y la cuenta seleccionada', color:'warning'});
          }
        }else if (this.tipo === 1){
          if (!this.isObjEmpty(this.cliente) && this.nc.monto > 0 && !this.isObjEmpty(this.cuenta)){
            this.dialogoCaja = true;
          }else{
            this.$store.commit('notificacion',{texto:'Vetifica el monto, el cliente y la cuenta seleccionada', color:'warning'});
          }
        }
      }else{
        this.$store.commit('notificacion',{texto:'No puedes usar un monto mayor al del anticipo', color:'warning'});
      }
    },
    validarIdentidad(){
      if (this.$refs.FormValidarIdentidadCliente.validate())
        this.buscarcliente();
    },
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
