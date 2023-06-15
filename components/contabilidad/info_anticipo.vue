<template>
<v-card flat>
  <v-progress-linear indeterminate v-if="LOADANTICIPO"></v-progress-linear>
  <v-row>
    <v-col cols="1"></v-col>
    <v-col cols="10">
      <v-card v-if="!LOADANTICIPO" flat>
        <table>
          <thead>
          <tr>
            <th colspan="3">Datos del Cliente</th>
          </tr>
          <tr>
            <th>Identidad</th>
            <th>Nombres</th>
            <th>Apellidos</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{ANTICIPO.cliente.identidad}}</td>
            <td>{{ANTICIPO.cliente.nombres}}</td>
            <td>{{ANTICIPO.cliente.apellidos}}</td>
          </tr>
          </tbody>
        </table>

        <table>
          <thead>
          <tr>
            <th colspan="5">Datos del Anticipo</th>
          </tr>
          <tr>
            <th>Monto Disponible</th>
            <th>Motivo</th>
            <th>Creado</th>
            <th>Estado</th>
            <th>Documento</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{int.format(ANTICIPO.monto)}} lps</td>
            <td>{{ANTICIPO.motivo}}</td>
            <td>
              {{ANTICIPO.created_at.split('T')[0].split('-')[2]}}/{{ANTICIPO.created_at.split('T')[0].split('-')[1]}}/{{ANTICIPO.created_at.split('T')[0].split('-')[0]}}
            </td>
            <td>
              <v-chip x-small dark color="red" v-if="ANTICIPO.estado === 0">Pendiente</v-chip>
              <v-chip x-small dark color="green" v-else-if="ANTICIPO.estado === 1">Liquidado</v-chip>
            </td>
            <td>
              <b-link v-if="ANTICIPO.archivo" @click="verDocumento(ANTICIPO.archivo)">Ver documento adjunto</b-link>
              <span v-else>No hay documento</span>
            </td>
          </tr>
          </tbody>
        </table>

        <table >
          <thead>
          <tr>
            <th>Codigo CC</th>
            <th>Saldo Actual de la CC</th>
            <th>Recibo</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{ANTICIPO.cc.cod}}</td>
            <td>{{int.format(ANTICIPO.cc.total)}} lps</td>
            <td>
              <b-link v-if="ANTICIPO.recibo" @click="solicitarClave(ANTICIPO.recibo.codigo)">Ver recibo {{ANTICIPO.recibo.codigo}}</b-link>
              <span v-else>No se ha liquidado</span>
            </td>
          </tr>
          </tbody>
          <thead>
          <tr>
            <th>Caja</th>
            <th>Sucursal</th>
            <th>Total del Recibo</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{ANTICIPO.recibo.caja.codigo}}</td>
            <td>{{ANTICIPO.recibo.caja.sucursal.nombre}}</td>
            <td>L. {{int.format(ANTICIPO.recibo.total)}}</td>
          </tr>
          </tbody>
        </table>

      </v-card>
    </v-col>
    <v-col cols="1"></v-col>
  </v-row>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "info_anticipo",
  data(){
    return{
      int: Intl.NumberFormat(),
    }
  },
  computed:{
    ANTICIPO(){
      return this.$store.state.contabilidad.anticipos.ANTICIPO;
    },
    LOADANTICIPO(){
      return this.$store.state.contabilidad.anticipos.LOADANTICIPO
    },
    USUARIO(){
      return this.$store.state.usuario
    }
  },
  methods:{
    print_DXC(clave, recibo){
      let url = this.$axios.defaults.baseURL+'documentos/cajas/recibo_anticipo/usuario='+this.USUARIO+'/recibo='+recibo+'/'+clave;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    solicitarClave(recibo){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.print_DXC(res.data.clave, recibo);
      }).catch((error)=>{
        this.dialogoPartida = true;
        this.$store.commit('activarOverlay', false);
      });
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
      })
    }
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