<template>
  <v-card flat tile>
    <v-card flat height="50" color="grey lighten-5">
      <v-toolbar color="grey lighten-5" flat dense>
        <v-toolbar-title>Recibos</v-toolbar-title>
      </v-toolbar>
    </v-card>

    <v-row no-gutters class="ml-1 mr-1">
      <v-progress-linear indeterminate v-if="loadRecibos"></v-progress-linear>
      <v-col cols="7">
        <table>
          <thead>
          <tr style="background-color: #f1f0f0">
            <th colspan="4">Recibos Filrados</th>
            <th colspan="1" style="border-left: none" class="text-right">
              <span style="font-size: 8px"><strong>{{resultados}} resultados</strong></span>
            </th>
          </tr>
          <tr>
            <th>Sucursal</th>
            <th>Caja</th>
            <th>Codigo</th>
            <th>Cliente</th>
            <th>Monto</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in filterRecibo">
            <td>{{item.suc}}</td>
            <td>{{item.caja}}</td>
            <td>{{item.codigo}}</td>
            <td>{{item.nombres}} {{item.apellidos}}</td>
            <td>{{int.format(item.total)}}</td>
          </tr>
          </tbody>
        </table>
        <div class="d-flex justify-end">
          <v-pagination
              v-model="page"
              :length="paginas"
              :total-visible="6"
          ></v-pagination>
        </div>
      </v-col>
      <v-col cols="5">
        <v-row no-gutters>
          <v-col cols="11">
            <table>
              <tr style="background-color: #f1f0f0">
                <th>Información del recibo #</th>
              </tr>
            </table>
          </v-col>
          <v-col cols="1">
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-menu :close-on-content-click="false" offset-y :nudge-width="300">
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-if="search.length === 0" v-on="{...tooltip, ...menu}" v-bind="attrs"  fab x-small icon text color="grey"><v-icon>mdi-magnify</v-icon></v-btn>
                        <v-btn v-else v-on="{...tooltip, ...menu}" v-bind="attrs"  fab x-small icon text color="grey"><v-icon color="green">mdi-text-search</v-icon></v-btn>
                      </template>
                      <span>Buscar recibo</span>
                    </v-tooltip>
                  </template>
                  <v-card color="white" tile outlined>
                    <v-row no-gutters>
                      <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong>Buscando articulos</strong></span></v-col>
                      <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong>Resultados: {{resultados}}</strong></span></v-col>
                    </v-row>
                    <input type="text" style="background-color: white; width: 100%;
                      padding: 8px 8px;margin: 0px 0;box-sizing: border-box;" v-model="search" placeholder="Buscar ...">
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-menu :close-on-content-click="false" offset-y :nudge-width="300">
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs"  fab x-small icon text color="grey">
                          <v-icon color="green">mdi-filter-check</v-icon>
                        </v-btn>
                      </template>
                      <span>Filtrar por fecha</span>
                    </v-tooltip>
                  </template>
                  <v-card color="white" tile outlined>
                    <v-row no-gutters class="ma-2">
                      <v-col>
                        <v-dialog ref="dialogFechaInicio" v-model="dialogoFechaInicio" :return-value.sync="fecha_inicio"
                                  persistent width="290px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="fecha_inicio" label="Fecha de Inicio"
                                          readonly v-bind="attrs" v-on="on"></v-text-field>
                          </template>
                          <v-date-picker v-model="fecha_inicio" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="dialogoFechaInicio = false">Cancelar</v-btn>
                            <v-btn text color="primary" @click="$refs.dialogFechaInicio.save(fecha_inicio)">OK</v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="ma-2">
                      <v-col>
                        <v-dialog ref="dialogFechaFinal" v-model="dialogoFechaFinal" :return-value.sync="fecha_final"
                                  persistent width="290px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="fecha_final" label="Fecha Final"
                                          readonly v-bind="attrs" v-on="on"></v-text-field>
                          </template>
                          <v-date-picker v-model="fecha_final" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="dialogoFechaInicio = false">Cancelar</v-btn>
                            <v-btn text color="primary" @click="$refs.dialogFechaFinal.save(fecha_final)">OK</v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-col>
                    </v-row>
                    <v-card-actions class="d-flex justify-end">
                      <v-btn class="ma-2" small tile text color="indigo" @click="cargarRecibos">Cargar Recibos</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-menu :close-on-content-click="false" offset-y :nudge-width="400">
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs"  fab x-small icon text color="grey">
                          <v-icon v-if="!selectSucursal">mdi-filter</v-icon>
                          <v-icon color="green" v-else>mdi-filter-check</v-icon>
                        </v-btn>
                      </template>
                      <span>Filtrar por sucursal</span>
                    </v-tooltip>
                  </template>
                  <v-card color="white" tile outlined>
                    <v-row><v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong>Sucursales</strong></span></v-col></v-row>
                    <v-row><v-col>
                      <v-autocomplete class="ma-2" :items="SUCURSALES" :loading="LOADSUCURSALES" dense v-model="sucursal"
                                      :item-value="'id'" :item-text="'nombre'"></v-autocomplete>
                    </v-col></v-row>
                    <v-card-actions class="d-flex justify-end">
                      <v-btn class="ma-2" small tile text color="indigo" @click="todasSucursal">Todas las Sucursales</v-btn>
                      <v-btn class="ma-2" small tile text color="indigo" @click="cargarRecibos">Cargar Recibos</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-menu :close-on-content-click="false" offset-y :nudge-width="400">
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs"  fab x-small icon text color="grey">
                          <v-icon v-if="!selectCliente">mdi-filter</v-icon>
                          <v-icon color="green" v-else>mdi-filter-check</v-icon>
                        </v-btn>
                      </template>
                      <span>Filtrar por cliente</span>
                    </v-tooltip>
                  </template>
                  <v-card color="white" tile outlined>

                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-menu :close-on-content-click="false" offset-y :nudge-width="400">
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs"  fab x-small icon text color="grey">
                          <v-icon v-if="!selectCodRecibo">mdi-filter</v-icon>
                          <v-icon color="green" v-else>mdi-filter-check</v-icon>
                        </v-btn>
                      </template>
                      <span>Filtrar por codigo de recibo</span>
                    </v-tooltip>
                  </template>
                  <v-card color="white" tile outlined>

                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-tooltip left>
                  <template v-slot:activator="{on, sttrs}">
                    <v-btn v-on="on" v-bind="sttrs"  fab x-small icon text color="grey" @click="cargarRecibos">
                      <v-icon v-if="loadRecibos">mdi-filter</v-icon>
                      <v-icon color="green" v-else>mdi-filter-check</v-icon>
                    </v-btn>
                  </template>
                  <span>Cargar Recibos</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

  </v-card>

</template>

<script>
export default {
  name: "editar_recibos",
  created() {
    this.$store.commit('guardarTitulo','Administración > Recibos');
    let fecha = new Date();
    this.fecha_inicio = fecha.getFullYear()+'-'+(fecha.getMonth() + 1)+'-'+(fecha.getDate() - 1);
    this.fecha_final  = fecha.getFullYear()+'-'+(fecha.getMonth() + 1)+'-'+fecha.getDate();
    this.cargarRecibos();
    this.$store.commit('suc/cargar_SUCURSALES');
  },
  computed:{
    filterRecibo(){
      let filtro = [];
      filtro = this.Recibos.filter(fila => {
        let sucursal    = fila.suc.toString().toLowerCase();
        let codigo   = fila.codigo.toString().toLowerCase();
        let nombres   = fila.nombres.toString().toLowerCase();
        let apellidos   = fila.apellidos.toString().toLowerCase();
        let search   = this.search.toLowerCase()

        return sucursal.includes(search) || codigo.includes(search) || nombres.includes(search) ||
            apellidos.includes(search)
      });

      // if (this.selectPromo)
      //   filtro = filtro.filter(item=>item.precio_promo)
      //
      // if (this.selectPrecioContadoPagos)
      //   filtro = filtro.filter(item => item.pagos > 0)
      //
      //
      // if (this.proveedor_id > 0)
      //   filtro = filtro.filter(item=>item.proveedor_id === this.proveedor_id)
      //
      this.resultados = filtro.length;

      if (filtro.length > 0) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }else{
        this.paginas = 1
      }

      return filtro;
    },
    LOADSUCURSALES(){
      return this.$store.state.suc.LOAD_SUCURSALES;
    },
    SUCURSALES(){
      return this.$store.state.suc.SUCURSALES
    }
  },
  data(){
    return{
      dialogoFechaInicio: false,
      dialogoFechaFinal: false,
      resultados: 0,
      paginas: 1,
      page: 1,
      filas: 35,
      search: '',
      selectSucursal: false,
      selectCliente: false,
      selectCodRecibo: false,
      sucursal: 0,
      cliente: null,
      codRecibo: null,
      fecha_inicio: '',
      fecha_final: '',
      loadRecibos: false,
      Recibos: [],
      int: new Intl.NumberFormat(),
    }
  },
  methods:{
    cargarRecibos(){
      this.loadRecibos = true;
      this.$axios.get('clientes/recibos/fecha_inicial='+this.fecha_inicio+'/fecha_final='+this.fecha_final+'/sucursal='+this.sucursal+'/cliente='+this.cliente+'/recibo='+this.codRecibo)
          .then((res)=>{
            this.Recibos     = res.data.recibos;
            this.loadRecibos = false;
          }).catch((error)=>{
            this.$store.commit('notificacion',{texto:'Hubo un error al cargar los datos', color:'error'});
            this.loadRecibos = false;
      })
    },
    todasSucursal(){
      this.sucursal = 0;
      this.cargarRecibos();
    }
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
  font-size: 14px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 12px;
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
