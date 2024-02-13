<template>
<v-card flat tile>
  <v-toolbar dense flat tile>
    <v-card-title>Creando Nueva Solicitud de Pago</v-card-title>
  </v-toolbar>
  <v-divider></v-divider>
  <v-form class="ma-2 pa-2" ref="FormNuevaSolicitudPago">
    <v-row no-gutters>
      <v-col class="ma-1">
        <span class="nameImput">Detalle completo</span>
        <div class="cajaInput">
          <input type="text" v-model="detalle">
        </div>
      </v-col>
      <v-col cols="3" class="ma-1">
        <span class="nameImput">Detalle Impresión/Partida</span>
        <div class="cajaInput">
          <input type="text" v-model="detallrPrint">
        </div>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col class="ma-1">
        <span class="nameImput">Total</span>
        <div class="cajaInput">
          <input type="text" disabled v-model="total">
        </div>
      </v-col>
      <v-col class="ma-1">
        <span class="nameImput">Fecha Programada</span>
        <div class="cajaInput">
          <input type="date" v-model="fecha_programado">
        </div>
      </v-col>
      <v-col class="ma-1">
        <span class="nameImput">Fecha Acreditación</span>
        <div class="cajaInput">
          <input type="date" v-model="fecha_acreditacion">
        </div>
      </v-col>
      <v-col class="ma-1">
        <span class="nameImput">Tipo de solicitúd</span>
        <div class="cajaSelect">
          <select v-model="tipo" >
            <option class="item-select" v-for="item in Tipos" :value="item.value" v-text="item.text"></option>
          </select>
        </div>
      </v-col>
      <v-col class="ma-1">
        <span class="nameImput">Tipo de busqueda</span>
        <div class="cajaSelect">
          <select v-model="tipo_busqueda" @change="selectOption">
            <option :value="0">-----</option>
            <option class="item-select" v-for="item in TiposBusqueda" :value="item.value" v-text="item.text"></option>
          </select>
        </div>
      </v-col>
      <v-col class="ma-1">
        <span class="nameImput" v-text="tituloBusqueda"></span>
        <div class="cajaLink">
          <b-link style="font-size: 10px; margin-left: 5px" :disabled="tipo_busqueda === 0" @click="abrirDialogo">
            <span >Buscar</span>
            {{tituloBusquedaInput}}</b-link>
        </div>
      </v-col>
    </v-row>
    <div v-if="tipo_busqueda > 0">
      <span class="nameImput">Documentos</span>
      <v-divider></v-divider>
<!--      tipo de busqueda 1 - 2-->
      <v-row v-if="tipo_busqueda < 3">
        <v-col cols="6">
          <v-card :loading="loadPeticion" tile height="250" style="overflow-y: auto">
            <table>
              <thead>
              <tr>
                <th>Detalle</th>
                <th>Correlativo</th>
                <th>Gasto</th>
                <th>Sucursal</th>
                <th>Total</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in Gastos" @click="selectGasto(item)">
                <td>{{item.detalle}}</td>
                <td>{{item.correlativo}}</td>
                <td>{{item.gasto}}</td>
                <td>{{item.suc}}</td>
                <td>L. {{Intl.NumberFormat().format(item.total)}}</td>
              </tr>
              </tbody>
            </table>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card tile height="250" style="overflow-y: auto">
            <table>
              <thead>
              <tr>
                <th>Detalle</th>
                <th>Correlativo</th>
                <th>Gasto</th>
                <th>Sucursal</th>
                <th>Total</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in Gastos2" @dblclick="removeGasto(item)">
                <td>{{item.detalle}}</td>
                <td>{{item.correlativo}}</td>
                <td>{{item.gasto}}</td>
                <td>{{item.suc}}</td>
                <td>L. {{Intl.NumberFormat().format(item.total)}}</td>
              </tr>
              </tbody>
            </table>
          </v-card>
        </v-col>
      </v-row>
<!--      tipo de busqueda contrato-->
      <v-card v-if="tipo_busqueda === 3" :loading="loadPeticion" tile height="300" style="overflow-y: auto">
        <table>
          <thead>
          <tr>
            <th>Gasto</th>
            <th>Sucursal</th>
            <th>CC Cod.</th>
            <th>Num. Contrato</th>
            <th>Total Divisa</th>
            <th>Total</th>
            <th>Cant. Pagos</th>
            <th>Pago Actual</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in Contratos" @click="cargarPagosContratos(item)">
            <td>{{item.gasto}}</td>
            <td>{{item.suc}}</td>
            <td>{{item.cod}}</td>
            <td>{{item.num_contrato}}</td>
            <td>{{item.simbolo}} {{Intl.NumberFormat().format(item.total_divisa)}}</td>
            <td>{{SIMDIVISA}} {{Intl.NumberFormat().format(item.total)}}</td>
            <td>{{item.meses}}</td>
            <td>{{item.mes_actual}}</td>
          </tr>
          </tbody>
        </table>
      </v-card>
      <span class="nameImput">Pagos de la Solicitúd</span>
      <v-divider></v-divider>
<!--      tipo de busqueda 1 - 2-->
        <v-card v-if="tipo_busqueda < 3" tile height="250" style="overflow-y: auto">
        <table>
          <thead>
          <tr>
            <th>Detalle</th>
            <th>Proveedor</th>
            <th>Acreedor</th>
            <th>Tipo de Gasto</th>
            <th>Sucursal</th>
            <th>Cod CC</th>
            <th>Total</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in pagos">
            <td>{{item.detalle}}</td>
            <td>{{item.proveedor}}</td>
            <td>{{item.acreedor}}</td>
            <td>{{item.gasto}}</td>
            <td>{{item.suc}}</td>
            <td>{{item.cod}}</td>
            <td>L. {{Intl.NumberFormat().format(item.total)}}</td>
          </tr>
          </tbody>
        </table>
      </v-card>
<!--      contratos-->
        <v-row no-gutters v-if="tipo_busqueda === 3" >
          <v-col cols="8">
            <v-card tile height="350" style="overflow:auto;">
              <table>
              <thead>
              <tr>
                <th>Niel</th>
                <th colspan="2">Detalle</th>
                <th>Saldo Inicial</th>
                <th>Saldo Abonado</th>
                <th>Saldo Final</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in pagos">
                <td>{{item.nivel}}</td>
                <td>{{item.gasto}}</td>
                <td>{{item.detalle}}</td>
                <td>{{SIMDIVISA}} {{Intl.NumberFormat().format(item.saldo_inicial)}}</td>
                <td>{{SIMDIVISA}} {{Intl.NumberFormat().format(item.saldo_abonado)}}</td>
                <td>{{SIMDIVISA}} {{Intl.NumberFormat().format(item.saldo_actual)}}</td>
              </tr>
              </tbody>
            </table>
            </v-card>
          </v-col>
          <v-col>
            <v-card tile height="350" style="overflow:auto;">
              <table>
                <thead>
                <tr>
                  <th>Nivel</th>
                  <th>Total</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in arrayNiveles">
                  <td>Pago - <strong>{{arrayNiveles[index]}}</strong> de contrato</td>
                  <td>{{SIMDIVISA}} {{arrayTotales[index]}}</td>
                </tr>
                </tbody>
              </table>
            </v-card>
          </v-col>
        </v-row>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" small tile dark class="mt-5" @click="validarForm">Registrar</v-btn>
      </v-card-actions>
    </div>

  </v-form>

  <v-dialog v-model="dialogoAcreedores" width="35%" style="height: 60vh">
    <v-card >
      <v-card-title>Seleccionando Acreedor</v-card-title>
      <v-divider></v-divider>
      <v-card flat tile class="pa-2">
        <v-text-field class="ma-2" label="Buscar ..." v-model="search"></v-text-field>
        <v-data-table class="ma-2" :headers="headersAcreedor" :items="ACREEDORES" @click:row="SeletDialogo"
                      dense :search="search" :loading="LOAD_ACREEDORES"></v-data-table>
      </v-card>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="warning" small tile dark @click="dialogoAcreedores = false" class="ma-2">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogoProveedores" width="40%" style="height: 70vh">
    <v-card >
      <v-card-title>Seleccionando Proveedor</v-card-title>
      <v-divider></v-divider>
      <v-card flat tile class="pa-2">
        <v-text-field class="ma-2" label="Buscar ..." v-model="search"></v-text-field>
        <v-data-table class="ma-2" :headers="headersProveedor" :items="Proveedores" @click:row="SeletDialogo"
                      dense :search="search" :loading="loadProveedores"></v-data-table>
      </v-card>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="warning" small tile dark @click="dialogoProveedores = false" class="ma-2">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogoContratos" style="height: 90vh">
    <v-card>
      <v-card-title></v-card-title>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
export default {
  name: "nueva_solicitud_pago",
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Solicitudes de Pago > Nueva');
    this.$store.commit('contabilidad/divisas/cargarMonedas');
  },
  computed:{
    LOAD_ACREEDORES() {
      return this.$store.state.contabilidad.acreedores.LOAD_ACREEDORES;
    },
    ACREEDORES() {
      return this.$store.state.contabilidad.acreedores.ACREEDORES;
    },
    SIMDIVISA(){
      return this.$store.state.contabilidad.divisas.DIVISA.simbolo;
    },
  },
  data(){
    return{
      detalle: '',
      total: 0,
      detallrPrint: '',
      fecha_programado: null,
      fecha_acreditacion: null,
      tipo_busqueda: 0,
      TiposBusqueda:[
        {text: 'Acreedor', value: 1},
        {text: 'Proveedor - Gastos', value: 2},
        {text: 'Proveedor - Contratos', value: 3},

      ],
      tipo: 0,
      Tipos:[
        {text: 'Normal', value: 0},
        {text: 'Extendido', value: 1},
      ],
      loadProveedores: false,
      Proveedores: [],
      proveedor: 0,
      dialogoProveedores: false,
      headersProveedor:[
        {text: 'Nombre Completo', value:'nombre'},
        {text: 'Rtn',  value:'rtn'},
      ],
      loadAcreedore: false,
      Acreedores: [],
      acreedor: 0,
      headersAcreedor:[
        {text: 'Nombre Completo', value:'nombre'},
        {text: 'Identificación',  value:'identificacion'},
      ],
      dialogoAcreedores: false,
      loadContratos: false,
      Contratos: [],
      contrato: 0,
      dialogoContratos: false,
      tituloBusqueda: 'Sin seleccionar',
      tituloBusquedaInput: '-----',
      search: '',

      loadPeticion: false,
      Gastos: [],
      Gastos2: [],
      pagos: [],
      pagosContratos: [],
      arrayNiveles: [],
      arrayTotales: []
    }
  },
  methods:{
    abrirDialogo(){
      if (this.tipo_busqueda === 1) {
        this.dialogoAcreedores = true;
      }else if (this.tipo_busqueda === 2) {
        this.dialogoProveedores = true;
      }else if (this.tipo_busqueda === 3){
        this.dialogoProveedores = true;
      }
    },
    acomodarPagos(data, cc){
      let nivel = 1;
      data.forEach(item=>{
        if (item.estado === 0){
          this.pagos.push({
            key: 0,
            nivel: nivel,
            detalle: item.detalle,
            saldo_inicial: item.saldo_inicial,
            saldo_abonado: item.saldo_abonado,
            saldo_actual:  item.saldo_actual,
            gasto:         item.ct_contrato_proveedor.tipo_gasto.nombre +' - '+item.ct_contrato_proveedor.num_contrato,
            id:            item.id,
            cod:           cc
          });
          if (!this.arrayNiveles.includes(nivel)){
            this.arrayNiveles.push(nivel)
          }
          nivel++
        }
      });
      this.pagos.sort((a,b)=>{
        if (a.nivel > b.nivel)
          return 1;
        if (a.nivel < b.nivel)
          return -1;

        return 0;
      })

      let datos = [];
      let suma  = 0;
      this.arrayTotales = [];
      for (let i = 0; i < this.arrayNiveles.length; i++){
        datos = this.pagos.filter(item=>item.nivel === this.arrayNiveles[i]);
        datos.forEach(item=>{
          suma = Number(suma) + Number(item.saldo_inicial)
        })
        console.log("nivel "+this.arrayNiveles[i]+' hay '+suma);
        this.arrayTotales.push(suma)
        suma = 0;
      }
    },
    cargarAcreedores(){
      if (this.ACREEDORES.length === 0)
        this.$store.commit('contabilidad/acreedores/cargarACREEDORES');
    },
    cargarAcreedoresGastos(){
      this.loadPeticion = true;
      this.$axios.get('contabilidad/gastos_pendientes/acreedor/'+this.acreedor).then((res)=>{
        res.data.gastos.forEach((item, i)=>{
          this.Gastos.push({
            key: i,
            id: item.id,
            gasto: item.gasto,
            correlativo: item.correlativo,
            detalle:     item.detalle,
            suc:         item.suc,
            total:       item.total,
            nivel:       1
          });
          this.sumarTotal(item.total)
        })
        this.loadPeticion = false;
      })
    },
    cargarContratos(){
      this.loadPeticion = true;
      this.$axios.get('contabilidad/formato_pago/contratos/proveedor/'+this.proveedor).then((res)=>{
        this.Contratos = res.data.contratos;
        this.loadPeticion = false;
      })
    },
    cargarPagosContratos(data){
      let pagos         = this.pagosContratos.filter(item=> item.ct_contrato_proveedor_id === data.id);
      if (pagos.length === 0){
        this.$store.commit('activarOverlay', true);
        this.$axios.get('contabilidad/formato_pago/contratos/pagos/contrato/'+data.id).then((res)=>{
          this.acomodarPagos(res.data.pagos, data.cod)
          this.$store.commit('activarOverlay', false);
        });
      }
    },
    cargarProveedores(){
      if (this.Proveedores.length === 0){
        this.loadProveedores = true;
        this.$axios.get('/proveedores/').then((res)=>{
          this.Proveedores    = res.data.proveedores;
          this.loadProveedores = false;
        })
      }
    },
    cargarProveedoresGastos(){
      this.loadPeticion = true;
      this.$axios.get('contabilidad/gastos_pendientes/proveedor/'+this.proveedor).then((res)=>{
        res.data.gastos.forEach((item, i)=>{
          this.Gastos.push({
            key: i,
            id: item.id,
            gasto: item.gasto,
            correlativo: item.correlativo,
            detalle:     item.detalle,
            suc:         item.suc,
            total:       item.total,
            nivel:       1
          });
          this.sumarTotal(item.total)
        })
        this.loadPeticion = false;
      })
    },
    registrarSolicitud(){
      let pagos    = [];
      let idCuerpo = null;
      let idGasto  = null;
      let nivel    = 1;
      let total    = 0;
      let idProveedor = null;
      let idAcreedor  = null;
      if (this.tipo_busqueda > 1)
        idProveedor = this.proveedor;
      if (this.tipo_busqueda === 1)
        idAcreedor  = this.acreedor;

      this.pagos.forEach(item=>{
        if (this.tipo_busqueda < 3) {
          idGasto = item.id;
          total   = this.total;
        }else if (this.tipo_busqueda === 3) {
          idCuerpo = item.id;
          nivel    = item.nivel;
        }
        pagos.push({
          cuerpo_proveedor_id: idCuerpo,
          gasto_id:            idGasto,
          nivel:               nivel,
          cod:                 item.cod,
        })
      })
      this.$store.commit('activarOverlay', true);
      this.$axios.post('contabilidad/formato_pago/solicitud_pago',{
        detalle:            this.detalle,
        detalle_print:      this.detallrPrint,
        tipo:               this.tipo,
        proveedor_id:       idProveedor,
        acreedor_id:        idAcreedor,
        fecha_acreditacion: this.fecha_acreditacion,
        fecha_programado:   this.fecha_programado,
        cant_pagos:         this.arrayNiveles.length,
        tipo_busqueda:      this.tipo_busqueda,
        total:              total,
        pagos:              pagos
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$router.push('/contabilidad/formato_pagos/solicitudes_pago');
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    removeGasto(item){
      this.Gastos2.splice(item.key,1);
      this.Gastos2.forEach( (i, index) => {
        i.key = index;
      });
      this.pagos.splice(item.key, 1);
      this.pagos.forEach((i, index)=>{
        i.key = index
      })
    },
    SeletDialogo(data){
      switch (this.tipo_busqueda){
        case 1:
          this.tituloBusquedaInput = data.nombre;
          this.acreedor            = data.id;
          this.dialogoAcreedores   = false;
          this.search              = '';
          this.cargarAcreedoresGastos();
          break;
        case 2:
          this.tituloBusquedaInput = data.nombre;
          this.proveedor           = data.id;
          this.dialogoProveedores  = false;
          this.search              = '';
          this.cargarProveedoresGastos();
          break;
        case 3:
          this.tituloBusquedaInput = data.nombre;
          this.dialogoProveedores  = false;
          this.proveedor           = data.id;
          this.search              = ''
            this.cargarContratos();
          break;
        default:
          this.tituloBusqueda      = 'Sin seleccionar';
          this.search              = '';
          this.contrato            = 0;
          this.proveedor           = 0;
          this.acreedor            = 0;
          break;
      }
    },
    selectGasto(item){
      let filter = this.Gastos2.filter(i=>i.id === item.id);
      if (filter.length === 0) {
        this.Gastos2.push(item);
        this.$store.commit('activarOverlay', true);
        this.$axios.get('contabilidad/gasto/'+item.id).then((res)=>{
          if (this.pagos.filter((i)=>i.id === item.id).length === 0){
            let data = res.data.gasto;
            this.pagos.push({
              key: this.pagos.length,
              id: item.id,
              detalle: data.detalle+' - '+data.correlativo,
              acreedor: data.acreedor,
              proveedor: data.proveedor,
              gasto:     data.gasto,
              suc:       data.suc,
              cod:       data.cod,
              total:     data.total
            })
          }
          this.$store.commit('activarOverlay', false)
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false)
        })
      }
    },
    selectOption(){
      switch (this.tipo_busqueda){
        case 1:
          this.tituloBusqueda      = 'Acreedor';
          this.cargarAcreedores();
          break;
        case 2:
          this.tituloBusqueda      = 'Proveedor - Gastos';
          this.cargarProveedores();
          break;
        case 3:
          this.tituloBusqueda      = 'Proveedor Contratos';
          this.cargarProveedores();
          break;
        default:
          this.tituloBusqueda = 'Sin seleccionar'
          break;
      }
      this.tipo                = 0;
      this.pagosContratos      = [];
      this.pagos               = [];
      this.tituloBusquedaInput = '';
    },
    sumarTotal(total){
      this.total = parseFloat(this.total) + parseFloat(total);
    },
    validarForm(){
      let contador = 0;

      if (this.detalle.length >= 15)
        contador++;
      else this.$store.commit('notificacion',{texto:'El detalle debe ser mayor o igual a 15 carácteres', color:'warning'})

      if (this.detallrPrint.length >= 5)
        contador++;
      else this.$store.commit('notificacion',{texto:'El detalle debe ser mayor o igual a 5 carácteres', color:'warning'})

      if (this.fecha_programado)
        contador++;
      else this.$store.commit('notificacion',{texto:'La fecha de programación es obligatoria', color:'warning'})

      if (this.pagos.length > 0)
        contador++
      else this.$store.commit('notificacion',{texto:'No hay pagos seleccionados', color:'warning'})

      if (this.tipo_busqueda < 3 && this.tipo === 0) contador++;
      else if (this.tipo_busqueda === 3) contador ++;
      else this.$store.commit('notificacion',{texto:'Si tienes busqueda por proveedor/gasto o acreedor el tipo de la solicitúd debe ser normal', color:'warning'})


      if (this.tipo_busqueda === 3 && this.fecha_acreditacion) contador++;
      else if (this.tipo_busqueda < 3) contador++;
      else this.$store.commit('notificacion',{texto:'La fecha de acreditación debe ser obligatoria en el tipo de busqueda proveedor/contrato', color:'warning'})

      console.log(this.tipo_busqueda)
      console.log(this.fecha_programado)
      console.log(this.fecha_acreditacion)

      if (contador === 6)
        this.registrarSolicitud();
      else this.$store.commit('notificacion',{texto:'Hay datos incorrectos', color:'warning'})
    }
  }
}
</script>

<style scoped>
.cajaSelect {
  border:1px solid #d9d9d9;
  height:30px;
  overflow: hidden;
  width: 100%;
  position:relative;
}
.cajaLink {
  border:1px solid #d9d9d9;
  height:30px;
  overflow: hidden;
  width: 100%;
  position:relative;
}
.cajaInput {
  border:1px solid #d9d9d9;
  height:30px;
  overflow: hidden;
  width: 100%;
  position:relative;
}
select {
  background: transparent;
  border: none;
  font-size: 10px;
  height: 30px;
  padding: 5px;
  width: 100%;
}
input{
  background-color: transparent;
  border: none;
  font-size: 10px;
  height: 30px;
  padding: 5px;
  width: 100%
}
.cajaSelect::after{
  content:"\025be";
  display:table-cell;
  padding-top:7px;
  text-align:center;
  width:30px;
  height:30px;
  background-color:#d9d9d9;
  position:absolute;
  top:0;
  right:0px;
  pointer-events: none;
}
.item-select{
  font-size: 10px;
}
.nameImput{
  font-size: 11px;
  color: #b2b0b0;
}
table{
  width: 100%;
  border-collapse: collapse;
  box-sizing: border-box;
  position: relative;
}
table tbody tr{
  cursor: pointer;
}
table thead tr th{
  border-top: solid 1px #7F828B;
  font-size: 10px;
  color: white;
  box-sizing: border-box;
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  background-color: #7F828B;

}
table tbody tr td{
  font-size: 9px;
  margin-left: 5px;
  padding: 5px;
}
table tbody tr:nth-of-type(even) { background-color: #f3f3f3; }
</style>
