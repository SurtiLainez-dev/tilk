<template>
  <v-card flat>
    <v-card flat v-if="vista === 1">
      <v-toolbar  color="grey lighten-3" flat>
        <v-card-title>Prospectos por sucursal</v-card-title>
        <v-spacer></v-spacer>
        <v-autocomplete :items="SUCURSALES" :loading="LOAD_SUCURSALES" :item-value="'id'" :item-text="'nombre'"
                        label="Sucursal" class="ma-2" dense v-model="suc" @change="cargar_Seg"></v-autocomplete>

        <v-spacer></v-spacer>
        <v-text-field dense label="Buscar..." v-model="search"></v-text-field>

      </v-toolbar>
      <v-data-table dense :search="search" :loading="LOAD_SEGUIMIENTOS" loading-text="Cargando datos ..."
                    :headers="header" :items="SEGUIMIENTOS" @click:row="goSeguimiento">
        <template v-slot:item.estado="{item}">
          <v-chip x-small color="red" dark v-if="item.estado === 0">Cerrado sin exito</v-chip>
          <v-chip x-small color="green lighten-1" dark v-else-if="item.estado === 1">Abierto</v-chip>
          <v-chip x-small color="green darken-3" dark v-else-if="item.estado === 2">Vendido</v-chip>
        </template>
        <template v-slot:item.fecha_inicio="{item}">
          {{item.fecha_inicio.split('-')[2]}}/{{item.fecha_inicio.split('-')[1]}}/{{item.fecha_inicio.split('-')[0]}}
        </template>
        <template v-slot:item.cliente.nombres="{item}">{{item.cliente.nombres}} {{item.cliente.apellidos}}</template>
      </v-data-table>
    </v-card>

    <v-card v-else>
      <v-toolbar dense color="grey lighten-3" flat>
        <v-btn fab dark color="orange" x-small @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
      </v-toolbar>
      <seguimiento/>
    </v-card>
  </v-card>
</template>

<script>
import seguimiento from "@/components/Ventas/seguimiento";
export default {
  name: "x_sucursal",
  components:{seguimiento},
  data(){
    return{
      suc: 0,
      vista: 1,
      search: '',
      header:[
        {text:'Nombre del Cliente',value:'cliente.nombres'},
        {text:'Artículo',value:'articulo.nombre_articulo'},
        {text:'Estado',value:'estado'},
        {text:'Fecha de Inicio',value:'fecha_inicio'},
        {text:'Usuario',value:'user.usuario'},
      ]
    }
  },
  computed:{
    SUCURSAL(){
      return this.$store.state.sucursal;
    },
    SEGUIMIENTOS(){
      return this.$store.state.seguimientos.SEGUIMIENTOS_X_SUCURSAL;
    },
    LOAD_SEGUIMIENTOS(){
      return this.$store.state.seguimientos.LOAD_SEGUIMIENTOS;
    },
    SUCURSALES(){
      return this.$store.state.suc.SUCURSALES;
    },
    LOAD_SUCURSALES(){
      return this.$store.state.suc.LOAD_SUCURSALES;
    }
  },
  created() {
    this.$store.commit('seguimientos/cargar_SEGUIMIENTOS_X_SUCURSAL', this.SUCURSAL);
    this.$store.commit('suc/cargar_SUCURSALES');
    this.suc = this.SUCURSAL;
  },
  methods:{
    goSeguimiento(item){
      this.$store.commit('asignarDatosSeguimiento', item);
      this.vista = 2;
    },
    cargar_Seg(){
      this.$store.commit('seguimientos/cargar_SEGUIMIENTOS_X_SUCURSAL', this.suc);
    }
  }
}
</script>

<style scoped>

</style>
