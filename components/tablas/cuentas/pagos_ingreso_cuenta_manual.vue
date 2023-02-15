<template>
<v-card flat>
  <v-row no-gutters>
    <v-col>
      <v-text-field class="mt-2" outlined dense disabled :rules="[rules.revision.revisados]"
                    label="Pagos Revisados" v-model="revision.user.revisados">
      </v-text-field>
    </v-col>
    <v-col>
      <v-text-field class="ma-2" outlined dense disabled prefix="L" :rules="[rules.revision.saldo_actual]"
                    label="Saldo Actual" v-model="revision.user.saldo_actual">
      </v-text-field>
    </v-col>
    <v-col>
      <v-text-field class="ma-2" outlined dense disabled :rules="[rules.revision.saldo_mora]"
                    label="Saldo en Mora" v-model="revision.user.mora">
      </v-text-field>
    </v-col>
    <v-col class="d-flex justify-end">
      <v-btn class="mt-5 mr-5" small dark color="indigo" @click="crearPagos" tile>Crear Pagos</v-btn>
      <v-btn class="mt-5" color="success" dark tile small @click="validarEnvio">Registrar</v-btn>
    </v-col>
  </v-row>
  <v-form ref="FormValidarConcordanciaDePagos">
    <v-card flat height="1000px" class="overflow-auto">
      <table>
        <thead>
        <tr>
          <th>Pago</th>
          <th>Detalle</th>
          <th>P. Inicial</th>
          <th>Total Abonado</th>
          <th>Saldo Capital</th>
          <th>Saldo en Mora</th>
          <th>Total del Pago</th>
          <th>Saldo Actual</th>
          <th>Estado Mora</th>
          <th>Estado Pago</th>
          <th>Inicio Mora</th>
          <th>Días Mora</th>
          <th>Ok</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in data.pagos"
            v-bind:style="(item.estao !== 5 && item.is_mora === 0 && item.revisado) || (item.estao !== 5 && item.is_mora === 1 && item.dias_mora > 0  && item.revisado) ? 'background-color: #8df48d; border-bottom: solid #FFF 2px' : 'border: none'">
          <td>
            <input  data-date-format="YYYY MM DD" class="input-tilk"  type="date" v-model="item.fecha_pago">
          </td>
          <td>{{item.detalle}}</td>
          <td @click="copiarSaldoPagado(item)">L. <span v-if="item.pago_inicial">{{int.format(item.pago_inicial)}}</span></td>
          <td>
            <input type="number" @change="sumarTotalPago(item)" class="input-tilk" v-model="item.total_abonado" min="0">
          </td>
          <td>L. <span v-if="item.saldo_cap">{{int.format(item.saldo_cap)}}</span></td>
          <td>
            <input type="number" @change="sumarTotalPago(item)" class="input-tilk" v-model="item.mora" min="0">
          </td>
          <td>
            <input type="number" disabled class="input-tilk" v-model="item.total_pago" min="0">
          </td>
          <td>
            <input type="number" disabled class="input-tilk" v-model="item.saldo_actual" min="0">
          </td>
          <td>
            <select class="input-select" v-model="item.is_mora" >
              <option v-for="item in selectEstado" :value="item.value" v-text="item.text"></option>
            </select>
          </td>
          <td>
            <select class="input-select" v-model="item.estao" >
              <option v-for="item in selectPago" :value="item.value" v-text="item.text"></option>
            </select>
          </td>
          <td>
            <input class="input-tilk" @change="calcularDiasMora(item)"  type="date" v-model="item.inicio_mora" placeholder="Fecha de Mora">
          </td>
          <td>
            <input type="text" disabled class="input-tilk" v-model="item.dias_mora">
          </td>
          <td>
            <input @change="contPagosRevisados(item)" type="checkbox" class="input-tilk" v-model="item.revisado">
          </td>
        </tr>
        </tbody>
      </table>
    </v-card>
  </v-form>
</v-card>
</template>

<script>

import Vue from "vue";
import {forEach} from "vuesax";

export default {
  name: "pagos_ingreso_cuenta_manual",
  props: {revision: Object, data: Object},
  data(){
    return{
      int: Intl.NumberFormat(),
      selectEstadoCuenta:[
        {text:'Al día', value:1},
        {text:'Mora', value:2},
      ],
      selectEstado:[
        {text:'Sin Mora Actual', value:0},
        {text:'Mora', value:1},
        {text:'-----', value:5},
      ],
      selectPago:[
        {text:'Al día', value:1},
        {text:'Mora', value:2},
        {text:'Cancelado', value:3},
        {text:'Condonado', value:4},
        {text:'-----', value:5},
      ],
      rules:{
        revision:{
          revisados: value => this.revision.sis.revisados === value || this.revision.user.revisados +' de '+this.revision.sis.revisados+' revisados',
          saldo_actual: value => parseFloat(this.data.cuenta.saldo_actual) === parseFloat(value) || 'Saldo actual de la cuenta: L '+this.data.cuenta.saldo_actual+' - Saldo de actual de los pagos: L '+value,
          saldo_mora:   value => this.data.cuenta.saldo_mora == value || 'Saldo en mora de la cuenta: L '+this.data.cuenta.saldo_mora+' - Saldo en mora de los pagos: L'+ value
        },
      }
    }
  },
  methods:{
    agregarPago(p_i, t_p, t_a, s_a, f_p, d){
      this.data.pagos.push({
        pago_inicial:  p_i,
        total_pago:    t_p,//
        total_abonado: t_a,//
        saldo_actual:  s_a,//
        is_mora:       5,//
        inicio_mora:   '',//
        fecha_pago:    f_p,//
        estao:        5,
        dias_mora:     0,//
        detalle:       d,//
        revisado:      false,//
        mora:          0,//,
        dialogo:       false,
        key:           this.data.pagos.length,
        dialogoMora:   false,
        saldo_cap:     p_i
      })
    },
    calcularDiasMora(data){
      let f = new Date();
      let fecha1 = new Date(f.getFullYear()+'-'+(f.getMonth() + 1)+'-'+f.getDate()).getTime();
      let fecha2 = new Date(data.inicio_mora).getTime();
      let diff   = fecha1 - fecha2;
      data.dias_mora = parseInt(diff/(1000*60*60*24))
    },
    calcularPagos(){
      if (this.data.cuenta.forma_pago === 1)
        return this.data.cuenta.cuotas * 4;
      else if (this.data.cuenta.forma_pago === 2)
        return this.data.cuenta.cuotas * 2;
      else if (this.data.cuenta.forma_pago === 3)
        return this.data.cuenta.cuotas
    },
    crearPagos(){
      this.revision.sis.revisados = 0;
      this.revision.user.saldo_actual = 0;
      this.data.pagos = [];
      this.revision.user.mora = 0;
      this.revision.user.revisados = 0;
      let pagos = this.calcularPagos();
      let mes = 0;
      let dia = 0;
      let fecha = new Date(this.data.cuenta.fecha_prima);
      for (let i = 0; i <= pagos; i++){
        if (i === 0){
          this.agregarPago(this.data.cuenta.prima, this.data.cuenta.prima, 0,
              this.data.cuenta.prima, this.data.cuenta.fecha_prima, 'Pago Inicial - Prima')
        }else{
          fecha = this.sumarDias(fecha);
          mes   = (fecha.getMonth()+ 1);
          dia   = fecha.getDate();
          if (mes < 10)
            mes = '0'+mes;

          if (dia < 10)
            dia = '0'+dia

          this.agregarPago(this.data.cuenta.couta, this.data.cuenta.couta, 0,
              this.data.cuenta.couta,
              fecha.getFullYear()+'-'+mes+'-'+dia, 'Cuota #'+(i));

        }
        this.revision.sis.revisados++;
      }
      this.totalRows = this.data.pagos.length;
    },
    contPagosRevisados(data){
      if (data.revisado)
        this.revision.user.revisados++;
      else
        this.revision.user.revisados--;
    },
    copiarSaldoPagado(data){
      data.total_abonado = data.pago_inicial;
      this.sumarTotalPago(data)
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    registrarCliente(){
      this.$store.commit('activarOverlay', true);
      if (this.data.disabled.cliente){
        this.$axios.post('cuenta/nueva/manual/cliente',{
          identidad:    this.data.cliente.identidad,
          nombres:      this.data.cliente.nombres,
          apellidos:    this.data.cliente.apellidos,
          sexo:         this.data.cliente.sexo,
          nacionalidad: this.data.cliente.nacionalidad,
          direcciones:  JSON.stringify(this.data.direcciones),
          telefonos:    JSON.stringify(this.data.telefonos),
          rtn:          ''
        }).then((res)=>{
          this.notificacion(res.data.msj,'success');
          this.registrarCuenta(res.data.cliente_id);
        }).catch((error)=>{
          if (error.response.status === 422)
            this.notificacion('El cliente ya existe','error');
          else
            this.notificacion('Hubo un error inesperado en el servidor','eror');

          this.$store.commit('activarOverlay', false)
        })
      }else{
        this.registrarCuenta(this.data.cliente.id);
      }
    },
    registrarCuenta(cliente){
      this.$axios.post('cuenta/nueva/manual/articulo',{
        articulo_id:       this.data.articulo.id,
        serie:             this.data.articulo.serie,
        color:             this.data.articulo.color,
        sucursal:          this.data.cuenta.sucursal,

        precio_inicial:    this.data.cuenta.total_inicial,
        cliente_id:        cliente,
        colaborador_id:    this.data.cuenta.colaborador,
        saldo_actual:      this.data.cuenta.saldo_actual,
        num_cuota:         this.data.cuenta.cuotas,
        identidad:         this.data.cliente.identidad,
        saldo_mora:        this.data.cuenta.saldo_mora,
        total_abonado:     this.data.cuenta.total_abonado,
        total:             this.data.cuenta.total_inicial,
        estado_cuenta:     this.data.cuenta.estado,

        fecha_vencimiento: this.data.cuenta.fecha_vencimiento,
        fecha_prima:       this.data.cuenta.fecha_prima,
        tasa_anual:        0.5,
        cuota:             this.data.cuenta.couta,
        forma_pago:        this.data.cuenta.forma_pago,
        prima:             this.data.cuenta.prima,
        financiamiento:    0.0,

        pagos:             this.data.pagos
      }).then((res)=>{
        this.$store.commit('activarOverlay', false)
        this.$router.replace({path:'/inicio/'});
        this.$store.commit('cuentas/cargar_CUENTAS');
      }).catch((error)=>{
        this.notificacion('Hubo un error inesperado al crear la cuenta','error');
        this.$store.commit('activarOverlay', false)
      })
    },
    sumarDias(fecha){
      let dias = 0;
      if(this.data.cuenta.forma_pago !== 3){
        if (this.data.cuenta.forma_pago === 1)
          dias = 7;
        else if (this.data.cuenta.forma_pago === 2)
          dias = 15;

        fecha.setDate(fecha.getDate() + dias);
        return fecha;
      }else{
        fecha.setMonth(fecha.getMonth() + 1);
        return  fecha;
      }

    },
    sumarSaldoActual(){
      this.data.pagos.forEach((i)=>{
        if (i.saldo_actual)
          this.revision.user.saldo_actual = (parseFloat(this.revision.user.saldo_actual) + parseFloat(i.saldo_actual)).toFixed(2);
      })
    },
    sumarTotalMora(data){
      this.revision.user.mora = 0;
      this.data.pagos.forEach((i)=>{
        if (i.mora > 0 && i.total_abonado >= 0 && i.total_abonado < i.total_pago && i.saldo_actual > 0) {
          this.revision.user.mora = parseFloat(this.revision.user.mora) + parseFloat(i.mora);
          data.is_mora = 1;
          data.estao  = 3;
        }else{
          data.is_mora = 0;
        }
      })

    },
    sumarTotalPago(data){
      this.revision.user.saldo_actual = 0;
      if (!isNaN(data.mora) || data.mora > 0) {
        data.total_pago = parseFloat(data.mora) + parseFloat(data.pago_inicial);
      }

      if (!isNaN(data.total_abonado) && !isNaN(data.total_pago) || data.total_abonado > 0 && data.total_pago > 0) {
        data.saldo_actual = (parseFloat(data.total_pago) - parseFloat(data.total_abonado));
        data.saldo_cap =    (parseFloat(data.pago_inicial) - parseFloat(data.total_abonado));
        data.saldo_cap.toFixed(2)
        data.saldo_actual.toFixed(2)
      }

      this.sumarSaldoActual();

      if (data.saldo_actual === 0){
        data.estao = 3;
      }

      this.sumarTotalMora(data);
    },
    validarEnvio(){
      if (this.data.pagos.length > 0 && this.revision.user.revisados === this.data.pagos.length && this.$refs.FormValidarConcordanciaDePagos.validate()) {
        let bandera = true;
        let baderaMora = true;
        let error   = '';
        let estadosPagos = this.data.pagos;
        let estadosMoras = this.data.pagos;
        this.data.pagos.forEach(item=>{
          if (item.is_mora === 5 || item.estao === 5) {
            bandera = false;
            error   = item.detalle
          }
          if (item.is_mora === 1){
            if (item.dias_mora === 0) {
              baderaMora = false;
              error      = item.detalle
            }
          }
        })
        if (bandera && baderaMora)
          this.registrarCliente()
        else
          this.notificacion('Hay error en el pago -> '+error,'warning')
      }else
        this.notificacion('Hay datos que no concuerdan','error');
    },
  }
}
</script>

<style scoped>
.input-tilk{
  box-sizing: border-box;
  width: 90%;
  padding: 2px;
  outline: none;
  font-size: 10px;
  margin: 1px;
  border-radius: 1px;
  border-bottom: solid #000000 1px;
}
.input-select{
  box-sizing: border-box;
  width: 90%;
  padding: 2px;
  outline: none;
  font-size: 10px;
  margin: 1px;
  border-bottom: solid #000000 1px;
}
table{
  width: 100%;
  border: solid #b2b0b0 1px;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
}
table thead tr th{
  padding: 5px;
  font-size: 12px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 2px;
  font-size: 10px;
  cursor: pointer;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr:hover{
  background-color: #f6f6f6;
}

tr:nth-child(even) {background-color: #f2f2f2;}
</style>