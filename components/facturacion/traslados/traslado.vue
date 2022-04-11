<template>
    <div>
      <v-row>
        <v-col md="3" cols="4">
          <v-hover v-slot:default="{ hover }" close-delay="100">
            <v-card color="blue-grey lighten-3" dark height="90px"
                    :elevation="hover ? 16 : 2" class="pl-2 pr-2 pt-2 pb-2 rowsTable">
              <h4 class="text-center">Sucursal de Origen</h4>
              <h6 class="text-center">{{Traslado.sucursal.nombre}}</h6>
            </v-card>
          </v-hover>
        </v-col>
        <v-col md="3" cols="4">
          <v-hover v-slot:default="{ hover }" close-delay="100">
            <v-card color="blue-grey lighten-3" dark height="90px"
                    class="pl-2 pr-2 pt-2 pb-2  rowsTable" :elevation="hover ? 16 : 2">
              <h4 class="text-center">Sucursal de Destino</h4>
              <h6 class="text-center">{{Traslado.destino.nombre}}</h6>
            </v-card>
          </v-hover>
        </v-col>
        <v-col md="3" cols="4">
          <v-hover v-slot:default="{ hover }" close-delay="100">
            <v-card color="blue-grey lighten-3" dark height="90px"
                    class="pl-2 pr-2 pt-2 pb-2  rowsTable" :elevation="hover ? 16 : 2">
              <h4 class="text-center">Solicitado por:</h4>
              <h6 class="text-center">{{Traslado.user.usuario}}</h6>
              <h6 class="text-center">{{Traslado.fecha_creado.split('-')[2]}}/{{Traslado.fecha_creado.split('-')[1]}}/{{Traslado.fecha_creado.split('-')[0]}}</h6>
            </v-card>
          </v-hover>
        </v-col>
        <v-col md="3" cols="12">
          <v-hover v-slot:default="{ hover }" close-delay="100">
            <v-card color="blue-grey lighten-3" dark height="90px"
                    class="pl-2 pr-2 pt-2 pb-2  rowsTable" :elevation="hover ? 16 : 2">
              <h4 class="text-center">Código</h4>
              <h6 class="text-center">{{Traslado.codigo}}</h6>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      <small>Observación:</small>{{Traslado.observacion}}
      <v-divider></v-divider>
      <v-row>
        <v-col cols="3">
          <strong>Detalles de Transferencia</strong>
        </v-col>
        <v-col cols="9" class="d-flex justify-end">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-if="Traslado.estado_remision === 4" class="ma-1" dark small
                     color="orange" v-on="on" v-bind="attrs" @click="$store.commit('valorDialogo', true)">
                Decidir sobre transferencia
              </v-btn>
            </template>
            <span>Aceptar o Rechzar la Transferencia</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="ma-1" dark fab x-small @click="verDocumento"
                     color="red" v-on="on" v-bind="attrs">
                <v-icon>fa fa-file-pdf</v-icon>
              </v-btn>
            </template>
            <span>Ver Documento de la Transferencia</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-container>
        <v-row>
          <v-col cols="7">Detalle</v-col>
          <v-col cols="1" class="text-center">Cant.</v-col>
          <v-col cols="1" class="text-center">Estado</v-col>
          <v-col cols="1" class="text-center">Remisión</v-col>
          <v-col cols="1" class="text-center">Compue.</v-col>
          <v-col cols="1" class="text-center">Vehículo</v-col>
        </v-row>
      </v-container>
      <v-expansion-panels>
        <v-expansion-panel :class="{'grey  lighten-2': i%2 === 0,'grey lighten-4': i%2 !== 0}"
          v-for="(item,i) in Traslado.cuerpo_transferencias" :key="i" class="rowsTable">
          <v-expansion-panel-header>
            <v-row>
              <v-col cols="7">
                <h5>{{item.articulo.nombre_articulo}}</h5>
              </v-col>
              <v-col cols="1" class="text-center">
                <h5>{{item.cantidad}}</h5>
              </v-col>
              <v-col cols="1" class="text-center">
                <h5>{{item.estado_articulo}}</h5>
              </v-col>
              <v-col cols="1" class="text-center">
                <v-icon v-if="item.is_remision === 1" dark x-small color="success">fa fa-check</v-icon>
                <v-icon v-else dark x-small color="error">fa fa-times</v-icon>
              </v-col>
              <v-col cols="1" class="text-center">
                <v-icon v-if="item.is_componente === 1" dark x-small color="success">fa fa-check</v-icon>
                <v-icon v-else dark x-small color="error">fa fa-times</v-icon>
              </v-col>
              <v-col cols="1" class="text-center">
                <v-icon v-if="item.articulo.is_motocicleta === 1" dark x-small color="success">fa fa-check</v-icon>
                <v-icon v-else dark x-small color="error">fa fa-times</v-icon>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <hr>
            <v-row>
              <v-col v-if="item.is_componente === 1">
                <small>*Componentes solicitados para enviar:</small>
                <v-simple-table dense fixed-header height="180px">
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th>Detalle</th>
                      <th>Cantidad</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="componente in item.componentes_transferencias">
                      <td>{{componente.articulo_compuesto.cantidad}} {{componente.articulo_compuesto.detalle}} <small v-if="componente.articulo_compuesto.detalle_cantidad">({{componente.articulo_compuesto.detalle_cantidad}} unidades)</small></td>
                      <td class="text-center">{{componente.cantidad}}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col v-if="item.is_remision === 1">
                <small>*Artículos en remisión a enviar:</small>
                <v-simple-table dense fixed-header height="180px">
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th>Cód. Sístema</th>
                      <th>Seríe</th>
                      <th>Color</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="remision in item.remision_art_traslado">
                      <td>{{remision.remision_articulo.serie_sistema}}</td>
                      <td>{{remision.remision_articulo.serie_fabricante}}</td>
                      <td>{{remision.remision_articulo.color}}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col v-if="item.articulo.is_motocicleta === 1">
                <small>*Motocicletas:</small>
                <v-simple-table fixed-header height="180px" dense>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th>Chasís</th>
                      <th>Motor</th>
                      <th>Año</th>
                      <th>CC</th>
                      <th>Placa</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="moto in item.remision_art_traslado">
                      <td>{{moto.remision_articulo.motocicleta.chasis}}</td>
                      <td>{{moto.remision_articulo.motocicleta.motor}}</td>
                      <td>{{moto.remision_articulo.motocicleta.anio}}</td>
                      <td>{{moto.remision_articulo.motocicleta.cilindraje}}</td>
                      <td>{{moto.remision_articulo.motocicleta.placa}}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <br>

      <v-dialog v-model="dialogo" width="30%">
        <v-card class="pl-5 pr-5">
          <br>
          <h3 class="text-center">Decisión de Transferencia</h3>
          <br>
          <hr>
          <v-card flat :disabled="!PERMISOS.includes(85)">
            <v-card-actions class="d-flex align-center justify-center">
              <v-btn class="ma-2" color="success" dark small @click="$store.commit('valorDialogo2', true)">Aceptar Transferencia</v-btn>
              <v-btn class="ma-2" color="red" dark small @click="declinarTraslado">Declinar Transferencia</v-btn>
            </v-card-actions>
          </v-card>
          <hr>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" dark small @click="$store.commit('valorDialogo', false)">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogo2" width="100%">
        <v-card class="pl-5 pr-5">
          <tramitar_transferencia :articulos_data="articulos"
                                  :sucursal_data="Traslado.sucursal.id"
                                  :tipo="2"
                                  :cuerpos_data="cuerpo_data"
                                  :traslado_id="TrasladoId"
                                  :motivo_data="Traslado.motivo_traslado.id"
                                  :destino_data="Traslado.destino.id"/>
          <v-card-actions class="d-flex justify-end">
            <v-btn dark v-if="vista < 3" color="orange" small @click="$store.commit('valorDialogo2', false);">Cancelar</v-btn>
            <v-btn dark v-if="vista === 4" color="orange" small @click="$router.replace({path:'/inventario/traslados/remisiones'})">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar">
        Ha ocurrido un error al cargar el documento
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </div>
</template>

<script>
import Vue from "vue";
  import nuevo from "./nuevo";
  import {ipcRenderer} from "electron";
  export default {
    props:{Traslado: Object},
    components:{tramitar_transferencia:nuevo},
    data(){
      return{
        cuerpo_data: [],
        articulos:[],
        snackbar: false,
        dialogoFecha: false,
        dialogoAceptar: false,
        dialogoDecision: false,
        Remision:{
          envio: '',
          recibe: '',
          transporte: '',
          fecha: ''
        },
        Col:{
          cols: [],
          envio: [],
          recibir: []
        },
        TrasladoId: 0
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Transferencias > '+this.Traslado.codigo);
      this.$store.commit('valorDialogo2', false);
      this.$store.commit('valorDialogo', false);
      this.TrasladoId = this.Traslado.id;
      let fila = 1;
      let back = false;
      let remision = 0, remisiones = [];
      let compuesto = 0, componentes = [];
      let moto = false, cantidad = '';
      this.Traslado.cuerpo_transferencias.forEach( (i) => {
        fila = parseInt(fila) + parseInt(this.articulos.length);
        back = fila % 2 == 0 ? true : false;
        cantidad = i.cantidad;
        if (i.is_remision === 1){
          remision = 1;
          remisiones = i.articulo.remision_articulos;
        }
        if (i.is_componente === 1 ){
          compuesto = 1;
          componentes = i.articulo.articulo_compuestos;
        }
        if (i.articulo.is_motocicleta === 1)
          moto = true;
        this.articulos.push(
          {
            "articulo_id":i.articulo_id,
            "articulo":i.articulo.nombre_articulo +' '+i.articulo.descripcion_corta,
            "observacion": '',
            "compuestos":[],
            "cantidad": cantidad,
            "cod": i.articulo.codigo_sistema,
            "remision": remision,
            "compuesto": compuesto,
            "fila": fila,
            "estado": false,
            "motocicleta": moto,
            "estadoS": i.estado_articulo,
            "cantidadStock": 0,
            "dataCompuestos": componentes,
            "dataStockCompuestos": null,
            "dataRemision": remisiones,
            "dataMotocicletas": null,
            "revisado": false,
            "back": back

          })

        this.cuerpo_data.push(
          {
            "transferencia": i.transferencia_articulo_id,
            "cuerpo":        i.id
          }
        )
      });
    },
    name: "traslado_trans",
    methods:{
      cargarColaboradores(){
        this.$axios.get('colaboradores',{
          headers:{
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        }).then((res)=>{
          res.data.colaboradores.forEach( (i) => {
            this.Col.cols.push({
              "id": i.col,
              "nombre": i.nombres+' '+i.apellidos
            })
          })
        })
      },
      cargarColaboradorEnvio(){
        this.$axios.get('colaboradores_suc/'+this.Traslado.sucursal.id,{
          headers:{
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        }).then((res)=>{
          res.data.col.forEach( (i) =>{
            this.Col.envio.push({
              "id": i.id,
              "nombre": i.nombres+' '+i.apellidos
            })
          })
        })
      },
      cargarColaboradorRecibir(){
        this.$axios.get('colaboradores_suc/'+this.Traslado.destino.id,{
          headers:{
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        }).then((res)=>{
          res.data.col.forEach( (i) =>{
            this.Col.recibir.push({
              "id": i.id,
              "nombre": i.nombres+' '+i.apellidos
            })
          })
        })
      },
      declinarTraslado(){
        this.dialogo = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.put('declinar_traslado/'+this.Traslado.id)
        .then((res)=>{
          Vue.$toast.open({
            message: 'Se ha rechazado la transferencia exitosamente.',
            type: 'success',
            position: 'bottom-left',
            duration: 4000
          });
          this.$store.commit('activarOverlay', false);
        })
      },
      verDocumento(){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('leer_documento/',{
          ubicacion: this.Traslado.file
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url)
            this.$store.commit('activarOverlay', false);
          }
        }).catch((error)=>{
          this.snackbar = true;
          this.$store.commit('activarOverlay', false);
        })
      }
    },
    computed:{
      PERMISOS(){
        let permisos = this.$store.state.permisosUser.split(',');
        let per = [];
        if (permisos.length > 1){
          permisos.forEach((item)=>{
            per.push(parseInt(item))
          })
          return per;
        }else
          return [];
      },
      dialogo:{
        get: function () {
          return this.$store.state.dialogo;
        },
        set: function (val) {
          this.$store.commit('valorDialogo', val)
        }
      },
      dialogo2:{
        get: function () {
          return this.$store.state.dialogo2;
        },
        set: function (val) {
          this.$store.commit('valorDialogo', val)
        }
      },
      vista(){
        return this.$store.state.vista;
      }
    },
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
