<template>
  <v-card flat tile>
    <div v-if="vista === 1" style="height: 95vh">
      <v-card class="pa-2" flat tile style="height: 95%;overflow-y: auto; overflow-x: hidden">
        <div class="mt-3 d-flex justify-start" style="width: 100%; height: 50px;">
          <div style="width: 70%; height: 100%" class="d-flex align-center">
            <div class="titleTable">Ventas Asignadas a Mi Usuario</div>
          </div>
          <div style="width: 30%; height: 100%">
            <div class="d-flex justify-start" style="display: flex">
              <span class="titleBuscar">Buscar</span>
            </div>
            <div style="border: solid 1px #b2b0b0; height: 60%; padding: 2px">
              <div style="height: 100%">
                <input class="ml-1" v-model="search" type="text" placeholder="...">
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3 d-flex justify-start" style="width: 100%; height: 50px;">
          <div style="width: 70%;height: 100%">
            <div class="d-flex justify-start">
              <span class="titleAcciones">Filtros:</span>
            </div>
            <div class="d-flex justify-start align-center">
              <v-menu :close-on-content-click="false" offset-y :nudge-width="300">
                <template v-slot:activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{on: tooltip}">
                      <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs" color="indigo" text
                             fab x-small icon><v-icon small>fa fa-calendar-day</v-icon></v-btn>
                    </template>
                    <span>Cambiar Fecha de Busqueda</span>
                  </v-tooltip>
                </template>
                <v-card color="white" tile outlined>
                  <v-row no-gutters>
                    <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong>Buscar ventas desde</strong></span></v-col>
                    <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong></strong>{{FechaParseada}}</span></v-col>
                  </v-row>
                  <v-dialog ref="dialogoFechaInicio" :return-value.sync="fecha" persistent
                            width="290px" v-model="dialogo_fecha_inicial">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="fecha" label="Fecha"
                                    dense class="ma-2"
                                    readonly v-bind="attrs" v-on="on" outlined>
                      </v-text-field>
                    </template>
                    <v-date-picker v-model="fecha" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn tile small dark color="orange" @click="dialogo_fecha_inicial = false">Cerrar</v-btn>
                      <v-btn tile small color="indigo" class="text-white"
                             @click="saveFechaInicial" :disabled="!fecha">Seleccionar</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-card>
              </v-menu>
            </div>
          </div>
          <div style="width: 30%;height: 100%">
            <div class="d-flex justify-start">
              <span class="titleAcciones">Acciones:</span>
            </div>
            <div class="d-flex justify-start align-center">
              <v-progress-circular
                  indeterminate
                  color="primary"
                  :size="20"
                  v-if="LOAD_VENTAS"
              ></v-progress-circular>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attr}">
                  <v-btn v-on="on" v-bind="attr" color="indigo" text
                         @click="$store.commit('ventas/cargar_MIS_VENTAS', fecha)"
                         fab x-small icon><v-icon small>fa fa-sync</v-icon></v-btn>
                </template>
                <span>Recargar Datos</span>
              </v-tooltip>
            </div>
          </div>
        </div>

        <v-divider></v-divider>
        <div>
          <table>
            <thead>
            <tr>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Tipo de Venta</th>
              <th>Codigo</th>
              <th>Estado</th>
              <th>Estado por Facturación</th>
              <th>Total</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in filterDatos" @click="verVista(item)">
              <td>{{item.cliente.nombres}} {{item.cliente.apellidos}}</td>
              <td>{{item.colaborador.nombres}} {{item.colaborador.apellidos}}</td>
              <td>
                <v-chip color="success" x-small v-if="item.tipo_venta === 1" dark>Contado</v-chip>
                <v-chip color="orange" x-small v-else-if="item.tipo_venta === 2" dark>Crédito</v-chip>
              </td>
              <td>{{item.cod}}</td>
              <td>
                <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
                <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
                <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
                <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
              </td>
              <td>
                <v-chip color="success" x-small v-if="item.is_aceptado === 1" dark>Aceptado</v-chip>
                <v-chip color="red" x-small v-else-if="item.is_aceptado === 2" dark>Rechazado</v-chip>
                <v-chip color="orange" x-small v-else-if="item.is_aceptado === 3" dark>Pendiente Revisar</v-chip>
              </td>
              <td>L {{ Intl.NumberFormat().format(item.total)}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </v-card>

      <v-card-actions class="grey" style=" width: 100%; height: 5%">
        <v-row no-gutters>
          <v-col cols="2"><span class="text-white" style="font-size: 10px">Resultados: <strong>{{resultados}}</strong> articulos</span></v-col>
          <v-col cols="2">
            <v-row no-gutters>
              <v-col><span class="text-white" style="font-size: 10px">Filas a mostrar</span></v-col>
              <v-col>
                <select v-model="filas">
                  <option :value="100">100</option>
                  <option :value="250">250</option>
                  <option :value="500">500</option>
                  <option :value="1000">1000</option>
                  <option :value="1500">1500</option>
                  <option :value="2000">2000</option>
                  <option :value="5000">5000</option>
                  <option :value="10000">10000</option>
                  <option :value="20000">20000</option>
                </select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="8" class="d-flex justify-end">
            <v-pagination
                v-model="page"
                :length="paginas"
                :total-visible="6"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-card-actions>
    </div>

    <div v-else-if="vista === 2">
      <v-row no-gutters>
        <v-col cols="1" class="d-flex align-center">
          <v-btn color="warning" @click="vista = 1" fab x-small><v-icon>fa fa-arrow-left</v-icon></v-btn>
        </v-col>
        <v-col cols="11" class="d-flex align-center justify-center">
          <v-card-title>Datos de la venta</v-card-title>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <mis_ventas_contado v-if="tipo === 1 && !is_combo"/>
      <mis_ventas v-else-if="tipo === 2 && !is_combo"/>
      <vista_salida_combos v-else-if="is_combo === 1"/>
    </div>
  </v-card>
</template>

<script>
import Mis_ventas_contado from "@/components/Ventas/contado/mis_ventas_contado.vue";
import Mis_ventas from "@/components/Ventas/mis_ventas.vue";
import vista_salida_combos from "@/components/Ventas/combos/vista_salida_combos.vue";
import mis_ventas from "@/components/Ventas/mis_ventas.vue";
import mis_ventas_contado from "@/components/Ventas/contado/mis_ventas_contado.vue";

export default {
  components: {Mis_ventas_contado, Mis_ventas, vista_salida_combos},
  comments:{
    mis_ventas,
    mis_ventas_contado,
  },
  name: "MisVentas",
  data(){
    return{
      search: '',
      header:[
        {text: 'Cliente',         value:'cliente.nombres'},
        {text: 'Vendedor',        value:'colaborador.nombres'},
        {text: 'Tipo de venta',   value:'tipo_venta'},
        {text: 'Código',          value:'cod'},
        {text: 'Estado',          value:'estado'},
        {text: 'Aceptado por F.', value:'is_aceptado'},
        {text: 'Total',           value:'total'},
      ],
      tipo: 0,
      is_combo: null,
      resultados: 0,
      paginas: 0,
      filas: 50,
      page: 1,
      fecha: '',
      FechaParseada: '',
      dialogo_fecha_inicial: false
    }
  },
  created() {
    this.vista         = 1;
    let date           = new Date();
    this.fecha         = date.getFullYear()+'-'+(date.getMonth() + 1)+'-01';
    this.FechaParseada = date.getFullYear()+'/'+(date.getMonth() + 1)+'/01';
    this.$store.commit('ventas/cargar_MIS_VENTAS', this.fecha);
  },
  computed:{
    filterDatos(){
      if (this.VENTAS){
        let filtro = [];
        filtro = this.VENTAS.filter(fila =>{
          let nombres = fila.cliente.nombres.toString().toLowerCase();
          let apellidos = fila.cliente.apellidos.toString().toLowerCase();
          let vendedor = fila.colaborador.nombres.toString().toLowerCase();
          let codigo = fila.cod.toString().toLowerCase();
          let search   = this.search.toLowerCase()
          //
          return nombres.includes(search) || apellidos.includes(search) || vendedor.includes(search) ||
              codigo.includes(search)
        });
        this.resultados = filtro.length;
        if (filtro.length > 0) {
          this.paginas = Math.ceil(filtro.length / this.filas);
          let inicio = (this.page - 1) * this.filas;
          filtro = filtro.splice(inicio, this.filas)
        }

        return filtro;
      }else return []
    },
    VENTAS(){
      return this.$store.state.ventas.MIS_VENTAS;
    },
    LOAD_VENTAS(){
      return this.$store.state.ventas.LOAD_MIS_VENTAS;
    },
    vista:{
      get: function (){
        return this.$store.state.ventas.VISTA;
      },
      set: function(val){
        this.$store.commit('ventas/cambiar_VISTA', val)
      }
    }
  },
  methods:{
    saveFechaInicial() {
      this.$refs.dialogoFechaInicio.save(this.fecha);
      this.FechaParseada = this.fecha.split('-')[2]+'/'+this.fecha.split('-')[1]+'/'+this.fecha.split('-')[0];
      this.dialogo_fecha_inicial = false;
      this.$store.commit('ventas/cargar_MIS_VENTAS', this.fecha);
    },
    verVista(data){
      this.tipo = data.tipo_venta
      this.is_combo = data.is_combo
      this.$store.commit('ventas/asignar_ID_VENTA', data.id);
      this.vista = 2;
    }
  }
}
</script>

<style scoped>
.titleTable{
  font-family: 'Rubik', sans-serif;
  font-size: 18px;
  font-weight: bold;
}
.titleAcciones{
  font-size: 10px;
  font-family: 'Rubik', sans-serif;
  color: #aaaaaa;
}
.titleBuscar{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
input{
  font-size: 14px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
.header div span{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  color: #7F828B;
}
.body div span{
  font-size: 10px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
table{
  width: 100%;
  border-collapse: collapse;
}
table thead tr th{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  color: #7F828B;
  text-align: start;
}
table tbody tr td{
  font-size: 11px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
  height: 22px;
  border-bottom: solid 1px #DADADA;
}
table tbody tr:hover{
  cursor: pointer;
  background-color: #f6f6f6;
}
</style>
