<template>
  <v-card flat>
    <v-toolbar flat>
      <h6>Solicitudes de Crédito del cliente</h6>
      <v-spacer></v-spacer>
      <v-text-field label="Buscar" dense v-model="search"></v-text-field>
    </v-toolbar>
    <v-data-table :headers="header"
                  :search="search"
                  :items="SOLICITUDES"
                  class="rowsTable"
                  loading-text="Cargando Solicitudes de Crédito"
                  :loading="Load">
      <template v-slot:item.tiempo="{item}">
        {{item.tiempo}} meses
      </template>
      <template v-slot:item.prima="{item}">
        L. {{item.prima}}
      </template>
      <template v-slot:item.estado="{item}">
        <v-chip v-if="item.estado === 1" x-small dark color="warning">Pendiente</v-chip>
        <v-chip v-else-if="item.estado === 2" x-small dark color="indigo">Falta documentación</v-chip>
        <v-chip v-else-if="item.estado === 3" x-small dark color="red">Rechazado</v-chip>
        <v-chip v-else-if="item.estado === 4" x-small dark color="success">Aprobado</v-chip>
        <v-chip v-else-if="item.estado === 5" x-small dark color="success">Venta Realizada</v-chip>
      </template>
    </v-data-table>
    <br>
    <v-card-subtitle>Solicitudes de Crédito como aval</v-card-subtitle>
    <v-data-table :headers="headerAval"
                  :items="SOLICITUDES_AVAL"
                  class="rowsTable"
                  @click:row="abrirDialogo"
                  loading-text="Cargando Solicitudes de Crédito"
                  :loading="Load">
      <template v-slot:item.solicitud_credito.tiempo="{item}">
        {{item.solicitud_credito.tiempo}} meses
      </template>
      <template v-slot:item.solicitud_credito.cliente.nombres="{item}">
        {{item.solicitud_credito.cliente.nombres}} {{item.solicitud_credito.cliente.apellidos}}
      </template>
    </v-data-table>

    <v-dialog v-model="solicitud.dialogo" width="40%">
      <v-card v-if="solicitud.dialogo" class="pa-2">
        <v-card-title>Datos del aval {{solicitud.data.cliente.nombres}} {{solicitud.data.cliente.apellidos}}</v-card-title>
        <v-card-subtitle>Solicitud de crédito # {{solicitud.data.solicitud_credito.codigo}} de
          {{solicitud.data.solicitud_credito.cliente.nombres}} {{solicitud.data.solicitud_credito.cliente.apellidos}}</v-card-subtitle>
        <v-divider></v-divider>
        <v-container>
          <b-link @click="solicitarClave">Imprimir solicitud de crédito</b-link>
          <br>
          <v-divider></v-divider>
          <div v-if="solicitud.data.documento">
            <b-link @click="verDocumento">Ver documento cargado</b-link>
            <br>
            <v-divider></v-divider>
          </div>
          <v-file-input v-model="solicitud.documento" dense label="Subir solicitúd de crédito"></v-file-input>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="warning" tile small @click="solicitud.dialogo = false" dark>Cerrar</v-btn>
            <v-btn color="success" tile small dark @click="cargarDocumentoAval">Registrar Solicitud</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "solicitudes_cliente",
  computed:{
    CLIENTE(){
      return this.$store.state.cliente.CLIENTE;
    },
    user(){
      return this.$store.state.usuario;
    },
    SOLICITUDES: {
      get: function(){
        return this.$store.state.cliente.SOLICITUDES;
      },
      set: function(solicitudes){
        this.$store.commit('cliente/agregar_SOLICITUDES', solicitudes);
      }
    },
    SOLICITUDES_AVAL:{
      get: function (){
        return this.$store.state.cliente.SOLICITUDES_AVAL;
      },
      set: function (data){
        this.$store.commit('cliente/agregar_SOLICITUDES_AVAL', data);
      }
    }
  },
  data(){
    return{
      search: '',
      Load: true,
      header:[
        {text:'Código',value: 'codigo'},
        {text:'Artículo',value: 'articulo.nombre_articulo'},
        {text:'Forma de Pago',value: 'forma_pago'},
        {text:'Tiempo',value: 'tiempo'},
        {text:'Prima',value: 'prima'},
        {text:'Estado',value: 'estado'},
      ],
      headerAval:[
        {text:'Código',value: 'solicitud_credito.codigo'},
        {text:'Artículo',value: 'solicitud_credito.articulo.nombre_articulo'},
        {text:'Tiempo',value: 'solicitud_credito.tiempo'},
        {text:'Nombre',value: 'solicitud_credito.cliente.nombres'},
      ],
      solicitud: {
        soli: null,
        data: {},
        dialogo: false,
        documento: null
      }
    }
  },
  created() {
    this.cargarSolicitudes();
  },
  methods:{
    abrirDialogo(data){
      this.solicitud.data    = data;
      this.solicitud.soli    = data.id;
      this.solicitud.dialogo = true;
    },
    cargarDocumentoAval(){
      if (this.solicitud.documento){
        let data = new FormData();
        data.append('id',        this.solicitud.soli);
        data.append('documento', this.solicitud.documento);
        this.solicitud.dialogo = false;
        this.$store.commit('activarOverlay', true);
        this.$axios({
          method: 'post',
          url:    'solicitud_credito/doc/aval',
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          },
          data: data
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          this.cargarSolicitudes();
          this.solicitud.documento = null;
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'danger'});
          this.solicitud.dialogo = true;
        })
      }else {
        this.$store.commit('notificacion',{texto:'El campo está vacio', color:'warning'});
      }
    },
    cargarSolicitudes(){
      this.Load = true
      this.$axios.get('solicitudes_credito/'+this.CLIENTE.id).then((res)=>{
        this.SOLICITUDES = res.data.solicitudes;
        this.SOLICITUDES_AVAL = res.data.soli_aval;
        this.Load = false
      })
    },
    imprimirsolicitud(clave){
      this.solicitud.dialogo = true;
      let url = this.$axios.defaults.baseURL+'documentos/ventas/solicitud_credito_aval/usuario='+this.user+'/solicitud='+this.solicitud.soli+'/'+clave;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    solicitarClave(){
      this.solicitud.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.imprimirsolicitud(res.data.clave);
      });
    },
    verDocumento(){
      this.solicitud.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: this.solicitud.data.documento}).then((res)=>{
        this.$store.commit('tareas/cambiarValorVista', true);
        if (res.status === 200){
          ipcRenderer.send('open-nav', res.data.url);
          this.$store.commit('activarOverlay', false);
          this.solicitud.dialogo = true;
        }
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.solicitud.dialogo = true;
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
