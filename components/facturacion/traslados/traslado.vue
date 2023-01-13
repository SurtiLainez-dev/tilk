<template>
    <v-card flat>
      <table>
        <thead>
        <tr>
          <th colspan="5">Detalle de la Transferencia</th>
        </tr>
        </thead>
        <thead>
        <tr>
          <th>Sucursal de Origen</th>
          <th>Sucursal de Destino</th>
          <th>Solicitado por</th>
          <th>Fecha Solicitado</th>
          <th>Referencia</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{Traslado.sucursal.nombre}}</td>
          <td>{{Traslado.destino.nombre}}</td>
          <td>{{Traslado.user.usuario}}</td>
          <td>{{Traslado.fecha_creado.split('-')[2]}}/{{Traslado.fecha_creado.split('-')[1]}}/{{Traslado.fecha_creado.split('-')[0]}}</td>
          <td>{{Traslado.codigo}}</td>
        </tr>
        </tbody>
        <thead>
        <tr>
          <th colspan="5">Observación</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td colspan="5">{{Traslado.observacion}}</td>
        </tr>
        </tbody>
      </table>

      <table>
        <thead>
        <tr>
          <th style="width: 60%">
            <v-row no-gutters>
              <v-col cols="6">Detalle de los Artículos</v-col>
              <v-col cols="6" class="d-flex justify-end">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-if="Traslado.estado_remision === 4" class="ma-1" dark small width="20" height="20"
                           color="orange" v-on="on" v-bind="attrs" @click="$store.commit('valorDialogo', true)">
                      Decidir sobre transferencia
                    </v-btn>
                  </template>
                  <span>Aceptar o Rechzar la Transferencia</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="ma-1" dark fab @click="verDocumento"
                           color="red" v-on="on" v-bind="attrs" width="20" height="20">
                      <v-icon x-small>fa fa-file-pdf</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Documento de la Transferencia</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </th>
          <th style="width: 4%" class="text-center">Cant.</th>
          <th style="width: 9%" class="text-center">Estado</th>
          <th style="width: 9%" class="text-center">Remisión</th>
          <th style="width: 9%" class="text-center">Compuesto</th>
          <th style="width: 9%" class="text-center">Vehículo</th>
        </tr>
        </thead>
        <tbody>
        <tr :class="{'grey  lighten-4': i%2 === 0,'grey lighten-5': i%2 !== 0}"
            class="rowsTable" v-for="(item,i) in Traslado.cuerpo_transferencias">
          <td>{{item.articulo.nombre_articulo}}
            <table v-if="item.is_componente === 1">
              <thead>
              <tr>
                <th style="width: 95%">Detalle de Componentes</th>
                <th style="width: 5%">Cant.</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="componente in item.componentes_transferencias">
                <td>{{componente.articulo_compuesto.cantidad}} {{componente.articulo_compuesto.detalle}} <small style="font-size: 9px" v-if="componente.articulo_compuesto.detalle_cantidad">({{componente.articulo_compuesto.detalle_cantidad}} unidades)</small></td>
                <td class="text-center">{{componente.cantidad}}</td>
              </tr>
              </tbody>
            </table>
            <table v-if="item.is_remision === 1">
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
            </table>
            <table v-if="item.articulo.is_motocicleta === 1">
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
            </table>
          </td>
          <td class="text-center">{{item.cantidad}}</td>
          <td class="text-center">{{item.estado_articulo}}</td>
          <td class="text-center">
            <v-icon v-if="item.is_remision === 1" dark x-small color="success">fa fa-check</v-icon>
            <v-icon v-else dark x-small color="error">fa fa-times</v-icon>
          </td>
          <td class="text-center">
            <v-icon v-if="item.is_componente === 1" dark x-small color="success">fa fa-check</v-icon>
            <v-icon v-else dark x-small color="error">fa fa-times</v-icon>
          </td>
          <td class="text-center">
            <v-icon v-if="item.articulo.is_motocicleta === 1" dark x-small color="success">fa fa-check</v-icon>
            <v-icon v-else dark x-small color="error">fa fa-times</v-icon>
          </td>
        </tr>
        <tr >
          <td colspan="6" class="text-center">--- Fin de la Transferencia ---</td>
        </tr>
        </tbody>
      </table>

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
    </v-card>
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
  table{
    width: 100%;
    border: solid #b2b0b0 1px;
  }
  table thead tr{
    border-bottom: solid #b2b0b0 1px;
    border-top: solid #b2b0b0 1px;
  }
  table thead tr th{
    padding: 5px;
    font-size: 14px;
  }
  table thead tr th{
    border-left: solid #b2b0b0 1px;
  }
  table tbody tr td{
    padding: 5px;
    border-left: solid #b2b0b0 1px;
    font-size: 12px;
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
