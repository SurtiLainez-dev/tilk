<template>
<v-card flat tile>
  <v-progress-linear indeterminate v-if="LOAD_VENTA"></v-progress-linear>
  <v-card v-if="!LOAD_VENTA"  flat>
    <table>
      <thead>
      <tr><th style="border-bottom: 0px" v-if="i < 5" v-for="(item, i) in DATOS_CARD">{{item.titulo}}</th></tr>
      </thead>
      <tbody>
      <tr>
        <td style="border-top: 0px" v-if="i < 5" v-for="(item, i) in DATOS_CARD">{{item.texto}}</td>
      </tr>
      </tbody>
      <thead>
      <tr><th style="border-bottom: 0px" v-if="i >= 5 && i < 10" v-for="(item, i) in DATOS_CARD">{{item.titulo}}</th></tr>
      </thead>
      <tbody>
      <tr>
        <td style="border-top: 0px" v-if="i >= 5 && i < 10" v-for="(item, i) in DATOS_CARD">{{item.texto}}</td>
      </tr>
      </tbody>
    </table>
    <v-progress-linear :value="valor" height="10px"></v-progress-linear>

    <v-card flat tile v-if="vista === 1">
      <v-card-title>Cargar Documentos</v-card-title>
      <v-divider></v-divider>
      <v-row>
        <v-col>
          <table >
            <caption>Documentos para descargar</caption>
            <thead>
            <tr>
              <th>Nombre del documento</th>
              <th>Link de descarga</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, i) in documentos">
              <td>{{item.name}}</td>
              <td><b-link @click="mostrarPdf($axios.defaults.baseURL+item.ref+DATA_VENTA.id, i)">Descargar</b-link></td>
            </tr>
            <tr>
              <td>Cargar Expediente Completo</td>
              <td><b-link @click="infoExpedienteCompleto">Cargar Expediente</b-link></td>
            </tr>
            <tr >
              <td>Permiso de Circulación</td>
              <td><b-link @click="mostrarPdf(null, 6)">Descargar Permiso</b-link></td>
            </tr>
            </tbody>
          </table>
        </v-col>
        <v-col>
          <table>
            <caption>Documentos Cargados</caption>
            <thead>
            <tr>
              <th>Nombre del documento</th>
              <th>Link para ver</th>
            </tr>
            </thead>
            <tbody>
            <tr >
              <td>Contrato</td>
              <td v-if="DATA_VENTA.documento_ventas && DATA_VENTA.documento_ventas.contrato">
                <b-link @click="verDocumento(DATA_VENTA.documento_ventas.contrato)">Ver contrato</b-link></td>
              <td v-else>No hay documento</td>
            </tr>
            <tr >
              <td>Pagaré</td>
              <td v-if="DATA_VENTA.documento_ventas && DATA_VENTA.documento_ventas.garantia_prendaria">
                <b-link @click="verDocumento(DATA_VENTA.documento_ventas.garantia_prendaria)">Ver pagaré</b-link></td>
              <td v-else>No hay documento</td>
            </tr>
            <tr >
              <td>Hoja de conocimientos</td>
              <td v-if="DATA_VENTA.documento_ventas && DATA_VENTA.documento_ventas.conocimiento_tramite">
                <b-link @click="verDocumento(DATA_VENTA.documento_ventas.conocimiento_tramite)">Ver hoja de conocimiento</b-link></td>
              <td v-else>No hay documento</td>
            </tr>
            <tr >
              <td>Traspaso Vehícular</td>
              <td v-if="DATA_VENTA.documento_ventas && DATA_VENTA.documento_ventas.traspaso">
                <b-link @click="verDocumento(DATA_VENTA.documento_ventas.traspaso)">Ver hoja de conocimiento</b-link></td>
              <td v-else>No hay documento</td>
            </tr>
            <tr >
              <td>Carta poder</td>
              <td v-if="DATA_VENTA.documento_ventas && DATA_VENTA.documento_ventas.carta_poder">
                <b-link @click="verDocumento(DATA_VENTA.documento_ventas.carta_poder)">Ver hoja de conocimiento</b-link></td>
              <td v-else>No hay documento</td>
            </tr>
            <tr >
              <td>Garantía</td>
              <td v-if="DATA_VENTA.documento_ventas && DATA_VENTA.documento_ventas.garantia_articulo">
                <b-link @click="verDocumento(DATA_VENTA.documento_ventas.garantia_articulo)">Ver hoja de conocimiento</b-link></td>
              <td v-else>No hay documento</td>
            </tr>
            <tr >
              <td>Factura SAR</td>
              <td v-if="DATA_VENTA.documento_ventas && DATA_VENTA.documento_ventas.factura_sar">
                <b-link @click="verDocumento(DATA_VENTA.documento_ventas.factura_sar)">Ver hoja de conocimiento</b-link></td>
              <td v-else>No hay documento</td>
            </tr>
            <tr >
              <td>Tarjeta Fisica</td>
              <td v-if="DATA_VENTA.documento_ventas && DATA_VENTA.documento_ventas.tarjeta_fisica">
                <b-link @click="verDocumento(DATA_VENTA.documento_ventas.tarjeta_fisica)">Ver hoja de conocimiento</b-link></td>
              <td v-else>No hay documento</td>
            </tr>
            <tr >
              <td>Expediente Completo</td>
              <td v-if="DATA_VENTA.documento_ventas && DATA_VENTA.documento_ventas.expediente">
                <b-link @click="verDocumento(DATA_VENTA.documento_ventas.expediente)">Ver hoja de conocimiento</b-link></td>
              <td v-else>No hay documento</td>
            </tr>
            </tbody>
          </table>
        </v-col>
      </v-row>
      <v-card class="ma-2" flat>
        <table>
          <caption>Cargando documentos</caption>
          <thead>
          <tr>
            <th>Nombre</th>
            <th>Cargar</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Contrato</td>
            <td>
              <v-file-input accept="application/pdf" v-model="doc.contrato" dense></v-file-input>
            </td>
          </tr>
          <tr>
            <td>Pagaré</td>
            <td>
              <v-file-input accept="application/pdf" v-model="doc.pagare" dense></v-file-input>
            </td>
          </tr>
          <tr>
            <td>Hoja de conocimientos</td>
            <td>
              <v-file-input accept="application/pdf" v-model="doc.hoja_conocimiento" dense></v-file-input>
            </td>
          </tr>
          <tr>
            <td>Traspaso Vehícular</td>
            <td>
              <v-file-input accept="application/pdf" v-model="doc.traspaso" dense></v-file-input>
            </td>
          </tr>
          <tr>
            <td>Carta poder</td>
            <td>
              <v-file-input accept="application/pdf" v-model="doc.carta_poder" dense></v-file-input>
            </td>
          </tr>
          <tr>
            <td>Garantía</td>
            <td>
              <v-file-input accept="application/pdf" v-model="doc.garantia" dense></v-file-input>
            </td>
          </tr>
          <tr>
            <td>Factura SAR</td>
            <td>
              <v-file-input accept="application/pdf" v-model="doc.factura_sar" dense></v-file-input>
            </td>
          </tr>
          <tr>
            <td>Tarjeta Fisica</td>
            <td>
              <v-file-input accept="application/pdf" v-model="doc.tarjeta_fisica" dense></v-file-input>
            </td>
          </tr>
          <!--                        <tr>-->
          <!--                          <td>Expediente Completo</td>-->
          <!--                          <td>-->
          <!--                            <v-file-input accept="application/pdf" v-model="doc.expediente" dense></v-file-input>-->
          <!--                          </td>-->
          <!--                        </tr>-->
          <tr v-if="DATA_VENTA.documento_ventas && DATA_VENTA.documento_ventas.expediente">
            <td colspan="2">
              <v-btn small></v-btn>
            </td>
            <!--                          <td>-->
            <!--                            <b-link @click="verDocumentoExpedient(DATA_VENTA.documento_ventas.expediente)">Ver hoja de conocimiento</b-link>-->
            <!--                          </td>-->
          </tr>
          </tbody>
        </table>
      </v-card>
      <v-card-actions class="d-flex justify-end">
        <v-btn tile color="warning" @click="cargarFiles" small>Cargar archivos</v-btn>
        <v-btn tile v-if="DATA_VENTA.is_aceptado !== 3"
               color="success" @click="cambiarVista(2,66)" small>Siguiente</v-btn>
      </v-card-actions>
    </v-card>


    <v-card flat tile v-else-if="vista === 2">
      <v-card-title>Revisión de Artículos</v-card-title>
      <v-divider></v-divider>
      <table>
        <thead>
        <tr>
          <th style="width: 50%">Articulo</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Serie del Fabricante</th>
          <th>Color</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in DATA_VENTA.facturas_contados">
          <td style="width: 50%"><strong>{{i+1}}</strong> - {{item.articulo.nombre_articulo}} - [{{item.articulo.codigo_sistema}}]
          <table style="border: 0px" v-if="item.articulo.stock_articulos">
            <thead>
            <tr>
              <th style="font-size: 10px; border-left: 0px; border-right: 0px; width: 60%">Sucursal</th>
              <th style="font-size: 10px; border-left: 0px; border-right: 0px">Nuevo</th>
              <th style="font-size: 10px; border-left: 0px; border-right: 0px">Reingreso</th>
              <th style="font-size: 10px; border-left: 0px; border-right: 0px">Consignado</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="i in item.articulo.stock_articulos">
              <td style="font-size: 9px; border-left: 0px; border-right: 0px">{{i.sucursal.nombre}}</td>
              <td style="font-size: 9px; border-left: 0px; border-right: 0px">{{i.stock_actual}}</td>
              <td style="font-size: 9px; border-left: 0px; border-right: 0px">{{i.stock_reingreso}}</td>
              <td style="font-size: 9px; border-left: 0px; border-right: 0px">{{i.stock_consignado}}</td>
            </tr>
            </tbody>
          </table>
          <table style="border: 0px" v-if="item.articulo.articulo_compuestos.length > 0">
            <thead>
            <tr>
              <th style="font-size: 10px; border-left: 0px; border-right: 0px; width: 60%">Detalle Componentes</th>
              <th style="font-size: 10px; border-left: 0px; border-right: 0px">Cant.</th>
              <th style="font-size: 10px; border-left: 0px; border-right: 0px">Detalle Cant.</th>
              <th style="font-size: 10px; border-left: 0px; border-right: 0px">Codigo</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="i in item.articulo.articulo_compuestos">
              <td style="font-size: 9px; border-left: 0px; border-right: 0px">{{i.detalle}}</td>
              <td style="font-size: 9px; border-left: 0px; border-right: 0px">{{i.cantidad}}</td>
              <td style="font-size: 9px; border-left: 0px; border-right: 0px">{{i.detalle_cantidad}}</td>
              <td style="font-size: 9px; border-left: 0px; border-right: 0px">{{i.codigo}}</td>
            </tr>
            </tbody>
          </table>
            <br>
            <br>
            <br>
          </td>
          <td>{{item.articulo.marca.nombre}}</td>
          <td>{{item.articulo.modelo}}</td>
          <td v-if="item.remision_articulo_id">{{item.remision_articulo.serie_fabricante}}</td>
          <td v-else>---</td>
          <td v-if="item.remision_articulo_id">{{item.remision_articulo.color}}</td>
          <td v-else>---</td>
        </tr>
        </tbody>
      </table>
      <v-card-actions class="d-flex justify-end">
        <v-btn class="ma-2" color="orange" dark small tile @click="cambiarVista(1,33)">Regresar</v-btn>
        <v-btn class="ma-2" color="success" dark small tile @click="cambiarVista(3,100)">Siguiente</v-btn>
      </v-card-actions>
    </v-card>


    <v-card flat tile v-else-if="vista === 3">
      <v-card-title>Salida de Inventario</v-card-title>
      <v-divider></v-divider>
      <v-card-title>Finalizar venta</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        La venta ha llegado a final, todos los datos han llegado han sido revisados por facturación
        y por tí. Al presionar el botón de finalizar ventas aceptas los siguiente términos.
      </v-card-text>
      <ol style="font-size: 12px">
        <li>
          He cargado al sistema todos los documentos solicitados para realizar la venta y son
          totalmente legítimos por mi parte y yo me aseguré que lo fueran de parte del cliente.
        </li>
        <li>
          Acepto la responsablidad de darle seguimiento a este crédito los primeros días de mora en el
          caso de qué acumule mora en alguna cuota.
        </li>
        <li>
          Todas las regalías de la ventas fueron revisadas por mi persona.
        </li>
        <li>
          Todos los componentes del artículo que se le harán salida los revisé para verificar que
          cumple con stock que se mostró anteriormente.
        </li>
        <li>
          He colocado el sticker de código del sistema al artículo para llevar el control de la
          garantía.
        </li>
        <li>
          Al aceptar la salida la venta estoy conciente que el inventario de ese artículo se alterará
          en mi piso de venta de, igual forma los componentes del artículo.
        </li>
        <li>
          Si rechazo la venta, no cumpliré ninguno de los términos antes mencionados, pero tendré
          que dar una explicación por correo a facturación explicando las razones de tal acción.
        </li>
      </ol>
      <br>
      <v-select v-model="Colaborador"
                class="ma-5"
                :loading="loadCol"
                loader-height="3"
                :item-value="'correo'"
                :item-text="'nombre'"
                label="Colaborador a enviar venta"
                :items="Colaboradores"></v-select>
      <v-divider></v-divider>
      <v-simple-table dense class="rowsTable">
        <template v-slot:default>
          <caption>Seleccionar dirección de envio</caption>
          <thead>
          <tr>
            <th>Dirección completa</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr  v-if="DATA_VENTA.cliente.direcciones" v-for="item in JSON.parse(DATA_VENTA.cliente.direcciones)">
            <td>{{item.detalle}}</td>
            <td>
              <v-btn fab x-small tile @click="capturarDireccion(item.detalle)"
                     dark><v-icon>fa fa-arrow-right</v-icon></v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <br>
      <small>Dirección seleccionada</small>
      <br>
      <b-input size="sm" placeholder="Introducir la dirección manualmente" v-model="Direccion"></b-input>
      <v-divider></v-divider>

      <v-card-actions class="d-flex justify-end">
        <v-btn class="ma-2" color="orange" dark small tile @click="cambiarVista(2,66)">Regresar</v-btn>
        <v-btn class="ma-2" color="indigo" v-if="this.DATA_VENTA.estado < 4 || this.DATA_VENTA.is_aceptado !== 2" dark small tile @click="ValidarDatos(2)">Declinar Venta</v-btn>
        <v-btn class="ma-2" color="success" v-if="this.DATA_VENTA.estado < 4 || this.DATA_VENTA.is_aceptado !== 2" dark small tile @click="ValidarDatos(1)">Registrar Salida</v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "vista_salida_combos",
  created() {
    this.$store.commit('ventas/cargar_DATA_VENTA');
    this.$store.commit('guardarTitulo', 'Mis Ventas > Combo');
    if (this.DATA_VENTA && this.DATA_VENTA.is_aceptado === 3 && this.DATA_VENTA.estado < 4){
      this.valor = 0;
    }
    else if (this.DATA_VENTA && this.DATA_VENTA.estado === 4){ this.valor = 100;}
    else{ this.valor = 33;}

    this.cargarColaboradores();
  },
  computed:{
    LOAD_VENTA(){
      return this.$store.state.ventas.LOAD_MIS_VENTAS;
    },
    DATA_VENTA(){
      return this.$store.state.ventas.DATA_VENTA;
    },
    DATOS_CARD(){
      return this.$store.state.ventas.DATOS_CARD;
    },
    COMBO(){
      return this.$store.state.ventas.COMBO;
    },
    USUARIO(){
      return this.$store.state.usuario;
    },
  },
  data(){
    return{
      vista: 1,
      Direccion: '',
      Colaborador: '',
      loadCol: false,
      documentos:[
        {name:'Contrato', ref:'print_contrato_venta/'},
        {name:'Pagaré', ref:'print_pagare_venta/'},
        {name:'Hoja de conocimientos (vehículos)', ref: 'print_hoja_conocimientos_venta/'},
        {name:'Traspaso (vehículos)', ref: 'print_traspaso_venta/'},
        {name:'Carta Poder (vehículos)', ref: 'print_carta_poder_venta/'},
      ],
      doc:{
        carta_poder:       null,
        contrato:          null,
        hoja_conocimiento: null,
        pagare:            null,
        garantia:          null,
        traspaso:          null,
        tarjeta_fisica:    null,
        expediente:        null,
        factura_sar:       null
      },
      valor: 0,
      articulos: [],
      Colaboradores: [],
    }
  },
  methods:{
    abrirNavegador(clave, serie){
      ipcRenderer.send('pint_navegador', this.$axios.defaults.baseURL+'documentos/permiso_s_placa/usuario='+this.USUARIO+'&chasis='+serie+'/'+clave);
      this.$store.commit('activarOverlay', false);
    },
    cambiarVista(vista, valor){
      if (vista < 3) {
        this.vista = vista
        this.valor = valor;
      }else
        this.validarStock();
    },
    capturarDireccion(dir){
      this.Direccion = dir
    },
    cargarColaboradores(){
      this.loadCol = true;
      this.$axios.get('colaborador_envio').then((res=>{
        res.data.colaboradores.forEach((i)=>{
          if (i.colaborador){
            this.Colaboradores.push({
              correo: i.email,
              nombre: i.colaborador.nombres+' '+i.colaborador.apellidos
            })
          }
        });
        this.loadCol = false;
      }))
    },
    cargarFiles(){
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      data.append('contrato',     this.doc.contrato);
      data.append('pagare',       this.doc.pagare);
      data.append('carta_poder',  this.doc.carta_poder);
      data.append('garantia',     this.doc.garantia);
      data.append('traspaso',     this.doc.traspaso);
      data.append('conocimiento', this.doc.hoja_conocimiento);
      data.append('factura_sar',  this.doc.factura_sar);
      data.append('expediente',   this.doc.expediente);
      data.append('tarjeta',      this.doc.tarjeta_fisica);
      data.append('id',           this.DATA_VENTA.id);

      this.$axios({
        method: 'post',
        url:    'cargar_documentos_venta',
        data:   data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.notificacion(res.data.msg, 'success');
        this.$store.commit('ventas/cargar_DATA_VENTA');
        this.notificacion('Tienes que esperar a que facturación revise los documentos para avanzar', 'success')
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })
    },
    infoExpedienteCompleto(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        let data = {
          token:     this.$store.state.token,
          token_doc: res.data.clave,
          data:      this.DATA_VENTA,
          usuario:   this.USUARIO,
          dir:       this.$store.state.DIRUTILIDADES,
          url:       this.$axios.defaults.baseURL,
        }
        this.$store.commit('activarOverlay', false);
        ipcRenderer.send('crear-utilidad', data);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Ocurrio un error', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    mostrarPdf(url, tipo){
      if (tipo < 2)
        ipcRenderer.send('pint_navegador', url);
      else{
        let combos = this.DATA_VENTA.facturas_contados;
        let motos  = combos.filter((item)=>item.articulo.is_motocicleta === 1);
        if (motos.length > 0) {
          if (tipo === 6)
            this.solicitarClave(motos[0].remision_articulo.serie_fabricante);
          else
            ipcRenderer.send('pint_navegador', url);
        }else
          this.$store.commit('notificacion',{texto:'La venta no tiene motocicletas', color:'warning'})
      }
    },
    registrarVenta(decision){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('registrar_venta',{
        decision:    decision,
        is_combo:    1,
        venta_id:    this.DATA_VENTA.id,
        sucursal_id: this.DATA_VENTA.colaborador.sucursal_id,
        correo:      this.Colaborador,
        direccion:   this.Direccion,
        articulos:   this.DATA_VENTA.facturas_contados
      }).then((res)=>{
        this.$store.commit('ventas/cargar_DATA_VENTA');
        this.$store.commit('ventas/cargar_MIS_VENTAS');

        this.$store.commit('notificacion',{texto:'Se ha actualizado la información de la venta', color:'success'})
        if (decision === 1) {
          this.$store.commit('notificacion',{texto:'Se le va enviar esta venta al correo: '+this.Colaborador, color:'success'})
          this.$store.commit('notificacion',{texto:'Se han realizado todos los procedicimientos para la venta', color:'success'})
          if (res.data.orden)
            this.OrdenEntrada_id = res.data.orden;
        }
        else
          this.$store.commit('notificacion',{texto:'Se ha cancelado la venta exitosamente', color:'success'})

        this.Enviado = true;
        this.vista   = 1;
        this.valor   = 100;

        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        }, 5000)
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Ha ocurrido un error, comunicate con el soporte técnico.', color:'error'})
      })
    },
    solicitarClave(serie){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave, serie);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Ocurrio un error', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    ValidarDatos(decision){
      if (this.DATA_VENTA.is_aceptado === 1 && this.DATA_VENTA.estado === 4) {
        if (this.Colaborador) {
          if (this.Direccion) {
            this.registrarVenta(decision);
          }else {
            this.$store.commit('notificacion',{texto:'Tienes que seleccionar una dirección de envio.', color:'warning'})
          }
        }else {
          this.$store.commit('notificacion',{texto:'Tienes que seleccionar al colaborador que va a recibir la venta', color:'warning'})
        }
      }
    },
    validarStock(){
      let articulos = this.DATA_VENTA.facturas_contados;
      let articulosIds = [];
      let artExiste    = [];
      let sucursal     = [];
      let stock        = 0;
      articulos.forEach((item, i)=>{
        if (item.articulo.stock_articulos)
          sucursal = item.articulo.stock_articulos.filter(data => data.sucursal_id === this.DATA_VENTA.sucursal_id)
        if (sucursal.length > 0){
          if (item.articulo.is_motocicleta === 1){
            if (item.remision_articulo.estado_articulo_id === 2)
              stock = sucursal[0].stock_consignado;
            else if (item.remision_articulo.estado_articulo_id === 1)
              stock = sucursal[0].stock_actual;
          }else
            stock = sucursal[0].stock_actual;
        }

        if (articulosIds.length === 0) {

          articulosIds.push({id: item.articulo_id, cant: 1, key: i, stock: stock, sucursal: sucursal})
        }else{
          if (articulosIds.filter(data=>data.id === item.articulo_id).length === 0)
            articulosIds.push({id:item.articulo_id, cant: 1, key: i, stock: stock, sucursal: sucursal})
          else{
            artExiste = articulosIds.filter(data => data.id === item.articulo_id);
            artExiste = artExiste[0];
            articulosIds.splice(artExiste.key, 1);

            artExiste.cant = parseInt(artExiste.cant) + 1;
            articulosIds.push(artExiste);
            articulosIds.forEach((item,i)=>{item.key = i})
          }
        }
        sucursal = [];
        stock    = 0;
      })

      console.log(articulosIds)
      let bandera = 0;
      articulosIds.forEach(item=>{
        if (item.cant > item.stock)
          bandera++
      });
      if(bandera === 0) {
        this.vista = 3;
        this.valor = 90;
      }else
        this.$store.commit('notificacion',{texto:'Hay un articulo que no cumple con el stock minimo. Revisa el stock por favor', color:'warning'})

    },
    verDocumento(url){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: url}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })
    },
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border: solid #b2b0b0 1px;
  cursor: pointer;
}
table thead tr th{
  padding: 5px;
  font-size: 12px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 10px;
  cursor: pointer;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr:hover{
  background-color: #f6f6f6;
}
</style>