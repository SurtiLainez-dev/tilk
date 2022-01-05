<template>
  <v-card flat :loading="LOAD">
    <v-toolbar  flat color="grey lighten-4">
      <v-icon>fa fa-chart-bar</v-icon>
      <v-card-title>Saldos por Sucursales</v-card-title>
    </v-toolbar>
    <v-card-subtitle>Seleccionar datos para el reporte</v-card-subtitle>
    <v-toolbar flat>
      <v-row no-gutters>
        <v-col>
          <v-select :loading="LOAD" :items="ANIOS" :item-value="'anio'" :item-text="'anio'"
                    class="ma-2" dense label="Seleccionar Año" v-model="anio"></v-select>
        </v-col>
        <v-col>
          <v-autocomplete class="ma-2" :loading="loadSucursales" :items="Sucursales" :item-text="'nombre'"
                          dense label="Seleccionar Sucursal" v-model="sucursal" :item-value="'id'"></v-autocomplete>
        </v-col>
        <v-col>
          <v-btn color="success" class="ma-2" tile dark small @click="validar_datos">Buscar datos</v-btn>
        </v-col>
        <v-col>
          <u>{{dataSucursal}}</u>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider></v-divider>

    <v-card flat >
      <v-card flat class="pa-2">
        <v-row no-gutters>
          <v-col cols="2">
            <v-card height="420" width="256" class="mx-auto">
              <v-navigation-drawer permanent>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">Tipo de Reportes</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list dense nav>
                  <v-list-item link @click="vista = 1">
                    <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                    <v-list-item-content><v-list-item-title>Normalidades</v-list-item-title></v-list-item-content>
                  </v-list-item>
                  <v-list-item link @click="vista = 2">
                    <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                    <v-list-item-content><v-list-item-title>Recaudado</v-list-item-title></v-list-item-content>
                  </v-list-item>
                  <v-list-item link @click="vista = 3">
                    <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                    <v-list-item-content><v-list-item-title>Valor del Portafolio</v-list-item-title></v-list-item-content>
                  </v-list-item>
                  <v-list-item link @click="vista = 4">
                    <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                    <v-list-item-content><v-list-item-title>Saldo Corriente</v-list-item-title></v-list-item-content>
                  </v-list-item>
                  <v-list-item link @click="vista = 5">
                    <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                    <v-list-item-content><v-list-item-title>Total de Cuotas</v-list-item-title></v-list-item-content>
                  </v-list-item>
                  <v-list-item link @click="vista = 6">
                    <v-list-item-icon><v-icon>fa fa-chart-bar</v-icon></v-list-item-icon>
                    <v-list-item-content><v-list-item-title>Cant. Cuentas</v-list-item-title></v-list-item-content>
                  </v-list-item>
                  <v-list-item link @click="vista = 7">
                    <v-list-item-icon><v-icon>fa fa-file-excel</v-icon></v-list-item-icon>
                    <v-list-item-content><v-list-item-title>Importar Datos</v-list-item-title></v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-navigation-drawer>
            </v-card>
          </v-col>
          <v-col cols="10">
            <v-card flat height="500" class="pa-2 ma-2" :loading="loadDatos">
              <grafica_sucursales :sucursal="dataSucursal" v-if="!loadDatos && vista === 1 && Datos.length > 0" :datos="Datos" :meses="datos.meses" :labels="datos.labels"/>
              <grafica_recaudado :sucursal="dataSucursal" v-else-if="!loadDatos && vista === 2 && Datos.length > 0" :datos="Datos" :meses="datos.meses" :labels="datos.labels"/>
              <grafica_valor_portafolio :sucursal="dataSucursal" v-else-if="!loadDatos && vista === 3 && Datos.length > 0" :datos="Datos" :meses="datos.meses" :labels="datos.labels"/>
              <grafica_saldo_corriente :sucursal="dataSucursal" v-else-if="!loadDatos && vista === 4 && Datos.length > 0" :datos="Datos" :meses="datos.meses" :labels="datos.labels"/>
              <grafica_total_cuotas :sucursal="dataSucursal" v-else-if="!loadDatos && vista === 5 && Datos.length > 0" :datos="Datos" :meses="datos.meses" :labels="datos.labels"/>
              <grafica_cant_cuentas :sucursal="dataSucursal" v-else-if="!loadDatos && vista === 6 && Datos.length > 0" :datos="Datos" :meses="datos.meses" :labels="datos.labels"/>
              <excel :sucursal="dataSucursal" v-else-if="!loadDatos && vista === 7 && Datos.length > 0" :sucursal_id="sucursal" :labels="datos.labels"/>
              <v-card class="d-flex justify-center align-center" flat v-else><v-icon color="grey lighten-3" :size="400">fa fa-chart-bar</v-icon></v-card>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-card>

  </v-card>
</template>


<script>
import grafica_sucursales from "@/components/reportes/cobros/sucursales/grafica_sucursales";
import grafica_recaudado from "@/components/reportes/cobros/sucursales/grafica_recaudado";
import excel from "@/components/reportes/cobros/sucursales/excel";
import grafica_valor_portafolio from "@/components/reportes/cobros/sucursales/grafica_valor_portafolio";
import grafica_saldo_corriente from "@/components/reportes/cobros/sucursales/grafica_saldo_corriente";
import grafica_total_cuotas from "@/components/reportes/cobros/sucursales/grafica_total_cuotas";
import grafica_cant_cuentas from "@/components/reportes/cobros/sucursales/grafica_cant_cuentas";
export default {
  name: "sucursales",
  components:{
    grafica_sucursales,
    grafica_recaudado,
    excel,
    grafica_valor_portafolio,
    grafica_saldo_corriente,
    grafica_total_cuotas,
    grafica_cant_cuentas
  },
  created() {
    this.$store.commit('guardarTitulo','Reportes > Cobros > Saldos por Sucursales');
    this.$store.commit('reportes/cobros/sucursales/cargar_ANIOS');
    this.cargar_SUCURSALES();
  },
  data(){
    return{
      dataSucursal: '',
      vista: 1,
      loadSucursales: true,
      Sucursales:[],
      sucursal: '',
      anio:     '',
      datos:{
        labels: [],
        meses: [],
      },
      loadDatos: false,
      Datos: []
    }
  },
  computed:{
    DATOS(){
      return this.$store.state.reportes.cobros.sucursales.DATOS;
    },
    LOAD(){
      return this.$store.state.reportes.cobros.sucursales.LOADINDEX;
    },
    ANIOS(){
      return this.$store.state.reportes.cobros.sucursales.ANIOS;
    },
    LOADDATOS(){
      return this.$store.state.reportes.cobros.sucursales.LOADDATOS;
    },
  },
  methods:{
    cargar_datos(){
      this.loadDatos = true;
      let data = this.Sucursales.filter((item => item.id === this.sucursal));
      this.dataSucursal = data[0].nombre;
      this.$axios.get(`reportes/cobros/sucursales/datos/sucursal/${this.sucursal}/anio/${this.anio}`).then((res)=>{
        if (res.data.datos.length > 0) {
          this.Datos = res.data.datos;
          this.identificarMeses();
        }else {
          this.Datos = [];
          this.$store.commit('notificacion',{texto:'No hay datos en esta busqueda', color:'error'})
        }

        this.loadDatos = false;
      })
    },
    cargar_SUCURSALES(){
      this.$axios.get('/sucursales').then((res)=>{
        this.Sucursales     = res.data.suc;
        this.loadSucursales = false;
      })
    },
    identificarMeses(){
      let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      let dataMes = [], data = [];

      this.Datos.forEach((item)=>{
        item.mes.forEach((i)=>{
          if (!dataMes.includes(i.mes)){
            dataMes.push(i.mes);
          }
        })
      });


      this.datos.meses  = dataMes.sort((a,b)=>{return a-b});
      this.datos.meses.forEach((item)=>{
        data.push(meses[item -1])
      })
      this.datos.labels =  data;
    },
    validar_datos(){
      if (this.anio && this.sucursal) {
        this.cargar_datos();
      }else
        this.$store.commit('notificacion',{texto:'Debes seleccionar una sucursal y un año', color:'error'});
    },
  }
}
</script>

<style scoped>
.chart{
  height: 400px;
}
</style>
