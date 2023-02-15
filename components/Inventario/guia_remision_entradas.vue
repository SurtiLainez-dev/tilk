<template>
  <v-card flat>
    <table>
      <thead>
      <tr>
        <th colspan="4" class="text-center" style="font-size: 20px">{{GUIA.num_guia}}</th>
      </tr>
      <tr>
        <th>Proveedor</th>
        <th>Sucursal de Entrada</th>
        <th>Referencia Orden Entrada</th>
        <th>Tipo de Ingreso</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{ORDEN.proveedor}}</td>
        <td>{{ORDEN.sucursal}}</td>
        <td>{{ORDEN.codigo}}</td>
        <td>{{ORDEN.entrada}}</td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th>Colaborador Responsable</th>
        <th>Fecha de Creación</th>
        <th>Tipo de Guía de Remisión</th>
        <th># Guía de Remisión</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{GUIA.colaborador.nombres}} {{GUIA.colaborador.apellidos}}</td>
        <td>{{ORDEN.fecha_creacion.split('-')[2]+'/'+ORDEN.fecha_creacion.split('-')[1]+'/'+ORDEN.fecha_creacion.split('-')[0]}}</td>
        <td>
          <span v-if="GUIA.tipo === 1">Consignada</span>
          <span v-else-if="GUIA.tipo === 0">Facturada</span>
        </td>
        <td>{{GUIA.num_guia}}</td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th colspan="3">Observación</th>
        <th>Documento</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="3">{{ORDEN.observacion}}</td>
        <td v-if="GUIA.file"><b-link @click="goFile">Ver Documento de la Guia </b-link></td>
        <td v-else><b-link @click="dialogo = true">Cargar Guía de Remisión</b-link></td>
      </tr>
      </tbody>
    </table>
    <br>
    <table style="border: none">
      <thead>
      <tr>
        <th colspan="8" style="border-top: none">Cuerpo de Guía de Remisión</th>
      </tr>
      <tr style="border-bottom:solid #b2b0b0 1px ">
        <th>Marca</th>
        <th>Modelo</th>
        <th>Chasis</th>
        <th>Motor</th>
        <th>CC</th>
        <th>Año</th>
        <th>Color</th>
        <th>Ubicación Actual</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in GUIA.motocicletas">
        <td v-text="item.remision_articulo.articulo.marca.nombre"></td>
        <td v-text="item.remision_articulo.articulo.modelo"></td>
        <td v-text="item.chasis"></td>
        <td v-text="item.motor"></td>
        <td v-text="item.cilindraje"></td>
        <td v-text="item.anio"></td>
        <td v-text="item.color"></td>
        <td v-text="item.remision_articulo.sucursal.nombre"></td>
      </tr>
      </tbody>
    </table>

    <v-dialog v-model="dialogo" width="40%">
      <v-card>
        <v-card-title>Cargar Documento</v-card-title>
        <v-divider></v-divider>
        <v-file-input accept="application/pdf" v-model="file" class="ma-3" label="Cargar Documento"></v-file-input>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn small tile color="orange" dark class="ma-2" @click="dialogo = false">Cerrar</v-btn>
          <v-btn small tile color="success" dark class="ma-2" @click="cargarDocumento">Cargar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";
import Swal from "sweetalert2";

export default {
  name: "guia_remision_entradas",
  data(){
    return{
      dialogo: false,
      file:    null
    }
  },
  computed:{
    GUIA(){
      return this.$store.state.inventario.ordenes_entrada.GUIA_REMISION;
    },
    ORDEN(){
      return this.$store.state.inventario.ordenes_entrada.INFO_ORDEN;
    }
  },
  methods:{
    cargarDocumento(){
      if (this.file) {
        this.$store.commit('activarOverlay', true);
        this.dialogo = false;
        let data = new FormData()
        data.append('orden', this.ORDEN.id);
        data.append('file', this.file);
        this.$axios({
          method: 'post',
          url:    'guia_remision/file',
          data:   data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.cargarRemision();
        })
      }else {
        this.$store.commit('notificacion', {texto: 'Tienes que seleccionar un documento', color: 'warning'});
      }
    },
    cargarRemision(){
      this.$axios.get('guia_remision/'+this.ORDEN.id).then((res)=>{
        this.$store.commit('inventario/ordenes_entrada/asignar_GUIAREMISION', res.data.guia);
        this.$store.commit('activarOverlay', false);
      })
    },
    goFile(){
      this.$store.commit('activarOverlay', true);
      this.$axios.get('guia_remision/file/'+this.ORDEN.id).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('open-nav', res.data.url)
          this.$store.commit('activarOverlay', false);
        }
      })
    },
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border: solid #b2b0b0 1px;
}

table thead tr th{
  padding: 5px;
  font-size: 14px;
  border-left: solid #b2b0b0 1px;
  border-top: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 12px;
  cursor: pointer;
}
table tbody tr td table{
  width: 80%;
}
table tbody tr td table thead tr th{
  font-size: 10px;
  padding: 2px;
}
table tbody tr td table tbody tr td{
  font-size: 9px;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr td:hover{
  background-color: #f6f6f6;
}
</style>