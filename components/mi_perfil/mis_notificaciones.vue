<template>
<v-card>
  <v-toolbar dense flat>
    <h6>Mis Notificaciones Laborales</h6>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-text-field dense label="Buscar" class="ma-2" v-model="search"></v-text-field>
  </v-toolbar>

  <v-data-table dense :headers="headers" :loading="loadNotificaciones" :items="notificaciones"
                loading-text="Cargando Notificaciones Laborales" @click:row="abrirDialogo"></v-data-table>

  <v-dialog width="95%" v-model="dialogoC">
    <v-card>
      <v-toolbar flat tile color="grey lighten-4">
        <v-toolbar-title>Cargando Notificación {{noti.codigo}}</v-toolbar-title>
      </v-toolbar>
      <v-card flat tile class="ma-2">
        <v-simple-table  class="ma-5" dense>
          <template>
            <thead>
            <tr>
              <th>Asunto</th>
              <th>Documento</th>
              <th>Cargar</th>
              <th>Documento Firmado</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{noti.asunto}}</td>
              <td><b-link @click="solicitarClave">Ver documento</b-link></td>
              <td>
                <v-file-input  accept="application/pdf" dense v-model="documento"></v-file-input>
              </td>
              <td>
                <b-link @click="verDocumento">Ver documento</b-link>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="warning" small class="ma-2" dark text tile @click="dialogo = false">Cerrar</v-btn>
        <v-btn color="indigo" small  class="ma-2" dark tile @click="cargarDocumento">Cargar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "mis_notificaciones",
  created() {
    this.$store.commit('guardarTitulo', 'Otras Gestiones > Mi Perfil > Notificaciones');
    this.cargarNotificaciones();
  },
  data(){
    return{
      dialogoC: false,
      documento: null,
      file: {},
      noti: {},
      search: '',
      loadNotificaciones: true,
      notificaciones: [],
      headers:[
        {text: 'Tipo de Notificación', value:'memo_tipo_documento.nombre'},
        {text: 'Creador', value:'user.usuario'},
        {text: 'Asunto', value:'asunto'},
      ],
      cont: 0,
    }
  },
  computed:{
    USUARIO(){
      return this.$store.state.usuario;
    },
  },
  methods:{
    abrirDialogo(data){
      this.noti      = data;
      this.dialogoC  = true;
      let documentos = [];
      if (this.noti.url_documento)
        documentos   = JSON.parse(this.noti.url_documento)

      documentos.forEach((item, i)=>{
        if (parseInt(item.key) === parseInt(this.$store.state.usuario_id)) {
          this.cont = i;
          this.file = documentos[i];
        }
      })
    },
    abrirNavegador(clave){
      let url = this.$axios.defaults.baseURL + 'documentos/mis_notificaciones/usuario=' + this.USUARIO+'/codigo='+this.noti.codigo+'/'+clave;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
      this.dialogoC = true;
    },
    cargarDocumento(){
      if (this.documento){
        this.dialogoC = false;
        this.$store.commit('activarOverlay', true);
        let data = new FormData();
        data.append('file', this.documento);
        data.append('id', this.noti.id)
        data.append('cont', this.cont)
        this.$axios({
          url: 'memo/cargar_notificacion',
          method: 'post',
          data: data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          this.documento = null;
          this.cargarNotificaciones();
          this.$store.commit('activarOverlay', false);
        }).catch((error)=>{
          this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento', color:'error'});
          this.$store.commit('activarOverlay', false);
        })
      }else this.$store.commit('notificacion',{texto:'Tienes que cargar un documento', color:'warning'})
    },
    cargarNotificaciones(){
      this.$axios.get('memo/mis_notificaciones').then((res)=>{
        this.notificaciones     = res.data.notificaciones;
        this.loadNotificaciones = false;
      })
    },
    solicitarClave(){
      this.dialogoC= false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave)
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      });
    },
    verDocumento(){
      this.dialogoC = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: this.file.file}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false)
          this.dialogoC = true;
        }
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
        this.dialogoC = true;
      })
    }
  }
}
</script>

<style scoped>

</style>