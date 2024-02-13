<template>
  <v-container class="pl-2 pt-2 pr-2">
    <v-card flat>
      <v-card  :loading="LOADPLANILLAS" flat height="100" color="grey lighten-5">
        <v-toolbar color="grey lighten-5" flat dense>
          <v-toolbar-title>Planillas de Colaboradores</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-row no-gutters >
          <v-col cols="8">
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-btn @click="dialogoFilter = true" x-small fab color="indigo" v-on="on" v-bind="attrs" text icon><v-icon>mdi-filter</v-icon></v-btn>
              </template>
              <span>Busqueda Avanzada</span>
            </v-tooltip>
          </v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-text-field v-model="search" label="Buscar planilla"
                          append-outer-icon="mdi-magnify"></v-text-field>
          </v-col>
        </v-row>
      </v-card>
      <v-progress-linear indeterminate v-if="LOADPLANILLAS"></v-progress-linear>

      <table>
        <thead>
        <tr>
          <th v-for="item in header">{{item.text}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in filterData" :key="i" @click="go(item)">
            <td>{{item.codigo}}</td>
            <td>{{item.fecha_creacion}}</td>
            <td>L. {{int.format(item.total_planilla)}}</td>
            <td>{{item.periodo}} de {{item.mes_asignado}} de {{item.ano}}</td>
            <td>{{item.nombre}}</td>
            <td>{{item.usuario}}</td>
            <td class="text-center">
              <v-icon size="15px" v-if="item.estado ===1" color="success">fa fa-check-circle</v-icon>
              <v-icon size="15px" v-else color="red">fa fa-times</v-icon>
            </td>
        </tr>
        </tbody>
      </table>

      <div class="d-flex justify-end">
        <v-spacer></v-spacer>
        <v-card-text class="grey--text">{{resultados}} Resultados</v-card-text>
        <v-pagination
            v-model="page"
            :length="paginas"
            :total-visible="6"
        ></v-pagination>
      </div>
    </v-card>

    <v-dialog v-model="dialogoFilter" width="30%">
      <v-card>
        <v-toolbar tile flat color="grey lighten-4"><v-toolbar-title>Busqueda Avanzada</v-toolbar-title></v-toolbar>

        <v-autocomplete class="ma-2" v-model="sucursalID" :item-text="'nombre'" :item.value="'id'"
                        label="Seleccionar Sucursal" dense :items="SUCURSALES"></v-autocomplete>
        <v-select class="ma-2" label="Día del rango" dense v-model="dia" :items="dias"></v-select>
        <v-select class="ma-2" label="Mes del rango" dense v-model="mes" :items="meses"></v-select>
        <v-select class="ma-2" label="Año del rango" dense v-model="anio" :items="anios"></v-select>
        <v-autocomplete class="ma-2" v-model="colaboradorID" :item-text="'nombre'" :item.value="'id'"
                        label="Seleccionar Colaborador" dense ></v-autocomplete>
        <v-checkbox label="Seleccionar todos los colaboradores de la sucursal" class="ma-2"></v-checkbox>
        <v-divider></v-divider>



        <v-card-actions class="d-flex justify-end">
          <v-btn color="red" tile dark small @click="dialogoFilter = false">Cerrar</v-btn>
          <v-btn color="success" tile dark small>Consultar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
    export default {
      created() {
        this.$store.commit('contabilidad/planillas/cargar_PLANILLAS');
        this.$store.commit('suc/cargar_SUCURSALES');
        this.$store.commit('guardarTitulo', 'Planillas');
        let date = new Date();
        this.dia  = date.getDate()
        this.mes = (date.getMonth() + 1);
        this.anio = date.getFullYear();
        this.anios.push(this.anio - 1);
        this.anios.push(this.anio);
        this.anios.push(this.anio + 1);
      },
      methods:{
        go(val){
          this.$router.replace({path:"/colaborador/planillas/"+val.id})
        }
      },
      data(){
        return{
          colaboradorID: '',
          meses: [1,2,3,4,5,6,7,8,9,10,11,12],
          dias: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
          anios: [],
          sucursalID: '',
          dia: 1,
          mes: 1,
          anio: 0,
          dialogoFilter: false,
          search: '',
          header:[
            {text:'Código', value:'codigo'},
            {text:'Fecha Creación', value:'fecha_creacion'},
            {text:'Total Planilla', value:'total_planilla'},
            {text:'Périodo', value:'mes_asignado'},
            {text:'Sucursal', value:'nombre'},
            {text:'Usuario Creador', value:'usuario'},
            {text:'Estado', value:'estado'},
          ],
          filas: 25,
          paginas: 1,
          page: 1,
          resultados: 0,
          anticipo: {},
          int: Intl.NumberFormat(),
        }
      },
      name: "index",
      computed:{
        filterData(){
          let filtro = [];
          filtro = this.PLANILLAS.filter(fila =>{
          let codigo = fila.codigo.toString().toLowerCase();
          let sucursal = fila.nombre.toString().toLowerCase();
          let usuario = fila.usuario.toString().toLowerCase();
          let search = this.search

          return codigo.includes(search) || sucursal.includes(search) || usuario.includes(search)
          });
          this.resultados = filtro.length;
          if (filtro.length) {
            this.paginas = Math.ceil(filtro.length / this.filas);
            let inicio = (this.page - 1) * this.filas;
            filtro = filtro.splice(inicio, this.filas)
          }
          return filtro
        },
        LOADPLANILLAS(){
          return this.$store.state.contabilidad.planillas.LOADPLANILLAS;
        },
        PLANILLAS(){
          return this.$store.state.contabilidad.planillas.PLANILLAS;
        },
        SUCURSALES(){
          return this.$store.state.suc.SUCURSALES;
        },
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
  font-size: 12px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 10px;
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
