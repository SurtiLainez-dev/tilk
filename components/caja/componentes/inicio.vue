<template>
  <v-card flat>
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <v-col>
            <v-card class="ma-4 grey lighten-5" flat>
              <v-toolbar color="grey lighten-5" flat><h6>Total de la Caja</h6></v-toolbar>
              <v-divider></v-divider>
              <v-card-actions class="pa-2 d-flex justify-end">
                <v-row no-gutters><v-col>
                  <h5>Total del Día</h5>
                  <v-spacer></v-spacer>
                  <h4>L {{int.format(total)}}</h4>
                </v-col></v-row>
                <v-row><v-col>
                  <v-spacer></v-spacer>
                  <h6>Total en Efectivo</h6>
                  <h6>L {{int.format(TOTAL_CAJA)}}</h6>
                </v-col></v-row>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-card class="ma-4" flat >
              <v-toolbar color="grey lighten-5" flat><h6>Totales de Formas de Pago</h6></v-toolbar>

              <v-data-table class="grey lighten-5" :items="FORMA_PAGOS" :loading="LOAD_FORMA_PAGOS"
                            loading-text="Cargando Datos"
                            :headers="headerFP" dense>
                <template v-slot:item.total="{item}">
                  L {{int.format(item.total)}}
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col>
        <v-card class="ma-4" flat>
          <v-toolbar color="grey lighten-5" flat>
            <h6>Documentos Realizados el Día de Hoy</h6>
          </v-toolbar>
          <v-data-table class="grey lighten-5" dense :headers="header"
                        :loading="LOAD_DOCUMENTOS"
                        loading-text="Cargando Documentos ..."
                        :items="DOCUMENTOS">
            <template v-slot:item.tipo_documento="{item}">
              <v-chip dark x-small color="success" v-if="item.tipo_documento === 1">Factura</v-chip>
              <v-chip dark x-small color="indigo" v-if="item.tipo_documento === 2">Recibo</v-chip>
              <v-chip dark x-small color="indigo" v-if="item.tipo_documento === 3">DXC</v-chip>
              <v-chip dark x-small color="indigo" v-if="item.tipo_documento === 5">Anticipos</v-chip>
            </template>
            <template v-slot:item.total="{item}">
              L {{int.format(item.total)}}
            </template>
            <template v-slot:item.id="{item}">
              <b-link v-if="item.tipo_documento === 1 && item.factura" @click="solicitarClave(1, 0, item)">{{item.factura.contador}}</b-link>
              <b-link v-else-if="item.tipo_documento === 2 && item.recibo" @click="solicitarClave(2,2,item.recibo)">{{item.recibo.codigo}}</b-link>
              <b-link v-else-if="item.tipo_documento === 3 && item.recibo" @click="solicitarClave(2,3,item.recibo)">{{item.recibo.codigo}}</b-link>
              <b-link v-else-if="item.tipo_documento === 5 && item.recibo" @click="solicitarClave(2,5,item.recibo)">{{item.recibo.codigo}}</b-link>
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
        if (i.tipo_documento !== 4)
          total = parseFloat(total) + parseFloat(i.total);
      });
      return total.toFixed(2);
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
    FORMA_PAGOS(){
      return this.$store.state.caja.HISTORIAL;
    },
    LOAD_FORMA_PAGOS(){
      return this.$store.state.caja.LOAD_HISTORIAL;
    },
    TOTAL_CAJA(){
      return this.$store.state.caja.CAJA_EFECTIVO;
    },
    USUARIO(){
      return this.$store.state.usuario;
    }
  },
  data(){
    return{
      int: new Intl.NumberFormat(),
      header:[
        {text:'Tipo',value:'tipo_documento'},
        {text:'Código',value:'id'},
        {text:'Total',value:'total'},
      ],
      headerFP:[
        {text:'Nombre',value:'nombre'},
        {text:'Total',value:'total'},
      ],
      fac: {},
    }
  },
  created() {
    let     f = new Date();
    let fecha = f.getFullYear()+'-'+(f.getMonth() + 1)+'-'+f.getDate();
    this.$store.commit('caja/cargar_DOCUMENTOS',{fecha: fecha, caja: this.CAJA.id, tipo: 3});
    this.$store.commit('caja/cargar_HISTORIAL', fecha);
    this.$store.commit('activarOverlay', false);
  },
  methods:{
    abrirNavegador(clave, tipo, recibo){
      let url = '';
      if (tipo === 1)
        url = this.$axios.defaults.baseURL+'documentos/cajas/factura/usuario='+this.USUARIO+'/factura='+this.fac.factura.contador+'/'+clave;
      else if(tipo === 2 && recibo === 2)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibos/usuario=' + this.USUARIO + '/recibo=' + this.fac.codigo + '/' + clave;
      else if(tipo === 2 && recibo === 3)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibo_dxc/usuario=' + this.USUARIO + '/recibo=' + this.fac.codigo + '/' + clave;
      else if (tipo === 2 && recibo === 5)
        url = this.$axios.defaults.baseURL+'documentos/cajas/recibo_anticipo/usuario='+this.USUARIO+'/recibo='+this.fac.codigo+'/'+clave;

      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    solicitarClave(tipo, recibo, data){
      this.$store.commit('activarOverlay', true);
      this.fac = data;
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave, tipo, recibo);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Ocurrio un error', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
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
