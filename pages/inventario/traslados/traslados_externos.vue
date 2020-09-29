<template>
    <v-card>
      <v-row>
        <v-col cols="9">
          <v-card-title>Trasnferencias Externas Existentes</v-card-title>
        </v-col>
        <v-col cols="3" class="d-flex justify-end ">
          <v-text-field v-model="search" class="ma-2" label="Buscar"></v-text-field>
        </v-col>
      </v-row>
      <hr>
      <v-data-table :headers="header"
                    :items="Traslados"
                    class="rowsTable"
                    :search="search">
        <template v-slot:item.id="{item}" class="d-flex justify-center">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn color="red" fab dark x-small @click="verDocumento(item.file_generado)" l v-on="on" v-bind="attrs">
                <v-icon>fa fa-file-pdf</v-icon>
              </v-btn>
            </template>
            <span>Ver Documento Generado</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn color="orange" fab dark  @click="verDocumento(item.file_subdio)" x-small v-on="on" v-bind="attrs">
                <v-icon>fa fa-file-pdf</v-icon>
              </v-btn>
            </template>
            <span>Ver Documento Firmado</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn color="success" fab dark  @click="verDocumento(item.file_referencia)" x-small v-on="on" v-bind="attrs">
                <v-icon>fa fa-file-pdf</v-icon>
              </v-btn>
            </template>
            <span>Ver Documento del Remitente</span>
          </v-tooltip>
        </template>
      </v-data-table>

    </v-card>
</template>

<script>
  import {ipcRenderer} from "electron";
  export default {
    created() {
      this.$store.commit('guardarTitulo', 'Transferencias > Transferencias Externas');
    },
    data(){
      return{
        search: '',
        header:[
          {text:'Código', value:'codigo'},
          {text:'Sucursal de Salida', value:'sucursal.nombre'},
          {text: 'Fecha Creado', value: 'fecha'},
          {text: 'Referencia', value: 'referencia'},
          {text: 'Remitente', value: 'remitente'},
          {text: 'Documentos', value: 'id'},
        ]
      }
    },
    name: "traslados_externos",
    methods:{
      verDocumento(dir){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('leer_documento/',{
          ubicacion: dir
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url)
            this.$store.commit('activarOverlay', false);
          }
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
        })
      }
    },
    asyncData({$axios, store}){
      store.commit('activarOverlay', true);
      return $axios.get('traslados_externos',{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then(res =>{
        store.commit('activarOverlay', false);
        return{
          Traslados: res.data.traslados
        }
      })
    }
  }
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
