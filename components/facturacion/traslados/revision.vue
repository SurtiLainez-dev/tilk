<template>
    <v-card>
      <div class="pl-2 pr-2 pb-3">
        <v-row>
          <v-col cols="9" class="d-flex justify-center"><small><strong>Datos del Artículo</strong></small></v-col>
          <v-col cols="1" class="d-flex justify-center"><small><strong>Estado</strong></small></v-col>
          <v-col cols="1" class="d-flex justify-center"><small><strong>Cantidad</strong></small></v-col>
          <v-col cols="1" class="d-flex justify-center"><small><strong>Revisado</strong></small></v-col>
        </v-row>
        <hr>
        <div v-for="(item, index) in traslado.articulos">
          <div v-if="page === (index + 1)">
            <v-row>
              <v-col cols="9" class="d-flex align-center"><small><strong>{{item.articulo}} [Código del Sístema: {{item.cod}}]</strong></small></v-col>
              <v-col cols="1" class="d-flex justify-center align-center"><small>{{item.estadoS}}</small></v-col>
              <v-col cols="1" class="d-flex justify-center align-center"><small>{{item.cantidad}}</small></v-col>
              <v-col cols="1" class="d-flex justify-center align-center">
                <v-checkbox dense v-model="item.revisado" disabled></v-checkbox>
              </v-col>
            </v-row>
            <hr>
            <small><strong>Datos de la transferencia de este artículo: </strong></small>
            <v-expansion-panels focusable hover>
              <v-expansion-panel v-if="item.compuesto === 1" :key="1">
                <v-expansion-panel-header>
                  Componentes del Artículo
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-simple-table dense class="rowsTable">
                    <template>
                      <thead>
                      <tr>
                        <th>Detalles del componente</th>
                        <th>Sucursal</th>
                        <th class="text-center">Stock Actual</th>
                        <th class="text-center">Stock Reingreso</th>
                        <th>Cantidad</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-if="componente.fila === item.fila" v-for="componente in dataCompuestos">
                        <td>{{componente.cantidad}} - {{componente.detalle}} <small v-if="componente.detalleCantidad">({{componente.detalleCantidad}} unidades)</small></td>
                        <td>{{componente.sucursal}}</td>
                        <td class="text-center">{{componente.stockActual}}</td>
                        <td class="text-center">{{componente.stockReingreso}}</td>
                        <td width="5%" class="text-center">
                          <v-text-field v-model="componente.cantidadEnvio"
                                        :rules="[rules.cantidad.mayor]"
                                        @keyup="verificarCantidad(item, componente)"
                                        dense>
                          </v-text-field>
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel v-if="item.remision === 1" :key="2">
                <v-expansion-panel-header>Remisiones del Artículo Disponibles</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-simple-table class="rowsTable">
                    <template>
                      <thead>
                      <tr>
                        <th>Cód. Sístema</th>
                        <th>Seríe Fabricante</th>
                        <th>Color</th>
                        <th>Estado</th>
                        <th class="text-center">Seleccionar</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-if="remision.fila === item.fila" v-for="remision in dataRemision">
                        <td>{{remision.cod_sistema}}</td>
                        <td>{{remision.cod_fabricante}}</td>
                        <td>{{remision.color}}</td>
                        <td>{{remision.estado}}</td>
                        <td class="d-flex justify-center">
                          <v-checkbox v-model="remision.seleccion"
                                      dense></v-checkbox>
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel v-if="item.motocicleta" :key="3">
                <v-expansion-panel-header>Motocicletas Disponibles</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-simple-table class="rowsTable">
                    <template>
                      <thead>
                      <tr>
                        <th>Chasis</th>
                        <th>Motor</th>
                        <th>CC</th>
                        <th>Color</th>
                        <th>Año</th>
                        <th class="text-center">Seleccionar</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr :data-moto="'moto-'+moto.fila" v-if="moto.fila === item.fila" v-for="moto in dataRemision">
                        <td>{{moto.motocicleta.chasis}}</td>
                        <td>{{moto.motocicleta.motor}}</td>
                        <td>{{moto.motocicleta.cilindraje}}</td>
                        <td>{{moto.motocicleta.color}}</td>
                        <td>{{moto.motocicleta.anio}}</td>
                        <td class="d-flex justify-center">
                          <v-checkbox v-model="moto.seleccion" disabled></v-checkbox>
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </div>
      <v-card-actions class="d-flex justify-end">
        <v-btn v-if="long === page"
               color="success"
               small
               dark
               @click="verificarEnvio"
               class="ma-2">Registrar Traslado</v-btn>
      </v-card-actions>
      <hr>
      <v-pagination :length="long" @input="verificarCambioPagina" v-model="page"></v-pagination>

      <v-dialog v-model="dialogoVerificar" width="100%">
        <v-card class="pl-10 pr-10">
          <v-row>
            <v-col cols="11">
              <v-card-title class="text-center">Verificación Final de Traslado</v-card-title>
            </v-col>
            <v-col class="d-flex justify-end align-center">
              <v-btn fab @click="dialogoVerificar = false" color="red"
                     x-small dark><v-icon>fa fa-times</v-icon></v-btn>
            </v-col>
          </v-row>
          <hr>
          <v-row>
            <v-col cols="9">Descripción</v-col>
            <v-col cols="1" class="d-flex justify-center">Estado</v-col>
            <v-col cols="1" class="d-flex justify-center">Cantidad</v-col>
            <v-col cols="1" class="d-flex justify-center">Revisado</v-col>
          </v-row>
          <v-row v-for="(item, a) in traslado.articulos" class="backF pl-3 pr-"
                 :class="{'backColor': item.back}">
            <v-col cols="9" class="d-flex  align-center"><small><strong>{{item.articulo}} [Código del Sístema: {{item.cod}}]</strong></small></v-col>
            <v-col cols="1" class="d-flex justify-center align-center"><small>{{item.estadoS}}</small></v-col>
            <v-col cols="1" class="d-flex justify-center align-center"><small>{{item.cantidad}}</small></v-col>
            <v-col cols="1" class="d-flex justify-center align-center">
              <v-checkbox disabled v-model="item.revisado"></v-checkbox>
            </v-col>
            <v-row v-if="item.compuesto === 1 || item.remision === 1">
              <v-col v-if="item.compuesto === 1">
                <v-card>
                  <v-card-title>Componentes</v-card-title>
                  <hr>
                  <v-simple-table class="rowsTable"  fixed-header height="180px">
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th>Detalle</th>
                        <th>Cant. Solicitada</th>
                        <th>Cant. a Enviar</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="componente in dataCompuestos" v-if="item.fila === componente.fila">
                        <td>{{componente.cantidad}} {{componente.detalle}} <small v-if="componente.detalleCantidad">({{componente.detalleCantidad}} unidades)</small></td>
                        <td>{{item.cantidad}}</td>
                        <td>{{componente.cantidadEnvio}}</td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </v-col>
              <v-col v-if="item.remision === 1">
                <v-card>
                  <v-card-title>Remisiónes Seleccionadas</v-card-title>
                  <hr>
                  <v-simple-table class="rowsTable" fixed-header height="180px">
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th>Cód. Sístema</th>
                        <th>Seríe</th>
                        <th>Color</th>
                        <th>Estado</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="remision in dataRemision" v-if="item.fila === remision.fila && remision.seleccion">
                        <td>{{remision.cod_sistema}}</td>
                        <td>{{remision.cod_fabricante}}</td>
                        <td>{{remision.color}}</td>
                        <td>{{remision.estado}}</td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </v-col>
              <v-col v-if="item.motocicleta">
                <v-card>
                  <v-card-title>Motocicletas Seleccionadas</v-card-title>
                  <hr>
                  <v-simple-table class="rowsTable" fixed-header height="180px">
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th>Chasis</th>
                        <th>Motor</th>
                        <th>CC</th>
                        <th>Año</th>
                        <th>Color</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="moto in dataRemision" v-if="moto.fila === item.fila && moto.seleccion">
                        <td>{{moto.motocicleta.chasis}}</td>
                        <td>{{moto.motocicleta.motor}}</td>
                        <td>{{moto.motocicleta.cilindraje}}</td>
                        <td>{{moto.motocicleta.color}}</td>
                        <td>{{moto.motocicleta.anio}}</td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </v-col>
            </v-row>
          </v-row>
          <v-card-actions class="d-flex justify-end">
            <v-btn class="ma-2"
                   color="orange"
                   small
                   @click="dialogoVerificar = false"
                   dark>Cancelar</v-btn>
            <v-btn class="ma-2" color="success" small dark @click="registrarTraslado">Registrar Traslado</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
</template>

<script>
  import Swal from 'sweetalert2'
  export default {
    props:{traslado: Object, tipo: Number, update: Array, traslado_id: Number, cuerpos: Array},
    name: "revision",
    data(){
      return{
        dialogoVerificar: false,
        page: 1,
        long: 0,
        i: 1,
        dataCompuestos:   [],
        dataRemision:     [],
        dataMotocicletas: [],
        validaciones:     [],
        rules:{
          cantidad:{
            mayor: v => v > 0 || 'Invalido'
          },
        },
        pageHistory: 0
      }
    },
    methods:{
      verificarEnvio(){
        let data = [];
        this.traslado.articulos.forEach( (i)=> {
          if (i.fila === this.page)
            data = i;
        });

        this.verificarPagina(data);

        let contador = 0;
        this.traslado.articulos.forEach( (i)=> {
          if (i.revisado)
            contador++;
        });
        if (contador === this.long)
          this.dialogoVerificar = true
      },
      verificarCambioPagina(val){
        this.traslado.articulos.forEach( (i) => {
          if (this.pageHistory === i.fila){
            if (this.verificarPagina(i)){
              this.page = val;
              this.pageHistory = this.page;
            }else{
              this.page = this.pageHistory;
            }
          }
        });
      },
      verificarPagina(data){
        let contadorRemision = 0;
        if(data.remision === 1){
          this.dataRemision.forEach( (i) =>{
            if (i.fila === data.fila){
              if (i.seleccion){
                contadorRemision++;
              }
            }
          });
          let c = parseInt(data.cantidad);
          if (c === contadorRemision){
            data.revisado = true;
          }else{
            Swal.fire(
              'Error',
              `Tienes que seleccionar ${data.cantidad}  artículo(s) en remisión ya que este artículo al
                    que le estas haciendo traslado lo seleccionaste de reingreso o es una motocicleta`,
              'error'
            );
            data.revisado = false;
          }
          return data.revisado;
        }else{
          data.revisado = true;
          return true;
        }
      },
      verificarCantidad(data, item){
        if (item.cantidadEnvio > data.cantidad){
          Swal.fire(
            'Error',
            `No puedes seleccionar una cantidad mayor del componente a la seleccionada por la cantidad artículo que se va a mover que es  ${data.cantidad}`,
            'error'
          );
          item.cantidadEnvio = data.cantidad
        }
      },
      registrarTraslado(){
        this.$store.commit('valorDialogo', false);
        this.$store.commit('valorDialogo2', false);
        this.$store.commit('activarOverlay', true);
        if (this.tipo === 1){
          this.dialogoVerificar = false;
          this.$axios.post('traslados',{
            sucursal_origen:  this.traslado.sucursalOrigen,
            motivo:           this.traslado.motivoTraslado,
            sucursal_destino: this.traslado.sucursalDestino,
            observacion:      this.traslado.observacion,
            articulos:        this.traslado.articulos,
            componentes:      this.dataCompuestos,
            remision:         this.dataRemision,
            per:              1
          },{
            headers:{
              'Authorization': 'Bearer ' + this.$store.state.token,
            }
          }).then((res)=>{
            this.$store.commit('activarOverlay', false);
            this.$store.commit('asiganrRemision', [res.data.traslado, res.data.direccion]);
            this.$store.commit('cambiarVista', 3);
            this.$store.commit('valorDialogo', true);
            this.$store.commit('valorDialogo2', true);
            Swal.fire(
              'Creado Exitosamente',
              `Se ha creó exitosamente el traslado, el siguiente paso es crear una remisión de la trasnferencia.`,
              'success'
            );
          })
        }else{
          this.$axios.post('save_traslados_pendientes',{
            sucursal_origen:  this.traslado.sucursalOrigen,
            motivo:           this.traslado.motivoTraslado,
            sucursal_destino: this.traslado.sucursalDestino,
            observacion:      this.traslado.observacion,
            articulos:        this.traslado.articulos,
            componentes:      this.dataCompuestos,
            remision:         this.dataRemision,
            per:              1,
            trlasdado:        this.traslado_id,
            cuerpos:          this.cuerpos
          },{
            headers:{
              'Authorization': 'Bearer ' + this.$store.state.token,
            }
          }).then((res)=>{
            this.$store.commit('activarOverlay', false);
            this.$store.commit('asiganrRemision', [res.data.traslado, res.data.direccion]);
            this.$store.commit('valorDialogo', true);
            this.$store.commit('valorDialogo2', true);
            this.$store.commit('cambiarVista', 3);
            Swal.fire(
              'Registro Exitoso',
              `Se ha aceptado exitosamente el traslado, el siguiente paso es crear una remisión de la trasnferencia.`,
              'success'
            );
          })
        }
      }
    },
    created() {
      this.pageHistory = this.page;
      let sucursal_origen = this.traslado.sucursalOrigen;
      this.traslado.articulos.forEach( (i)=>{
        if (i.compuesto === 0 && i.remision === 0)
          i.revisado = true;
        this.long++;
        i.dataCompuestos.forEach( (a) => {
          a.inventario_compuestos.forEach( (e) => {
            if (e.sucursal_id === sucursal_origen){
              this.dataCompuestos.push({
                "articulo":        e.articulo_compuesto_id,
                "fila":            i.fila,
                "detalle":         a.detalle,
                "detalleCantidad": a.detalle_cantidad,
                "cantidad":        a.cantidad,
                "sucursal":        e.sucursal.nombre,
                "stockActual":     e.stock_nuevo,
                "stockReingreso":  e.stock_reingreso,
                "cantidadEnvio":   0
              })
            }
          })
        });
        if (i.remision == 1){
          i.dataRemision.forEach( (o) =>{
            console.log(o)
            if (o.sucursal_id === sucursal_origen){
              this.dataRemision.push({
                "fila":           i.fila,
                "cod_sistema":    o.serie_sistema,
                "cod_fabricante": o.serie_fabricante,
                "color":          o.color,
                "estado":         o.estado_articulo.nombre,
                "seleccion":      false,
                "motocicleta":    o.motocicleta,
                "id":             o.id
              });
              this.dataMotocicletas.push({
                "fila":      i.fila,
                "moto":      o.motocicleta,
                "seleccion": false
              })
            }
          });
        }
      })
    }
  }
</script>

<style scoped>
  .bordesB{
    border-bottom: solid #000 1px;
  }
  .rowsTable{
    cursor: pointer;
  }
  .backColor{
    background-color: #EAEDEF;
  }
  .backF{
    cursor: pointer;
  }
  .backF:hover{
    background-color: #DDE0E2;
  }
</style>
