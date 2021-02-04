<template>
<v-card flat>
  <v-row>
    <v-col cols="2">
      <v-card height="325" width="256" class="mx-auto">
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
      <v-card >
        <v-toolbar flat>
          <v-card-title class="grey--text">{{tituloMenu}}</v-card-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>
        <datos_cuenta           v-if="VISTA === 1"/>
        <cliente_cuenta         v-else-if="VISTA === 2"/>
        <articulo_cuenta        v-else-if="VISTA === 3"/>
        <pago_nuevo             v-else-if="VISTA === 4"/>
        <pagos_agregados_cuenta v-else-if="VISTA === 5"/>
        <pagos_cuenta           v-else-if="VISTA === 6"/>
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
export default {
  components:{
    datos_cuenta,
    cliente_cuenta,
    articulo_cuenta,
    pagos_cuenta, pago_nuevo,
    pagos_agregados_cuenta
  },
  name: "cuenta",
  data(){
    return{
      tituloMenu: 'Datos',
      items: [
        { title: 'Datos',             val:1},
        { title: 'Cliente',           val:2},
        { title: 'Artículo',          val:3 },
        { title: 'Agregar Pagos',     val:4 },
        { title: 'Documentos x Cobrar',   val:5 },
        { title: 'Pagos a la Cuenta', val:6 },
        { title: 'Estado de Cuenta',  val:7 },
      ],
      vistaMenu: 1
    }
  },
  computed:{
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
  },
  methods:{
    cambiarDatosMenu(data){
      this.tituloMenu = data.title;
      this.VISTA      = data.val;
    },
  }
}
</script>

<style scoped>

</style>
