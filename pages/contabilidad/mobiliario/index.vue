<template>
<v-card flat>
  <div v-if="vista === 1">
    <v-toolbar flat color="grey lighten-3">
      <h5>Mobiliario Existente</h5>
      <v-spacer></v-spacer>
      <v-text-field dense label="Buscar" v-model="search"></v-text-field>
    </v-toolbar>
    <v-data-table dense
                  :search="search"
                  class="rowsTable"
                  @click:row="cambiarVista"
                  :items="MOBILIARIOS"
                  :loading="LOAD_MOBILIARIOS"
                  :items-per-page="18"
                  loading-text="Cargando Mobiliarios"
                  :headers="header">
      <template v-slot:item.colaborador.nombres="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">{{item.colaborador.nombres}}</span>
          </template>
          <span>{{item.colaborador.nombres}} {{item.colaborador.apellidos}}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.serie_f="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-if="item.serie_f && item.serie_f.length > 14" v-bind="attrs" v-on="on">
              {{item.serie_f.substr(0,15)}} ...</span>
            <span v-else-if="item.serie_f && item.serie_f.length <= 14" v-bind="attrs">
              {{item.serie_f.substr(0,15)}}</span>
          </template>
          <span>{{item.serie_f}}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.sucursal.nombre="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-bind="attrs" v-on="on">{{item.sucursal.abreviatura}}</span>
          </template>
          <span>{{item.sucursal.nombre}}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.estado="{item}">
        <v-chip x-small color="success" v-if="item.estado === 1" dark>Activo</v-chip>
        <v-chip x-small color="red" v-else-if="item.estado === 2" dark>Fuera de Servicio</v-chip>
        <v-chip x-small color="indigo" v-else-if="item.estado === 3" dark>Almacenado</v-chip>
        <v-chip x-small color="orange" v-else-if="item.estado === 4" dark>Movimiento</v-chip>
        <v-chip x-small color="orange" v-else-if="item.estado === 5" dark>Dañado</v-chip>
        <v-chip x-small color="orange" v-else-if="item.estado === 6" dark>Mantenimiento</v-chip>
      </template>
      <template v-slot:item.nombre="{item}">
        <v-tooltip top v-if="item.nombre.length > 20">
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">{{item.nombre.substr(0,20)}} ...</span>
          </template>
          <span>{{item.nombre}}</span>
        </v-tooltip>
        <span v-else>{{item.nombre}}</span>
      </template>
    </v-data-table>
  </div>

  <div v-else-if="vista === 2">
    <v-toolbar flat color="grey lighten-3">
      <v-btn fab color="orange" dark tile x-small @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-spacer></v-spacer>
      <h5>Datos del Mobiliario {{MOBILIARIO.nombre}}</h5>
    </v-toolbar>
    <mob v-if="MOBILIARIO"/>
  </div>
</v-card>
</template>

<script>
import mob from "../../../components/mobiliario/mob/mob";
export default {
  components:{mob},
  name: "index",
  data(){
    return{
      vista: 1,
      search: '',
      header:[
        {text:'Sucursal Asignada',      value:'sucursal.nombre'},
        {text:'Colaborador Responsable',value:'colaborador.nombres'},
        {text:'Modelo',                 value:'mob_modelo.nombre'},
        {text:'Serie del Fabricante',   value:'serie_f'},
        {text:'Nombre',                 value:'nombre'},
        {text:'Serie del Sistema',      value:'serie_s'},
        {text:'Estado',                 value:'estado'},
      ]
    }
  },
  computed:{
    MOBILIARIOS(){
      return this.$store.state.mob.familias.MOBILIARIOS;
    },
    LOAD_MOBILIARIOS(){
      return this.$store.state.mob.familias.LOADMIBILIARIOS;
    },
    MOBILIARIO(){
      return this.$store.state.mob.familias.MOBILIARIO;
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Mobiliarios');
    this.$store.commit('mob/familias/cargar_MOBILIARIOS');
  },
  methods:{
    cambiarVista(data){
      console.log(data)
      this.$store.commit('mob/familias/asignar_MOBILIARIO', data);
      this.vista = 2;
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
