<template>
  <v-card flat>
    <b-overlay :show="LOAD_VENTA" rounded="sm">
      <table>
        <thead>
        <tr><th colspan="5">Datos de la Venta</th></tr>
        </thead>
        <thead>
        <tr>
          <th :colspan="index === 0 ? 2 : 1" v-if="index < 4" v-for="(item, index) in DATOS_CARD">{{item.titulo}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td :colspan="index === 0 ? 2 : 1" v-if="index < 4" v-for="(item, index) in DATOS_CARD">{{item.texto}}</td>
        </tr>
        </tbody>
        <thead>
        <tr>
          <th v-if="index >= 4" v-for="(item, index) in DATOS_CARD">{{item.titulo}}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td v-if="index >= 4" v-for="(item, index) in DATOS_CARD">{{item.texto}}</td>
        </tr>
        </tbody>
      </table>
      <v-row no-gutters>
        <v-col cols="2">
          <v-card height="450" class="mx-auto">
            <v-navigation-drawer permanent>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="title">
                    {{tituloMenu}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

              <v-list dense nav>
                <v-list-item :disabled="item.dib" v-for="item in items" :key="item.title" link @click="cambiarVista(item)">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-divider></v-divider>
              <div v-if="DATA_VENTA">
                <v-btn tile small color="indigo" block dark @click="revisar">Finalizar Revisión</v-btn>
                <v-btn tile small color="success" v-if="itemId === 4 && DATA_VENTA.estado === 4" :disabled="!btnEnvio"
                       block class="text-white" @click="registrarVenta(1)">
                  Finalizar Venta</v-btn>
                <v-btn tile small color="warning" v-if="itemId === 4 && DATA_VENTA.estado ===4" :disabled="!btnEnvio"
                       block class="text-white" @click="registrarVenta(2)">
                  Cancelar Venta</v-btn>
              </div>
              <b-checkbox class="ma-2" v-model="revisado.salida" disabled>Salida de Inventario</b-checkbox>
              <b-checkbox class="ma-2" v-model="revisado.regalia" disabled>Salida de Regalias</b-checkbox>
              <b-checkbox class="ma-2" v-model="revisado.final" disabled>Finalización de Venta</b-checkbox>
            </v-navigation-drawer>
          </v-card>
        </v-col>

        <v-col cols="10" v-if="DATA_VENTA">

          <v-card v-if="itemId === 1" flat>
            <v-alert dense color="warning" dark class="ma-2">Si el artículo es una <strong>MOTOCICLETA</strong>, subir los archivos que se le solicitan. Sino es
            motocicleta, prosiga a la finalización de la venta.</v-alert>
            <v-card flat >
              <v-simple-table dense class="rowsTable">
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre del Documento</th>
                    <th>Descargar</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>1</td>
                    <td>Hoja Conocimiento de Trámite</td>
                    <td><b-link @click="mostrarPdf($axios.defaults.baseURL+'print_hoja_conocimientos_venta/'+DATA_VENTA.id)">Descargar</b-link></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Traspaso Vehícular</td>
                    <td><b-link @click="mostrarPdf($axios.defaults.baseURL+'print_traspaso_venta/'+DATA_VENTA.id)">Descargar</b-link></td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Carta Poder</td>
                    <td><b-link @click="mostrarPdf($axios.defaults.baseURL+'print_carta_poder_venta/'+DATA_VENTA.id)">Descargar</b-link></td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Permiso para Circular sin Placa</td>
                    <td><b-link @click="solicitarClave">Generar</b-link></td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Cargar Expediente Completo</td>
                    <td><b-link @click="abrirDialogoDocumentoCompleto">Cargar Expediente</b-link></td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-divider></v-divider>
              <v-file-input dense class="ma-4" v-model="doc.hoja_conocimiento" label="Cargar Hoja Conocimiento Trámites"></v-file-input>
              <v-file-input dense class="ma-4" v-model="doc.carta_poder" label="Cargar Carta Poder"></v-file-input>
              <v-file-input dense class="ma-4" v-model="doc.traspaso" label="Cargar Traspaso"></v-file-input>
              <v-file-input dense class="ma-4" v-model="doc.garantia" label="Cargar Hoja de Garantía"></v-file-input>
              <v-divider></v-divider>
            </v-card>
            <v-card flat >
              <v-simple-table dense class="rowsTable">
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th></th>
                    <th>Nombre del Documento</th>
                    <th>Ver</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr >
                    <th>1</th>
                    <td>Traspaso Vehícular</td>
                    <td><b-link @click="verDocumento(DATA_VENTA.documento_ventas.traspaso)">ver</b-link></td>
                  </tr>
                  <tr >
                    <th>2</th>
                    <td>Hojas de Conocimiento de Trámites</td>
                    <td><b-link @click="verDocumento(DATA_VENTA.documento_ventas.conocimiento_tramite)">ver</b-link></td>
                  </tr>
                  <tr >
                    <th>3</th>
                    <td>Carta Poder</td>
                    <td><b-link @click="verDocumento(DATA_VENTA.documento_ventas.carta_poder)">ver</b-link></td>
                  </tr>
                  <tr >
                    <th>4</th>
                    <td>Hoja de Garantía</td>
                    <td><b-link @click="verDocumento(DATA_VENTA.documento_ventas.garantia_articulo)">ver</b-link></td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
            <v-card-actions class="d-flex justify-end">
              <v-btn class="ma-2" color="success" dark small tile v-if="!DATA_VENTA.documento_ventas" @click="registrarDocumentos">Registrar Documentos</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-if="itemId === 2" flat>
            <v-simple-table dense class="rowsTable">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre del Artículo</th>
                  <th>Estado</th>
                  <th>Modelo</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                  <th>Remisión</th>
                  <th>Motocicleta</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,i) in DATA_VENTA.facturas_contados">
                  <td>{{i + 1}}</td>
                  <td>{{item.articulo.nombre_articulo}}</td>
                  <td>{{item.remision_articulo.estado_articulo.nombre}}</td>
                  <td>{{item.articulo.modelo}}</td>
                  <td>{{item.cantidad}}</td>
                  <td>L {{item.precio}}</td>
                  <td>L {{item.total}}</td>
                  <td>
                    <v-tooltip left>
                      <template v-slot:activator="{on, attrs}">
                        <v-btn tile fab text width="20" height="20" v-bind="attrs"
                               :disabled="item.is_remision !== 1"
                               v-on="on" color="success"><v-icon size="15">fa fa-eye</v-icon></v-btn>
                      </template>
                      <v-card v-if="item.is_remision === 1">
                        <v-toolbar flat>
                          <h6>Datos de la Remisión</h6>
                        </v-toolbar>
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title>Código del Sistema</v-list-item-title>
                            <v-list-item-subtitle>{{item.remision_articulo.serie_sistema}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title>Código del Proveedor</v-list-item-title>
                            <v-list-item-subtitle>{{item.remision_articulo.serie_fabricante}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title>Color</v-list-item-title>
                            <v-list-item-subtitle>{{item.remision_articulo.color}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-card>
                    </v-tooltip>
                  </td>
                  <td>
                    <v-tooltip left>
                      <template v-slot:activator="{on, attrs}">
                        <v-icon :disabled="item.articulo.is_motocicleta !== 1" v-on="on"
                                v-bind="attrs" color="success" size="20">fa fa-motorcycle</v-icon>
                      </template>
                      <v-card v-if="item.articulo.is_motocicleta === 1 && item.remision_articulo.motocicleta">
                        <v-toolbar flat>
                          Datos de la Motocicleta
                        </v-toolbar>
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title>Chasis</v-list-item-title>
                            <v-list-item-subtitle>{{item.remision_articulo.motocicleta.chasis}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title>Motor</v-list-item-title>
                            <v-list-item-subtitle>{{item.remision_articulo.motocicleta.motor}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title>Color</v-list-item-title>
                            <v-list-item-subtitle>{{item.remision_articulo.motocicleta.color}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title>Año</v-list-item-title>
                            <v-list-item-subtitle>{{item.remision_articulo.motocicleta.anio}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item two-line>
                          <v-list-item-content>
                            <v-list-item-title>CC</v-list-item-title>
                            <v-list-item-subtitle>{{item.remision_articulo.motocicleta.cilindraje}}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-card>
                    </v-tooltip>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider></v-divider>
            <v-simple-table dense class="rowsTable">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>Pertenece a</th>
                  <th>Nombre del Componente</th>
                  <th>Cantidad</th>
                  <th>Código</th>
                  <th>Salida</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Componentes">
                  <td>{{item.articulo}}</td>
                  <td>{{item.nombre}}</td>
                  <td>{{item.cantidad}} <span v-if="item.detalleCant">({{item.detalleCant}} unidades)</span></td>
                  <td>{{item.codigo}}</td>
                  <td>
                    <b-checkbox size="sm" v-model="item.salida"></b-checkbox>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>

<!--          -->

          <v-card v-else-if="itemId === 3" flat>
            <v-simple-table dense class="rowsTable">
              <thead>
              <tr>
                <th>Nombre del Artículo</th>
                <th>Código</th>
                <th>Salida Aceptada por Fac.</th>
                <th>Salida</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in Regalias">
                <td>{{item.articulo}}</td>
                <td>{{item.codigo}}</td>
                <td>
                  <v-icon color="success" v-if="item.estado === 1">fa fa-check</v-icon>
                  <v-icon color="red" v-else-if="item.estado === 2">fa fa-times</v-icon>
                </td>
                <td>
                  <b-checkbox size="sm" v-model="item.salida"></b-checkbox>
                </td>
              </tr>
              </tbody>
            </v-simple-table>
          </v-card>
          <v-card v-else-if="itemId === 4" flat>
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

          </v-card>

        </v-col>

      </v-row>
    </b-overlay>
  </v-card>
</template>

<script>

import {vsUpload} from 'vuesax';
import 'vuesax/dist/vuesax.css';
import 'material-icons/iconfont/material-icons.css';
import Vue from "vue";
import {ipcRenderer} from "electron";

export default {
  name: "mis_ventas_contado",
  data(){
    return{
      pdfCompleto: null,
      paginas: 0,
      itemValidarDocumento: 0,
      validadDocumento: false,
      tituloMenu: 'Salida de Inventario',
      items: [
        { title: 'Documentos',  val:1, dib: false},
        { title: 'Salida de Inventario',  val:2, dib: false},
        { title: 'Revisión de Regalias',  val:3, dib: true},
        { title: 'Finalización de Venta', val:4, dib: true},
      ],
      disableDoc: false,
      doc:{
        carta_poder:       null,
        hoja_conocimiento: null,
        garantia:          null,
        traspaso:          null,
        completo:          null,
      },
      itemId: 1,
      Direccion: '',
      Componentes: [],
      Colaborador: '',
      revisado:{
        docs:   false,
        salida: false,
        regalia: false,
        final:   false
      },
      btnEnvio: true,
      Regalias: [],
      Colaboradores: [],
      loadCol: false,
      dirDocumentoCompleto: ''
    }
  },
  computed:{
    LOAD_VENTA(){
      return this.$store.state.ventas.LOAD_MIS_VENTAS;
    },
    USUARIO(){
      return this.$store.state.usuario;
    },
    DATA_VENTA(){
      if (this.$store.state.ventas.DATA_VENTA && this.$store.state.ventas.DATA_VENTA.estado !== 4){
        this.revisado.final   = true;
        this.revisado.salida  = true;
        this.revisado.regalia = true;
        this.items.forEach((i)=>{
          i.dib = false;
        })
      }
      return this.$store.state.ventas.DATA_VENTA;
    },
    DATOS_CARD(){
      return this.$store.state.ventas.DATOS_CARD;
    },
    IS_MOTO(){
      return this.$store.state.ventas.IS_MOTO;
    },
    DATA_COMPONENTES(){
      return this.$store.state.ventas.DATA_COMPONENTES;
    },
    DATA_REGALIAS(){
      return this.$store.state.ventas.DATA_REGALIAS;
    },
    IS_ACEPTADA(){
      return this.$store.state.ventas.IS_ACEPTADA;
    },
  },
  created() {
    this.$store.commit('ventas/cargar_DATA_VENTA_CONTADO');
    this.Componentes = this.DATA_COMPONENTES;
    this.Regalias    = this.DATA_REGALIAS;
    this.cargarColaboradores();
    Vue.use(vsUpload)
  },
  methods:{
    abrirDialogoDocumentoCompleto(){
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
    abrirNavegador(clave){
      ipcRenderer.send('pint_navegador', this.$axios.defaults.baseURL+'documentos/permiso_s_placa/usuario='+this.USUARIO+'&chasis='+this.DATA_VENTA.facturas_contados[0].remision_articulo.serie_fabricante+'/'+clave);
      this.$store.commit('activarOverlay', false);
    },
    cambiarVista(data){
      this.itemId     = data.val;
      this.tituloMenu = data.title;
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
    habilitarBtnEnvio(){
      console.log(this.revisado)
      this.btnEnvio = this.revisado.final && this.revisado.regalia && this.revisado.salida;
    },
    mostrarPdf(url){
      ipcRenderer.send('pint_navegador', url);
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    revisar(){
      if (this.itemId === 1) {
        this.revisado.docs = true;
        this.itemId = 2;
        this.items[1].dib = false;
      }else if (this.itemId === 2){
        this.revisado.salida = true;
        this.itemId           = 3;
        this.items[2].dib     = false;
      }else if (this.itemId === 3){
        this.revisado.regalia = true;
        this.itemId = 4;
        this.items[3].dib     = false;
      } else if (this.itemId === 4){
        this.revisado.final = true;
      }
      this.habilitarBtnEnvio();
    },
    registrarDocumentos(){
      console.log(this.doc)
      if (this.validarFiles()){
        this.$store.commit('activarOverlay', true);
        let data = new FormData();
        data.append('carta_poder',  this.doc.carta_poder);
        data.append('garantia',     this.doc.garantia);
        data.append('traspaso',     this.doc.traspaso);
        data.append('conocimiento', this.doc.hoja_conocimiento);
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
          this.$store.commit('notificacion',{texto:res.data.msg, color:'success'});
          this.$store.commit('ventas/cambiar_VISTA', 1);
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
        })

      }
    },
    registrarVenta(val){
      if (this.Colaborador && this.Direccion){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('venta/contado/save',{
          venta_id:    this.DATA_VENTA.id,
          decision:    val,
          sucursal_id: this.DATA_VENTA.sucursal_id,
          regalias:    this.Regalias,
          componentes: this.Componentes,
          correo:      this.Colaborador,
          direccion:   this.Direccion
        }).then((res)=>{
          this.$store.commit('ventas/cargar_MIS_VENTAS', null);
          setTimeout(()=>{
            this.$store.commit('activarOverlay', false);
          },4500);
          this.$store.commit('ventas/cambiar_VISTA', 1)
          this.notificacion('Se ha registrado la venta al contado actualmente','success');
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.notificacion('Hubo un error en el servidor','error');
        })
      }else{
        this.$store.commit('notificacion',{texto:'Selecciona un colaborador o revisa que tengas una dirección', color:'warning'})
      }
    },
    solicitarClave(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Ocurrio un error', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    validarFiles(){
      if (this.doc.carta_poder && this.doc.garantia && this.doc.traspaso && this.doc.hoja_conocimiento)
        return true;
      else
        this.$store.commit('notificacion',{texto:'Tienes que cargar los archivos que se te solicitan', color:'warning'});
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
}

table thead tr th{
  padding: 5px;
  font-size: 14px;
  border-left: solid #b2b0b0 1px;
  border-top: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 12px;
  cursor: pointer;
}
table tbody tr td table{
  width: 80%;
}
table tbody tr td table thead tr th{
  font-size: 10px;
  padding: 2px;
}
table tbody tr td table tbody tr td{
  font-size: 9px;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr td:hover{
  background-color: #f6f6f6;
}
</style>
