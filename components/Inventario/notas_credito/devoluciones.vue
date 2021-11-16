<template>
  <div>
    <v-stepper v-model="vista">
      <v-stepper-header>
        <v-stepper-step :complete="vista > 1" step="1">Datos de la Devolución</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="vista > 2" step="2">Seleccionar Orden de Entrada</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step  step="3">Revisión de Artículos</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card height="100%" width="100%">
            <v-row no-gutters>
              <v-col class="d-flex justify-center">
                <v-card width="30%">
                  <v-card-title>Datos de la Devolución</v-card-title>
                  <hr>
                  <v-form class="pl-2 pr-2" ref="FormDatosDevolucionProveedor">
                    <v-text-field label="Sucursal de Devolución" disabled v-model="sucursal"></v-text-field>
                    <v-text-field label="Usuario Responsanle" disabled v-model="user"></v-text-field>
                    <v-textarea label="Razón de la Devolución"
                                v-model="Devolucion.razon"
                                :rules="[rules.razon.req, rules.razon.min, rules.razon.max]"
                                counter></v-textarea>
                  </v-form>
                </v-card>
              </v-col>
            </v-row>
            <hr>
            <v-row>
              <v-col>
                <v-card-actions class="d-flex justify-end">
                  <v-btn color="success" @click="validarRazon" dark small>Seleccionar Orden</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card height="100%" width="100%">
            <b-table hover
                     caption-top
                     :fields="fields"
                     small
                     class="rowsTable"
                     :items="data"
                     responsive>
              <template v-slot:table-caption>Ordenes disponibles para devoluciones</template>
              <template v-slot:head(codigo)="scope"><div class="text-nowrap">Código</div></template>
              <template v-slot:head(tipo_entrada_articulo.nombre)="scope">
                <div class="text-nowrap">Tipo de Entrada</div></template>
              <template v-slot:head(sucursal.nombre)="scope">
                <div class="text-nowrap">Sucursal de Entrada</div></template>
              <template v-slot:head(user.usuario)="scope">
                <div class="text-nowrap">Usuario Responsable</div></template>
              <template v-slot:head(fecha_creacion)="scope">
                <div class="text-nowrap">Fecha de Creación</div></template>
              <template v-slot:head(file)="scope">
                <div class="text-nowrap">Documento</div></template>
              <template v-slot:head(observacion)="scope">
                <div class="text-nowrap">Observación</div></template>
              <template v-slot:cell(sucursal.abreviatura)="scope">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <span v-on="on" v-bind="attrs">{{scope.item.sucursal.abreviatura}}</span>
                  </template>
                  <span>{{scope.item.sucursal.nombre}}</span>
                </v-tooltip>
              </template>
              <template v-slot:cell(file)="scope">
                <div class="d-flex justify-center">
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" fab color="red" @click="verDocumento(scope.item.file)"
                             x-small dark><v-icon>fa fa-file-pdf</v-icon></v-btn>
                    </template>
                    <span>Documento de la orden de entrada</span>
                  </v-tooltip>
                </div>
              </template>
              <template v-slot:cell(observacion)="scope">
                <div class="d-flex justify-center">
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <v-icon dark  v-on="on" v-bind="attrs" color="success">fa fa-comments</v-icon>
                    </template>
                    <span v-if="scope.item.observacion">{{scope.item.observacion}}</span>
                    <span v-else>Sin observaciones</span>
                  </v-tooltip>
                </div>
              </template>
              <template v-slot:cell(estado)="scope">
                <div>
                  <v-chip dark x-small v-if="scope.item.estado === 1" color="success">Registrado</v-chip>
                  <v-chip dark x-small v-else color="red">Pendiente</v-chip>
                </div>
              </template>
              <template v-slot:cell(id)="scope">
                <div>
                  <b-radio name="item_radio" @change="capturarOrden(scope.item)"></b-radio>
                </div>
              </template>
            </b-table>
            <hr>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="orange" small @click="vista = 1" dark>Volver</v-btn>
              <v-btn color="success" small @click="verificarOrden" dark>Verificar Datos</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card>
            <strong>Seleccionar los artículos que estarán en la devolución</strong>
            <b-table hover
                     caption-top
                     :fields="fields2"
                     small
                     class="rowsTable"
                     :items="Devolucion.Orden"
                     responsive>
              <template v-slot:table-caption>Artículos disponibles para hacer devolución</template>
              <template v-slot:head(cod)="scope"><div class="text-nowrap">Código</div></template>
              <template v-slot:head(cantidad_salida)="scope"><div class="d-flex justify-center">Salida</div></template>
              <template v-slot:head(show_compuestos)="scope"><div class="d-flex justify-center">
                <v-icon dark color="success">fa fa-eye</v-icon>
              </div></template>
              <template v-slot:head(id)="scope"><div class="text-nowrap">Seleccionar</div></template>
              <template v-slot:head(cantidad)="scope"><div class="text-nowrap">Cantidad Ingresada</div></template>
              <template v-slot:head(is_compuesto)="scope"><div class="text-nowrap">Compuesto</div></template>
              <template v-slot:cell(is_compuesto)="scope">
                <div class="d-flex justify-center">
                  <v-icon v-if="scope.item.is_compuesto === 1" color="success" dark>fa fa-check</v-icon>
                  <v-icon v-else color="red" dark>fa fa-times</v-icon>
                </div>
              </template>
              <template v-slot:cell(cantidad)="scope">
                <div class="d-flex justify-center">
                  {{scope.item.cantidad}}
                </div>
              </template>
              <template v-slot:cell(id)="scope">
                <div class="d-flex justify-center">
                  <b-checkbox v-model="scope.item.seleccionado" @change="cancelarRevisado(scope.item)"></b-checkbox>
                </div>
              </template>
              <template v-slot:cell(revisado)="scope">
                <div class="d-flex justify-center">
                  <b-checkbox v-model="scope.item.revisado" :disabled="!scope.item.seleccionado"></b-checkbox>
                </div>
              </template>
              <template v-slot:cell(cantidad_salida)="scope" >
                <div class="d-flex justify-center">
                  <b-input type="number" style="width: 50%" v-model="scope.item.cantidad_salida"
                           @change="verificarCantidad(scope.item.cantidad, scope.item.cantidad_salida, scope.item)"
                           @keyup="verificarCantidad(scope.item.cantidad, scope.item.cantidad_salida, scope.item)"
                           :disabled="!scope.item.seleccionado"  size="sm"></b-input>
                </div>
              </template>
              <template v-slot:cell(show_compuestos)="row">
                <div class="d-flex justify-center">
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn icon @click="row.toggleDetails" v-on="on" v-bind="attrs"
                             color="gray" :disabled="!row.item.seleccionado"><v-icon>fa fa-sitemap</v-icon></v-btn>
                    </template>
                    <span>Ver componentes de este artículo</span>
                  </v-tooltip>
                </div>
              </template>

              <template v-slot:row-details="row">
                <b-card>
                  <b-card-header>
                    <strong>Componentes: </strong>
                  </b-card-header>
                  <b-list-group>
                    <b-list-group-item v-for="item in row.item.compuestos" style="font-size: 15px; padding: 2px !important;"
                                       button>
                      <v-row no-gutters>
                        <v-col cols="4">{{item.detalle}}</v-col>
                        <v-col cols="1">
                          {{item.cantidad_entrada}}
                        </v-col>
                        <v-col cols="1">
                          <b-input type="number"
                                   v-model="item.cantidad_salida"
                                   @change="verificarCantidad(item.cantidad_entrada, item.cantidad_salida, item)"
                                   @keyup="verificarCantidad(item.cantidad_entrada, item.cantidad_salida, item)"
                                   size="sm" ></b-input>
                          <small style="font-size: 9px">Cantidad de Salida</small>
                        </v-col>
                      </v-row>
                    </b-list-group-item>
                  </b-list-group>
                </b-card>
              </template>

            </b-table>
            <hr>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="orange" small @click="vista = 2" dark>Volver</v-btn>
              <v-btn color="success" small dark @click="verificarRevisiones">Crear Devolución</v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>

      <v-dialog v-model="Devolucion.dialogoEnviar" width="30%">
        <v-card>
          <v-card-title class="grey lighten-4">Registrar Devolución</v-card-title>
          <div class="pl-3 pr-3">
            <v-card-text>Esta devolución bajara el stock de los artículos y componentes seleccionados de la
              sucursal {{sucursal}}. Al registrar
            la devolución no hay manera de cancelarla, por favor verífique bien los datos.</v-card-text>
          </div>
          <hr>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="warning" @click="Devolucion.dialogoEnviar = false" dark small>Cerrar</v-btn>
            <v-btn color="success" dark small @click="registrarDevolucion">Registrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-stepper>
  </div>
</template>

<script>
  import Swal from "sweetalert2";
  import {ipcRenderer} from "electron";
  export default {
    props:{data:Array},
    name: "devoluciones",
    data(){
      return{
        vista: 1,
        alert: true,
        Devolucion: {
          razon: '',
          Orden: [],
          Envio: [],
          dialogoEnviar: false,
          orden_id: null
        },
        rules: {
          razon: {
            max: v => v.length < 255 || 'No puede ser mayor a 255 carácteres',
            min: v => v.length > 20 || 'Tiene que ser mayor a 20 carácteres',
            req: v => !!v || 'Campo requerido',
          },
        },
        fields: [
          { key: 'id', label:'', stickyColumn: true, isRowHeader: true, variant: 'light'}, 'codigo',
          'tipo_entrada_articulo.nombre', 'proveedor.nombre', 'user.usuario', 'sucursal.abreviatura',
          'fecha_creacion', 'estado', 'file', 'observacion'
        ],
        fields2:[
          { key: 'id', stickyColumn: true, isRowHeader: true, variant: 'light'}, 'articulo',
          'cod', 'cantidad','cantidad_salida','is_compuesto','revisado', 'show_compuestos'
        ],
      }
    },
    computed:{
      user(){
        return this.$store.state.usuario
      },
      sucursal(){
        return this.$store.state.sucursal_id;
      },
      suc(){
        return this.$store.state.sucursal;
      }
    },
    methods:{
      cancelarRevisado(data){
        data.seleccionado = !data.seleccionado;
        if (data.seleccionado === false){
          data.revisado = false;
        }
      },
      capturarOrden(data){
        this.Devolucion.Orden = [];
        let compuestos = [];
        data.cuerpo_orden_entradas.forEach( (i) => {
          compuestos = [];
          i.orden_cuerpo_compuestos.forEach((a)=>{
            compuestos.push({
              "id":                   i.id,
              "articulo_compuesto_id":a.articulo_compuesto_id,
              "cantidad_entrada":     a.cantidad,
              "detalle":              a.articulo_compuesto.cantidad+' - '+a.articulo_compuesto.detalle,
              "cantidad_salida":      0
            })
          });
          this.Devolucion.orden_id = i.orden_entrada_id;
          this.Devolucion.Orden.push({
            "id":              i.id,
            "articulo_id":     i.articulo_id,
            "articulo":        i.articulo.nombre_articulo+' '+i.articulo.descripcion_corta,
            "cod":             i.articulo.codigo_sistema,
            "cantidad":        i.cantidad,
            "is_compuesto":   i.is_compuesto,
            "revisado":        false,
            "seleccionado":    false,
            "cantidad_salida": 0,
            "compuestos":      compuestos,
          })
          console.log(i)
        })
      },
      registrarDevolucion(){
        let cuerpo = JSON.stringify(this.Devolucion.Envio);
        this.$store.commit('activarOverlay', true);
        this.Devolucion.dialogoEnviar = false;
        this.$store.commit('valorDialogo', false);
        this.$axios.post('devoluciones_proveedor',{
          orden_entrada_id: this.Devolucion.orden_id,
          cuerpo:           cuerpo,
          razon:            this.Devolucion.razon,
          sucursal:         this.suc
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.vista = 1;
          this.$store.commit('activarOverlay', false);
          this.$store.commit('cargarDevoluciones');
          Swal.fire(
              'Registro Exitoso',
              `Se registro exitosamente la devolución.`,
              'success'
          );
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        })
      },
      validarRazon(){
        if (this.$refs.FormDatosDevolucionProveedor.validate())
          this.vista = 2
      },
      verDocumento(dir){
        this.$store.commit('activarOverlay', true);
        this.$store.commit('valorDialogo', false);
        this.$axios.post('leer_documento/',{
          ubicacion: dir
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url);
            this.$store.commit('activarOverlay', false);
            this.$store.commit('valorDialogo', true);
          }
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('valorDialogo', true);
        })
      },
      verificarCantidad(min, val, data){
        if (val > min){
          data.cantidad_salida = 0;
          Swal.fire(
              'Error',
              `Haz sobrepasado la cantidad permitida de ${min}.`,
              'warning'
          );
        }
      },
      verificarOrden(){
        if (this.Devolucion.Orden)
          this.vista = 3
      },
      verificarRevisiones(){
        let contador = 0;
        let bandera  = 0;
        this.Devolucion.Envio = [];
        this.Devolucion.Orden.forEach( (i) => {
          if (i.seleccionado === true){
            contador++;
            if (i.revisado === true){
              bandera++;
              this.Devolucion.Envio.push(i);
            }
          }
        });
        if (contador === bandera){
          this.Devolucion.dialogoEnviar = true;
        }else {
          this.Devolucion.dialogoEnviar = false;
          Swal.fire(
            'Error',
            `Falta la revisión de algún artículo.`,
            'warning'
          );
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
