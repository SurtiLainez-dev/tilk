<template>
<v-card flat :loading="show">
  <v-row no-gutters>
    <v-col cols="4">
      <v-card class="ma-2">
        <v-simple-table class="rowsTable" dense>
          <template v-slot:default>
            <tbody>
            <tr>
              <th>Saldo Inicial:</th>
              <td><strong>L </strong>{{CUENTA.total}}</td>
            </tr>
            <tr>
              <th>Saldo Mora:</th>
              <td><strong>L </strong> {{CUENTA.contrato_cliente.saldo_mora}}</td>
            </tr>
            <tr>
              <th>Saldo Abonado:</th>
              <td><strong>L </strong> {{CUENTA.contrato_cliente.saldo_abonado}}</td>
            </tr>
            <tr>
              <th>Saldo Actual</th>
              <td><strong>L </strong> {{CUENTA.saldo_actual}}</td>
            </tr>
            <tr>
              <th>Cuota</th>
              <td><strong>L </strong>{{CUENTA.contrato_cliente.cuota}}</td>
            </tr>
            <tr>
              <th>Forma de Pago</th>
              <td>
                <v-chip x-small color="indigo" dark v-if="CUENTA.contrato_cliente.forma_pago === 1">Semanal</v-chip>
                <v-chip x-small color="indigo" dark v-else-if="CUENTA.contrato_cliente.forma_pago === 2">Quincenal</v-chip>
                <v-chip x-small color="indigo" dark v-if="CUENTA.contrato_cliente.forma_pago === 3">Mensual</v-chip>
              </td>
            </tr>
            <tr>
              <th>Estado:</th>
              <td>
                <v-chip color="orange" x-small v-if="CUENTA.estado === 1" dark>Al día</v-chip>
                <v-chip color="red" x-small v-else-if="CUENTA.estado === 2" dark>Mora</v-chip>
                <v-chip color="success" x-small v-else-if="CUENTA.estado === 3" dark>Cancelada</v-chip>
                <v-chip color="indigo" x-small v-else-if="CUENTA.estado === 4" dark>Pendiente por aceptar</v-chip>
              </td>
            </tr>
            <tr>
              <th>Cliente</th>
            </tr>
            <tr>
              <th>Identidad:</th>
              <td>{{CUENTA.cliente.identidad}}</td>
            </tr>
            <tr>
              <th>Artículo</th>
            </tr>
            <tr>
              <th>Artículo:</th>
              <td>{{CUENTA.remision_articulo.articulo.nombre_articulo}}</td>
            </tr>
            <tr>
              <th>Módelo:</th>
              <td>{{CUENTA.remision_articulo.articulo.modelo}}</td>
            </tr>
            <tr>
              <th>Marca:</th>
              <td>{{CUENTA.remision_articulo.articulo.marca.nombre}}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>
    <v-col cols="8">
      <v-card class="ma-2 pa-4">
        <v-row no-gutters>
          <v-col cols="4">
            <v-text-field class="ma-2" outlined dense label="# Cuenta" disabled v-model="CUENTA.cod"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field class="ma-2" outlined dense placeholder="0"
                          label="Abono" prefix="L" v-model="Abono.total"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn color="indigo" class="ma-2" @click="distribuirPago" outlined tile dark>Distribuir Pago</v-btn>
          </v-col>
        </v-row>
        <v-toolbar flat color="grey lighten-5">
          <h6>Distribución de Pagos</h6>
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{on, attr}">
              <v-btn color="orange" v-bind="attr" @click="dialogoPagos = true"  v-on="on" fab tile x-small dark>
                <v-icon>fa fa-expand-arrows-alt</v-icon>
              </v-btn>
            </template>
            <span>Ver Tabla de Pagos Completa</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attr}">
              <v-btn color="indigo" class="ma-1" v-bind="attr" v-on="on" fab tile x-small dark>
                <v-icon>fa fa-calculator</v-icon>
              </v-btn>
            </template>
            <span>Calculadora de Pagos</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attr}">
              <v-btn color="success" class="ma-1" v-bind="attr" v-on="on" fab tile x-small dark>
                <v-icon>fa fa-expand-arrows-alt</v-icon>
              </v-btn>
            </template>
            <span>Pagos Agregados</span>
          </v-tooltip>
        </v-toolbar>
        <v-simple-table dense height="180" class="rowsTable" fixed-header>
          <template v-slot:default>
            <thead>
            <tr>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Pendiente</th>
              <th>Pagará</th>
              <th>Saldo</th>
              <th>Aún Hay</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in PagosDistrubuidos">
              <td>{{item.tipo}}</td>
              <td>{{item.detalle}}</td>
              <td>{{item.pendiente}}</td>
              <td>{{item.pagara}}</td>
              <td>{{item.saldo}}</td>
              <td>{{item.hay}}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="indigo" tile dark small>Registrar Pago</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

  </v-row>


  <v-dialog v-model="dialogoPagos" width="80%">
    <v-card>
      <v-toolbar color="grey lighten-5">
        <h6>Tabla de Pagos</h6>
      </v-toolbar>
      <v-data-table dense
                    :items="CUENTA.pagos_contratos"
                    class="rowsTable"
                    :headers="headers"></v-data-table>
      <v-card-actions class="d-flex justify-end">
        <v-btn small color="orange" dark @click="dialogoPagos = false" tile>Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
export default {
  name: "cuenta",
  data(){
    return{
      headers:[
        {text: 'Detalle', value:'detalle'},
        {text: 'Mora', value:'mora'},
        {text: 'Pago Inical', value:'pago_inicial'},
        {text: 'Pago total', value:'total_pago'},
        {text: 'Abonado', value:'total_abonado'},
      ],
      dialogoPagos: false,
      show: true,
      Abono:{
        total: '',
        distribucion: []
      },
      PagosDistrubuidos: []
    }
  },
  computed:{
    CUENTA:{
      get: function (){
        return this.$store.state.caja.CUENTA;
      },
      set: function (data){
        this.$store.commit('caja/agregar_CUENTA', data);
      }
    }
  },
  created() {
    this.$axios.get('cuentas/ventas/'+this.CUENTA.id).then((res)=>{
      this.CUENTA = res.data.venta;
      this.show = false;
      console.log(this.CUENTA)
    })
  },
  methods:{
    distribuirPago(){
      if (this.Abono.total > 0){
        let saldo = this.Abono.total, estado = true;
        let pagos = this.CUENTA.pagos_contratos.filter((i)=> i.estado !== 3);
        let pago = 0, saldo_p = 0;
        this.PagosDistrubuidos = [];
        pagos.forEach((item)=>{
          if (saldo > 0){
            if (item.is_mora === 1) {
              if (saldo > item.mora) {
                pago = item.mora;
                saldo_p = 0
              }else {
                pago = (item.mora - saldo).toFixed(2);
                saldo_p = (pago - item.mora).toFixed(2)
                if (saldo_p < 0)
                  saldo_p = 0;
              }

              saldo = (saldo - pago).toFixed(2);
              if (saldo < 0)
                saldo = 0;

              this.PagosDistrubuidos.push({
                status: 2,
                pago_id: item.id,
                tipo: 'Mora',
                detalle: 'Mora ' + item.detalle,
                pendiente: item.mora,
                pagara:    pago,
                saldo:     saldo_p,
                hay:       saldo
              })
            }

            if (saldo > 0){
              if (saldo > item.pago_inicial){
                pago = item.pago_inicial;
                saldo_p = 0;
              }else{
                pago = (item.pago_inicial - saldo).toFixed(2);
                saldo_p = (pago - item.pago_inicial).toFixed(2);
                if (saldo_p < 0){
                  pago = saldo
                  saldo_p = (item.pago_inicial - pago).toFixed(2)
                }
              }

              saldo = (saldo - pago).toFixed(2);

              this.PagosDistrubuidos.push({
                status: 1,
                pago_id: item.id,
                tipo: 'Letra',
                detalle: item.detalle,
                pendiente: item.pago_inicial,
                pagara:    pago,
                saldo:     saldo_p,
                hay:       saldo
              })
            }
          }
        })
      }
      console.log(this.PagosDistrubuidos)
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
