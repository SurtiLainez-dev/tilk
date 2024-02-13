<template>
<v-card flat tile class="pa-5">
  <table>
    <thead>
    <tr>
      <th>Nombre del Articulo</th>
      <th>Modelo</th>
      <th>Marca</th>
      <th>Codigo del Sistema</th>
      <th>Codigo del Proveedor</th>
    </tr>
    <tr>
      <td>{{REINGRESO.articulo.descripcion_corta}}</td>
      <td>{{REINGRESO.articulo.modelo}}</td>
      <td>{{REINGRESO.articulo.marca.nombre}}</td>
      <td>{{REINGRESO.articulo.codigo_proveedor}}</td>
      <td>{{REINGRESO.articulo.codigo_sistema}}</td>
    </tr>
    <tr>
      <th>Serie del Sistema</th>
      <th colspan="2">Serie del Fabricante</th>
      <th>Color</th>
      <th>Precio de Contado</th>
    </tr>
    <tr>
      <td>{{REINGRESO.serie_sistema}}</td>
      <td colspan="2">{{REINGRESO.serie_fabricante}} <span v-if="REINGRESO.motocicleta">{{REINGRESO.motocicleta.motor}}</span></td>
      <td>{{REINGRESO.color}}</td>
      <th>L. {{int.format(REINGRESO.precio_actual)}}</th>
    </tr>
    <tr>
      <th>#</th>
      <th colspan="4">Comentario</th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="REINGRESO.comentarios" v-for="item in JSON.parse(REINGRESO.comentarios)">
      <td>{{item.key + 1}}</td>
      <td colspan="4">{{item.titulo}} - {{item.comentario}}</td>
    </tr>
    </tbody>
    <thead>
    <tr>
      <th>Creando Solicitud - Precio</th>
    </tr>
    </thead>
  </table>

  <v-form ref="FormPrecioSolicitud">
    <v-row no-gutters>
      <v-col>
        <v-text-field outlined class="ma-2" dense label="Precio de Contado" v-model="Precio.contado"
                      @keyup.enter="calcularMinimoPrima" @keyup.tab="calcularMinimoPrima" suffix="lps"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field outlined  class="ma-2" dense label="Minimo de Prima" v-model="Precio.min_prima"
                      disabled :suffix="(Precio.procentaje_prima * 100).toFixed(2)+'%'"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field outlined  class="ma-2" dense label="Saldo" v-model="Precio.saldo" disabled suffix="lps"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field outlined  class="ma-2" dense label="Prima Propuesta por el Cliente" v-model="Precio.prima"
                      suffix="lps" @keyup.enter="calcularCuota" @keyup.tab="calcularCuota"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field outlined  class="ma-2" disabled dense v-model="Precio.saldo_a_financiar" label="Saldo a Financiar" suffix="lps"></v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-select outlined  dense class="ma-2" label="Forma de Pago" :items="formaPagos" @change="calcularCuota"
                  v-model="Precio.forma_pago"></v-select>
      </v-col>
      <v-col>
        <v-text-field  outlined class="ma-2" dense label="Maximo Financiación" v-model="Precio.maximo_financiamiento" disabled suffix="meses"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field outlined  class="ma-2" dense label="Cantidad de Meses" @keyup.enter="calcularCuota"
                      v-model="Precio.meses" suffix="meses" ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field outlined  class="ma-2" v-model="Precio.cuota" @keyup.enter="calcularCuota"
                      dense label="Cuota por Pago" @keyup.tab="calcularCuota" suffix="lps"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field outlined  class="ma-2" v-model="Precio.total_credito_c_prima" dense label="Total del Crédito" disabled suffix="lps"></v-text-field>
      </v-col>
    </v-row>
    <small class="ml-4">Tabla de pagos</small>
    <v-card flat tile height="380" color="grey lighten-3" class="overflow-auto">
      <v-simple-table class="grey lighten-3" dense>
        <template v-slot:default>
          <thead>
          <tr>
            <th># Pago</th>
            <th>Fecha de Pago</th>
            <th>Saldo</th>
            <th>Cuota</th>
            <th>Saldo Restante</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in Precio.pagos">
            <th>{{item.num}}</th>
            <th>{{item.fecha}}</th>
            <th>L. {{int.format(item.saldo)}}</th>
            <th>L. {{int.format(item.cuota)}}</th>
            <th>L. {{int.format(item.saldo_a)}}</th>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <v-card class="d-flex justify-end">
      <v-btn class="d-flex justify-end ma-2" small tile color="success" @click="sideSolicitud = true">Crear Solicitúd</v-btn>
    </v-card>
  </v-form>

  <v-navigation-drawer v-model="sideSolicitud" clipped right absolute width="100%" class="side">
    <solicitud_credito v-if="sideSolicitud" :precio="Precio" :combo="false" :articulo="REINGRESO.articulo" :forma_pago="forma_de_pago"/>
  </v-navigation-drawer>

</v-card>
</template>

<script>
import solicitud_credito from "@/components/Ventas/solicitud_credito.vue";
export default {
  components:{
    solicitud_credito
  },
  name: "solicitud_reingreso",
  data(){
    return{
      int: Intl.NumberFormat(),
      Precio:{
        contado:               0,
        min_prima:          0,
        saldo:                 0,
        saldo_a_financiar:     0,
        prima:         0,
        forma_pago:            0,
        maximo_financiamiento: 0,
        meses:                 0,
        cuota:                 0,
        total_credito_c_prima: 0,
        pagos:                 [],
        procentaje_prima:      0,
        tasa_anual:            0,
      },
      formaPagos:[
        {text:'Semanal', value:1},
        {text:'Quincenal', value:2},
        {text:'Mensual', value:3},
      ],
    }
  },
  computed:{
    forma_de_pago(){
      if (this.Precio.forma_pago === 1)
        return 'Semanal';
      else if (this.Precio.forma_pago === 2)
        return 'Quincenal';
      else if (this.Precio.forma_pago === 3)
        return 'Mensual';
    },
    REINGRESO(){
      return this.$store.state.inventario.reingreso.REINGRESO
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
  methods:{
    calcularMinimoPrima(){
      if (this.Precio.contado > 0){
        this.Precio.min_prima  = (this.Precio.contado * this.Precio.procentaje_prima).toFixed(2);
        this.Precio.saldo         = (this.Precio.contado - this.Precio.min_prima).toFixed(2);
        this.Precio.prima = this.Precio.min_prima;
      }
    },
    calcularCuota(){
      this.calcularPorcentajePrima();
      if (this.Precio.prima > 0){
        this.Precio.saldo_a_financiar = (this.Precio.contado - this.Precio.prima).toFixed(2)
        if (this.Precio.meses > 0){
          let MESES = this.Precio.meses;
          let pagos = 0;
          if (this.Precio.forma_pago === 1) {
            pagos = this.Precio.meses * 4;
            this.Precio.cuota = (this.Precio.cuota / 4).toFixed(2)
          }else if (this.Precio.forma_pago === 2) {
            pagos = this.Precio.meses * 2;
            this.Precio.cuota = (this.Precio.cuota / 2).toFixed(2)
          }else if (this.Precio.forma_pago === 3) {
            pagos = this.Precio.meses;
          }
          this.Precio.total_credito        = (this.Precio.cuota * pagos).toFixed(2)
          this.Precio.total_credito_c_prima = ((this.Precio.cuota * pagos) + parseFloat(this.Precio.prima)).toFixed(2);

          this.crearPagos(pagos);
        }
      }
    },
    crearPagos(pagos){
      let dias= 0, saldo = this.Precio.total_credito;
      let ANTES = new Date(), cuota = this.Precio.cuota;

      this.Precio.pagos = [];
      if(this.Precio.prima > 0){
        this.Precio.pagos.push({
          "num": 'prima',
          "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
          "saldo": this.Precio.total_credito_c_prima,
          "cuota": this.Precio.prima,
          "saldo_a": saldo
        });
      }

      for (let i = 0;  i < pagos; i++){
        ANTES.setMonth(ANTES.getMonth() + 1);
        this.Precio.pagos.push({
          "num": 'Letra '+(i+1),
          "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
          "saldo": saldo,
          "cuota": cuota,
          "saldo_a": (saldo - cuota).toFixed(2)
        });
        saldo = (saldo - cuota).toFixed(2);
        this.totalRows++;
      }
    },
    calcularPorcentajePrima() {
      let porcentaje = (this.Precio.prima / this.Precio.contado).toFixed(2);
      this.Precio.procentaje_prima = porcentaje;
      this.Precio.min_prima = this.Precio.prima
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
table thead tr td{
  padding: 5px;
  font-size: 12px;
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
