<template>
<v-card flat tile>
  <v-card flat tile v-if="vista === 1">
    <table>
      <thead>
      <tr>
        <th>Marca</th>
        <th>Modelo</th>
        <th>Codigo del Sistema</th>
        <th colspan="2">Articulo</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{REINGRESO.articulo.marca.nombre}}</td>
        <td>{{REINGRESO.articulo.modelo}}</td>
        <td>{{REINGRESO.articulo.codigo_sistema}}</td>
        <td colspan="2">{{REINGRESO.articulo.descripcion_corta}}</td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th>Precio de Contado</th>
        <th>Serie del Sistema</th>
        <th>Estado del Articulo</th>
        <th>Serie del Fabricante</th>
        <th>Sucursal</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>L. {{int.format(REINGRESO.precio_actual)}}</td>
        <td>{{REINGRESO.serie_sistema}}</td>
        <td>{{REINGRESO.estado_articulo.nombre}}</td>
        <td>{{REINGRESO.serie_fabricante}}</td>
        <td>{{REINGRESO.sucursal.nombre}}</td>
      </tr>
      </tbody>
    </table>
    <v-row>
      <v-col>
        <v-card class="ma-2" tile flat>
          <v-card-subtitle>Comentarios</v-card-subtitle>

          <table>
            <tbody>
            <tr v-for="(item, index) in JSON.parse(REINGRESO.comentarios)">
              <td>{{index + 1}}</td>
              <td>{{item.titulo}}</td>
              <td>{{item.comentario}}</td>
            </tr>
            </tbody>
          </table>
        </v-card>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-card flat tile class="ma-2">
          <v-toolbar tile flat>
            <v-card-subtitle>Creando Pagos</v-card-subtitle>
            <v-spacer></v-spacer>
            <v-btn color="success" small tile :disabled="!precio.calculado" @click="vista = 2" class="text--white">Crear Solicitud</v-btn>
          </v-toolbar>
          <v-row no-gutters>
            <v-col>
              <v-text-field @change="calcularPago" @keyup.enter="calcularPago" v-model="precio.prima"
                            dense label="Prima" class="ma-2" suffix="lps"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field @change="calcularPago" @keyup.enter="calcularPago" v-model="precio.meses"
                            dense label="Can. de Meses" type="number" class="ma-2" suffix="meses"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field @change="calcularPago" @keyup.enter="calcularPago" v-model="cuota"
                            dense label="Cuota Mensual" type="number" class="ma-2" suffix="lps"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-autocomplete dense label="Forma de Pago" @change="calcularPago" :items="formaPagos" v-model="precio.forma_pago" class="ma-2"></v-autocomplete>
            </v-col>
            <v-col>
              <v-text-field dense label="Cuota Final" disabled suffix="lps" v-model="precio.cuota_final" type="number" class="ma-2"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field dense label="Total del Credito" disabled suffix="lps" v-model="precio.total" type="number" class="ma-2"></v-text-field>
            </v-col>
          </v-row>
          <table>
            <thead>
            <tr>
              <th>#</th>
              <th>Pago</th>
              <th>Saldo Actual</th>
              <th>Cuota</th>
              <th>Nuevo Saldo</th>
              <th>Fecha</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="precio.calculado" v-for="item in precio.pagos">
              <td>{{item.key + 1}}</td>
              <td>{{item.num}}</td>
              <td>L. {{int.format(item.saldo)}}</td>
              <td>L. {{int.format(item.cuota)}}</td>
              <td>L. {{int.format(item.saldo_a)}}</td>
              <td>{{item.fecha}}</td>
            </tr>
            </tbody>
          </table>
        </v-card>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-card>

  <v-card v-else-if="vista === 2">
    <v-toolbar flat dense>
      <v-btn color="red" dark fab small icon @click="vista = 1"><v-icon>fa fa-times</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>{{REINGRESO.articulo.nombre_articulo}} - {{REINGRESO.serie_fabricante}}</v-toolbar-title>

    </v-toolbar>
    <solicitud v-if="sideSolicitud" :precio="precio" :combo="false" :articulo="REINGRESO.articulo" :forma_pago="forma_de_pago"/>
  </v-card>

</v-card>
</template>

<script>
import solicitud_credito from "@/components/Ventas/solicitud_credito.vue";

export default {
  name: "venta_articulo_reingreso",
  components:{solicitud: solicitud_credito},
  computed:{
    REINGRESO(){
      return this.$store.state.inventario.reingreso.REINGRESO;
    },
    forma_de_pago(){
      if (this.precio.forma_pago === 1)
        return 'Semanal';
      else if (this.precio.forma_pago === 2)
        return 'Quincenal';
      else if (this.precio.forma_pago === 3)
        return 'Mensual';
    },
    sideSolicitud:{
      get:function () {
        return this.$store.state.solicitud_credito.SolicitudCredito_view;
      },
      set: function (val) {
        this.$store.commit('solicitud_credito/cambiarValorVista', val);
      }
    }
  },
  created() {
    this.precio.contado = this.REINGRESO.precio_actual;
  },
  data(){
    return{
      formaPagos:[
        {text:'Semanal', value:1},
        {text:'Quincenal', value:2},
        {text:'Mensual', value:3},
      ],
      int: Intl.NumberFormat(),
      vista: 1,
      cuota: 0,
      precio:{
        observacion: '',
        S_contado: false,
        contado: 0,
        min_prima: 0,
        saldo: 0,
        pagosT: 0,
        prima: 0,
        saldo_nuevo: 0,
        financiamiento: 0,
        meses:0,
        pagos: [],
        cuota: 0,
        forma_pago: 3,
        total_financiamiento: 0,
        total_credito: 0,
        maximo_financiamiento: 0,
        venta_sin_prima: false,
        prom_precio_contado: false,
        prom_cant_cuotas: 0,
        total: 0,
        calculado:  false,
        cuota_final: 0,
      }
    }
  },
  methods:{
    calcularPago(){
      if (this.precio.meses > 0 && this.cuota > 0 && this.precio.prima > 0 && this.precio.forma_pago > 0){
        this.precio.min_prima = this.precio.prima;
        this.precio.maximo_financiamiento = this.precio.meses
        let cuota = 0, cantidad = 0;
        if (this.precio.forma_pago === 1) {
          cuota    = (this.cuota / 4).toFixed(2);
          cantidad = this.precio.meses * 4;
        }else if (this.precio.forma_pago === 2){
          cuota    = (this.cuota / 2).toFixed(2);
          cantidad = this.precio.meses * 2;
        }else if (this.precio.forma_pago === 3){
          cantidad = this.precio.meses;
          cuota    = this.cuota;
        }

        this.precio.total = (cuota * cantidad).toFixed(2);
        this.precio.total_credito = (cuota * cantidad).toFixed(2);
        this.precio.cuota_final = cuota;
        this.precio.cuota       = cuota;
        let ANTES = new Date();
        let total = (parseFloat(this.precio.total) + parseFloat(this.precio.prima));
        this.precio.total = total;
        this.precio.saldo = total.toFixed(2);
        this.precio.saldo_nuevo = total;

        let pago  = '';
        this.precio.pagos = [];
        this.precio.pagos.push({
          key: 0,
          num: 'Prima',
          saldo: total,
          cuota: this.precio.prima,
          saldo_a: (total - this.precio.prima).toFixed(2),
          fecha: ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
        });
        total = (total - this.precio.prima).toFixed(2);
        let dias_sumados = 30;
        if (this.precio.forma_pago === 1){
          dias_sumados = 7
        }else if (this.precio.forma_pago === 2){
          dias_sumados = 15
        }
        for (let i = 0; i < cantidad; i++){//creando pagos
          ANTES.setDate(ANTES.getDate() + dias_sumados);
          this.precio.pagos.push({
            key: i+1,
            num: 'Pago #'+(i+1),
            saldo: total,
            cuota: cuota,
            saldo_a: (total - cuota).toFixed(2),
            fecha: ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
          });
          total = (total - cuota).toFixed(2);
        }
        this.precio.calculado = true;
        this.sideSolicitud    = true;
      }else
        this.$store.commit('notificacion',{texto:'No haz registrado cuota o cantidad de pagis', color:'warning'});
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
