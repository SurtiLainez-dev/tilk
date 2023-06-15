<template>
  <v-card flat>
    <v-toolbar flat dense>
      <v-card-title>{{cuenta.cliente.nombres}} {{cuenta.cliente.apellidos}} - #{{cuenta.cod}}</v-card-title>
    </v-toolbar>

    <v-row>
      <v-col>
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
            <tr><th>Nombres:</th><td>{{cuenta.cliente.nombres}}</td></tr>
            <tr><th>Apellidos:</th><td>{{cuenta.cliente.apellidos}}</td></tr>
            <tr><th>Identidad:</th><td>{{cuenta.cliente.identidad}}</td></tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col>
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
            <tr><th>Saldo Inicial:</th><td>L. {{int.format(cuenta.total)}}</td></tr>
            <tr><th>Mora:</th><td>L. {{int.format(cuenta.contrato_cliente.saldo_mora)}}</td></tr>
            <tr><th>Saldo Actual:</th><td>L. {{int.format(cuenta.saldo_actual)}}</td></tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col>
        <v-simple-table dense>
          <template v-slot:default>
            <tbody>
            <tr>
              <th>Estado:</th>
              <td v-if="cuenta.estado === 1"><v-chip x-small dark color="success">Al día</v-chip></td>
              <td v-else-if="cuenta.estado === 2"><v-chip x-small dark color="warning">Mora</v-chip></td>
              <td v-else-if="cuenta.estado === 3"><v-chip x-small dark color="indigo">Cancelado</v-chip></td>
            </tr>
            <tr>
              <th>Días en Mora:</th>
              <td>{{cuenta.contrato_cliente.dias_mora}}</td>
            </tr>
            <tr>
              <th>Fecha de Vencimiento:</th>
              <td>{{cuenta.contrato_cliente.fecha_vencimiento}}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="10">
        <v-row no-gutters>
          <v-col cols="10"> <v-card-subtitle>Pagos Actuales</v-card-subtitle></v-col>
          <v-col cols="2" class="d-flex justify-end">
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-btn v-on="on" v-bind="attrs" x-small fab text dark @click="generarEdicion"
                       color="indigo" class="ma-2"><v-icon small>fa fa-edit</v-icon></v-btn>
              </template>
              <span>Generar datos</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-data-table :items-per-page="12" dense :headers="headers" :items="pagos">
          <template v-slot:item.estado="{item}">
            <v-chip color="orange" x-small dark v-if="item.estado === 1">Al día</v-chip>
            <v-chip color="red" x-small dark v-else-if="item.estado === 2">En Mora</v-chip>
            <v-chip color="success" x-small dark v-else-if="item.estado === 3">Cancelado</v-chip>
          </template>
          <template v-slot:item.mora="{item}">L {{item.mora}}</template>
          <template v-slot:item.pago_inicial="{item}">L {{int.format(item.pago_inicial)}}</template>
          <template v-slot:item.total_pago="{item}">L {{int.format(item.total_pago)}}</template>
          <template v-slot:item.total_abonado="{item}">
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <input class="inputE" type="number" :disabled="item.estado === 3"
                       v-model="item.total_abonado" v-on="on" v-bind="attrs">
              </template>
              <span>Para cancelar esta cuota debes sumar {{int.format(parseFloat(item.saldo_actual) - parseFloat(item.mora))}} lps</span>
            </v-tooltip>
          </template>
          <template v-slot:item.mora_abonado="{item}">
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <input class="inputE" type="number" :disabled="item.estado === 3"
                       v-model="item.mora_abonado" v-on="on" v-bind="attrs">
              </template>
              <span>Para cancelar la mora de este pago debes sumar {{item.mora}} lps al saldo</span>
            </v-tooltip>
          </template>
          <template v-slot:item.saldo_actual="{item}">L. {{int.format(item.saldo_actual)}}</template>
        </v-data-table>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-card-subtitle>Formulario</v-card-subtitle>
        <v-divider></v-divider>
        <v-form ref="FormEditarCuenta">
          <v-text-field dense class="ma-2" v-model="tasa" label="Tasa de Mora" :suffix="(tasa).toFixed(2)+' %'"></v-text-field>
          <v-text-field dense class="ma-2" v-model="dias_gracia" suffix="días de gracia" label="Días de Gracia"></v-text-field>
          <v-select :items="estados" dense class="ma-2" label="Estado de la Cuenta" v-model="cuenta.estado"></v-select>
          <v-text-field dense class="ma-2" label="Saldo Actual" v-model="saldo_actual" suffix="lps" ></v-text-field>
          <v-text-field dense class="ma-2" label="Saldo Abonado" v-model="saldo_abonado" suffix="lps"></v-text-field>
          <v-text-field dense class="ma-2" label="Capital Abonado" v-model="capital" suffix="lps"></v-text-field>
          <v-text-field dense class="ma-2" label="Mora" v-model="mora" suffix="lps"></v-text-field>
          <v-text-field dense class="ma-2" label="Días de Moa" v-model="dias_mora" suffix="días"></v-text-field>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="success" dark tile small class="ma-2" @click="registrarCambios">Registrar Cambios</v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "editar_venta",
  data(){
    return{
      int: new Intl.NumberFormat(),
      headers:[
        {text: 'Detalle', value:'detalle'},
        {text: 'Estado', value:'estado'},
        {text: 'Mora', value:'mora'},
        {text: 'Pago Inical', value:'pago_inicial'},
        {text: 'Pago total', value:'total_pago'},
        {text: 'Abonado', value:'total_abonado'},
        {text: 'Mora Abonado', value:'mora_abonado'},
        {text: 'Saldo Actual', value:'saldo_actual'},
      ],
      estados:[
        {text: 'Al día', value: 1},
        {text: 'Mora', value: 2},
        {text: 'Cancelado', value: 3},
      ],
      acumulado: 0,
      pagos: [],
      dias_gracia: 0,
      saldo_abonado: 0,
      tasa: 0,
      saldo_actual: 0,
      mora: 0,
      dias_mora: 0,
      capital: 0
    }
  },
  created() {
    this.cargarPagos();
  },
  computed:{
    cuenta(){
      return this.$store.state.cuentas.CUENTA;
    }
  },
  methods:{
    calcularMora(){
      this.mora = 0;
      this.pagos.forEach((item)=>{
        this.mora = (parseFloat(item.mora) + parseFloat(this.mora)).toFixed(2);
      })
    },
    calcularSaldo(){
      this.saldo_actual = (parseFloat(this.cuenta.saldo_actual) - parseFloat(this.saldo_abonado)).toFixed(2)
    },
    cargarCuenta(){
      this.$axios.get('cuentas/ventas/num/'+this.cuenta.cod).then((res)=>{
        if (res.data.venta){
          this.$store.commit('activarOverlay', false)
          this.$store.commit('notificacion',{texto:'Datos cargados', color:'success'});
          this.$store.commit('cuentas/agregar_CUENTA', res.data.venta);
          this.cargarPagos();
        }else{
          this.$store.commit('notificacion',{texto:'Esta cuenta no existe', color:'error'});
        }
      })
    },
    cargarPagos(){
      this.pagos = [];
      this.cuenta.pagos_contratos.forEach((item)=>{
        this.pagos.push({
          id: item.id,
          detalle: item.detalle,
          mora: item.mora,
          pago_inicial: item.pago_inicial,
          total_pago:   item.total_pago,
          total_abonado: item.total_abonado,
          saldo_actual: item.saldo_actual,
          estado:       item.estado,
          dias_mora:    item.dias_mora,
          saldo_cap:    item.saldo_cap,
          mora_abonado: 0,
          saldo:        item.saldo_actual,
          saldo_mora:   item.mora
        })
        this.dias_gracia = item.dias_gracia;
      });
      this.tasa = this.cuenta.tasa_mora;
      this.saldo_actual = this.cuenta.saldo_actual;
      this.dias_mora    = this.cuenta.contrato_cliente.dias_mora
    },
    generarEdicion(){
      this.saldo_abonado = 0;
      let total_abonado  = 0;
      this.capital       = 0;
      let mora_abonado       = 0;
      this.pagos.forEach((item, i)=>{
        //Verifica que sea un pago activo
        if (item.estado < 3){
          total_abonado   = (parseFloat(item.total_abonado)+parseFloat(item.mora_abonado)).toFixed(2);
          mora_abonado    = (parseFloat(mora_abonado)+parseFloat(item.mora_abonado)).toFixed(2)
          //Verifica que el saldo ingresado en abonado sea menor o igual al total del apgo
          if (total_abonado <= item.total_pago){
            //Verificando saldo en mora
            item.mora = item.saldo_mora
            if (item.mora_abonado >= item.mora)
              item.mora = 0;
            else
              item.mora = (parseFloat(item.mora) - parseFloat(item.mora_abonado)).toFixed(2)

            item.saldo_cap = item.pago_inicial;
            item.saldo_cap = parseFloat(item.saldo_cap) - parseFloat(item.total_abonado)

            //hace la resta para determinar el saldo actual del pago
            item.saldo_actual = (parseFloat(item.total_pago) - parseFloat(total_abonado)).toFixed(2)

            this.saldo_abonado = ((parseFloat(item.saldo) - parseFloat(item.saldo_actual)) + parseFloat(this.saldo_abonado)).toFixed(2);
          }else{
            this.$store.commit('notificacion',{texto:'La '+item.detalle+', tiene un error', color:'warning'})
          }
        }
      });
      this.calcularSaldo();
      this.calcularMora();
      this.capital = (parseFloat(this.saldo_abonado) - parseFloat(mora_abonado)).toFixed(2);
      console.log('saldo abonado '+this.saldo_abonado)
      console.log('saldo mora'+mora_abonado)
    },
    registrarCambios(){
      this.$store.commit('activarOverlay', true);
      this.$axios.put('cuenta/edit/'+this.cuenta.id,{
        saldo_actual:    this.saldo_actual,
        estado:          this.cuenta.estado,
        tasa_mora:       this.tasa,
        sucursal_id:     this.cuenta.sucursal_id,
        capital_abonado: this.capital,
        saldo_mora:      this.mora,
        saldo_abonado:   this.saldo_abonado,
        dias_mora:       this.dias_mora,
        pagos:           this.pagos
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.saldo_actual = 0;
        this.capital      = 0;
        this.saldo_abonado = 0;
        this.cargarCuenta();
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error a solicitar los cambios', color:'error'});
        this.$store.commit('activarOverlay', false)
      })

    }
  }
}
</script>

<style scoped>
.inputE{
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  border: 1px solid #000000;
  padding: 0 6px 0 6px;
  width: 85px;
}
.rowsTable{
  cursor: pointer;
}
</style>
