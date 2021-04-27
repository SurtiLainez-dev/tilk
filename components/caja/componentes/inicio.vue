<template>
  <v-card flat>
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <v-col>
            <v-card class="ma-4">
              <v-toolbar flat><h6>Total de la Caja</h6></v-toolbar>
              <v-divider></v-divider>
              <v-card-actions class="pa-2 d-flex justify-end">
                <h6>Total del Día</h6>
                <v-spacer></v-spacer>
                <h4>L {{total}}</h4>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-card class="ma-4">
              <v-toolbar flat><h6>Totales de Formas de Pago</h6></v-toolbar>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col>
        <v-card class="ma-4">
          <v-toolbar flat>
            <h6>Documentos Realizados el Día de Hoy</h6>
          </v-toolbar>
          <v-data-table dense :headers="header"
                        :loading="LOAD_DOCUMENTOS"
                        loading-text="Cargando Documentos ..."
                        :items="DOCUMENTOS">
            <template v-slot:item.tipo_documento="{item}">
              <v-chip dark x-small color="success" v-if="item.tipo_documento === 1">Factura</v-chip>
              <v-chip dark x-small color="indigo" v-if="item.tipo_documento === 2">Recibo</v-chip>
            </template>
            <template v-slot:item.total="{item}">
              L {{item.total}}
            </template>
            <template v-slot:item.id="{item}">
              <b-link v-if="item.tipo_documento === 1 && item.factura" @click="verDocumento(item.factura.file)">{{item.factura.contador}}</b-link>
              <b-link v-else-if="item.tipo_documento === 2 && item.recibo" @click="verDocumento(item.recibo.file)">{{item.recibo.codigo}}</b-link>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";
export default {
  name: "inicio",
  computed:{
    total(){
      let total = 0;
      this.DOCUMENTOS.forEach((i)=>{
        total = parseFloat(total) + parseFloat(i.total);
      });
      return total;
    },
    DOCUMENTOS(){
      return this.$store.state.caja.DOCUMENTOS_HOY;
    },
    LOAD_DOCUMENTOS(){
      return this.$store.state.caja.LOADDOCUMENTOS_HOY;
    },
    CAJA(){
      return this.$store.state.caja.CAJA;
    },
  },
  data(){
    return{
      header:[
        {text:'Tipo',value:'tipo_documento'},
        {text:'Código',value:'id'},
        {text:'total',value:'total'},
      ]
    }
  },
  created() {
    let     f = new Date();
    let fecha = f.getFullYear()+'-'+(f.getMonth() + 1)+'-'+f.getDate();
    this.$store.commit('caja/cargar_DOCUMENTOS',{fecha: fecha, caja: this.CAJA.id, tipo: 3});
  },
  methods:{
    verDocumento(URL){
      this.$store.commit('activarOverlay',  true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento',color:'error'})
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
