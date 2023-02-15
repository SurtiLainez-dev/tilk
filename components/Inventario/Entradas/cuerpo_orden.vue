<template>
<v-card flat>
<table>
  <thead>
  <tr>
    <th>Tipo de Entrada</th>
    <th>Proveedor</th>
    <th>Sucursal</th>
    <th>Referencia</th>
    <th>Fecha de Entrada</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td v-text="orden.entrada"></td>
    <td v-text="orden.proveedor"></td>
    <td v-text="orden.sucursal"></td>
    <td v-text="orden.codigo"></td>
    <td v-text="orden.fecha_creacion"></td>
  </tr>
  </tbody>
  <thead>
  <tr>
    <th v-if="ORDEN.tipo_entrada_articulo_id !==2" colspan="2">Creado por</th>
    <th v-else>Creado por</th>
    <th>Estado</th>
    <th>Documento</th>
    <th v-if="ORDEN.tipo_entrada_articulo_id ===2">Guía de Remisión</th>
    <th>Documento Cargado</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td v-if="ORDEN.tipo_entrada_articulo_id !==2" colspan="2">{{ORDEN.user.colaborador.nombres}} {{ORDEN.user.colaborador.apellidos}}</td>
    <td v-else >{{ORDEN.user.colaborador.nombres}} {{ORDEN.user.colaborador.apellidos}}</td>
    <td>
      <v-chip x-small dark v-if="orden.estado ===1" color="success">Registrado</v-chip>
      <v-chip x-small dark v-else color="red">Pendiente</v-chip>
    </td>
    <td><b-link @click="imprimir">Ver documento</b-link></td>
    <td v-if="ORDEN.tipo_entrada_articulo_id ===2"><b-link @click="goGuiaRemision">Ver Guía</b-link></td>
    <td><b-link disabled>Ver documento</b-link></td>
  </tr>
  </tbody>
  <thead>
  <tr>
    <th colspan="5">Observación</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td colspan="5">{{ORDEN.observacion}}</td>
  </tr>
  </tbody>
</table>
  <br>
<table style="border-top: none !important;">
  <thead>
  <tr>
    <th style="border-top: none !important;" colspan="4">Cuerpo de la Orden de Entrada</th>
  </tr>
  <tr style="border-bottom: solid #b2b0b0 1px;">
    <th style="width: 3%">#</th>
    <th style="width: 72%">Artículo</th>
    <th style="width: 5%" class="text-center">Cant.</th>
    <th style="width: 10%" class="text-center">Compuesto</th>
    <th style="width: 10%" class="text-center">Estado</th>
  </tr>
  </thead>
  <tbody>
  <tr v-for="(item, index) in ORDEN.cuerpo_orden_entradas">
    <td>{{index + 1}}</td>
    <td>
      <strong>{{item.articulo.nombre_articulo}}</strong> <br> [{{item.articulo.descripcion_corta}}]
      [{{item.articulo.modelo}}] [{{item.articulo.marca.nombre}}] - {{item.articulo.codigo_sistema}}

      <table style="border: none" v-if="item.is_compuesto === 1">
        <thead>
        <tr>
          <th style="border: none" colspan="4">Componente del Artículo</th>
        </tr>
        <tr style="border-bottom: solid #b2b0b0 1px; border-right: solid #b2b0b0 1px;">
          <th style="width: 75%">Detalle</th>
          <th style="width: 5%" class="text-center">Cant.</th>
          <th style="width: 10%" class="text-center"> Detalle Cant.</th>
          <th style="width: 10%" class="text-center">Cant. Igresada</th>
        </tr>
        </thead>
        <tbody>
        <tr style="border-top: solid #b2b0b0 1px; border-right: solid #b2b0b0 1px"  v-for="i in item.orden_cuerpo_compuestos">
          <td style="border-bottom: none;" v-text="i.articulo_compuesto.detalle"></td>
          <td style="border-bottom: none" class="text-center" v-text="i.articulo_compuesto.cantidad"></td>
          <td style="border-bottom: none" class="text-center" v-if="i.articulo_compuesto.detalle_cantidad"> {{i.articulo_compuesto.detalle_cantidad}} unidades</td>
          <td style="border-bottom: none" v-else class="text-center">-</td>
          <td style="border-bottom: none">{{i.cantidad}} unidades</td>
        </tr>
        </tbody>
      </table>
    </td>
    <td v-text="item.cantidad" class="text-center"></td>
    <td class="text-center">
      <v-chip x-small v-if="item.is_compuesto === 1" color="success" dark>Artículo Compuesto</v-chip>
      <v-chip x-small v-else-if="item.is_compuesto === 0" color="red" dark>Artículo No Compuesto</v-chip>
    </td>
    <td class="text-center" v-text="item.estado_articulo.nombre"></td>
  </tr>
  <tr>
    <td class="text-center" colspan="5">--- Final de la orden ---</td>
  </tr>
  </tbody>
</table>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "cuerpo_orden",
  props:{orden: Object},
  computed:{
    ORDEN(){
      return this.$store.state.inventario.ordenes_entrada.ORDEN;
    },
    Pes(){
      return this.$store.state.pestana
    },
  },
  methods:{
    anadirPestana(key, titulo){
      let bandera = 0;
      this.Pes.forEach((item)=>{
        if (item.key === key)
          bandera++;
      });
      if (bandera === 0){
        this.$store.commit('anadirCaja', {titulo:titulo, key: key});
        this.$store.commit('cambiarTab', {val:key, tipo:false});
      }
    },
    goGuiaRemision(){
      let dataPestana = this.Pes.filter(item=>{return item.key === 11});
      if (dataPestana.length > 0)
        this.$store.commit('quitar_pestania', dataPestana[0].valor)

      this.$store.commit('activarOverlay', true);
      this.$axios.get('guia_remision/'+this.orden.id).then((res)=>{
        this.$store.commit('inventario/ordenes_entrada/asignar_GUIAREMISION', res.data.guia);
        this.$store.commit('inventario/ordenes_entrada/asignar_INFOORDEN', this.orden);
        this.anadirPestana(11, 'Guía de Remisión '+this.$store.state.inventario.ordenes_entrada.GUIA_REMISION.num_guia)
        this.$store.commit('activarOverlay', false);
      })
    },
    imprimir(){
      this.$store.commit('activarOverlay', true);
      this.$axios.get('orden_entrada/print/'+this.orden.id).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('open-nav', res.data.url)
          this.$store.commit('activarOverlay', false);
        }
      })
    },
  },
  created() {
    this.$store.commit('activarOverlay', false);
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border: solid #b2b0b0 1px;
}

table thead tr th{
  padding: 5px;
  font-size: 14px;
  border-left: solid #b2b0b0 1px;
  border-top: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 12px;
  cursor: pointer;
}
table tbody tr td table{
  width: 80%;
}
table tbody tr td table thead tr th{
  font-size: 10px;
  padding: 2px;
}
table tbody tr td table tbody tr td{
  font-size: 9px;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr td:hover{
  background-color: #f6f6f6;
}
</style>