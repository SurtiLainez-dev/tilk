<template>
<v-card flat>
  <v-data-table :loading="load" loading-text="Cargando Notificaciones ..." @click:row="abrirDialogo"
                :search="search" dense :headers="headers" :items="notificaciones">
    <template v-slot:item.estado="{item}">
      <v-chip x-small dark v-if="item.estado === 0" color="red">Pendiente</v-chip>
      <v-chip x-small dark v-else-if="item.estado === 1" color="success">Verificado</v-chip>
    </template>
  </v-data-table>


  <v-dialog v-model="dialogo" width="55%">
    <v-card>
      <v-toolbar tile flat color="grey lighten-4"><v-card-title>{{noti.asunto}}</v-card-title></v-toolbar>
      <v-card flat tile :loading="loading">
        <v-card flat tile v-if="!loading" class="ma-5">
          <v-simple-table dense>
            <template>
              <thead>
              <tr>
                <th>Grupal</th>
                <th>Estado</th>
                <th>Acciones</th>
                <th>Imprimir</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>
                  <span v-if="noti.grupal === 0">Firma Individual</span>
                  <span v-else-if="noti.grupal === 1">Firma Grupal</span>
                </td>
                <td>
                  <v-chip x-small color="warning" dark v-if="noti.estado === 0">Pendiente</v-chip>
                  <v-chip x-small color="success" dark v-else-if="noti.estado === 1">Validado</v-chip>
                </td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn fab x-small dark v-on="on" v-bind="attrs" @click="validar"
                             v-if="noti.estado === 0 && usuario == noti.user_id" icon color="success"><v-icon>fa fa-check</v-icon></v-btn>
                    </template>
                    <span>Validar Notificación</span>
                  </v-tooltip>
                </td>
                <td><b-link @click="solicitarClave">Imprimir</b-link></td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-divider></v-divider>

          <v-simple-table dense>
            <template>
              <thead>
              <tr>
                <th>Usuarios</th>
                <th>Colaboradores</th>
                <th>Documento Firmado</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in usuarios">
                <td>{{item.usuario}}</td>
                <td>{{item.colaborador.nombres}} {{item.colaborador.apellidos}}</td>
                <td v-for="i in JSON.parse(noti.url_documento)" v-if="noti.grupal === 0 && item.id === i.key">
                  <b-link @click="verDocumento(i.file)" v-if="i.file">Ver documento</b-link>
                  <span v-else>No hay documento</span>
                </td>
                <td v-for="i in JSON.parse(noti.url_documento)" v-else-if="noti.grupal === 1">
                  <b-link @click="verDocumento(i.file)" v-if="i.file">Ver documento grupal</b-link>
                  <span v-else>No hay documento</span>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-divider></v-divider>
        </v-card>

        <v-card-actions class="d-flex justify-end">
          <v-btn class="ma-2" dark @click="dialogo = false" color="indigo" tile small>Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "notificaciones",
  data(){
    return{
      dialogo: false,
      noti: {},
      headers:[
        {text:'Usuario Creador', value:'usuario'},
        {text:'Tipo', value:'tipo'},
        {text:'Asunto', value:'asunto'},
        {text:'Estado', value:'estado'},
      ],
      loading: false,
      usuarios: []
    }
  },
  props:{
    notificaciones: Array,
    usuario: Number,
    search: '',
    load: Boolean
  },
  computed:{
    USUARIO(){
      return this.$store.state.usuario;
    },
  },
  methods:{
    abrirDialogo(data){
      this.noti    = data;
      this.loading = true;
      this.dialogo = true;
      this.$axios.get('memo/notificacion/'+data.id).then((res)=>{
        this.noti     = res.data.notificacion;
        this.usuarios = res.data.usuarios;
        this.loading  = false;
      })
    },
    abrirNavegador(clave){
      let url = this.$axios.defaults.baseURL + 'documentos/mis_notificaciones/usuario=' + this.USUARIO+'/codigo='+this.noti.codigo+'/'+clave;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
      this.dialogo = true;
    },
    solicitarClave(){
      this.dialogo= false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave)
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      });
    },
    validar(){
      this.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.get('memo/notificacion/validar/'+this.noti.id).then((res)=>{
        this.$store.commit('notificacion',{texto: res.data.msj, color:'success'})
        this.$store.commit('activarOverlay', false);
        this.noti = res.data.notificacion;
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor', color:'error'});
        this.dialogo = true;
      })
    },
    verDocumento(url){
      this.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: url}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false)
          this.dialogo = true;
        }
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
        this.dialogo = true;
      })
    }

  }
}
</script>

<style scoped>

</style>