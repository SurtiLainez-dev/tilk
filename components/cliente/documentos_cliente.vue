<template>
  <v-card flat>
    <v-simple-table dense class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>Detalle</th>
          <th>Ver/Descargar</th>
          <th>Quitar</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in Archivos">
          <td v-if="item.status === 1 || item.status">{{item.detalle}}</td>
          <td v-else>
            <v-text-field dense v-model="item.detalle" :disabled="item.key < longArchivos"
                          placeholder="Nombre del archivo"></v-text-field>
          </td>
          <td>
            <v-btn v-if="item.status === 1 || item.status" color="red" @click="verDocumento(item.dir)"
                   dark x-small >Ver Documento</v-btn>
            <v-file-input dense counter accept=".pdf"
                          v-else v-model="item.file"></v-file-input>
          </td>
          <td>
            <v-btn color="red" class="text-white" :disabled="item.key < longArchivos"
                   width="25" height="25" x-small fab tile @click="removeTelefono(item.key)">
              <v-icon>fa fa-times</v-icon>
            </v-btn>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-divider></v-divider>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="indigo" small dark tile @click="addArchivos">
        <v-icon left>fa fa-plus</v-icon>
        Agregar Archivo
      </v-btn>
      <v-btn color="success" small class="text-white" :disabled="!habilitarBtnEnvio"
             tile @click="validarArchivos">Guardar Archivos</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";
import Vue from "vue";

export default {
  name: "documentos_cliente",
  computed:{
    CLIENTE: function (){
      get: {
        return this.$store.state.cliente.CLIENTE;
      }
    }
  },
  created() {
    if (this.CLIENTE.archivos){
      this.Archivos = JSON.parse(this.CLIENTE.archivos);
      this.longArchivos = this.Archivos.length;
    }
    this.limpiarArchivos();
  },
  data(){
    return{
      Archivos: [],
      longArchivos: 0,
      EnvioArchivos: [],
      habilitarBtnEnvio:  false
    }
  },
  methods:{
    addArchivos(){
      this.Archivos.push({
        dir: '',
        key: this.Archivos.length,
        num: 2,
        file: null,
        estado: 0,
        status: false
      })
      this.habilitarBtnEnvio = true;
    },
    envioArchivos(){
      let data = new FormData();
      for (let i in this.EnvioArchivos){
        data.append(`file_cliente[${i}]`, this.EnvioArchivos[i].file);
      }

      data.append('id', this.CLIENTE.id);
      data.append('archivos', JSON.stringify(this.Archivos));
      this.$store.commit('activarOverlay', true);

      this.$axios({
        method:'post',
        url:'clientes/edit/files',
        data:data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.Archivos = res.data.archivos;
        this.EnvioArchivos = [];
        this.CLIENTE.archivos = JSON.stringify(res.data.archivos);
        this.longArchivos = this.Archivos.length;
        this.notificacion('Se han agregago los documentos exitosamente,','success');

        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })

    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    limpiarArchivos(){
      this.Archivos.forEach((i)=>{
        i.file = null;
      })
    },
    removeTelefono(key){
      let item = 0;
      this.Archivos.splice(key, 1);
      this.Archivos.forEach( (i) => {
        i.key = item;
        item++;
      })
      if (this.longArchivos >= this.Archivos.length)
        this.habilitarBtnEnvio = false;
    },
    validarArchivos(){
      let cont = 0,  bandera = 0, invalidos = 0;
      this.EnvioArchivos = [];
      this.Archivos.forEach( (i)=>{
        if (!i.status || i.status === 0){
          invalidos++;
          if (i.file) {
            cont++;
            if (i.detalle){
              bandera++;
              this.EnvioArchivos.push(i);
              i.estado = 1;
            }
          }
        }
      });

      if (invalidos === bandera && invalidos === cont)
        this.envioArchivos();
      else
        this.notificacion('Hay filas de archivos invalidos.','error');
    },
    verDocumento(url){
      this.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: url}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('open-nav', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
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
