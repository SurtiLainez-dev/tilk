<template>
    <div>
      <v-row>
        <v-col cols="6"><v-card-title>Creando Traslado de Artículos</v-card-title></v-col>
        <v-col cols="6" class="d-flex justify-end align-center">
          <v-btn @click="Motivos.dialogo = true"
                 color="orange" small dark class="ma-2">Crear Mótivo de Traslado</v-btn>
        </v-col>
      </v-row>
      <hr>
      <v-stepper v-model="vista">
        <v-stepper-header>
          <v-stepper-step :complete="vista > 1" step="1">Creando Transferencia</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="vista > 2" step="2">Revisión de Transferencia</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="vista > 3" step="3">Crear Remisión</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="4">Envio de Remisión</v-stepper-step>
        </v-stepper-header>

        <v-stepper-content step="1">
          <v-card height="100%" width="100%">
            <strong>Información del Traslado</strong>
            <v-form ref="FormVerificarIngresoArticuloTraslado">
              <div class="bordes pl-2 pr-2">
                <v-row>
                  <v-col cols="4">
                    <v-autocomplete :items="Sucursales"
                                    :item-text="'nombre'"
                                    :item-value="'id'"
                                    @change="cargarInventario"
                                    :rules="[rules.motivo.req]"
                                    label="Sucursal de Origen"
                                    :loading="Loads.sucursales"
                                    v-model="Traslado.sucursalOrigen">
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="4">
                    <v-select :items="Motivos.data"
                              :item-text="'motivo'"
                              :rules="[rules.motivo.req]"
                              label="Motivo del Traslado"
                              v-model="Traslado.motivoTraslado"
                              :loading="Loads.motivos"
                              :item-value="'id'"></v-select>
                  </v-col>
                  <v-col cols="4">
                    <v-autocomplete :items="Sucursales"
                                    :item-text="'nombre'"
                                    :item-value="'id'"
                                    :rules="[rules.motivo.req, rules.sucursal.dif]"
                                    label="Sucursal de Destino"
                                    :loading="Loads.sucursales"
                                    v-model="Traslado.sucursalDestino">
                    </v-autocomplete>
                  </v-col>
                </v-row>
                <v-text-field label="Observación"
                              :rules="[rules.observacion.max]"
                              v-model="Traslado.observacion">
                </v-text-field>
              </div>
              <div class="bordes pl-2 pr-2">
                <v-simple-table dense height="460px" fixed-header>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th colspan="2">Artículo</th>
                      <th>Código</th>
                      <th>Cantidad</th>
                      <th>Estado</th>
                      <th class="text-center">Compuesto</th>
                      <th class="text-center">Remisión</th>
                      <th>Quitar</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in Traslado.articulos">
                      <td width="5%">
                        <v-btn fab
                               @click="abrirDialogoArticulo(item)"
                               color="success"
                               width="25px"
                               height="25px"
                               dark><v-icon size="15px">fa fa-search</v-icon>
                        </v-btn>
                      </td>
                      <td width="50%">
                        {{item.articulo}}
                      </td>
                      <td width="15%">
                        <v-text-field v-model="item.cod" :rules="[rules.motivo.req]" disabled></v-text-field>
                      </td>
                      <td width="10%">
                        <v-text-field v-model="item.cantidad"
                                      @keyup="verificarCantidad(item)"
                                      @keyup.enter="addFila"
                                      :rules="[rules.motivo.req, rules.cantidad.mayor]"></v-text-field>
                      </td>
                      <td>
                        {{item.estadoS}}
                      </td>
                      <td class="text-center">
                        <v-icon v-if="item.compuesto === 1" color="success" x-small>fa fa-check</v-icon>
                        <v-icon v-else-if="item.compuesto === 0" color="red" x-small>fa fa-times</v-icon>
                      </td>
                      <td class="text-center">
                        <v-icon v-if="item.remision === 1" color="success" x-small>fa fa-check</v-icon>
                        <v-icon v-else-if="item.remision ===0" color="red" x-small>fa fa-times</v-icon>
                      </td>
                      <td>
                        <v-btn color="red"
                               dark
                               width="25px"
                               height="25px"
                               @click="removeFila(item.fila)"
                               fab>
                          <v-icon size="15px">fa fa-times</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-form>
            <v-card-actions class="d-flex justify-end">
              <v-btn  small
                      dark
                      @click="verificarArticulosTraslados"
                      color="orange">
                Verificar Artículos
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card width="100%" height="100%">
            <strong>Verificación de Artículos</strong>
            <div class="bordes">
              <revision v-if="vista === 2" :tipo="tipo" :traslado_id="traslado_id"
                        :traslado="Traslado" :update="articulos_data" :cuerpos="cuerpos_data"/>
            </div>
            <v-card-actions class="d-flex justify-end">
              <v-btn dark color="orange" @click="$store.commit('cambiarVista',1)" small>Volver</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card height="400px" width="100%">
            <strong>Creación de Guía de Remisión</strong>
            <remision v-if="vista === 3"  :sucursales="Sucursales" :motivos="Motivos.data"/>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-card height="100%" width="100%">
            <envio v-if="vista === 4"/>
          </v-card>
        </v-stepper-content>
      </v-stepper>

      <v-dialog v-model="Motivos.dialogo" width="40%">
        <v-card>
          <v-card-title>Creando Motivo de Traslado</v-card-title>
          <hr>
          <v-form class="pl-5 pr-5" ref="FormNuevoMotivoTraslado">
            <v-text-field v-model="Motivos.motivo" :rules="[rules.motivo.req, rules.motivo.min, rules.motivo.max]"
                          label="Nombre del Motivo" :counter="100"></v-text-field>
          </v-form>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" small dark @click="Motivos.dialogo = false">Cerrar</v-btn>
            <v-btn color="success" @click="registrarMotivos" small dark >Registrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="Traslado.dialogo" width="100%">
        <v-card class="pl-5 pr-5">
          <v-row>
            <v-col cols="6">
              <v-card-title>Inventario</v-card-title>
            </v-col>
            <v-col cols="6" class="d-flex justify-end">
              <v-text-field v-model="search" label="Buscar Artículo"></v-text-field>
            </v-col>
          </v-row>
          <v-data-table :items="Inventario"
                        :headers="header"
                        dense
                        :search="search"
                        class="rowsTable"
                        loading-text="Cargando inventario ... espere un momento"
                        :loading="Loads.inventario">
            <template v-slot:item.stock_actual="{item}">
              <v-btn fab
                     x-small
                     dark
                     width="25px"
                     height="25px"
                     @click="agregarArticulo(item, 2)"
                     color="success">
                {{item.stock_actual}}
              </v-btn>
            </template>
            <template v-slot:item.stock_consignado="{item}">
              <v-btn fab
                     x-small
                     dark
                     width="25px"
                     height="25px"
                     @click="agregarArticulo(item, 3)"
                     color="success">
                {{item.stock_consignado}}
              </v-btn>
            </template>
            <template v-slot:item.stock_reingreso="{item}">
              <v-btn fab
                     x-small
                     dark
                     width="25px"
                     height="25px"
                     @click="agregarArticulo(item, 1)"
                     color="orange">
                {{item.stock_reingreso}}
              </v-btn>
            </template>
          </v-data-table>
          <v-card-actions class="d-flex justify-end">
            <v-btn class="ma-2"
                   color="orange"
                   dark
                   @click="Traslado.dialogo = 2"
                   small>Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
  import Swal from 'sweetalert2'
  import revision from "../../../components/facturacion/traslados/revision";
  import remision from "../../../components/facturacion/traslados/remision";
  import envio from "../../../components/facturacion/traslados/envio";
  export default {
    name: "nuevo_transfe",
    props:{
      sucursal_data:  Number,
      destino_data:   Number,
      motivo_data:    Number,
      articulos_data: Array,
      tipo:           Number,
      traslado_id:    Number,
      cuerpos_data:   Array
    },
    data(){
      return{
        side: false,
        search: '',
        header:[
          {text:'Artículo',       value:'articulo.nombre_articulo'},
          {text:'Marca',          value:'articulo.marca.nombre'},
          {text:'Módelo',         value:'articulo.modelo'},
          {text:'Proveedor',      value:'articulo.marca.proveedor.nombre'},
          {text:'Cód. Proveedor', value:'articulo.cod_proveedor'},
          {text:'Cód. Sístema',   value:'articulo.codigo_sistema'},
          {text:'Stock',          value:'stock_actual',    align:'center'},
          {text:'Stock R.',       value:'stock_reingreso', align:'center'},
          {text:'Stock Cons.',       value:'stock_consignado', align:'center'},
        ],
        Traslado:{
          fila: null,
          observacion: '',
          dialogo: false,
          sucursalOrigen:  this.sucursal_data,
          sucursalDestino: this.destino_data,
          motivoTraslado:  this.motivo_data,
          // articulos:[
          //   {articulo_id:'', articulo:'', observacion: '', compuestos: [],cantidad: 0, data: null, cod:'', back: false,
          //     remision: 0, compuesto: 0, fila:1, estado:false, motocicleta:
          //       false, estadoS: '', cantidadStock: 0, estadoArticulo: ''}
          // ]
          articulos: this.articulos_data
        },
        rules:{
          motivo:{
            max: v => v.length < 100 || 'No puede ser mayor a 100 carácteres',
            min: v => v.length > 5  || 'Tiene que ser mayor a 5 carácteres',
            req: v => !!v || 'Campo requerido'
          },
          sucursal:{
            dif: v => v != this.Traslado.sucursalOrigen || 'No puede ser igual que la sucursal de origen'
          },
          cantidad:{
            mayor: v => v > 0 || 'Invalido'
          },
          observacion:{
            max: v => v.length < 255 || 'No puede ser mayor a 255 carácteres',
          }
        },
        Motivos:{
          dialogo: false,
          motivo:'',
          data: [],
        },
        Loads:{
          motivos: true,
          sucursales: true,
          inventario: true
        },
        Sucursales: [],
        Inventario: [],
        Estados:    []
      }
    },
    components:{revision, remision, envio},
    created() {
      this.$store.commit('cambiarVista', 1);
      this.$store.commit('guardarTitulo', 'Transferencias > Nueva');
      this.cargarSucursales();
      this.cargarMotivos();
      if (this.tipo === 2){
        this.cargarInventario2()
      }
    },
    computed:{
      vista(){
        return this.$store.state.vista;
      }
    },
    methods:{
      abrirDialogoArticulo(item){
        if (this.Traslado.sucursalOrigen.length > 0 || this.Traslado.sucursalOrigen > 0){
          this.Traslado.fila = item;
          item.cantidad = 0;
          this.Traslado.dialogo = true;
        }
      },
      addFila(){
        let fila = parseInt(this.Traslado.articulos.length) + parseInt(1);
        let back = fila % 2 == 0 ? true : false;
        this.Traslado.articulos.push({
          "articulo_id": '',
          "articulo": '',
          "observacion": '',
          "compuestos": [],
          "cantidad": 0,
          "cod": '',
          "remision": 0,
          "compuesto": 0,
          "fila": fila,
          "estado": false,
          "motocicleta": false,
          "estadoS": '',
          "cantidadStock": 0,
          "dataCompuestos": null,
          "dataStockCompuestos": null,
          "dataRemision": null,
          "dataMotocicletas": null,
          "revisado": false,
          "back": back,
          "estadoArticulo":''
        })
      },
      agregarArticulo(data, val){
        this.Traslado.fila.articulo_id = data.articulo.id;
        this.Traslado.fila.cod         = data.articulo.codigo_sistema;
        this.Traslado.fila.articulo    = data.articulo.nombre_articulo +' '+data.articulo.descripcion_corta;
        if (val === 1) {
          this.Traslado.fila.cantidadStock = data.stock_reingreso;
          this.Traslado.fila.estadoS = 'Reingreso';
        }else if (val === 2) {
          this.Traslado.fila.cantidadStock = data.stock_actual;
          this.Traslado.fila.estadoS = 'Nuevo';
        }else if (val === 3){
          this.Traslado.fila.cantidadStock = data.stock_consignado;
          this.Traslado.fila.estadoS = 'Consignado';
        }
        if (val === 1 || val === 3)
          this.Traslado.fila.remision = 1;
        else
          this.Traslado.fila.remision = 0;

        if (data.articulo.is_motocicleta === 1){
          this.Traslado.fila.remision = 1;
          this.Traslado.fila.motocicleta = true
        }else{
          this.Traslado.fila.motocicleta = false
        }
        this.Traslado.fila.compuesto        = data.articulo.is_compuesto;
        this.Traslado.fila.dataCompuestos   = data.articulo.articulo_compuestos;
        this.Traslado.fila.dataRemision     = data.articulo.remision_articulos;
        this.Traslado.dialogo               = false
      },
      cargarInventario2(){
        this.Loads.inventario = true;
        this.Inventario = [];
        this.$axios.get('inventario_sucursal/'+this.Traslado.sucursalOrigen,{
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Inventario = res.data.inventario;
            this.Loads.inventario = false;
          }
        })
      },
      cargarInventario(){
        this.Loads.inventario = true;
        this.Inventario = [];
        this.Traslado.articulos = [
          {articulo_id:'', articulo:'', observacion: '', compuestos: [],cantidad: 0, data: null, cod:'', back: false,
            remision: 0, compuesto: 0, fila:1, estado:false, motocicleta:
                false, estadoS: '', cantidadStock: 0, estadoArticulo: ''}
        ]
        this.$axios.get('inventario_sucursal/'+this.Traslado.sucursalOrigen,{
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Inventario = res.data.inventario;
            this.Loads.inventario = false;
          }
        })
      },
      cargarMotivos(){
        this.$axios.get('motivos_traslados',{
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Motivos.data = res.data.motivos;
            this.Loads.motivos = false
          }
        })
      },
      cargarSucursales(){
        this.$axios.get('/sucursales',{
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Sucursales = res.data.suc
          this.Loads.sucursales = false
        })
      },
      removeFila(fila){
        if (this.Traslado.articulos.length < 2){
          alert("No puedes eliminar esta fila")
        }else{
          this.Traslado.articulos.splice((fila - 1), 1)
          for (let item in this.Traslado.articulos){
            let back = item % 2 == 0 ? true : false;
            this.Traslado.articulos[item].fila = parseInt(item) + parseInt(1);
            this.Traslado.articulos[item].back = back;
          }
        }
      },
      registrarMotivos(){
        if (this.$refs.FormNuevoMotivoTraslado.validate()){
          this.$store.commit('valorDialogo', false);
          this.$store.commit('valorDialogo2', false);
          this.$store.commit('activarOverlay', true);
          this.Motivos.dialogo = false;
          this.$axios.post('motivos_traslados',{nombre: this.Motivos.motivo},{
            headers:{
              'Authorization': 'Bearer ' + this.$store.state.token,
            }
          }).then((res)=>{
            this.cargarMotivos();
            if (res.status === 200){
              this.$store.commit('valorDialogo', true)
              this.$store.commit('valorDialogo2', true)
              Swal.fire(
                  'Registro Exitoso',
                  `Se registro exitosamente el motivo de traslado ${this.Motivos.motivo}.`,
                  'success'
              );
              this.Motivos.motivo = '';
              this.$store.commit('activarOverlay', false);
            }
          })
        }
      },
      verificarArticulosTraslados(){
        if (this.$refs.FormVerificarIngresoArticuloTraslado.validate()) {
          this.Traslado.fila = null;
          this.$store.commit('cambiarVista', 2);
        }
      },
      verificarCantidad(data){
        if (data.cantidad > data.cantidadStock){
          Swal.fire(
            'Error',
            `Se ha excedido la cantidad de stock actual. Elige un valor igual o menor a ${data.cantidadStock}`,
            'error'
          );
          data.cantidad = data.cantidadStock;
        }
      }
    },
  }
</script>

<style scoped>
  .bordes{
    border: solid #000 1px;
  }
  .rowsTable{
    cursor: pointer;
  }
  #side{
    opacity: 0.8;
  }
</style>
