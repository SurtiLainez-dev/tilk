<template>
  <div>
    <v-list-group v-if="PERMISOS.includes(34) || PERMISOS.includes(310) || PERMISOS.includes(38)
    || PERMISOS.includes(312) || PERMISOS.includes(33) || PERMISOS.includes(39)">
      <template v-slot:activator value="true">
        <v-list-item-title>Inventario</v-list-item-title>
      </template>
      <v-list-item v-if="PERMISOS.includes(34)" dense class="itemOpciones" @click="go('/inventario/')">
        Inventario
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(310)"  dense class="itemOpciones" @click="go('/inventario/articulos/nuevo')">
        Crear Artículo
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(38)" dense class="itemOpciones" @click="go('/inventario/traslados/traslados_externos')">
        Transferencias Externas
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(38)" dense class="itemOpciones" @click="go('/inventario/traslados/externas')">
        Crear Transferencia Externa
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(312)" dense class="itemOpciones" @click="go('/contabilidad/notas_credito/proveedor/devoluciones')">
        Devoluciones a Proveedores
      </v-list-item>
      <v-list-item dense class="itemOpciones" @click="go('/ventas/contado/nueva')">
        Crear Venta de Contado
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(33)" dense class="itemOpciones" @click="go('/ventas/venta_reingreso')">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">Crear Venta de A.R.</span>
          </template>
          <span>Crear Venta de Artículos de Reingreso</span>
        </v-tooltip>
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(39)" dense class="itemOpciones" @click="go('/inventario/peps')">
        Movimientos
      </v-list-item>
    </v-list-group>
    <v-list-group v-if="PERMISOS.includes(311) || PERMISOS.includes(32) || PERMISOS.includes(37) || PERMISOS.includes(31)">
      <template v-slot:activator value="true">
        <v-list-item-title>Ordenes</v-list-item-title>
      </template>
      <v-list-item v-if="PERMISOS.includes(311)" dense class="itemOpciones" @click="go('/inventario/ordenes-compra/nueva')">
        Crear Orden de Compra
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(32)"  dense class="itemOpciones" @click="go('/inventario/ordenes-compra/')">
        Ver Ordenes de de Compra
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(32)"  dense class="itemOpciones" @click="go('/inventario/ordenes-compra/orden_sucursal')">
        Ordenes de Compra x Sucursal
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(37)"  dense class="itemOpciones" @click="go('/inventario/ingresos/nuevo')">
        Crear Orden en Entrada
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(31)"  dense class="itemOpciones" @click="go('/inventario/ingresos/')">
        Ver Ordenes en Entrada
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
  export default {
    name: "sideInventario",
    methods:{
      go(url){
        this.$router.push(url)
      }
    },
    computed:{
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
    }
  }
</script>

<style scoped>
  .itemOpciones{
    font-size: 10px !important;
    margin-left: 6px;
    cursor: pointer;
  }
  .itemOpciones:hover{
    background-color: #47494e;
    margin-left: 8px;
    font-size: 14px !important;
  }
</style>
