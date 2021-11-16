<template>
  <v-card>
    <v-card-text>Datos del artículo</v-card-text>
    <v-row no-gutters>
      <v-col>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th>Marca:</th>
              <td>{{REINGRESO.articulo.marca.nombre}}</td>
            </tr>
            <tr>
              <th>Artículo:</th>
              <td>{{REINGRESO.articulo.descripcion_corta}}</td>
            </tr>
            <tr>
              <th>Modelo:</th>
              <td>{{REINGRESO.articulo.modelo}}</td>
            </tr>
            <tr>
              <th>Precio de costo:</th>
              <td>L. {{REINGRESO.articulo.precio_costo}}</td>
            </tr>
            <tr>
              <th>Precio de contado</th>
              <td v-if="REINGRESO.articulo.precio_activo">L. {{int.format(REINGRESO.articulo.precio_activo.precio_contado)}}</td>
            </tr>
            <tr>
              <th>Motocicleta (chasis):</th>
              <td v-if="REINGRESO.motocicleta">{{REINGRESO.motocicleta.chasis}}</td>
              <td>No es motocicleta</td>
            </tr>
            <tr>
              <th># Venta:</th>
              <th v-if="REINGRESO.contratos_cliente">{{REINGRESO.contratos_cliente.venta.cod}}</th>
              <th v-else>No tiene venta anterior</th>
            </tr>
            </thead>
          </template>
        </v-simple-table>
      </v-col>
      <v-col>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th>Serie del sistema:</th>
              <td>{{REINGRESO.serie_sistema}}</td>
            </tr>
            <tr>
              <th>Serie del fabricante:</th>
              <td>
                <v-text-field dense v-model="cod_fabricante" placeholder="Serie del fabricante" hint="Serie del fabricante" persistent-hint></v-text-field>
              </td>
            </tr>
            <tr>
              <th>Saldo actual del artículo:</th>
              <td>L. {{REINGRESO.precio_actual}}</td>
            </tr>
            <tr>
              <th>Sucursal:</th>
              <td>{{REINGRESO.sucursal.nombre}}</td>
            </tr>
            <tr>
              <th>Color:</th>
              <td>{{REINGRESO.color}}</td>
            </tr>
            <tr>
              <th>Estado actual del artículo:</th>
              <td>{{REINGRESO.estado_articulo.nombre}}</td>
            </tr>
            <tr></tr>
            </thead>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" lg="5">
        <v-card height="100%" class="pb-5">
          <v-card-text>Detalles de la venta</v-card-text>
          <v-data-table :items="pagos" dense :headers="headers">
            <template v-slot:item.pago_inicial="{item}">L. {{int.format(item.pago_inicial)}}</template>
            <template v-slot:item.saldo_capital="{item}">L. {{int.format(item.saldo_capital)}}</template>
            <template v-slot:item.total_abonado="{item}">L. {{int.format(item.total_abonado)}}</template>
          </v-data-table>
          <v-card v-if="!REINGRESO.contratos_cliente" flat>
            <v-card-text>No hay pagos que mostrar</v-card-text>
          </v-card>
        </v-card>
      </v-col>
      <v-col cols="12" lg="7">
        <v-card height="100%">
          <v-row no-gutters>
            <v-col>
              <v-card-text>Comentarios para la venta</v-card-text>
              <v-data-table dense :items="comentarios" :items-per-page="5" hide-default-footer :headers="headerComen">
                <template v-slot:item.titulo="{item}">
                  <vs-input size="small" v-model="item.titulo"/>
                </template>
                <template v-slot:item.comentario="{item}">
                  <vs-input size="small" v-model="item.comentario" style="min-width: 300px"/>
                </template>
                <template v-slot:item.key="{item}">
                  <v-btn color="red" dark fab height="25" @click="deteleComentario(item)"
                         width="25"><v-icon small>fa fa-times</v-icon></v-btn>
                </template>
              </v-data-table>
              <div class="d-flex justify-start pt-2">
                <v-btn tile small dark class="ma-3" color="indigo" @click="addComentario">Agregar Comentario</v-btn>
              </div>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-card-text>Datos del precio nuevo</v-card-text>
          <v-row no-gutters>
            <v-col>
              <v-text-field dense class="ma-4" label="Precio Nuevo"
                            v-model="precio.precio_nuevo" suffix="lps"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field dense class="ma-4" label="Precio Actual" v-model="precio.precio_actual"
                            disabled suffix="lps"></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="success" dark small tile @click="registrarPrecio">Registrar nuevo precio</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import {vsInput} from 'vuesax';
import Vue from 'vue';
import 'vuesax/dist/vuesax.css';
export default {
  name: "precio_reingreso",
  computed:{
    REINGRESO(){
      return this.$store.state.inventario.reingreso.REINGRESO;
    }
  },
  data(){
    return{
      int: new Intl.NumberFormat(),
      pagos: [],
      headers:[
        {text:'Detalle', value:'detalle'},
        {text:'Cuota', value:'pago_inicial'},
        {text:'Total Abonado', value:'total_abonado'},
        {text:'Saldo Capital', value:'saldo_capital'},
      ],
      cod_fabricante: '',
      headerComen:[
        {text:'Título', value:'titulo'},
        {text:'Detalle', value:'comentario'},
        {text:'Quitar', value:'key'},
      ],
      comentarios:[
        {titulo: 'Comentario 1', comentario: '', key: 0},
        {titulo: 'Comentario 2', comentario: '', key: 1},
        {titulo: 'Comentario 3', comentario: '', key: 2},
      ],
      precio:{
        precio_nuevo:  0,
        precio_actual: 0,
        diferencia:    0,
        precio:        0
      },
      longComentarios: 1
    }
  },
  created() {
    if (this.REINGRESO.contratos_cliente)
      this.pagos = this.REINGRESO.contratos_cliente.venta.pagos_contratos;

    Vue.use(vsInput);
    this.precio.precio_actual = this.REINGRESO.precio_actual;
    if (this.REINGRESO.comentarios) {
      this.comentarios = JSON.parse(this.REINGRESO.comentarios);
      this.longComentarios = this.comentarios.length;
    }
    this.cod_fabricante = this.REINGRESO.serie_fabricante;
    this.precio.precio_nuevo = this.REINGRESO.precio_actual;
  },
  methods:{
    addComentario() {
      let long = this.comentarios.length;
      this.comentarios.push({
        titulo:     'Comentario '+long,
        comentario: '',
        key:        long
      })
    },
    deteleComentario(data){
      if (this.comentarios.length > this.longComentarios){
        this.comentarios.splice(data.key, 1);
        this.comentarios.forEach((item, i)=>{
          item.key = i;
          item.titulo = 'Comentario '+(i+1)
        })
      }else{
        this.$store.commit('notificacion',{texto:'Tienes que dejar al menos un comentario', color:'warning'});
      }
    },
    registrarPrecio(){
      if (this.precio.precio_nuevo > 0){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('/2.0/inventario_reingreso/cambiar_precio',{
          remision_id: this.REINGRESO.id,
          nuevo_precio: this.precio.precio_nuevo,
          comentarios: JSON.stringify(this.comentarios),
          cod_f:       this.cod_fabricante
        }).then((res)=>{
          this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
          this.$store.commit('activarOverlay', false);
          this.$store.commit('inventario/reingreso/cargar_REINGRESOS',3);
          this.$store.commit('inventario/reingreso/cambiar_VISTA', 1);
        }).catch((error)=>{
          this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor', color:'error'});
          this.$store.commit('activarOverlay', false);
        })
      }else{
        this.$store.commit('notificacion',{texto:'El precio tiene que ser mayor a 0 lps', color:'warning'});
      }
    }
  }
}
</script>

<style scoped>
input{
  border: solid 1px #000;
}
</style>
