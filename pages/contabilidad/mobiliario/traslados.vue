<template>
<v-card>
  <div v-if="vista === 1">
    <v-toolbar flat color="grey lighten-3">
      <h5>Traslados de Mobiliarios</h5>
      <v-spacer></v-spacer>
      <v-text-field dense label="Buscar" v-model="searc"></v-text-field>
    </v-toolbar>

    <v-data-table dense
                  :search="searc"
                  :loading="LOAD_TRASLADOS"
                  loading-text="Cargando Traslados ..."
                  class="rowsTable"
                  :items="TRASLADOS"
                  @click:row="cambiarVista"
                  :headers="header">
      <template v-slot:item.sucursal.nombre="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, atts}">
            <span v-on="on" v-bind="atts">{{item.sucursal.abreviatura}}</span>
          </template>
          <span>{{item.sucursal.nombre}}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.destino.nombre="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, atts}">
            <span v-on="on" v-bind="atts">{{item.destino.abreviatura}}</span>
          </template>
          <span>{{item.destino.nombre}}</span>
        </v-tooltip>
      </template>
      <template v-slot:item.colaborador.nombres="{item}">
        {{item.colaborador.nombres}} {{item.colaborador.apellidos}}
      </template>
      <template v-slot:item.nuevo_responsable.nombres="{item}">
        {{item.nuevo_responsable.nombres}} {{item.nuevo_responsable.apellidos}}
      </template>
      <template v-slot:item.estado="{item}">
        <v-chip x-small dark color="orange" v-if="item.estado === 1">Sin Entregar</v-chip>
        <v-chip x-small dark color="red" v-else-if="item.estado === 2">Cancelada</v-chip>
        <v-chip x-small dark color="success" v-else-if="item.estado === 3">Cancretada</v-chip>
      </template>
    </v-data-table>
  </div>

  <div v-else-if="vista === 2">
    <v-toolbar flat color="grey lighten-3">
      <v-btn color="orange" dark x-small tile fab @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-spacer></v-spacer>
      <h5>Traslado de Mobiliario {{TRASLADO.cod}}</h5>
    </v-toolbar>
    <traslado/>
  </div>
</v-card>
</template>

<script>
import traslado from "../../../components/mobiliario/traslados/traslado";
export default {
  components:{traslado},
  name: "traslados",
  data(){
    return{
      vista: 1,
      searc: '',
      header:[
        {text: 'Código', value:'cod'},
        {text: 'Sucursal de Origen', value:'sucursal.nombre'},
        {text: 'Sucursal de Destino', value:'destino.nombre'},
        {text: 'Responsable de Envio', value:'colaborador.nombres'},
        {text: 'Nuevo Responsable', value:'nuevo_responsable.nombres'},
        {text: 'Estado', value:'estado'},
      ]
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Mobiliario > Traslados');
    this.$store.commit('mob/familias/cargar_TRASLADOS');
  },
  computed:{
    LOAD_TRASLADOS(){
      return this.$store.state.mob.familias.LOADTRASLADOS;
    },
    TRASLADOS(){
      return this.$store.state.mob.familias.TRASLADOS;
    },
    TRASLADO: {
      get: function (){
        return this.$store.state.mob.familias.TRASLADO;
      },
      set: function (data){
        this.$store.commit('mob/familias/asignar_TRASLADO', data)
      }
    }
  },
  methods:{
    cambiarVista(data){
      this.TRASLADO = data;
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
