<template>
  <v-card flat tile>
    <v-card flat tile v-if="$store.state.tipoUsuario < 5" class="ml-2 mr-2">
      <v-row no-gutters class="mt-5">
        <v-col class="ma-1">
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-card v-on="on" v-bind="attrs" dark color="cyan" :loading="clientesNuevos.load">
                <v-row>
                  <v-col cols="1">
                    <div class="white d-flex justify-center ml-3" style="border-radius: 100px; height: 70px; width: 70px">
                      <v-icon color="cyan" size="40"> fa fa-user</v-icon>
                    </div>
                  </v-col>
                  <v-col style="margin-left: 60px">
                    <v-card-text class="pt-0">
                      <div class="text-h6 font-weight-light mb-2">
                        {{clientesNuevos.total}}
                      </div>
                      <div class="subheading font-weight-light white--text" style="font-size: 11px">
                        Clientes nuevos desde {{fechaInicio}}
                      </div>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <span>Ver reporte</span>
          </v-tooltip>
        </v-col>
        <v-col class="ma-1">
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-card  v-on="on" v-bind="attrs" dark color="purple">
                <v-row>
                  <v-col cols="1">
                    <div class="white d-flex justify-center ml-3" style="border-radius: 100px; height: 70px; width: 70px">
                      <v-icon color="purple" size="40"> fa fa-user</v-icon>
                    </div>
                  </v-col>
                  <v-col style="margin-left: 60px">
                    <v-card-text class="pt-0">
                      <div class="text-h6 font-weight-light mb-2">
                        {{clientesRecompra.total}}
                      </div>
                      <div class="subheading font-weight-light white--text" style="font-size: 11px">
                        Clientes recompra desde {{fechaInicio}}
                      </div>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <span>Ver reporte</span>
          </v-tooltip>
        </v-col>
        <v-col class="ma-1">
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-card  v-on="on" v-bind="attrs" dark color="orange">
                <v-row>
                  <v-col cols="1">
                    <div class="white d-flex justify-center ml-3" style="border-radius: 100px; height: 70px; width: 70px">
                      <span style="color: #FFFFFF; font-weight: bold; font-size: 45px" class="orange--text">L</span>
                    </div>
                  </v-col>
                  <v-col style="margin-left: 60px">
                    <v-card-text class="pt-0">
                      <div class="text-h6 font-weight-light mb-2">
                        {{Intl.NumberFormat().format(totalVentas)}} lps
                      </div>
                      <div class="subheading font-weight-light white--text" style="font-size: 11px">
                        Total de ventas del mes de {{leerMes(fecha.getMonth())}}
                      </div>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <span>Ver reporte</span>
          </v-tooltip>
        </v-col>
        <v-col class="ma-1">
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-card dark v-on="on" v-bind="attrs" @click="goReportes(4)" color="pink">
                <v-row>
                  <v-col cols="1">
                    <div class="white d-flex justify-center ml-3" style="border-radius: 100px; height: 70px; width: 70px">
                      <span style="color: #FFFFFF; font-weight: bold; font-size: 45px" class="pink--text">V</span>
                    </div>
                  </v-col>
                  <v-col style="margin-left: 60px">
                    <v-card-text class="pt-0">
                      <div class="text-h6 font-weight-light mb-2">
                        {{VENTAS.length}}
                      </div>
                      <div class="subheading font-weight-light white--text" style="font-size: 11px">
                        Ventas pendientes por revisar
                      </div>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </template>
            <span>Revisar las Ventas Pendientes</span>
          </v-tooltip>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card tile class="mx-auto" height="470px" :loading="LOAD_VENTAS">
            <v-toolbar tile flat>
              <v-toolbar-title>Ventas Pendientes</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn small tile text class="ma-2" color="indigo">Ir a Ventas</v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-simple-table>
              <template>
                <thead>
                <tr>
                  <th>Nombre del Cliente</th>
                  <th>Código</th>
                  <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in VENTAS">
                  <td>{{item.cliente.nombres}} {{item.cliente.apellidos}}</td>
                  <td>{{item.cod}}</td>
                  <td>
                    <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
                    <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
                    <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
                    <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
                  </td>
                </tr>
                <tr v-if="i === 0" v-for="(item, i) in VENTAS">
                  <td>{{item.cliente.nombres}} {{item.cliente.apellidos}}</td>
                  <td>{{item.cod}}</td>
                  <td>
                    <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
                    <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
                    <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
                    <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
                  </td>
                </tr>
                <tr v-for="item in VENTAS">
                  <td>{{item.cliente.nombres}} {{item.cliente.apellidos}}</td>
                  <td>{{item.cod}}</td>
                  <td>
                    <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
                    <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
                    <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
                    <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider v-if="VENTAS.length > 0"></v-divider>
            <v-card-text>Son las ventas pendientes del usuario</v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card :loading="LOAD_VENTAS" class="mx-auto" tile>
            <v-toolbar tile flat>
              <v-toolbar-title>SL To-Do</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn small tile text class="ma-2" color="indigo" @click="goTodo">Ir a To-Do</v-btn>
            </v-toolbar>
            <v-divider></v-divider>
            <v-simple-table>
              <template>
                <thead>
                <tr>
                  <th>Título</th>
                  <th>Grupo</th>
                  <th>Etiqueta</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in TAREAS" v-if="i < 5">
                  <td>
                    <v-chip x-small dark v-if="USUARIO == item.user_id" color="success">Propia / {{item.user.usuario}}</v-chip>
                    <v-chip x-small dark v-else color="warning">Asignada / {{item.user.usuario}}</v-chip>
                  </td>
                  <td>
                    <v-row no-gutters>
                      <v-col cols="11">{{item.todo_grupo.nombre}}</v-col>
                      <v-col cols="1">
                        <div :style="'height: 100%; width: 7px; background-color: '+item.todo_grupo.color.substr(0,7)+' !important'"></div>
                      </v-col>
                    </v-row>
                  </td>
                  <td>
                    <v-row no-gutters>
                      <v-col cols="11">{{item.todo_estado.nombre}}</v-col>
                      <v-col cols="1">
                        <div :style="'height: 100%; width: 7px; background-color: '+item.todo_estado.color.substr(0,7)+' !important'"></div>
                      </v-col>
                    </v-row>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider v-if="TAREAS.length > 0"></v-divider>
            <v-card-text>Son las tareas del usuario</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <view_transferencias/>
        </v-col>
      </v-row>
    </v-card>

    <v-card flat tile v-else>

    </v-card>
  </v-card>
</template>

<script>
  import seguimiento from "../../components/Ventas/seguimiento";
  import view_transferencias from "../../components/Inicio/view_transferencias";
  import view_seguimientos from "../../components/Inicio/view_seguimientos";
  import index from "../../components/Tareas/index"
  import x_sucursal from "@/components/Ventas/seguimientos/x_sucursal";
  import VueApexCharts from 'vue-apexcharts'
  export default {
    components:{view_transferencias, view_seguimientos, seguimiento, tareas:index, x_sucursal, apexcharts: VueApexCharts},
    name: "index",
    data(){
      return{
        fecha: new Date(),
        fechaInicio: '',
        fechaInicioBd: '',
        vista: 1,
        totalVentas: 0,
        clientesNuevos:{
          load: true,
          total: 0
        },
        clientesRecompra:{
          load: true,
          total: 0
        }
      }
    },
    computed:{
      Pes(){
        return this.$store.state.pestana
      },
      USUARIO(){
        return this.$store.state.usuario_id;
      },
      VENTAS(){
        if (this.$store.state.ventas.MIS_VENTAS)
          return this.$store.state.ventas.MIS_VENTAS.filter(item=>item.estado === 4);
        else []
      },
      LOAD_VENTAS(){
        return this.$store.state.ventas.LOAD_MIS_VENTAS;
      },
      LOAD_TAREAS(){
        return this.$store.state.todo.LOAD_TAREAS;
      },
      TAREAS(){
        return this.$store.state.todo.TAREAS;
      },
    },
    created() {
      this.$store.commit('activarOverlay', false);
      this.$store.commit('guardarTitulo', 'Inicio')
      this.$store.commit('valorDialogo', false);
      this.$store.commit('col/cargar_COLABORADORES');
      this.$store.commit('ventas/cargar_MIS_VENTAS', null);
      this.$store.commit('todo/cargar_TAREAS', this.USUARIO);
      this.$store.commit('contabilidad/divisas/cargarMonedas');
      this.fechaInicio   = '1/'+(this.fecha.getMonth() + 1)+'/'+this.fecha.getFullYear();
      this.fechaInicioBd = this.fecha.getFullYear()+'-'+(this.fecha.getMonth() + 1)+'-01';
      this.cantClientesNuevos();
      this.cantClientesRecompra();
    },
    methods:{
      cantClientesNuevos(){
        this.clientesNuevos.load = true;
        this.$axios.get('reportes/clientes_nuevos/fecha/'+this.fechaInicioBd+'/sucursal/'+this.$store.state.sucursal).then((res)=>{
          this.clientesNuevos.load  = false;
          this.clientesNuevos.total = res.data.cant;
        })
      },
      cantClientesRecompra(){
        this.$axios.get('reportes/clientes_recompra/fecha/'+this.fechaInicioBd+'/sucursal/'+this.$store.state.sucursal).then((res)=>{
          this.clientesRecompra.load  = false;
          this.clientesRecompra.total = res.data.cant;
        })
      },
      updateTheme(e) {
        this.chartOptions = {
          theme: {
            palette: e.target.value
          }
        };
      },
      taraa(){
        this.$store.commit('tareas/cambiarTareas', 'esto es un cambio')
      },
      goReportes(val){
        if (val === 4)
          this.$router.push('/inicio/otras_gestiones/ventas');
      },
      onResize () {
        this.$emit('resize', this.$refs.ChartVentasSemanal.offsetHeight)
      },
      goTodo(){
        this.$store.commit('todo/asignar_TITULO', 'Tareas');
        this.$store.commit('todo/cargar_TAREAS', this.USUARIO);
        let bandera = 0;
        this.Pes.forEach((item)=>{
          if (item.key === 3)
            bandera++;
        });
        if (bandera === 0){
          this.$store.commit('anadirCaja', {titulo:'To-Do SL', key: 3});
          this.$store.commit('cambiarTab', {val:3, tipo:false});
        }
      },
      leerMes(val){
        let meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
        return meses[val];
      }
    }
  }
</script>

<style scoped>
#ChartVentasSemanal {
  max-width: 650px;
  margin: 35px auto;
}
</style>
