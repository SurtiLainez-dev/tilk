<template>
  <v-card flat>
    <v-toolbar dense color="grey lighten-4" flat>
      <v-card-title>Ordenes de Entrega Enlazadas a mi Usuario</v-card-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field dense label="Buscar ..." v-model="search"></v-text-field>

    </v-toolbar>
    <v-data-table :search="search" :loading="LOAD_ORDENES" :headers="header" :items="ORDENES"
                  loading-text="Cargando datos..." @click:row="selesctOrden">
      <template v-slot:item.id="{item}">
        <v-chip x-small color="success" v-if="item.file" dark>Cargado</v-chip>
        <v-chip x-small color="orange" v-else dark>Pendiente</v-chip>
      </template>
    </v-data-table>

    <v-dialog v-model="dialogo" width="45%">
      <v-card>
        <v-toolbar flat color="grey lighten-4">
          <v-card-title>{{data.titulo}}</v-card-title>
        </v-toolbar>
        <v-card-subtitle>{{data.detalle}}</v-card-subtitle>

        <v-card class="pa-4" flat>
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
              <tr>
                <th>Fecha:</th>
                <td>{{data.fecha}}</td>
              </tr>
              <tr>
                <th>Para:</th>
                <td>{{data.destino}}</td>
              </tr>
              <tr v-if="data.file">
                <th>Documento</th>
                <td><b-link @click="verDocumento(data.file)">Ver</b-link></td>
              </tr>
              <tr v-else>
                <th>Imprimir Orden:</th>
                <td><b-link @click="solicitarClave">Imprimir</b-link></td>
              </tr>
              <tr>
                <th>Observación:</th>
                <td>{{data.observacion}}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider></v-divider>
          <v-file-input v-if="!data.file" dense label="Orden Escaneada" class="ma-2" v-model="file"></v-file-input>
          <v-textarea v-if="!data.file" dense class="ma-2" label="Observación"
                      v-model="data.observacion" ></v-textarea>

          <v-card-actions class="d-flex justify-end">
            <v-btn color="success" dark tile small @click="actualizarOrden">Subir Documento</v-btn>
            <v-btn color="orange" @click="cerrarDialogo" dark tile small>Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "ordenes",
  data(){
    return{
      dialogo: false,
      file: null,
      search: '',
      data: {},
      header:[
        {text: 'Fecha', value:'fecha'},
        {text: 'Para', value:'destino'},
        {text: 'Título', value:'titulo'},
        {text: 'Estado', value:'id'},
      ]
    }
  },
  created() {
    this.$store.commit('orden_genericas/cargar_MISORDENES')
  },
  computed:{
    ORDENES(){
      return this.$store.state.orden_genericas.MIS_ORDENES;
    },
    LOAD_ORDENES(){
      return this.$store.state.orden_genericas.LOAD_ORDENES;
    }
  },
  methods:{
    actualizarOrden(){
      if (this.file){
        this.dialogo = false;
        let data = new FormData();
        data.append('orden', this.data.id);
        data.append('file', this.file);
        data.append('observacion', this.data.observacion);
        this.$store.commit('activarOverlay', true);
        this.$axios.post('ordenes_entrega_genericas/update', data).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('orden_genericas/cargar_ORDENES');
          this.file = null;
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.dialogo = true;
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'})
        })
      }else{
        this.$store.commit('notificacion',{texto:'No hay archivo adjunto', color:'warning'})
      }
    },
    cerrarDialogo(){
      this.dialogo = false;
      this.file =  null;
    },
    imprimirInventario(clave){
      let url = this.$axios.defaults.baseURL+'documentos/orden_entrega_generica/usuario='+this.user+'/orden='+this.data.id+'/'+clave;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
      this.dialogo = true;
    },
    selesctOrden(item){
      this.data = item;
      this.dialogo = true;
    },
    solicitarClave(){
      this.$store.commit('activarOverlay', true);
      this.dialogo = false;
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.$store.commit('notificacion',{texto:'Cargando inventario', color:'success'});
        this.imprimirInventario(res.data.clave);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'danger'});
      })
    },
    verDocumento(dir){
      this.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: dir}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('open-nav', res.data.url);
          this.$store.commit('activarOverlay', false);

        }
        this.dialogo = true;
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })
    },
  }
}
</script>

<style scoped>

</style>
