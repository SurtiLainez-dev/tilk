<template>
  <v-card flat tile>
    <div v-if="vista === 1" style="height: 95vh">
      <v-card class="pa-2" flat tile style="height: 95%;overflow-y: auto; overflow-x: hidden">
        <div class="mt-3 d-flex justify-start" style="width: 100%; height: 50px;">
          <div style="width: 70%; height: 100%" class="d-flex align-center">
            <div class="titleTable">Revisión de Documentos</div>
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
                      <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs" color="indigo" text disabled
                             fab x-small icon><v-icon small>fa fa-calendar-day</v-icon></v-btn>
                    </template>
                    <span>Cambiar Fecha de Busqueda</span>
                  </v-tooltip>
                </template>
                <v-card color="white" tile outlined>
                  <v-row no-gutters>
                    <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong>Buscar solicitudes desde</strong></span></v-col>
                    <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong></strong>{{fechaParseada}}</span></v-col>
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
                             :disabled="!fecha">Seleccionar</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-card>
              </v-menu>
              <v-menu :close-on-content-click="false" offset-y :nudge-width="350">
                <template v-slot:activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{on: tooltip}">
                      <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs" color="pink" text disabled
                             fab x-small icon><v-icon small>fa fa-search</v-icon></v-btn>
                    </template>
                    <span>Busqueda global por nombre o apellido</span>
                  </v-tooltip>
                </template>
                <v-card color="white" tile outlined>
                  <v-row no-gutters>
                    <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong>Buscar por nombre o apellido</strong></span></v-col>
                    <v-col><span class="ml-2 text--grey" style="font-size: 8px">Presiona enter para hacer la busqueda</span></v-col>
                  </v-row>
                  <input type="text" style="background-color: white; width: 100%;
                    padding: 8px 8px;margin: 0px 0;box-sizing: border-box;" v-model="search" placeholder="Buscar ...">
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
                  v-if="LOAD"
              ></v-progress-circular>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attr}">
                  <v-btn v-on="on" v-bind="attr" color="indigo" text
                         @click="$store.commit('cuentas/cargar_VENTAS_REV_DOC');"
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
              <th>Estado por Fac.</th>
              <th>Fecha</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in filterDatos" @click="goVenta(item)">
              <td>{{item.nombres}} {{item.apellidos}}</td>
              <td>{{item.nombresCol}} {{item.apellidosCol}}</td>
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
                <v-chip color="success" x-small v-if="item.is_aceptado === 1" dark>Sí</v-chip>
                <v-chip color="red" x-small v-else-if="item.is_aceptado === 2" dark>No</v-chip>
                <v-chip color="orange" x-small v-else-if="item.is_aceptado === 3" dark>Pendiente</v-chip>
              </td>
              <td>
                {{item.created_at.split(' ')[0].split('-')[2]}}/{{item.created_at.split(' ')[0].split('-')[1]}}/{{item.created_at.split(' ')[0].split('-')[0]}}
              </td>
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


    <v-card v-else flat>
      <v-toolbar dense flat >
        <v-btn fab x-small dark color="orange" @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-divider></v-divider>
        Venta # {{venta.cod}} - {{venta.nombres}} {{venta.apellidos}}
      </v-toolbar>

      <revision_doc/>
    </v-card>
  </v-card>
</template>

<script>
import revision_doc from "@/components/Ventas/revision_doc.vue";

export default {
  name: "Revision_doc",
  components:{revision_doc},
  data(){
    return{
      dialogo_fecha_inicial: false,
      fecha: '',
      fechaParseada: '',
      int: Intl.NumberFormat(),
      search: '',
      vista: 1,
      venta: {},
      resultados: 0,
      paginas: 0,
      filas: 50,
      page: 1,
    }
  },
  computed:{
    filterDatos(){
      let filtro = [];
      filtro = this.VENTAS.filter(fila =>{
        let nombre = fila.nombres.toString().toLowerCase();
        let apellido = fila.apellidos.toString().toLowerCase();
        let vendedor = fila.nombresCol.toString().toLowerCase();
        let vendedorA = fila.apellidosCol.toString().toLowerCase();
        let codigo = fila.cod.toString().toLowerCase();
        let search   = this.search.toLowerCase()
        //
        return nombre.includes(search) || vendedor.includes(search) || codigo.includes(search) ||
            apellido.includes(search) || vendedorA.includes(search)
      });
      this.resultados = filtro.length;
      if (filtro.length > 0) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }
      return filtro
    },
    VENTAS(){
      return this.$store.state.cuentas.VENTAS_REV_DOC;
    },
    LOAD(){
      return this.$store.state.cuentas.LOAD_CUENTAS_REV_DOC;
    }
  },
  created() {
    let fecha = new Date();
    this.fecha = fecha.getFullYear()+'-'+(fecha.getMonth() + 1)+'-'+fecha.getDate();
    this.fechaParseada = fecha.getDate()+'-'+(fecha.getMonth() + 1)+'-'+fecha.getFullYear();
    this.$store.commit('guardarTitulo','Facturación > Ventas > Revisión de Documentos');
    this.$store.commit('cuentas/cargar_VENTAS_REV_DOC');
  },
  methods:{
    goVenta(data){
      this.venta = data;
      this.vista = 2;
      this.$store.commit('cuentas/agregar_CUENTA', data);
      this.$store.commit('cuentas/cargar_VENTA_REV_DOC', data.id);
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
