<template>
<v-card flat>
  <v-simple-table class="rowsTable">
    <template v-slot:default class="rowsTable">
      <tbody>
      <tr>
        <th>Tipo de Cuenta</th>
        <td>
          <span v-if="CUENTA.tipo_venta === 1">Contado</span>
          <span v-else>Crédito</span>
        </td>
      </tr>
      <tr>
        <th>Código</th>
        <td>{{CUENTA.cod}}</td>
      </tr>
      <tr>
        <th>Cliente</th>
        <td>{{CUENTA.cliente.nombres+' '+CUENTA.cliente.apellidos}}</td>
      </tr>
      <tr>
        <th>Sucursal</th>
        <td>{{CUENTA.colaborador.sucursal.nombre}}</td>
      </tr>
      <tr>
        <th>Vendedor</th>
        <td>{{CUENTA.colaborador.nombres+' '+CUENTA.colaborador.apellidos}}</td>
      </tr>
      <tr>
        <th>Saldo Inicial del Crédito</th>
        <td><strong>L </strong>{{int.format(CUENTA.total)}}</td>
      </tr>
      <tr>
        <th>Total Abonado</th>
        <td><strong>L </strong>{{int.format(CUENTA.contrato_cliente.saldo_abonado)}}</td>
      </tr>
      <tr v-if="CUENTA.contrato_cliente">
        <th>Saldo en Mora</th>
        <td><strong>L </strong>{{int.format(CUENTA.contrato_cliente.saldo_mora)}}</td>
      </tr>
      <tr>
        <th>Saldo Actual</th>
        <td><strong>L </strong>{{int.format(CUENTA.saldo_actual)}}</td>
      </tr>
      <tr>
        <th>Estado</th>
        <td>
          <v-chip color="orange" x-small v-if="CUENTA.estado === 1" dark>Al día</v-chip>
          <v-chip color="red" x-small v-else-if="CUENTA.estado === 2" dark>Mora</v-chip>
          <v-chip color="success" x-small v-else-if="CUENTA.estado === 3" dark>Cancelada</v-chip>
          <v-chip color="indigo" x-small v-else-if="CUENTA.estado === 4" dark>Pendiente por aceptar</v-chip>
        </td>
      </tr>
      <tr>
        <th># de Cuotas</th>
        <td>{{CUENTA.num_cuotas}} cuotas</td>
      </tr>
      <tr>
        <th>Aceptado por facturación</th>
        <td>
          <v-chip color="success" x-small v-if="CUENTA.is_aceptado === 1" dark>Sí</v-chip>
          <v-chip color="red" x-small v-else-if="CUENTA.is_aceptado === 2" dark>No</v-chip>
          <v-chip color="orange" x-small v-else-if="CUENTA.is_aceptado === 3" dark>Pendiente</v-chip>
        </td>
      </tr>
      <tr>
        <th>Cuenta registrada en portafolio</th>
        <td>
          <v-chip color="success" x-small v-if="verificar === 1" dark>Sí</v-chip>
          <v-chip color="red" x-small v-else-if="verificar === 0" dark>No</v-chip>
          <v-btn v-if="verificar === 0" color="indigo" x-small dark @click="registrarCuentaPortafolio" tile>Registrar en portafolio</v-btn>
        </td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-card>
</template>

<script>
export default {
  name: "datos_cuenta",
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
  },
  data(){
    return{
      int: Intl.NumberFormat(),
      loadVerificas: true,
      verificar: 2
    }
  },
  methods:{
    registrarCuentaPortafolio(){
      if (this.verificar === 0){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('cobros/verificar_cuenta/portafolio',{id: this.CUENTA.id}).then((res)=>{
          this.$store.commit('cuentas/cambiar_VISTA', 2);
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'})
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error', color:'success'})
        })
      }
    },
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
