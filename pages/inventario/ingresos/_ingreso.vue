<template>
  <v-container class="pl-2 pr-2">
    <v-card>
      <v-card-title>Orden de Ingreso {{Orden[0].orden_entrada.codigo}}</v-card-title>
      <div class="pl-3 bordes">
        <v-row>
          <v-col cols="4"><small><strong>Proveedor:</strong> {{Orden[0].orden_entrada.proveedor.nombre}}</small></v-col>
          <v-col cols="4"><small><strong>Sucursal de entrada:</strong> {{Orden[0].orden_entrada.sucursal.nombre}}</small></v-col>
          <v-col cols="4"><small><strong>Código:</strong> {{Orden[0].orden_entrada.codigo}}</small></v-col>
        </v-row>
        <v-row>
          <v-col cols="4"><small><strong>Tipo de ingreso:</strong> {{Orden[0].orden_entrada.tipo_entrada_articulo.nombre}}</small></v-col>
          <v-col cols="4"><small><strong>Usuario creador:</strong> {{Orden[0].orden_entrada.user.usuario}}</small></v-col>
          <v-col cols="4"><small><strong>Fecha Creación:</strong> {{Orden[0].orden_entrada.fecha_creacion}}</small></v-col>
        </v-row>
      </div>
      <div class="bordes">
        <v-simple-table class="rowsTable">
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-center" colspan="3"><h2><strong>Artículos en la Orden de Ingreso</strong></h2></th>
              <th class="d-flex justify-end">
                <v-btn class="ma-2" @click="imprimir" dark fab x-small color="primary"><v-icon>fa fa-print</v-icon></v-btn>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-if="Orden[0].orden_entrada.tipo_entrada_articulo_id ===2"
                           @click="redirectRemision" class="ma-2" v-on="on"
                           v-bind="attrs" dark fab x-small color="orange">
                      <v-icon>fa fa-eye</v-icon></v-btn>
                  </template>
                  <span>Ver guía de remisión</span>
                </v-tooltip>
              </th>
            </tr>
            <tr>
              <th>Artículo</th>
              <th>Cantidad</th>
              <th>Compuesto</th>
              <th>Estado</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, i) in Orden">
              <td width="80%">
                -- <strong>{{item.articulo.nombre_articulo}}</strong> <br>
                [{{item.articulo.descripcion_corta}}] [{{item.articulo.modelo}}] [{{item.articulo.marca.nombre}}] [[<strong>{{item.articulo.codigo_sistema}}</strong>]]
                <v-list v-if="item.is_compuesto === 1" class="borderH">
                  <v-subheader>Artículos compuestos </v-subheader>
                  <v-list-item-group v-model="i" color="primary">
                    <v-list-item v-for="(index) in item.orden_cuerpo_compuestos" >
                      <v-list-item-content>
                        <v-list-item-title v-text="index.articulo_compuesto.cantidad +' '+index.articulo_compuesto.detalle"></v-list-item-title>
                        <v-list-item-subtitle v-if="index.articulo_compuesto.detalle_cantidad"
                          v-text="index.articulo_compuesto.detalle_cantidad + 'unidaes'"></v-list-item-subtitle>
                        <v-list-item-subtitle v-else v-text="'/'"></v-list-item-subtitle>
                        <v-list-item-subtitle ><small><strong>Ingresaron: {{index.cantidad}}</strong> unidades</small></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </td>
              <td class="text-center">{{item.cantidad}}</td>
              <td>
                <v-chip v-if="item.is_compuesto === 1" color="success" dark>Artículo Compuesto</v-chip>
                <v-chip v-if="item.is_compuesto === 0" color="red" dark>Artículo No Compuesto</v-chip>
              </td>
              <td>
                <v-chip v-if="item.estado_articulo_id === 1" color="success" dark>{{item.estado_articulo.nombre}}</v-chip>
                <v-chip v-if="item.estado_articulo_id === 2" color="success" dark>{{item.estado_articulo.nombre}}</v-chip>
                <v-chip v-if="item.estado_articulo_id === 3" color="orange" dark>{{item.estado_articulo.nombre}}</v-chip>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </v-card>
  </v-container>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    created() {
      this.$store.commit('guardarTitulo', 'Inventario > Ingresos > '+this.Orden[0].orden_entrada.codigo);
    },
    methods:{
      imprimir(){
        this.$store.commit('activarOverlay', true);
        this.$axios.get('orden_entrada/print/'+this.$route.params.ingreso,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url)
            this.$store.commit('activarOverlay', false);
          }
        })
      },
      redirectRemision(){
        this.$router.replace({path:'/inventario/ingresos/remision/'+this.$route.params.ingreso})
      }
    },
    asyncData({store, $axios, route}){
      return $axios.get('ordenes_entrada/'+route.params.ingreso,{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then(res =>{
        return{
          Orden: res.data.orden
        }
      })
    }
  }
</script>

<style scoped>
  .bordes{
    border: solid #000 1px;
  }
  .borderH{
    border: solid #000 1px;
    margin-bottom: 20px;
  }
  .rowsTable{
    cursor: pointer;
  }
</style>
