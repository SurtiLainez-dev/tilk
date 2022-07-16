<template>
<v-card flat>
    <v-row>
      <v-col cols="2">
        <v-card  :loading="!loadData" height="460" width="256" class="mx-auto">
          <v-navigation-drawer permanent>
            <v-list dense nav>
              <v-list-item v-for="item in items" :key="item.title" link @click="cambiarDatosMenu(item)">
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

          </v-navigation-drawer>
        </v-card>
      </v-col>

      <v-col cols="10">
        <v-card v-if="loadData">
          <v-toolbar flat>
            <v-card-title class="grey--text">{{tituloMenu}}</v-card-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-divider></v-divider>
          <datos_cuenta           v-if="VISTA === 1"/>
          <cliente_cuenta         v-else-if="VISTA === 2"/>
          <articulo_cuenta        v-else-if="VISTA === 3 && CUENTA.tipo_venta === 2"/>
          <articulos_contado      v-else-if="VISTA === 3 && CUENTA.tipo_venta === 1"/>
          <pago_nuevo             v-else-if="VISTA === 4"/>
          <pagos_agregados_cuenta v-else-if="VISTA === 5"/>
          <pagos_cuenta           v-else-if="VISTA === 6"/>
          <estado_cuenta          v-else-if="VISTA === 7"/>
          <orden_entrega          v-else-if="VISTA === 8"/>
          <recibos                v-else-if="VISTA === 9"/>
          <deducción_mora         v-else-if="VISTA === 10 && PERMISOS.includes(148)"/>
        </v-card>
      </v-col>
    </v-row>

</v-card>
</template>

<script>
import datos_cuenta from "./cuentas/datos_cuenta";
import cliente_cuenta from "./cuentas/cliente_cuenta";
import articulo_cuenta from "./cuentas/articulo_cuenta";
import pagos_cuenta from "./cuentas/pagos_cuenta";
import pago_nuevo from "./cuentas/pago_nuevo";
import pagos_agregados_cuenta from "./cuentas/pagos_agregados_cuenta";
import articulos_contado from "./cuentas/articulos_contado";
import orden_entrega from "./cuentas/orden_entrega";
import estado_cuenta from "./cuentas/estado_cuenta";
import recibos from "./cuentas/recibos";
import deducción_mora from "@/components/Ventas/cuentas/deducción_mora";
export default {
  components:{
    datos_cuenta,
    cliente_cuenta,
    articulo_cuenta,
    pagos_cuenta, pago_nuevo,
    pagos_agregados_cuenta,
    articulos_contado,
    orden_entrega,
    estado_cuenta,
    recibos,
    deducción_mora
  },
  name: "cuenta",
  data(){
    return{
      tituloMenu: 'Datos',
      items: [
        { title: 'Datos',                 val:1},
        { title: 'Cliente',               val:2},
        { title: 'Artículo',              val:3 },
        { title: 'Agregar Pagos',         val:4 },
        { title: 'Documentos x Cobrar',   val:5 },
        { title: 'Pagos a la Cuenta',     val:6 },
        { title: 'Estado de Cuenta',      val:7 },
        { title: 'Orden de Entrega',      val:8 },
        { title: 'Documentos',            val:9 },
        { title: 'Deducir Mora',          val:10},
      ],
      vistaMenu: 1,
      loadData: false,
    }
  },
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
    PERMISOS(){
      let permisos = this.$store.state.permisosUser.split(',');
      let per = [];
      if (permisos.length > 1){
        permisos.forEach((item)=>{
          per.push(parseInt(item))
        })
        return per;
      }else
        return [];
    },
    VISTA:{
      get: function (){
        return this.$store.state.cuentas.VISTA;
      },
      set: function (val){
        this.$store.commit('cuentas/cambiar_VISTA', val);
      }
    }
  },
  created() {
    this.VISTA = 1;
    this.cargandoDatos();
  },
  methods:{
    cargandoDatos(){
      this.$axios.get('cuentas/ventas/'+this.CUENTA.id).then((res)=>{
        this.$store.commit('cuentas/agregar_CUENTA', res.data.venta);
        this.loadData = true;
      })
    },
    cambiarDatosMenu(data){
      this.tituloMenu = data.title;
      this.VISTA      = data.val;
    },
  }
}
</script>

<style scoped>

</style>
