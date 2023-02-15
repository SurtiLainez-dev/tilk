<template>
    <v-card flat>
      <v-card flat v-if="VISTA === 1">
        <table>
          <thead>
          <tr>
            <th style="border-bottom: none !important; font-size: 20px" colspan="7">Ordenes de Ingreso de Inventario
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
          <tr>
            <td colspan="7" class="text-center">--- Fin de resultados ---</td>
          </tr>
          <tr>
            <td colspan="7">
              <div class="d-flex justify-end">
                <v-pagination
                    v-model="page"
                    :length="paginas"
                    :total-visible="6"
                ></v-pagination>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

      </v-card>

      <v-card v-else-if="VISTA === 2">
        <v-toolbar flat dense color="grey lighten-5">
          <v-btn small text fab color="orange" icon @click="VISTA = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
          <v-spacer></v-spacer>
          {{ORDEN.codigo}} - {{ORDEN.sucursal}}
        </v-toolbar>
      </v-card>
    </v-card>
</template>

<script>
import cuerpo_orden from "@/components/Inventario/Entradas/cuerpo_orden.vue";
  export default {
    components:{cuerpo_orden},
    name: "index",
    data(){
      return{
        page: 1,
        filas: 20,
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
      this.$store.commit('guardarTitulo', 'Inventario > Ingresos');
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
          let final  = this.filas * this.page;
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
      },
      ORDEN(){
        return this.$store.state.inventario.ordenes_entrada.ORDEN;
      }
    },
    methods:{
      redireccionar(data){
        this.$store.commit('inventario/ordenes_entrada/asignar_ORDEN', data);
        this.VISTA = 2;
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
    border-radius: 5px;
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
