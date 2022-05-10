<template>
  <v-card class="ma-2" flat>
    <v-card>
      <v-row no-gutters>
        <v-col>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
              <tr>
                <th>Referencia del Depósito</th>
                <td>{{DEPOSITO.referencia}}</td>
              </tr>
              <tr>
                <th>Monto del Depósito</th>
                <td>L. {{int.format(DEPOSITO.monto)}}</td>
              </tr>
              <tr>
                <th>Saldo Actual</th>
                <td>L. {{int.format(DEPOSITO.monto_actual)}}</td>
              </tr>
              <tr>
                <th>Fecha del Depósito</th>
                <td>{{DEPOSITO.fecha_deposito}}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
              <tr>
                <th>Usuario que Registró</th>
                <td>{{DEPOSITO.user.usuario}}</td>
              </tr>
              <tr>
                <th>Caja</th>
                <td>[{{DEPOSITO.caja.codigo}}]</td>
              </tr>
              <tr>
                <th>Documento</th>
                <td><b-link>Ver documento</b-link></td>
              </tr>
              <tr>
                <th>Fecha Revisado</th>
                <td>{{DEPOSITO.fecha_revisado}}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
              <tr>
                <th>Estado</th>
                <td>
                  <v-chip x-small dark color="warning" v-if="DEPOSITO.estado === 1">Pendiente</v-chip>
                  <v-chip x-small dark color="success" v-else>Revisado</v-chip>
                </td>
              </tr>
              <tr>
                <th>Observaciones</th>
                <td><v-btn small tile dark text color="indigo">Ver</v-btn></td>
              </tr>
              <tr>
                <th>Pagos Editados</th>
                <td>
                  <v-btn small tile dark text color="indigo">Ver</v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card>

    <v-card-subtitle>Pagos pendientes</v-card-subtitle>
    <v-data-table dense :headers="header" :loading="load" loading-text="Cargando pagos ..."
                  :items="pagos" show-select v-model="pagosSelect" :items-per-page="5">
      <template v-slot:item.saldo_actual="{item}">L. {{int.format(item.saldo_actual)}}</template>
      <template v-slot:item.mora="{item}">L. {{int.format(item.mora)}}</template>
    </v-data-table>

    <v-divider></v-divider>

    <v-row no-gutters>
      <v-col cols="9">
        <v-card flat class="ma-2">
          <v-card-subtitle>Datos de la cuenta</v-card-subtitle>
          <v-divider></v-divider>
          <cuenta/>
        </v-card>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-card flat class="ma-2">
          <v-card-subtitle>Formulario</v-card-subtitle>
          <v-divider></v-divider>
          <v-form>
            <v-btn small block color="success" text tile dark @click="calcularSaldo">Calcular Saldos</v-btn>
            <v-text-field label="Saldo en Depósito" v-model="DEPOSITO.monto_actual" disabled class="ma-2"></v-text-field>
            <v-text-field label="Saldo a Abonar" disabled class="ma-2" v-model="saldo_abonado"></v-text-field>
            <v-autocomplete label="Seleccionar un banco" v-model="cuenta"
                            :items="Cuentas"></v-autocomplete>
            <v-textarea label="Observaciones" class="ma-2" v-model="DEPOSITO.observacion"></v-textarea>
          </v-form>
          <v-divider></v-divider>
          <v-btn block color="indigo" @click="registrarForm" dark tile small>Registrar Validación</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import cuenta from "../../components/Ventas/cuenta";
export default {
  name: "deposito",
  components:{cuenta},
  data(){
    return{
      int: Intl.NumberFormat(),
      pagos: [],
      pagosSelect: [],
      pagosSi: [],
      saldo_abonado: 0,
      load: true,
      header:[
        {text: 'Pago Inicial', value:'pago_inicial'},
        {text: 'Detalle', value:'detalle'},
        {text: 'Saldo Actual', value:'saldo_actual'},
        {text: 'Mora', value:'mora'},
        {text: 'Fecha de Pago', value:'fecha_pago'},
      ],
      Cuentas: [],
      loadCuentas: true,
      cuenta: '',
      moraAbonado: 0
    }
  },
  computed:{
    DEPOSITO(){
      return this.$store.state.contabilidad.depositos.DEPOSITO;
    }
  },
  created() {
    this.$axios.get('venta/pagos/'+this.DEPOSITO.venta.id).then((res)=>{
      if (res.data.pagos.length > 0){
        res.data.pagos.forEach((item)=>{
          if (item.estado < 3){
            this.pagos.push(item)
          }
        })
      }
      this.load = false;
    });
    this.cargarCuentas();
  },
  methods:{
    calcularSaldo(){
      let mora = 0;
      let sa   = 0;
      let saa  = 0;
      if (this.DEPOSITO.monto_actual > 0){
        this.pagosSelect.forEach((i)=>{
          saa =  this.DEPOSITO.monto_actual;
          if (i.saldo_actual > 0 && this.DEPOSITO.monto_actual > 0){
            //verifica si el pago esta en moRA
            if (i.mora > 0 && i.estado === 2){
              mora = i.mora;
              if (this.DEPOSITO.monto_actual >= i.mora) {
                i.mora = 0;
                this.DEPOSITO.monto_actual = (parseFloat(this.DEPOSITO.monto_actual) - parseFloat(mora)).toFixed(2);
              }else if (this.DEPOSITO.monto_actual < i.mora) {
                i.mora = (parseFloat(i.mora) - parseFloat(this.DEPOSITO.monto_actual)).toFixed(2);
                this.DEPOSITO.monto_actual = (parseFloat(this.DEPOSITO.monto_actual) - (parseFloat(mora) - parseFloat(i.mora))).toFixed(2)
              }
              if (i.mora === 0)
                i.is_mora = false

              i.saldo_actual = (parseFloat(i.saldo_actual) - parseFloat(mora)).toFixed(2);
              this.moraAbonado = (parseFloat(mora) - parseFloat(i.mora)).toFixed(2);
            }

            if (this.DEPOSITO.monto_actual > 0){
              sa = i.saldo_actual;
              if (this.DEPOSITO.monto_actual >= i.saldo_actual) {
                i.saldo_actual = 0;
                this.DEPOSITO.monto_actual = (parseFloat(this.DEPOSITO.monto_actual) - parseFloat(sa)).toFixed(2);
              }if (this.DEPOSITO.monto_actual < i.saldo_actual) {
                i.saldo_actual = (parseFloat(i.saldo_actual) - parseFloat(this.DEPOSITO.monto_actual)).toFixed(2);
                this.DEPOSITO.monto_actual = (parseFloat(this.DEPOSITO.monto_actual) - (parseFloat(sa) - parseFloat(i.saldo_actual))).toFixed(2);
              }

              if (this.DEPOSITO.monto_actual < 0)
                this.DEPOSITO.monto_actual = 0;
            }

            if (i.saldo_actual === 0)
              i.estado = 3;

            this.saldo_abonado = (parseFloat(this.saldo_abonado) + (parseFloat(saa) - parseFloat(this.DEPOSITO.monto_actual))).toFixed(2)

            this.pagosSi.push(i)
          }
        })
      }

      if (this.DEPOSITO.monto_actual < 0)
        this.DEPOSITO.monto_actual = 0;
    },
    cargarCuentas(){
      this.$axios.get('cuentas').then((res)=>{
        res.data.cuentas.forEach((i)=>{
          this.Cuentas.push({
            value: i.id,
            text: i.banco.nombre+' - '+i.num
          })
        })
        this.loadCuentas = false;
      })
    },
    registrarForm(){
      this.$store.commit('activarOverlay', true);
      this.$axios.put('venta/pagos/'+this.DEPOSITO.venta.id,{
        pagos: this.pagosSi,
        saldo_abonado: this.saldo_abonado,
        saldo_actual:  this.DEPOSITO.monto_actual,
        observacion:   this.DEPOSITO.observacion,
        mora_abonado:  this.mora_abonado
      }).then((res)=>{
        this.$store.commit('activarOverlay', false)
      })
    }
  }
}
</script>

<style scoped>

</style>
