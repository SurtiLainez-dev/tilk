<template>
<v-card flat>
  <v-toolbar flat color="grey lighten-5">
    <h6>Información General del Traslado</h6>
  </v-toolbar>
  <v-simple-table dense class="rowsTable">
    <template v-slot:default>
      <tbody>
      <tr>
        <th>Código</th>
        <td>{{TRASLADO.cod}}</td>
      </tr>
      <tr>
        <th>Sucursal de Origen</th>
        <td>{{TRASLADO.sucursal.nombre}}</td>
      </tr>
      <tr>
        <th>Sucursal de Destino</th>
        <td>{{TRASLADO.destino.nombre}}</td>
      </tr>
      <tr>
        <th>Responsable del Envio</th>
        <td>{{TRASLADO.colaborador.nombres}} {{TRASLADO.colaborador.apellidos}}</td>
      </tr>
      <tr>
        <th>Nuevo Responsabe del Mobiliario</th>
        <td>{{TRASLADO.nuevo_responsable.nombres}} {{TRASLADO.nuevo_responsable.apellidos}}</td>
      </tr>
      <tr>
        <th>Estado</th>
        <td>
          <v-chip x-small dark color="orange" v-if="TRASLADO.estado === 1">Sin Entregar</v-chip>
          <v-chip x-small dark color="red" v-else-if="TRASLADO.estado === 2">Cancelada</v-chip>
          <v-chip x-small dark color="success" v-else-if="TRASLADO.estado === 3">Concretada</v-chip>
        </td>
      </tr>
      <tr>
        <th>Fecha</th>
        <td>{{TRASLADO.fecha.split('-')[2]}}/{{TRASLADO.fecha.split('-')[1]}}/{{TRASLADO.fecha.split('-')[0]}}</td>
      </tr>
      <tr>
        <th>Fecha Entregado</th>
        <td v-if="TRASLADO.fecha_entregado">{{TRASLADO.fecha_entregado.split('-')[2]}}/{{TRASLADO.fecha_entregado.split('-')[1]}}/{{TRASLADO.fecha_entregado.split('-')[0]}}</td>
        <td v-else>Sin actualizaciones</td>
      </tr>
      <tr>
        <th>Documento</th>
        <td><b-link @click="verDocumento(TRASLADO.file)">Imprimir</b-link></td>
      </tr>
      <tr>
        <th>Documento Súbido</th>
        <td v-if="TRASLADO.file_subido"><b-link @click="verDocumento(TRASLADO.file_subido)">Imprimir</b-link></td>
        <td v-else>Sin actualizaciones</td>
      </tr>
      <tr>
        <th>Observación</th>
        <td>{{TRASLADO.observaciones}}</td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>

  <v-divider></v-divider>

  <v-simple-table dense class="rowsTable">
    <template v-slot:default>
      <thead>
      <tr>
        <th>#</th>
        <th>Serie del Sistema</th>
        <th>Nombre</th>
        <th>Modelo</th>
        <th>Marca</th>
        <th>Sub-familía</th>
        <th>Estado</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in TRASLADO.mob_cuerpo_traslados">
        <td>{{i + 1}}</td>
        <td>{{item.mob_mobiliario.serie_s}}</td>
        <td>{{item.mob_mobiliario.nombre}}</td>
        <td>{{item.mob_mobiliario.mob_modelo.nombre}}</td>
        <td>{{item.mob_mobiliario.mob_modelo.mob_marca.nombre}}</td>
        <td>{{item.mob_mobiliario.mob_modelo.sub_f}}</td>
        <td>
          <v-chip color="orange" x-small dark v-if="TRASLADO.estado === 1 && item.estado === 0">Sin Entregar</v-chip>
          <v-chip color="red" x-small dark v-else-if="TRASLADO.estado === 2 && item.estado === 0">Cencelado</v-chip>
          <v-chip color="success" x-small dark v-else-if="TRASLADO.estado === 3 && item.estado === 1">Entregado</v-chip>
          <v-chip color="orange" x-small dark v-else-if="TRASLADO.estado === 3 && item.estado === 0">No se entregó</v-chip>
        </td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "info",
  computed:{
    TRASLADO(){
      return this.$store.state.mob.familias.TRASLADO;
    }
  },
  methods:{
    verDocumento(URL){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
      })
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
