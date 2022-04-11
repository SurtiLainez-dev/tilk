<template>
<v-card>
  <v-card :loading="load" v-if="vista === 1" flat>
    <v-card flat v-if="CAJAS">
      <v-toolbar flat color="grey lighten-4">
        <h5>Cajas Generales de {{SUCURSAL}}</h5>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card flat :disabled="PERMISOS.includes(151)">
        <v-simple-table dense class="rowsTable">
          <thead>
          <tr>
            <th>Sucursal</th>
            <th>#</th>
            <th>Código</th>
            <th>Usuario Responsable</th>
            <th>Estado de Horario</th>
            <th>Estado Actual</th>
            <th>Estado Configuración</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in CAJAS" @click="abrirDialogoIngreso(item)">
            <td>{{item.sucursal.nombre}}</td>
            <td>{{item.num_caja}}</td>
            <td>{{item.codigo}}</td>
            <td>{{item.user.usuario}}</td>
            <td>
              <v-chip x-small dark v-if="item.estado_cierre === 1" color="orange">Abierta a cualquier hora</v-chip>
              <v-chip x-small dark v-else-if="item.estado_cierre === 0" color="indiigo">Con horarios</v-chip>
            </td>
            <td>
              <v-chip x-small dark v-if="item.estado === 1" color="success">Abierta</v-chip>
              <v-chip x-small dark v-else-if="item.estado === 0" color="orange">Cerrada</v-chip>
            </td>
            <td>
              <v-chip x-small dark v-if="item.activa === 1" color="success">Disponible</v-chip>
              <v-chip x-small dark v-else-if="item.activa === 0" color="orange">No disponible</v-chip>
            </td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-card>
    </v-card>
  </v-card>


  <v-dialog v-model="dialogoIngreso" width="50%">
    <v-card :loading="verificacionPasswor">
      <v-toolbar color="grey lighten-3" flat>
        <h5>Accediendo a la Caja {{Caja.codigo}}</h5>
        <v-spacer></v-spacer>
        <h6 class="grey--text">{{SUCURSAL}}</h6>
      </v-toolbar>
      <v-row no-gutters class="pa-5">
        <v-col cols="7">
          <v-text-field v-model="password" :type="show ? 'text' : 'password'" @keyup.enter="validarIngreso"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" label="Contraseña"
                        class="input-group--focused ma-4" @click:append="show = !show">
          </v-text-field>
        </v-col>
        <v-col cols="5" class="d-flex align-center justify-end">
          <v-btn color="success" class="text-white" :disabled="verificacionPasswor"
                 tile @click="validarIngreso">Acceder</v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row no-gutters class="pa-5" v-if="Caja.user">
        <v-col cols="8">
          <small>Usuario Responsanle: {{Caja.user.usuario}}</small>
        </v-col>
        <v-col class="d-flex justify-end align-center">
          <v-btn color="orange" dark tile @click="cerrarDialogo">Cerrar</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import Vue from "vue";
export default {
  name: "index",
  data(){
    return{
      load: true,
      vista: 1,
      dialogoIngreso: false,
      Caja: [],
      password: '',
      show: false,
      verificacionPasswor: false
    }
  },
  computed:{
    PERMISOS(){
      let permisos = this.$store.state.permisosUser.split(',');
      let per = [];
      if (permisos.length > 1){
        permisos.forEach((item)=>{
          per.push(parseInt(item))
        })
        return per;
      }else
        return [];
    },
    CAJAS(){
      return this.$store.state.caja.CAJAS_X_SUCURSAL;
    },
    USUARIO_ID(){
      return this.$store.state.usuario_id;
    },
    SUCURSAL(){
      return this.$store.state.sucursal_id
    },
    SUCURSAL_ID(){
      return this.$store.state.sucursal;
    },
    FECHA(){
      return this.$store.state.fecha.DIA_STRING;
    },
    COLABORADOR(){
      return this.$store.state.colaborador;
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Caja > '+this.SUCURSAL);
    this.cargarCajas();
  },
  methods:{
    abrirDialogoIngreso(data){
      this.Caja = data;
      if (data.activa === 1)
        this.dialogoIngreso = true;
      else
        this.notificacion('Esta caja no se puede abrir, porque no está configurada o esta desactivada.','error');
    },
    cargarCajas(){
      this.load = true;
      this.$axios.get('cajas/cajas_x_sucursal/'+this.SUCURSAL_ID).then((res)=>{
        this.$store.commit('caja/agregar_CAJAS_X_SUCURSAL', res.data.cajas);
        this.load = false
      })
    },
    cerrarDialogo(){
      this.dialogoIngreso = false;
      this.password       = '';
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    validarIngreso(){
      if (this.Caja.user_id == this.USUARIO_ID){
        if (this.password.length >= 8)
          this.verificarPasswor();
        else
          this.notificacion('La contraeña tiene que ser de 8 carácteres mínimo','error');
      }else
        this.notificacion('No tienes acceso a esta caja.','error');
    },
    verificarPasswor(){
      this.verificacionPasswor = true;
      this.$axios.post('cajas/acceder_caja',{
        id:       this.Caja.id,
        password: this.password,
        user:     this.USUARIO_ID
      }).then((res)=>{
        this.notificacion(res.data.msj,'success');
        this.verificacionPasswor = false;
        this.notificacion('Cargando datos de la caja','success');
        this.dialogoIngreso = false;
        this.$store.commit('caja/agregar_CAJA_ID', this.Caja.id);
        this.$store.commit('anadirCaja', {titulo:'Caja', key: 1});
        this.$store.commit('cambiarTab', {val:1, tipo:false});
      }).catch((error)=>{
        if (error.response.status === 422)
          this.notificacion(error.response.data.error, 'error');

        this.verificacionPasswor = false;
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
