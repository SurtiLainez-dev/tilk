<template>
<v-card flat>
  <h6 class="text-center">Entrada y Salida</h6>
  <v-divider></v-divider>

  <v-card-subtitle>Filtrar por:</v-card-subtitle>
  <v-row class="ma-2" no-gutters>
    <v-col>
      <v-autocomplete dense class="ma-2" :items="SUCURSALES" v-model="sucursal" :item-value="'id'"
                      :item-text="'nombre'"
                      label="Seleccionar sucursal" :loading="LOAD_SUCURSALES"></v-autocomplete>
    </v-col>
    <v-col>
      <v-dialog ref="dialogFechaInicial" v-model="dialogos.fecha_inicial" :return-value.sync="fecha_inicial"
                persistent width="290px">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field dense class="ma-2" label="Fecha 1" v-bind="attrs" v-on="on"
                        v-model="fecha_inicial" hint="Rango de fecha de inicio" persistent-hint></v-text-field>
        </template>
        <v-date-picker v-model="fecha_inicial" scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogos.fecha_inicial = false">Cancelar</v-btn>
          <v-btn text color="primary" @click="$refs.dialogFechaInicial.save(fecha_inicial)">OK</v-btn>
        </v-date-picker>
      </v-dialog>
    </v-col>
    <v-col>

      <v-dialog ref="dialogFechaFinal" v-model="dialogos.fecha_final" :return-value.sync="fecha_final"
                persistent width="290px">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field dense class="ma-2" label="Fecha 2" v-bind="attrs" v-on="on"
                        hint="Rango de fecha final" persistent-hint
                        v-model="fecha_final"></v-text-field>
        </template>
        <v-date-picker v-model="fecha_final" scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogos.fecha_final = false">Cancelar</v-btn>
          <v-btn text color="primary" @click="$refs.dialogFechaFinal.save(fecha_final)">OK</v-btn>
        </v-date-picker>
      </v-dialog>

    </v-col>
    <v-col></v-col>
    <v-col class="d-flex justify-end">

      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <v-btn fab x-small v-on="on" v-bind="attrs" color="success" @click="sucursal = null"
                 class="ma-2" text dark><v-icon>fa fa-trash</v-icon></v-btn>
        </template>
        <span>Limpiar la sucursal seleccionada</span>
      </v-tooltip>

      <v-btn small tile dark color="indigo" class="ma-2" @click="filtrarDatos">Consultar Datos</v-btn>

    </v-col>
  </v-row>

  <v-card class="ma-4" flat>
    <tabla_entradas_salidas :data="PEPS" :loading="LOAD_PEPS"/>

  </v-card>
</v-card>
</template>

<script>
import tabla_entradas_salidas from "@/components/tablas/inventario/tabla_entradas_salidas";
export default {
  name: "entradas_salidas",
  components:{tabla_entradas_salidas},
  data(){
    return{
      int: new Intl.NumberFormat(),
      sucursal: null,
      fecha_final: '',
      fecha_inicial: '',
      dialogos:{
        fecha_inicial: '',
        fecha_final: ''
      }
    }
  },
  computed:{
    ARTICULO(){
      return this.$store.state.inventario.inventario.ARTICULO;
    },
    LOAD_PEPS:{
      get: function (){
        return this.$store.state.inventario.inventario.LOAD_PEPS;
      },
      set: function (val){
        this.$store.commit('inventario/inventario/cambiarEstado_LOADPEPS', val)
      }
    },
    PEPS:{
      get: function (){
        return this.$store.state.inventario.inventario.PEPS;
      },
      set: function (val){
        this.$store.commit('inventario/inventario/asignar_PEPS', val)
      }
    },
    SUCURSALES(){
      return this.$store.state.suc.SUCURSALES;
    },
    LOAD_SUCURSALES(){
      return this.$store.state.suc.LOAD_SUCURSALES;
    }
  },
  created() {
    this.$store.commit('suc/cargar_SUCURSALES');
    let fecha = new Date();
    this.fecha_inicial = fecha.getFullYear()+'-01-01';
    this.fecha_final = fecha.getFullYear()+'-'+(fecha.getMonth()+1)+'-'+fecha.getDate();
  },
  mounted() {
    this.sucursal = '';
  },
  methods:{
    filtrarDatos(){
      this.LOAD_PEPS = true;
      this.$axios.get(`/2.0/peps/articulo/${this.ARTICULO.id}/fi=${this.fecha_inicial}&ff=${this.fecha_final}&sucursal=${this.sucursal}`).then((res)=>{
        this.PEPS = res.data.peps;
        this.LOAD_PEPS = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
