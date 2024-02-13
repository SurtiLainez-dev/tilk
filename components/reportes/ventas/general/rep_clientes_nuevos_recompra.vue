<template>
  <v-card flat tile>
    <v-toolbar-title class="ml-5 mt-3">Reporte de Clientes Nuevos y Recompra</v-toolbar-title>
    <v-form ref="FormFechaClientes">
      <v-row no-gutters>
        <v-col>
          <v-dialog ref="dialogoFechaInicio" :return-value.sync="fecha_inicial" persistent
                    width="290px" v-model="dialogo_fecha_inicial">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="fecha_inicial" label="Fecha Inicial"
                            :rules="[rules.req]" dense class="ma-2"
                            readonly v-bind="attrs" v-on="on" outlined>
              </v-text-field>
            </template>
            <v-date-picker v-model="fecha_inicial" scrollable>
              <v-spacer></v-spacer>
              <v-btn tile small dark color="orange" @click="dialogo_fecha_inicial = false">Cerrar</v-btn>
              <v-btn tile small color="indigo" class="text-white"
                     @click="saveFechaInicial" :disabled="!fecha_inicial">Seleccionar</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col>
          <v-dialog ref="dialogoFechaFinal" :return-value.sync="fecha_final" persistent
                    width="290px" v-model="dialogo_fecha_final">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="fecha_final" label="Fecha Final"
                            :rules="[rules.req]" dense class="ma-2"
                            readonly v-bind="attrs" v-on="on" outlined>
              </v-text-field>
            </template>
            <v-date-picker v-model="fecha_final" scrollable>
              <v-spacer></v-spacer>
              <v-btn tile small dark color="orange" @click="dialogo_fecha_final = false">Cerrar</v-btn>
              <v-btn tile small color="indigo" class="text-white"
                     @click="saveFechaFinal" :disabled="!fecha_final">Seleccionar</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col></v-col>
        <v-col></v-col>
      </v-row>
    </v-form>
    <v-progress-linear indeterminate v-if="load"></v-progress-linear>
    <v-row no-gutters>
      <v-col class="pa-2">
        <v-card-subtitle>Clientes Nuevos</v-card-subtitle>
        <table>
          <thead>
            <tr>
              <th>Sucursal</th>
              <th>Ventas</th>
              <th>Clientes</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ventasNuevas">
              <td>{{item.nombre}}</td>
              <td>{{item.total}}</td>
              <td>{{item.clientes}}</td>
              <td>L. {{Intl.NumberFormat().format(item.ventassim)}}</td>
            </tr>
            <tr v-if="ventasNuevas.length > 0" style="background-color: #626262; color: #FFFFFF">
              <td>Totales</td>
              <td>{{totalVentasClientesNuevos}}</td>
              <td>{{totalClientesVentas}}</td>
              <td>L. {{Intl.NumberFormat().format(totalesClientesVentas)}}</td>
            </tr>
          </tbody>
        </table>
      </v-col>
      <v-col class="pa-2">
        <v-card-subtitle>Clientes Recompra</v-card-subtitle>
        <table>
          <thead>
          <tr>
            <th>Sucursal</th>
            <th>Ventas</th>
            <th>Clientes</th>
            <th>Total</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in ventasRecompra">
            <td>{{item.nombre}}</td>
            <td>{{item.total}}</td>
            <td>{{item.clientes}}</td>
            <td>L. {{Intl.NumberFormat().format(item.ventassim)}}</td>
          </tr>
          <tr v-if="ventasRecompra.length > 0" style="background-color: #626262; color: #FFFFFF">
            <td>Totales</td>
            <td>{{totalVentasClientesRecompra}}</td>
            <td>{{totalClientesRecompra}}</td>
            <td>L. {{Intl.NumberFormat().format(totalesClientesRecompra)}}</td>
          </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "rep_clientes_nuevos_recompra",
  data(){
    return{
      rules:{
        req: v => !!v || 'Campo requerido',
      },
      load: false,
      dialogo_fecha_inicial: false,
      dialogo_fecha_final: false,
      fecha_inicial: '',
      fecha_final: '',
      ventasNuevas: [],
      ventasRecompra: []
    }
  },
  computed:{
    totalVentasClientesNuevos(){
      if (this.ventasNuevas.length > 0) return this.ventasNuevas.reduce((num1, num2)=> num1 + parseFloat(num2.total),0)
      else return 0;
    },
    totalVentasClientesRecompra(){
      if (this.ventasRecompra.length > 0) return this.ventasRecompra.reduce((num1, num2)=> num1 + parseFloat(num2.total),0)
      else return 0;
    },
    totalClientesRecompra(){
      if (this.ventasRecompra.length > 0) return this.ventasRecompra.reduce((num1, num2)=> num1 + parseFloat(num2.clientes),0)
      else return 0;
    },
    totalClientesVentas(){
      if (this.ventasNuevas.length > 0) return this.ventasNuevas.reduce((num1, num2)=> num1 + parseFloat(num2.clientes),0)
      else return 0;
    },
    totalesClientesVentas(){
      if (this.ventasNuevas.length > 0) return this.ventasNuevas.reduce((num1, num2)=> num1 + parseFloat(num2.ventassim),0)
      else return 0;
    },
    totalesClientesRecompra(){
      if (this.ventasRecompra.length > 0) return this.ventasRecompra.reduce((num1, num2)=> num1 + parseFloat(num2.ventassim),0)
      else return 0;
    },
  },
  methods:{
    saveFechaFinal() {
      this.$refs.dialogoFechaFinal.save(this.fecha_final);
      this.dialogo_fecha_final = false;
      this.validarForm();
    },
    saveFechaInicial() {
      this.$refs.dialogoFechaInicio.save(this.fecha_inicial);
      this.dialogo_fecha_inicial = false;
      this.validarForm();
    },
    validarForm(){
      if (this.$refs.FormFechaClientes.validate()){
        this.load = true;
        this.$axios.get('reportes/rep_clientes/fecha/'+this.fecha_inicial+'/fecha_f/'+this.fecha_final).then((res)=>{
          this.ventasNuevas   = res.data.nuevo;
          this.ventasRecompra = res.data.recompra;
          this.load           = false;
        })
      }
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
