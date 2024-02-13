<template>
<v-card flat tile>
  <v-toolbar dense flat tile>
    <v-card-title>Cargando Gastos</v-card-title>
    <v-spacer></v-spacer>
    <v-tooltip top>
      <template v-slot:activator="{on, attrs}">
        <v-btn color="success" @click="validarForm"
               text fab small v-on="on" v-bind="attrs" class="pa-2" icon><v-icon>mdi-content-save-outline</v-icon></v-btn>
      </template>
      <span>Guardar Facturas</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{on, attrs}">
        <v-btn color="indigo" @click="cargarProveedores"
               text fab small v-on="on" v-bind="attrs" class="pa-2" icon><v-icon>mdi-reload</v-icon></v-btn>
      </template>
      <span>Recargar Proveedores</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{on, attrs}">
        <v-badge color="success" bordered offset-x="15"
                 offset-y="15" dot overlap icon="mdi-plus">
          <v-btn color="orange" @click="addFactura" depressed
                 text fab small v-on="on" v-bind="attrs" class="pa-2" icon><v-icon>mdi-tab-plus</v-icon></v-btn>
        </v-badge>
      </template>
      <span>Agregar Factura</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{on, attrs}">
        <v-btn color="indigo" @click="$store.commit('contabilidad/acreedores/setDIALOGO', true)"
             text fab small v-on="on" v-bind="attrs" class="pa-2" icon><v-icon>fa fa-plus</v-icon></v-btn>
      </template>
      <span>Agregar Acreedor</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{on, attrs}">
        <v-btn color="indigo"  @click="anadirPestana(23, 'Proveedor Nuevo')"
             text fab small v-on="on" v-bind="attrs" class="pa-2" icon><v-icon>fa fa-plus</v-icon></v-btn>
      </template>
      <span>Agregar Proveedor</span>
    </v-tooltip>
  </v-toolbar>
  <v-card flat class="ma-2" tile>
    <table>
      <thead>
      <tr>
        <th>#</th>
        <th>Sucursal</th>
        <th>Tipo de Gasto</th>
        <th>Detalle</th>
        <th>Total</th>
        <th>Estado</th>
        <th>Documento</th>
        <th>Proveedor</th>
        <th>Reembolso</th>
        <th>Acreedor</th>
        <th>Quitar</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="data in facturas">
        <td>{{data.key + 1}}</td>
        <td>
          <span v-if="data.sucursal_id > 0"><b-link @click="data.dialogoSucursal = true">{{data.Sucursal.nombre}}</b-link></span>
          <span v-else><b-link style="color: red" @click="data.dialogoSucursal = true">Seleccionar Sucursal</b-link></span>
          <v-progress-linear indeterminate v-if="LOADSUCURSALES" style="width: 100%"></v-progress-linear>
          <v-dialog v-model="data.dialogoSucursal" width="35%">
            <v-card>
              <v-card-title>Seleccionando sucursal de la factura {{data.key + 1}}</v-card-title>
              <v-divider></v-divider>
              <v-card-subtitle v-if="data.sucursal_id > 0">Gasto seleccionado: <b>{{data.Sucursal.nombre}}</b></v-card-subtitle>
              <v-text-field class="ma-2" label="Buscar ..." v-model="data.searchSucursal"></v-text-field>
              <v-data-table dense :items="SUCURSALES" :search="data.searchSucursal"
                            :headers="headersSucursales" class="ma-2">
                <template v-slot:item.nombre="{item}" ><div @click="selectSucursal(item, data)">{{item.nombre}}</div></template>
              </v-data-table>
              <v-card class="d-flex justify-end">
                <v-btn color="warning" class="ma-2" dark small  text tile @click="data.dialogoSucursal = false">Cerrar</v-btn>
              </v-card>
            </v-card>
          </v-dialog>
        </td>
        <td>
          <span v-if="data.tipo_gasto_id > 0"><b-link @click="data.dialogoGastos = true">{{data.Gasto.nombre}}</b-link></span>
          <span v-else><b-link style="color: red" @click="data.dialogoGastos = true" :disabled="data.sucursal_id === 0">Seleccionar gasto</b-link></span>
          <v-progress-linear indeterminate v-if="data.load_gastos" style="width: 100%"></v-progress-linear>
          <v-dialog v-model="data.dialogoGastos" width="35%">
            <v-card>
              <v-card-title>Seleccionando gasto de la factura {{data.key + 1}}</v-card-title>
              <v-divider></v-divider>
              <v-card-subtitle>Gastos de {{data.Sucursal.nombre}}</v-card-subtitle>
              <v-card-subtitle v-if="data.tipo_gasto_id > 0">Gastos seleccionado: <b>{{data.Gasto.nombre}}</b></v-card-subtitle>
              <v-text-field class="ma-2" label="Buscar ..." v-model="data.searchGasto"></v-text-field>
              <v-data-table dense :items="data.Gastos" :search="data.searchGasto"
                            :headers="headersGastos" class="ma-2">
                <template v-slot:item.nombre="{item}" >
                  <div @click="selectGasto(item, data)">
                    {{item.nombre}}
                  </div>
                </template>
                <template v-slot:item.cod="{item}" @click="selectGasto(item, data)">{{item.cod}}</template>
              </v-data-table>
              <v-card class="d-flex justify-end">
                <v-btn color="warning" class="ma-2" dark small  text tile @click="data.dialogoGastos = false">Cerrar</v-btn>
              </v-card>
            </v-card>
          </v-dialog>
        </td>
        <td>
          <v-row no-gutters>
            <v-col cols="7">
              <div class="cajaInput" style="width: 95% !important;">
                <input style="width: 95% !important;" v-model="data.detalle" type="text" placeholder="Escribir el detalle">
              </div>
            </v-col>
            <v-col cols="5">
              <div class="cajaInput" style="width: 100% !important;">
                <input type="text" v-model="data.correlativo" style="width: 100%" placeholder="Correlativo">
              </div>
            </v-col>
          </v-row>
        </td>
        <td>
          <div class="cajaInput" style="width: 85px !important;">
            <input style="width: 85px !important;" v-model="data.total" type="number" placeholder="Total">
          </div>
        </td>
        <td>
          <div class="cajaSelect" style="width: 100px">
            <select v-model="data.estado" style="width: 100px">
              <option class="item-select" v-for="i in Estados" v-text="i.text" :value="i.value"></option>
            </select>
          </div>
        </td>
        <td>
          <span v-if="data.documento"><b-link @click="data.dialogoDocumento = true">Cargado</b-link></span>
          <span v-else><b-link style="color: red" @click="data.dialogoDocumento = true">Cargar gasto</b-link></span>

          <v-dialog v-model="data.dialogoDocumento" width="35%">
            <v-card>
              <v-card-title>Cargando documento de la factura {{data.key + 1}}</v-card-title>
              <v-divider></v-divider>
              <v-card-subtitle>Gasto: {{data.detalle}}</v-card-subtitle>
              <v-file-input class="ma-5" label="Documento escaneado" v-model="data.documento" @change="data.dialogoDocumento = false"
                            accept="image/*,.pdf"></v-file-input>

              <v-card class="d-flex justify-end">
                <v-btn color="warning" class="ma-2" dark small  text tile @click="data.dialogoDocumento = false">Cerrar</v-btn>
              </v-card>
            </v-card>
          </v-dialog>
        </td>
        <td>
          <span v-if="data.proveedor_id > 0"><b-link @click="data.dialogoProveedores = true">{{data.Proveedor.nombre}}</b-link></span>
          <span v-else><b-link style="color: #f37629" @click="data.dialogoProveedores = true">Seleccionar Proveedor</b-link></span>
          <v-progress-linear indeterminate v-if="loadProveedores" style="width: 100%"></v-progress-linear>
          <v-dialog v-model="data.dialogoProveedores" width="35%">
            <v-card>
              <v-card-title>Seleccionando proveedor de la factura {{data.key + 1}}</v-card-title>
              <v-divider></v-divider>
              <v-card-subtitle v-if="data.proveedor_id > 0">Proveedor seleccionado: <b>{{data.Proveedor.nombre}}</b></v-card-subtitle>
              <v-text-field class="ma-2" label="Buscar ..." v-model="data.searchProveedor"></v-text-field>
              <v-data-table dense :items="Proveedores" :search="data.searchProveedor"
                            :headers="headersProveedores" class="ma-2">
                <template v-slot:item.nombre="{item}" ><div @click="selectProveedor(item, data)">{{item.nombre}}</div></template>
                <template v-slot:item.rtn="{item}" ><div @click="selectProveedor(item, data)">{{item.rtn}}</div></template>
              </v-data-table>
              <v-card class="d-flex justify-end">
                <v-btn color="warning" class="ma-2" dark small  text tile @click="data.dialogoProveedores = false">Cerrar</v-btn>
              </v-card>
            </v-card>
          </v-dialog>
        </td>
        <td>
          <div class="cajaSelect" style="width: 80px">
            <select v-model="data.is_reembolso" style="width: 80px">
              <option class="item-select" v-for="i in Reembolsos" v-text="i.text" :value="i.value"></option>
            </select>
          </div>
        </td>
        <td>
          <span v-if="data.acreedor_id > 0 && data.is_reembolso === 1"><b-link @click="data.dialogoAcreedor = true">{{data.Acreedor.nombre}}</b-link></span>
          <span v-else-if="data.is_reembolso === 1"><b-link style="color: red" @click="data.dialogoAcreedor = true">Seleccionar Acreedor</b-link></span>
          <v-progress-linear indeterminate v-if="LOAD_ACREEDORES" style="width: 100%"></v-progress-linear>
          <v-dialog v-model="data.dialogoAcreedor" width="35%">
            <v-card>
              <v-card-title>Seleccionando acreedor de la factura {{data.key + 1}}</v-card-title>
              <v-divider></v-divider>
              <v-card-subtitle v-if="data.acreedor_id > 0">Acreedor seleccionado: <b>{{data.Acreedor.nombre}}</b></v-card-subtitle>
              <v-text-field class="ma-2" label="Buscar ..." v-model="data.searchAcreedor"></v-text-field>
              <v-data-table dense :items="ACREEDORES" :search="data.searchAcreedor"
                            :headers="headersAcreedores" class="ma-2">
                <template v-slot:item.nombre="{item}" ><div @click="selectAcreedor(item, data)">{{item.nombre}}</div></template>
                <template v-slot:item.identificacion="{item}" ><div @click="selectAcreedor(item, data)">{{item.identificacion}}</div></template>
              </v-data-table>
              <v-card class="d-flex justify-end">
                <v-btn color="warning" class="ma-2" dark small  text tile @click="data.dialogoAcreedor = false">Cerrar</v-btn>
              </v-card>
            </v-card>
          </v-dialog>
        </td>
        <td>
          <b-link @click="removeFactura(data.key)">Quitar</b-link>
        </td>
      </tr>
      </tbody>
    </table>
  </v-card>

  <form_acreedor_nuevo :id="null"/>
</v-card>
</template>

<script>
import form_acreedor_nuevo from "@/components/contabilidad/form_acreedor_nuevo.vue";
export default {
  name: "cargar_gastos",
  components:{form_acreedor_nuevo},
  created() {
    this.$store.commit('guardarTitulo', 'Contabilidad > Gastos > Cargando Facturas');
    this.$store.commit('suc/cargar_SUCURSALES');
    this.$store.commit('contabilidad/acreedores/cargarACREEDORES');
    this.addFactura();
    this.cargarProveedores();
  },
  data(){
    return{
      facturas: [],
      Gastos: [],
      Estados:[
        {text:'Pendiente', value: 0},
        {text:'Cancelado', value: 1},
      ],
      Reembolsos:[
        {text:'Si', value: 1},
        {text:'No', value: 0},
      ],
      headersGastos:[
        {text:'Nombre del Gasto', value:'nombre'},
        {text:'Cod. CC', value:'cod'},
      ],
      headersProveedores:[
        {text:'Nombre del Proveedor', value:'nombre'},
        {text:'Rtn', value:'rtn'},
      ],
      headersSucursales:[
        {text:'Nombre de la Sucursal', value:'nombre'}
      ],
      headersAcreedores:[
        {text:'Nombre del Acreedor', value:'nombre'},
        {text:'Identificación', value:'identificacion'},
      ],
      loadProveedores: false,
      Proveedores: [],
    }
  },
  computed:{
    LOADSUCURSALES(){
      return this.$store.state.suc.LOAD_SUCURSALES;
    },
    Pes(){
      return this.$store.state.pestana
    },
    SUCURSALES(){
      return this.$store.state.suc.SUCURSALES;
    },
    LOAD_ACREEDORES() {
      return this.$store.state.contabilidad.acreedores.LOAD_ACREEDORES;
    },
    ACREEDORES() {
      return this.$store.state.contabilidad.acreedores.ACREEDORES;
    }
  },
  methods:{
    anadirPestana(key, titulo){
      let bandera = 0;
      this.Pes.forEach((item)=>{
        if (item.key === key)
          bandera++;
      });
      if (bandera === 0){
        this.$store.commit('anadirCaja', {titulo:titulo, key: key});
        this.$store.commit('cambiarTab', {val:key, tipo:false});
      }
    },
    addFactura(){
      this.facturas.push({
        key: this.facturas.length,
        sucursal_id: 0,
        tipo_gasto_id: 0,
        detalle: '',
        documento: null,
        dialogo_doc: false,
        estado: 1,
        total: 0,
        proveedor_id: 0,
        is_reembolso: 0,
        acreedor_id: 0,
        correlativo: '',
        //
        load_gastos: false,
        Gastos: [],
        Gasto: {},
        searchGasto: '',
        dialogoGastos: false,
        //
        Sucursal: {},
        searchSucursal: '',
        dialogoSucursal: false,
        //
        dialogoDocumento:  false,
        //
        dialogoProveedores: false,
        Proveedor: {},
        searchProveedor: '',
        //
        dialogoAcreedor: false,
        Acreedor: {},
        searchAcreedor: ''
      })
    },
    cargarGASTOS(item){
      item.load_gastos = true;
      this.$axios.get('contabilidad/caja_chica/sucursal/'+item.sucursal_id).then((res)=>{
        item.Gastos      = res.data.tipo_gastos;
        item.load_gastos = false;
      });
    },
    cargarProveedores(){
      this.loadProveedores = true;
      this.$axios.get('/proveedores/').then((res)=>{
        this.Proveedores    = res.data.proveedores;
        this.loadProveedores = false;
      })
    },
    registrarGastos(){
      let datas = [];
      let files = [];
      let data  = new FormData();
      let cont  = 0;
      this.facturas.forEach(item=>{
        datas.push({
          tipo_gasto_id: item.tipo_gasto_id,
          detalle:       item.detalle,
          estado:        item.estado,
          total:         item.total,
          caja_chica_id: null,
          is_reembolso:  item.is_reembolso,
          acreedor_id:   item.acreedor_id,
          correlativo:   item.correlativo,
          proveedor_id:  item.proveedor_id,
        });
        data.append(`file[${cont}]`, item.documento);
        cont++;
      });
      data.append('pagos', JSON.stringify(datas));
      this.$store.commit('activarOverlay', true);
      this.$axios({
        url: 'contabilidad/gastos_contabilidad',
        method: 'post',
        data: data,
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$router.push('/contabilidad/gastos/gastos')
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })
    },
    removeFactura(fila){
      let cont = 0;
      if (this.facturas.length > 1){
        this.facturas.splice(fila,1);
        this.facturas.forEach( (i) => {
          i.key = cont;
          cont++;
        })
      }else this.$store.commit('notificacion',{texto:'No puedes borrar la ultima fila', color:'warning'})
    },
    selectAcreedor(item, data){
      data.Acreedor        = item;
      data.acreedor_id     = item.id;
      data.dialogoAcreedor = false;
    },
    selectGasto(item, data) {
      data.Gasto         = item
      data.tipo_gasto_id = item.id;
      data.dialogoGastos = false;
    },
    selectProveedor(item, data){
      data.Proveedor          = item;
      data.proveedor_id       = item.id;
      data.dialogoProveedores = false;
    },
    selectSucursal(item, data){
      data.Sucursal        = item;
      data.sucursal_id     = item.id;
      data.dialogoSucursal = false;
      this.cargarGASTOS(data);
    },
    validarForm(){
      let bandera = this.facturas.length;
      let aprobados = 0;
      this.facturas.forEach((item)=>{
        if (item.sucursal_id > 0 && item.tipo_gasto_id > 0 && item.detalle.length > 5 &&  item.detalle.length <= 100 &&
            item.correlativo.length > 4 && item.correlativo.length <= 50 && item.total > 0){
          if (item.is_reembolso === 1){
            if (item.acreedor_id > 0 && item.estado === 0)
              aprobados++
            else
              this.$store.commit('notificacion',{texto:'En la fila '+(item.key + 1)+' que es un reembolso tienes que seleccionar un acreedor, además el estado debe ser pendiente', color:'warning'})
          }else{
            aprobados++;
          }

        }else {
          this.$store.commit('notificacion', {color: 'warning', texto: 'Hay un error en la linea ' + (item.key + 1)})
        }
      })

      if (bandera === aprobados)
        this.registrarGastos();
    }
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border-collapse: collapse;
}
table tbody tr{
  cursor: pointer;
}
table thead tr th{
 border-left: solid 1px #7F828B;
 border-top: solid 1px #7F828B;
 border-right: solid 1px #7F828B;
}
table tbody tr td{
  padding: 5px;
  font-size: 10px;
  margin-left: 3px;
}

.cajaSelect {
  border:1px solid #d9d9d9;
  height:22px;
  overflow: hidden;
  width: 200px;
  position:relative;
}
.cajaInput {
  border:1px solid #d9d9d9;
  height:20px;
  overflow: hidden;
  width: 200px;
  position:relative;
}
select {
  background: transparent;
  border: none;
  font-size: 10px;
  height: 22px;
  padding: 5px;
  width: 200px;
}
input{
  background-color: transparent;
  border: none;
  font-size: 10px;
  height: 20px;
  padding: 5px;
  width: 200px;
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
table tbody tr:nth-of-type(even) { background-color: #f3f3f3; }
table tbody tr:last-of-type {
  border-bottom: 2px solid #b2b0b0;
  margin-bottom: 5px;
}
table thead tr { background-color: grey; color: #ffffff; }
table tbody tr { border-bottom: 1px solid #dddddd; }
</style>
