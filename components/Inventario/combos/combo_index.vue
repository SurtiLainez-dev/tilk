<template>
  <v-card flat :loading="LOADCOMBO">
    <v-row no-gutters>
      <v-col>
        <v-card class="ma-2 pa-2">
          <v-card-title>Datos del Combo</v-card-title>
          <v-list-item dense two-line v-for="item in lista">
            <v-list-item-content>
              <v-list-item-title>{{item.title}}</v-list-item-title>
              <v-list-item-subtitle v-if="item.number">L. {{int.format(item.sub)}}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>{{item.sub}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="ma-2 pa-2">
          <v-card-title>Datos del Precio</v-card-title>
          <v-list-item dense two-line v-for="item in listaPrecio">
            <v-list-item-content>
              <v-list-item-title>{{item.title}}</v-list-item-title>
              <v-list-item-subtitle v-if="item.number">L. {{int.format(item.sub)}}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>{{item.sub}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col>
        <v-card-title>Sucursales </v-card-title>
        <v-list-item-content v-for="item in SUCURSALES">
          <v-list-item-title>Single-line item</v-list-item-title>
        </v-list-item-content>
      </v-col>
    </v-row>
      <pre>{{COMBO}}</pre>
  </v-card>
</template>

<script>
export default {
  name: "combo_index",
  data(){
    return{
      int: Intl.NumberFormat()
    }
  },
  created() {
    this.$store.commit('suc/cargar_SUCURSALES');
  },
  computed:{
    COMBO(){
      return this.$store.state.inventario.combos.COMBO;
    },
    LOADCOMBO(){
      return this.$store.state.inventario.combos.LOAD_COMBOS;
    },
    lista(){
      let C = this.COMBO;
      let lista = [
        {title: 'Nombre del combo', sub: C.nombre, number: false},
        {title: 'Detalle del combo', sub: C.detalle, number: false},
        {title: 'Código', sub: C.codigo, number: false},
        {title: 'Fecha de creación', sub: C.fecha_inicio.split('-')[2]+'/'+C.fecha_inicio.split('-')[2]+'/'+C.fecha_inicio.split('-')[0], number: false},
        {title: 'Fecha de finalización', sub: C.fecha_final.split('-')[2]+'/'+C.fecha_final.split('-')[2]+'/'+C.fecha_final.split('-')[0], number: false},
        {title: 'Usuario creador', sub: C.user.usuario, number: false},
      ]
      return lista;
    },
    listaPrecio(){
      let C = this.COMBO;
      let lista = [
        {title: 'Precio de contado del total de los artículos', sub: C.total_precio_contado, number: true},
        {title: 'Precio de costo', sub: C.precio_costo, number: true},
        {title: 'Precio de contado del combo', sub: C.precio_contado, number: true},
        {title: 'Mínimo de prima', sub: C.minimo_prima, number: true},
        {title: 'Margen de ganancia', sub: C.margen_ganancia+' %', number: false},
        {title: 'Tasa de financiamiento anual', sub: C.financiamiento_anual+' %', number: false},
      ];
      return lista;
    },
    SUCURSALES(){
      return this.$store.state.suc.SUCURSALES;
    },
  }
}
</script>

<style scoped>

</style>
