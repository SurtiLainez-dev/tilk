<template>
    <div>
      <v-row>
        <v-col cols="3">
          <strong>Detalles de Remisión</strong>
        </v-col>
        <v-col cols="9" class="d-flex justify-end">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="ma-1" dark fab x-small @click="verFileGenerado"
                     v-if="remision.file_subido"
                     color="orange" v-on="on" v-bind="attrs">
                <v-icon>fa fa-file-pdf</v-icon>
              </v-btn>
            </template>
            <span>Ver Documento de la Transferencia Firmado</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="ma-1" dark fab x-small @click="verDocumento"
                     color="red" v-on="on" v-bind="attrs">
                <v-icon>fa fa-file-pdf</v-icon>
              </v-btn>
            </template>
            <span>Ver Documento de la Transferencia</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="3" cols="4">
          <v-hover v-slot:default="{ hover }" close-delay="100">
            <v-card color="blue-grey lighten-3" dark height="63px"
                    :elevation="hover ? 16 : 2" class="pl-2 pr-2 pt-2 pb-2 rowsTable">
              <h4 class="text-center">Encargado de Enviar</h4>
              <h6 class="text-center">{{remision.colaborador.nombres}} {{remision.colaborador.apellidos}}</h6>
            </v-card>
          </v-hover>
        </v-col>
        <v-col md="3" cols="4">
          <v-hover v-slot:default="{ hover }" close-delay="100">
            <v-card color="blue-grey lighten-3" dark height="63px"
                    class="pl-2 pr-2 pt-2 pb-2  rowsTable" :elevation="hover ? 16 : 2">
              <h4 class="text-center">Encargado de Recibir</h4>
              <h6 class="text-center">{{remision.recibe.nombres}} {{remision.recibe.apellidos}}</h6>
            </v-card>
          </v-hover>
        </v-col>
        <v-col md="3" cols="4">
          <v-hover v-slot:default="{ hover }" close-delay="100">
            <v-card color="blue-grey lighten-3" dark height="63px"
                    class="pl-2 pr-2 pt-2 pb-2  rowsTable" :elevation="hover ? 16 : 2">
              <h4 class="text-center">Aprobado por:</h4>
              <h6 class="text-center">{{remision.user.usuario}}</h6>
            </v-card>
          </v-hover>
        </v-col>
        <v-col md="3" cols="12">
          <v-hover v-slot:default="{ hover }" close-delay="100">
            <v-card color="blue-grey lighten-3" dark height="63px"
                    class="pl-2 pr-2 pt-2 pb-2  rowsTable" :elevation="hover ? 16 : 2">
              <h4 class="text-center">Trasnportista</h4>
              <h6 class="text-center">{{remision.traslado.nombres}} {{remision.traslado.apellidos}}</h6>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
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
</style>
