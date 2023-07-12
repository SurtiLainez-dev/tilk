<template>
  <v-card flat>
    <v-card flat v-if="VISTA === 1">
      <table>
        <thead>
        <tr>
          <th style="border-bottom: none !important; font-size: 20px" colspan="7">
            <v-row no-gutters>
              <v-col cols="10">Ordenes de Ingreso de Inventario</v-col>
              <v-col cols="2" class="d-flex justify-end">
                <v-btn small text dark color="indigo" @click="$store.commit('inventario/ordenes_entrada/cargar_ORDENES')">Recargar</v-btn>
                <v-btn small text dark color="indigo" disabled>Busqueda Avanzada</v-btn>
              </v-col>
            </v-row>
            <v-progress-linear v-if="LOAD_ORDENES" indeterminate></v-progress-linear>
          </th>
        </tr>
        <tr>
          <th style="border-right: none; color: #aaaaaa; font-size: 10px">{{resultado}} Resultados</th>
          <td colspan="6">
            <div  class="d-flex justify-end">
              <v-icon >mdi-magnify</v-icon>
              <input v-model="search" class="input-busqueda" placeholder="Buscar orden de entrada"/>
            </div>
          </td>
        </tr>
        <tr style="border-top:solid #b2b0b0 1px">
          <th>Tipo de Entrada</th>
          <th>Proveedor</th>
          <th>Sucursal</th>
          <th>Referencia</th>
          <th>Estado</th>
          <th>Usuario Creador</th>
          <th>Fecha Creador</th>
        </tr>
        </thead>
        <tbody>
        <tr @click="redireccionar(item)" v-for="(item, index) in filterRows" :key="`ordenEntrada-${index}`">
          <td v-text="item.entrada"></td>
          <td v-text="item.proveedor"></td>
          <td v-text="item.sucursal"></td>
          <td v-html="resaltarRows(item.codigo)"></td>
          <td >
            <v-chip x-small dark v-if="item.estado ===1" color="success">Registrado</v-chip>
            <v-chip x-small dark v-else color="red">Pendiente</v-chip>
          </td>
          <td v-text="item.usuario"></td>
          <td>
            {{item.fecha_creacion.split('-')[2]}}/{{item.fecha_creacion.split('-')[1]}}/{{item.fecha_creacion.split('-')[0]}}
          </td>
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

    </v-card>

    <v-card flat v-else-if="VISTA === 2">
      <v-toolbar flat dense color="grey lighten-5">
        <v-btn small text fab color="orange" icon @click="VISTA = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-spacer></v-spacer>
        {{Orden.codigo}} - {{Orden.sucursal}}
      </v-toolbar>
      <cuerpo_orden :orden="Orden"/>
    </v-card>
  </v-card>
</template>

<script>
import cuerpo_orden from "@/components/Inventario/Entradas/cuerpo_orden.vue";

export default {
  name: "ordenes_entradas",
  components:{cuerpo_orden},
  data(){
    return{
      Orden: {},
      page: 1,
      filas: 22,
      paginas: 1,
      resultado: 0,
      search: '',
      header:[
        {text:'Tipo de Entrada', value:'tipo_entrada_articulo.nombre'},
        {text:'Proveedor', value:'proveedor.nombre'},
        {text:'Código', value:'codigo'},
        {text:'Estado', value:'estado'},
        {text:'Usuario Creador', value:'user.usuario'},
        {text:'Fecha Creado', value:'fecha_creacion'},
      ]
    }
  },
  created() {
    this.VISTA = 1;
    this.$store.commit('inventario/ordenes_entrada/cargar_ORDENES');
  },
  computed:{
    filterRows(){
      let filtro = this.ORDENES.filter(row => {
        let proveedor = row.proveedor.toString().toLowerCase();
        let entrada   = row.entrada.toString().toLowerCase();
        let sucursal  = row.sucursal.toString().toLowerCase();
        let codigo    = row.codigo.toString().toLowerCase();
        let usuario   = row.usuario.toString().toLowerCase();
        let fecha     = row.fecha_creacion.toString().toLowerCase();
        let busqueda  = this.search.toLowerCase();
        return entrada.includes(busqueda) || proveedor.includes(busqueda) || sucursal.includes(busqueda) ||
            codigo.includes(busqueda) || usuario.includes(busqueda) || fecha.includes(busqueda)
      })
      this.resultado =  filtro.length;
      if (filtro.length > 0)
        this.paginas = Math.ceil(filtro.length / this.filas)

      if (filtro.length > 0){
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio,this.filas)
      }
      return filtro;
    },
    LOAD_ORDENES(){
      return this.$store.state.inventario.ordenes_entrada.LOAD_ORDENES;
    },
    ORDENES(){
      return this.$store.state.inventario.ordenes_entrada.ORDENES;
    },
    VISTA:{
      get: function (){
        return this.$store.state.inventario.ordenes_entrada.VISTA;
      },
      set: function (val){
        this.$store.commit('inventario/ordenes_entrada/cambiar_VISTA', val);
      }
    }
  },
  methods:{
    redireccionar(data){
      this.$store.commit('activarOverlay', true);
      this.Orden = data;
      this.$store.commit('inventario/ordenes_entrada/cargar_ORDEN', data.id);
    },
    resaltarRows(text){
      let exits = text.toLowerCase().includes(this.search.toLowerCase());
      if (!exits) return text;

      let reg = new RegExp(this.search, 'ig');
      return text.replace(reg, textoRemarcado => `<strong>${textoRemarcado}</strong>`)
    }
  },
}
</script>

<style scoped>
.input-busqueda{
  border-bottom: solid #7F828B 1px;
  padding: 2px;
  outline: none;
  height: 25px;
  width: 250px;
  font-size: 12px;
  margin: 5px;
  background-color: #FBFBFB;
  border-radius: 3px;
}

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