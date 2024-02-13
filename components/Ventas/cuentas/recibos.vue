<template>
  <v-card flat tile>
    <v-card flat tile>
      <v-file-input v-model="file" accept="application/pdf" class="ma-2" label="Factura SAR"></v-file-input>
      <v-card-actions class="d-flex justify-end">
        <v-btn small class="ma-2" tile color="indigo" dark @click="cargarFactura">Cargar Factura SAR</v-btn>
      </v-card-actions>
      <v-divider> </v-divider>
      <v-simple-table dense class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>#</th>
          <th>Fecha</th>
          <th>Referencia</th>
          <th>Total</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in CUENTA.recibos">
          <th>{{i+1}}</th>
          <td>{{item.fecha}}</td>
          <td>
            <b-link @click="solicitarClave(item.codigo, item.file)">{{item.codigo}}</b-link>
          </td>
          <td>L {{item.total}}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    </v-card>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";
import Swal from "sweetalert2";

export default {
  name: "recibos",
  data(){
    return{
      file: ''
    }
  },
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
    USUARIO(){
      return this.$store.state.usuario;
    }
  },
  methods:{
    abrirNavegador(clave, recibo, tipo){
    let url = '';
    if(!tipo || tipo == 1)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibos/usuario=' + this.USUARIO + '/recibo=' + recibo + '/' + clave;
    else if(tipo == 2)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibo_dxc/usuario=' + this.USUARIO + '/recibo=' + recibo + '/' + clave;

    ipcRenderer.send('pint_navegador', url);
    this.$store.commit('activarOverlay', false);
    },
    cargarFactura(){
      if (this.file){
        this.$store.commit('activarOverlay', true);
        let data = new FormData();
        data.append('factura_sar', this.file);
        data.append('id', this.CUENTA.id)
        this.$axios({
          method: 'post',
          url:    'cargar_documentos_venta',
          data:   data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.$store.commit('notificacion',{texto:res.data.mjg, color:'success'});
          this.$store.commit('notificacion',{texto:'Recargando datos', color:'success'});
          this.$axios.get('cuentas/ventas/'+this.CUENTA.id).then((res)=>{
            this.$store.commit('cuentas/agregar_CUENTA', res.data.venta);
            this.$store.commit('notificacion',{texto:'Datos cargados exitosamente', color:'success'});
            this.loadData = true;
          }).then(res=>{
            this.$store.commit('activarOverlay', false);
          })
        }).catch((error)=>{
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
          this.$store.commit('activarOverlay', false);
        })
      }
    },
    solicitarClave(recibo, tipo){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave, recibo, tipo);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Ocurrio un error', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
