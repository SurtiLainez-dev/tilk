<template>
<v-card flat>
  <v-simple-table class="rowsTable">
    <template v-slot:default>
      <tbody>
      <tr>
        <th>Nombres</th>
        <td>{{CUENTA.cliente.nombres}}</td>
      </tr>
      <tr>
        <th>Apellidos</th>
        <td>{{CUENTA.cliente.apellidos}}</td>
      </tr>
      <tr>
        <th>Identidad</th>
        <td>{{CUENTA.cliente.identidad}}</td>
      </tr>
      <tr>
        <th>Rtn</th>
        <td>{{CUENTA.cliente.rtn}}</td>
      </tr>
      <tr>
        <th>Sexo</th>
        <td>
          <span v-if="CUENTA.cliente.sexo === 1">Masculino</span>
          <span v-else>Femenino</span>
        </td>
      </tr>
      <tr>
        <th>Correo Eléctronico</th>
        <td>{{CUENTA.cliente.email}}</td>
      </tr>
      <tr>
        <th>Nacionalidad</th>
        <td>{{CUENTA.cliente.nacionalidad}}</td>
      </tr>
      <tr>
        <th>Fecha de Nacimiento</th>
        <td>{{CUENTA.cliente.fecha_nacimiento.split('-')[2]}}/{{CUENTA.cliente.fecha_nacimiento.split('-')[1]}}/{{CUENTA.cliente.fecha_nacimiento.split('-')[2]}}</td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-card>
</template>

<script>
export default {
  name: "cliente_cuenta",
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
