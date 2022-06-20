<template>
  <v-card>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="success" dark tile small @click="dialogoInicial = true">Buscar Otra Cuenta</v-btn>
    </v-card-actions>
    <v-card flat v-if="cuentaCargada">
      <editar_venta /></v-card>

    <v-card flat v-else>
      <v-card-text>No hay datos de cuenta</v-card-text>
    </v-card>

    <v-dialog width="30%" v-model="dialogoInicial">
      <v-card>
        <v-toolbar color="grey lighten-3" dense flat>
          <v-card-title>Editando Cuenta</v-card-title>
        </v-toolbar>

        <v-container>
          <v-form v-on:submit.prevent ref="FormSolicitarCuenta">
            <v-text-field class="ma-2" dense label="Número de Cuenta" v-model="num_cuenta" persistent-hint
                          hint="Dígite el número de cuenta para cargar los datos" @keyup.enter="cargarCuenta"></v-text-field>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="success" dark tile small @click="cargarCuenta">Cargar Cuenta</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import editar_venta from "@/components/Ventas/admin/editar_venta";
export default {
  name: "cuentas",
  components:{editar_venta},
  data(){
    return{
      loadCuenta: false,
      cuentaCargada: false,
      dialogoInicial: true,
      num_cuenta: '',
      cuenta: {},
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Editar Cuenta')
  },
  methods:{
    cargarCuenta(){
      this.loadCuenta = true;
      this.dialogoInicial = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.get('cuentas/ventas/num/'+this.num_cuenta).then((res)=>{
        if (res.data.venta){
          this.$store.commit('activarOverlay', false)
          this.loadCuenta = false;
          this.$store.commit('notificacion',{texto:'Datos cargados', color:'success'});
          this.$store.commit('cuentas/agregar_CUENTA', res.data.venta);
          this.cuentaCargada = true;
        }else{
          this.$store.commit('notificacion',{texto:'Esta cuenta no existe', color:'error'});
          this.dialogoInicial = true
        }
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
