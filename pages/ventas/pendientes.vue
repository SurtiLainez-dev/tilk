<template>
<v-card>
  <div v-if="vista === 1">
    <v-row no-gutters>
      <v-col cols="9">  <v-card-title>Ventas Pendientes (Revisión de Documentos y Regalias)</v-card-title>
      </v-col>
      <v-col cols="3">
        <v-text-field dense v-model="search" label="Buscar"></v-text-field>
      </v-col>
    </v-row>

    <v-data-table dense :headers="header"
                  class="rowsTable"
                  @click:row="cambiar_vista"
                  :loading="LOAD_VENTAS" loading-text="Actualizando ventas"
                  :items="VENTAS">
      <template v-slot:item.colaborador.nombres="{item}">
        {{item.colaborador.nombres}} {{item.colaborador.apellidos}}
      </template>
      <template v-slot:item.cliente.nombres="{item}">
        {{item.cliente.nombres}} {{item.cliente.apellidos}}
      </template>
      <template v-slot:item.tipo_venta="{item}">
        <v-chip color="success" x-small v-if="item.tipo_venta === 1" dark>Contado</v-chip>
        <v-chip color="orange" x-small v-else-if="item.tipo_venta === 2" dark>Crédito</v-chip>
      </template>
      <template v-slot:item.estado="{item}">
        <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
        <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
        <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
        <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
      </template>
      <template v-slot:item.is_aceptado="{item}">
        <v-chip color="success" x-small v-if="item.is_aceptado === 1" dark>Sí</v-chip>
        <v-chip color="red" x-small v-else-if="item.is_aceptado === 2" dark>No</v-chip>
        <v-chip color="orange" x-small v-else-if="item.is_aceptado === 3" dark>Pendiente</v-chip>
      </template>
      <template v-slot:item.total="{item}">
        <strong>L {{item.total}}</strong>
      </template>
    </v-data-table>
  </div>
  <div v-else>
    <v-row no-gutters class="ma-2">
      <v-col cols="1" class="d-flex align-center">
        <v-btn color="orange" fab x-small @click="vista = 1" dark>
          <v-icon>fa fa-arrow-left</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="11" class="d-flex align-center justify-center">
        <h5 >Venta {{Venta.cliente.nombres}} {{Venta.cliente.apellidos}}</h5></v-col>
    </v-row>
    <v-divider></v-divider>
    <v-card class="pb-10" flat>
      <div class="ma-2">
        <small><strong>Documentos </strong></small>
        <b-list-group class="ma-2" v-if="Venta.documento_ventas">
          <b-list-group-item button>
            <v-row no-gutters>
              <v-col cols="10">
                CONTRATO DE LA VENTA {{Venta.cod}}, del cliente {{Venta.cliente.nombres}} {{Venta.cliente.apellidos}}
              </v-col>
              <v-col cols="1">
                <v-btn color="red" @click="verDocumento(Venta.documento_ventas.contrato)"
                       v-if="Venta.documento_ventas.contrato"
                       dark fab x-small><v-icon>fa fa-file-pdf</v-icon></v-btn>
              </v-col>
              <v-col cols="1">
                <v-icon v-if="Venta.documento_ventas.contrato" color="success">fa fa-check</v-icon>
                <v-icon v-else color="red">fa fa-times</v-icon>
              </v-col>
            </v-row>
          </b-list-group-item>
          <b-list-group-item button>
            <v-row no-gutters>
              <v-col cols="10">PAGARE DEL CLIENTE {{Venta.cliente.nombres}} {{Venta.cliente.apellidos}}</v-col>
              <v-col cols="1">
                <v-btn color="red"
                       @click="verDocumento(Venta.documento_ventas.garantia_prendaria)"
                       v-if="Venta.documento_ventas.garantia_prendaria"
                       dark fab x-small><v-icon>fa fa-file-pdf</v-icon></v-btn>
              </v-col>
              <v-col cols="1">
                <v-icon v-if="Venta.documento_ventas.garantia_prendaria" color="success">fa fa-check</v-icon>
                <v-icon v-else color="red">fa fa-times</v-icon>
              </v-col>
            </v-row>
          </b-list-group-item>
          <b-list-group-item button>
            <v-row no-gutters>
              <v-col cols="10">HOJA DE CONOCIMIENTO DE TRÁMITES DEL CLIENTE {{Venta.cliente.nombres}} {{Venta.cliente.apellidos}}</v-col>
              <v-col cols="1">
                <v-btn color="red" @click="verDocumento(Venta.documento_ventas.conocimiento_tramite)"
                       v-if="Venta.documento_ventas.conocimiento_tramite"
                       dark fab x-small><v-icon>fa fa-file-pdf</v-icon></v-btn>
              </v-col>
              <v-col cols="1">
                <v-icon v-if="Venta.documento_ventas.conocimiento_tramite" color="success">fa fa-check</v-icon>
                <v-icon v-else color="red">fa fa-times</v-icon>
              </v-col>
            </v-row>
          </b-list-group-item>
          <b-list-group-item button>
            <v-row no-gutters>
              <v-col cols="10">CARTA PODER DEL CLIENTE {{Venta.cliente.nombres}} {{Venta.cliente.apellidos}}</v-col>
              <v-col cols="1">
                <v-btn color="red" @click="verDocumento(Venta.documento_ventas.carta_poder)"
                       v-if="Venta.documento_ventas.carta_poder"
                       dark fab x-small><v-icon>fa fa-file-pdf</v-icon></v-btn>
              </v-col>
              <v-col cols="1">
                <v-icon v-if="Venta.documento_ventas.carta_poder" color="success">fa fa-check</v-icon>
                <v-icon v-else color="red">fa fa-times</v-icon>
              </v-col>
            </v-row>
          </b-list-group-item>
          <b-list-group-item button>
            <v-row no-gutters>
              <v-col cols="10">
                TRASPASO DEL CLIENTE {{Venta.cliente.nombres}} {{Venta.cliente.apellidos}}
              </v-col>
              <v-col cols="1">
                <v-btn color="red" @click="verDocumento(Venta.documento_ventas.traspaso)"
                       v-if="Venta.documento_ventas.traspaso"
                       dark fab x-small><v-icon>fa fa-file-pdf</v-icon></v-btn>
              </v-col>
              <v-col cols="1">
                <v-icon v-if="Venta.documento_ventas.traspaso" color="success">fa fa-check</v-icon>
                <v-icon v-else color="red">fa fa-times</v-icon>
              </v-col>
            </v-row>
          </b-list-group-item>
          <b-list-group-item button>
            <v-row no-gutters>
              <v-col cols="10">
                GARANTÍA DEL ARTÍCULO DE LA VENTA {{Venta.cod}}
              </v-col>
              <v-col cols="1">
                <v-btn color="red" @click="verDocumento(Venta.documento_ventas.garantia_articulo)"
                       v-if="Venta.documento_ventas.garantia_articulo"
                       dark fab x-small><v-icon>fa fa-file-pdf</v-icon></v-btn>
              </v-col>
              <v-col cols="1">
                <v-icon v-if="Venta.documento_ventas.garantia_articulo" color="success">fa fa-check</v-icon>
                <v-icon v-else color="red">fa fa-times</v-icon>
              </v-col>
            </v-row>
          </b-list-group-item>
        </b-list-group>
        <b-list-group v-else class="ma-2">
          <b-list-group-item>No hay documentos asociados a esta venta aún.</b-list-group-item>
        </b-list-group>

        <v-card class="ma-2">
          <v-toolbar dense flat>
            <h6>Regalias aplícadas a la venta</h6>
            <v-spacer></v-spacer>
            <v-btn fab color="success" dark x-small @click="dialogoBuscarInventario = true"><v-icon>fa fa-plus</v-icon></v-btn>
          </v-toolbar>
          <v-simple-table dense class="rowsTable">
            <template v-slot:default>
              <thead>
              <tr>
                <th>Artículo</th>
                <th>Marca</th>
                <th>Código del sistema</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Decisión sobre regalia</th>
                <th>Quitar</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in Regalias">
                <td>{{item.articulo}}</td>
                <td>{{item.marca}}</td>
                <td>{{item.codigo}}</td>
                <td>L {{item.precio}}</td>
                <td>
                  <v-chip x-small v-if="item.estado === 1" color="orange" dark>Pendiente</v-chip>
                  <v-chip x-small v-else-if="item.estado === 2" color="success" dark>Aceptado</v-chip>
                  <v-chip x-small v-else-if="item.estado === 3" color="error" dark>Rechazado</v-chip>
                </td>
                <td>
                  <v-select v-model="item.is_aceptado" :items="selestDecidir" dense></v-select>
                </td>
                <td>
                  <v-btn @click="quitarRegalia(item.key)" color="red" width="25px" height="25px" fab dark>
                    <v-icon size="15">fa fa-times</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>

        </v-card>

        <v-card class="ma-2">
          <v-toolbar dense flat>
            <h6>Datos de la cuenta</h6>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th>Total del crédito</th>
                <th>Prima</th>
                <th>Saldo a financiar</th>
                <th>Cuota</th>
                <th># de Cuotas</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>L {{int.format(Venta.total)}}</td>
                <td>L {{int.format(Venta.contrato_cliente.prima)}}</td>
                <td>L {{int.format(Venta.contrato_cliente.saldo_financiar)}}</td>
                <td>L {{int.format(Venta.contrato_cliente.cuota)}}</td>
                <td>{{Venta.num_cuotas}} Cuotas</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </div>

    </v-card>

    <v-card-actions class="d-flex justify-end" v-if="Venta.estado === 4 && Venta.is_aceptado === 3">
      <v-btn small tile color="orange" @click="validarEnvio(2)" dark>Rechazar Venta</v-btn>
      <v-btn small tile color="success" @click="validarEnvio(1)" dark>Aceptar Venta y Salida de Inventario</v-btn>
    </v-card-actions>

  </div>


  <v-dialog v-model="dialogoBuscarInventario" width="90%">
    <v-card class="pl-5 pr-5 pb-5 pt-2" height="650">
      <v-row no-gutters>
        <v-col cols="8" class="d-flex align-center">
          <v-card-title>Buscar regalia</v-card-title>
        </v-col>
        <v-col cols="4" class="d-flex justify-end align-center">
          <v-text-field v-model="searchR" class="ma-2" label="buscar..." ></v-text-field>
        </v-col>
      </v-row>
      <hr>
      <v-data-table dense :items="Inventario" :search="searchR" class="rowsTable"
                    :headers="headerR" :loading="isPeticon" @click:row="agregarRegalia">
        <template v-slot:item.articulo_id="{item}">
          <v-tooltip top v-if="item.articulo.precio_activo">
            <template v-slot:activator="{on, attrs}">
              <v-btn color="success" v-on="on" v-bind="attrs"
                     x-small text fab class="text-white">
                <v-icon>fa fa-arrow-right</v-icon>
              </v-btn>
            </template>
            <span>Seleccionar {{item.nombre_articulo}}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.articulo.precio_activo.precio_contado="{item}">
          <span v-if="item.articulo.precio_activo"> <strong>L </strong></span>
          <span v-else>Sin precio</span>
        </template>
      </v-data-table>
      <hr>
      <v-card-actions class="d-flex justify-end">
        <v-btn class="ma-2" color="warning" small dark @click="dialogoBuscarInventario = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";
import Vue from "vue";

export default {
  name: "pendientes",
  data(){
    return{
      int: new Intl.NumberFormat(),
      Inventario: [],
      isPeticon: false,
      Venta: null,
      dialogoBuscarInventario: false,
      selestDecidir: [
        {text:'Aceptar', value:1},
        {text:'Rechazar', value:2},
      ],
      headerR:[
        {text:'Proveedor',value:'articulo.marca.proveedor.nombre'},
        {text:'Marcá',value:'articulo.marca.nombre'},
        {text:'Módelo',value:'articulo.modelo'},
        {text:'Código Sístema',value:'articulo.codigo_sistema'},
        {text:'Nombre del Artículo',value:'articulo.nombre_articulo'},
        {text:'Código Proveedor',value:'articulo.codigo_proveedor'},
        {text:'Precio de Contado', value:'articulo.precio_activo.precio_contado'},
        {text:'Acciones',value:'articulo_id'},
      ],
      Regalias:[],
      RegaliasLong: 0,
      vista: 1,
      search: '',
      searchR: '',
      header:[
        {text: 'Cliente',         value:'cliente.nombres'},
        {text: 'Vendedor',        value:'colaborador.nombres'},
        {text: 'Tipo de venta',   value:'tipo_venta'},
        {text: 'Código',          value:'cod'},
        {text: 'Estado',          value:'estado'},
        {text: 'Aceptado por F.', value:'is_aceptado'},
        {text: 'Total',           value:'total'},
      ]
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Facturación > Ventas > Pendientes');
    this.$store.commit('ventas/cargar_VENTAS_PENDIENTES');
  },
  computed:{
    VENTAS(){
      return this.$store.state.ventas.VENTAS_PENDIENTES;
    },
    LOAD_VENTAS(){
      return this.$store.state.ventas.LOAD_MIS_VENTAS;
    }
  },
  methods:{
    agregarRegalia(data){
      this.Regalias.push({
        exist:       false,
        id:          0,
        articulo_id: data.articulo_id,
        articulo:    data.articulo.nombre_articulo + ' - '+ data.articulo.descripcion_corta,
        marca:       data.articulo.marca.nombre,
        // precio:      data.articulo.precio_activo.precio_contado,
        estado:      1,
        codigo:      data.articulo.codigo_sistema,
        key:         this.Regalias.length,
        is_aceptado: 0
      })
      this.dialogoBuscarInventario = false;
      this.notificacion('Se ha agregado la regalia','success');
    },
    cambiar_vista(val){
      this.Regalias     = [];
      this.Venta        = val;
      this.RegaliasLong = this.Venta.regalias_ventas.length;
      this.datosRegalias();
      this.cargarInventario();
      this.vista        = 2;
    },
    cargarInventario(){
      this.isPeticon = true;
      this.$axios.get('/2.0/inventario_x_sucursal/'+this.Venta.colaborador.sucursal_id).then((res)=>{
        this.Inventario = res.data.inventario;
        this.isPeticon = false;
        this.notificacion('Ya cargo el inventaio para regalias','success');
      })
    },
    datosRegalias(){
      this.Venta.regalias_ventas.forEach( (item, i) => {
        this.Regalias.push({
          exist:       true,
          articulo_id: item.articulo_id,
          id:          item.id,
          articulo:    item.articulo.nombre_articulo + ' - '+ item.articulo.descripcion_corta,
          marca:       item.articulo.marca.nombre,
          // precio:      item.articulo.precio_articulos[0].precio_contado,
          estado:      item.estado,
          codigo:      item.articulo.codigo_sistema,
          key:         i,
          is_aceptado: 0
        })
      })
    },
    decisionVenta(val){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('decicion_venta/fac',{
        venta:    this.Venta.id,
        decision: val,
        regalias:  this.Regalias
      }).then((res)=>{
        this.$store.commit('ventas/cargar_VENTAS_PENDIENTES');
        this.notificacion('La decisión de la venta se ha actualizado exitosamente');
        setTimeout(()=>{this.mostrarVista1()}, 5000);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })
    },
    mostrarVista1(){
      this.$store.commit('activarOverlay', false);
      this.vista = 1
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    validarEnvio(val){
      let longRegalias = this.Regalias.length;
      let contRegalias = 0;
      this.Regalias.forEach( (i) => {
        if (i.is_aceptado !== 0)
          contRegalias++;
      })
      if (contRegalias === longRegalias)
        this.decisionVenta(val);
      else
        this.notificacion('Tienes que tomar una decisión con las regalias.','error')
    },
    verDocumento(url){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: url}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('open-nav', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })
    },
    quitarRegalia(key){
      if (key >= this.RegaliasLong){
        this.Regalias.splice(key,1);
        this.Regalias.forEach( (i, cont) => {
          i.key = cont;
        })
      }else{
        this.notificacion('No se puede eliminar esta fila', 'error');
      }
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
