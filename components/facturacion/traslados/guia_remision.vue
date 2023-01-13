<template>
    <div>
      <table class="rowsTable">
        <thead>
        <tr>
          <th colspan="5">Detalle de la Guía de Remisión</th>
        </tr>
        </thead>
        <thead>
        <tr>
          <th>Encardo de Enviar</th>
          <th colspan="2">Encardo de Recibir</th>
          <th colspan="2">Encardo de Transportar</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{remision.colaborador.nombres}} {{remision.colaborador.apellidos}}</td>
          <td colspan="2">{{remision.recibe.nombres}} {{remision.recibe.apellidos}}</td>
          <td colspan="2">{{remision.traslado.nombres}} {{remision.traslado.apellidos}}</td>
        </tr>
        </tbody>
        <thead>
        <tr>
          <th>Aprobado por</th>
          <th>Fecha del Traslado</th>
          <th>Guía de Remisión</th>
          <th>Guía de Firmada</th>
          <th>Estado</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{remision.user.usuario}}</td>
          <td>{{remision.fecha_envio.split('-')[2]}}/{{remision.fecha_envio.split('-')[1]}}/{{remision.fecha_envio.split('-')[0]}}</td>
          <td>
            <b-link @click="verDocumento">Ver documento</b-link>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="ma-1" dark fab width="20" height="20" @click="verFileGenerado"
                       v-if="remision.file_subido"
                       color="orange" v-on="on" v-bind="attrs">
                  <v-icon size="12">fa fa-file-pdf</v-icon>
                </v-btn>
              </template>
              <span>Ver Documento de la Transferencia Firmado</span>
            </v-tooltip>
          </td>
          <td>
            <b-link v-if="remision.file_subido" @click="verFileGenerado">Ver documento</b-link>
            <span v-else style="color: red">Pendiente</span>
          </td>
          <td>
            <v-chip v-if="remision.estado === 1" x-small color="success">Terminado</v-chip>
            <v-chip v-else-if="remision.estado === 0" color="orange" x-small dark>En Espera</v-chip>
          </td>
        </tr>
        </tbody>
      </table>
      <br>
      <traslado :traslado="remision.transferencia_articulo"/>
    </div>
</template>

<script>
  import {ipcRenderer} from "electron";
  import traslado from "./traslado";
  export default {
    components:{traslado},
    props:{remision: Object},
    name: "guia_remision",
    methods:{
      verDocumento(){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('leer_documento/',{
          ubicacion: this.remision.file_generado
        },{
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
      verFileGenerado(){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('leer_documento/',{
          ubicacion: this.remision.file_subido
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url);
            this.$store.commit('activarOverlay', false);
          }
        })
      }
    }
  }
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
table{
  width: 100%;
  border: solid #b2b0b0 1px;
}
table thead tr{
  border-bottom: solid #b2b0b0 1px;
  border-top: solid #b2b0b0 1px;
}
table thead tr th{
  padding: 5px;
  font-size: 14px;
}
table thead tr th{
  border-left: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  font-size: 12px;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr td:hover{
  background-color: #f6f6f6;
}
</style>
