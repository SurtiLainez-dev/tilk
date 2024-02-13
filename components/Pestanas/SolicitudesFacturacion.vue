<template>
  <v-card tile flat>
    <div v-if="vista === 1" style="height: 95vh">
      <v-card class="pa-2" flat tile style="height: 95%;overflow-y: auto; overflow-x: hidden">
        <div class="mt-3 d-flex justify-start" style="width: 100%; height: 50px;">
          <div style="width: 70%; height: 100%" class="d-flex align-center">
            <div class="titleTable">Solicitudes de Credito</div>
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
                    <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong>Buscar solicitudes desde</strong></span></v-col>
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
              <v-menu :close-on-content-click="false" offset-y :nudge-width="350">
                <template v-slot:activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{on: tooltip}">
                      <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs" color="pink" text
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
                    padding: 8px 8px;margin: 0px 0;box-sizing: border-box;" v-model="search" @keyup.enter="buscarDatos" placeholder="Buscar ...">
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
                  v-if="loadSolicitudes"
              ></v-progress-circular>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attr}">
                  <v-btn v-on="on" v-bind="attr" color="indigo" text
                         @click="$store.commit('solicitud_credito/cargarSolicitudes', {tipo: 1, search: null, fecha});"
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
              <th>Referencia</th>
              <th>Nombre del Cliente</th>
              <th>Articulo</th>
              <th>Creado por</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in filterDatos" @click="SeleccionarSolicitud(item)">
              <td>{{item.codigo}}</td>
              <td>{{item.clN}} {{item.clA}}</td>
              <td>{{item.articulo}}</td>
              <td>{{item.colN}} {{item.colA}}</td>
              <td>
                <v-chip v-if="item.estado === 1" x-small dark color="warning">Pendiente</v-chip>
                <v-chip v-else-if="item.estado === 2" x-small dark color="indigo">Falta documentación</v-chip>
                <v-chip v-else-if="item.estado === 3" x-small dark color="red">Rechazado</v-chip>
                <v-chip v-else-if="item.estado === 4" x-small dark color="success">Aprobado</v-chip>
                <v-chip v-else-if="item.estado === 5" x-small dark color="green">Aprobado y Revisado</v-chip>
              </td>
              <td>{{item.fecha_creado.split('-')[2]}}/{{item.fecha_creado.split('-')[1]}}/{{item.fecha_creado.split('-')[0]}}</td>
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
    <div v-if="vista === 2">
      <v-row no-gutters class="grey lighten-5">
        <v-col cols="1" class="d-flex align-center">
          <v-btn class="ma-2" color="warning" x-small fab dark @click="vista = 1">
            <v-icon>fa fa-arrow-left</v-icon></v-btn>
        </v-col>
        <v-col cols="11" class="d-flex justify-center">
          <v-card-title>Solicitud</v-card-title>
        </v-col>
      </v-row>
      <solicitud/>
    </div>
  </v-card>
</template>

<script>
import solicitud from "@/components/Ventas/solicitud/solicitud.vue";

export default {
  name: "solicitudesFacturacion",
  components:{solicitud},
  data(){
    return{
      search: '',
      header:[
        {text:'Referencia', value: 'codigo'},
        {text:'Nombre del cliente', value: 'clN'},
        {text:'Artículo', value: 'articulo'},
        {text:'Creado por', value: 'colN'},
        {text:'Fecha creado', value: 'fecha_creado'},
        {text:'Estado', value: 'estado'},
      ],
      vista: 1,
      fecha: '',
      FechaParseada: '',
      dialogo_fecha_inicial:  false,
      resultados: 0,
      paginas: 0,
      filas: 50,
      page: 1,
    }
  },
  computed:{
    filterDatos(){
      let filtro = [];
      filtro = this.Solicitudes.filter(fila =>{
        let nombre = fila.clN.toString().toLowerCase();
        let apellido = fila.clA.toString().toLowerCase();
        let vendedor = fila.colN.toString().toLowerCase();
        let vendedorA = fila.colA.toString().toLowerCase();
        let codigo = fila.codigo.toString().toLowerCase();
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
    loadSolicitudes(){
      return this.$store.state.solicitud_credito.loadSolicitudes;
    },
    Solicitudes(){
      return this.$store.state.solicitud_credito.Solicitudes;
    },
    Solicitud(){
      return this.$store.state.solicitud_credito.Solicitud;
    },
  },
  created() {
    this.vista = 1;
    this.$store.commit('guardarTitulo', 'Facturación > Solicitudes de Crédito');
    let date           = new Date();
    this.fecha         = date.getFullYear()+'-'+(date.getMonth() + 1)+'-01';
    this.FechaParseada = date.getFullYear()+'/'+(date.getMonth() + 1)+'/01';
    this.$store.commit('solicitud_credito/cargarSolicitudes', {tipo: 1, search: null, fecha: this.fecha});
  },
  methods:{
    buscarDatos(){
      this.$store.commit('solicitud_credito/cargarSolicitudes',{tipo: 2, search: this.search, fecha: this.fecha});
    },
    saveFechaInicial() {
      this.$refs.dialogoFechaInicio.save(this.fecha);
      this.FechaParseada = this.fecha.split('-')[2]+'/'+this.fecha.split('-')[1]+'/'+this.fecha.split('-')[0];
      this.dialogo_fecha_inicial = false;
      this.$store.commit('solicitud_credito/cargarSolicitudes', {tipo: 1, search: null, fecha: this.fecha});
    },
    SeleccionarSolicitud(item){
      this.$store.commit('activarOverlay', true);
      this.$axios.get('solicitud_credito/'+item.id).then((res)=>{
        this.$store.commit('solicitud_credito/datoSolicitud', res.data.solicitud);
        this.vista     = 2;
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Datos cargados exitosamente', color:'success'});
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'No se pudo cargar los datos', color:'warning'});
      })

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
