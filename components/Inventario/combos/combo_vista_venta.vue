<template>
<v-card flat>
  <v-card flat class="ma-1" tile :loading="loadCombo">
    <v-toolbar flat tile color="grey lighten-4">
      <v-card-title>{{titulo}}</v-card-title>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{on, atts}">
          <v-btn class="ma-2" fab small v-on="on" v-bind="atts" @click="go(1, 'Datos del Combo')"
                 dark icon color="orange" ><v-icon>fa fa-boxes</v-icon></v-btn>
        </template>
        <span>Inicio del Combo</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{on, atts}">
          <v-btn class="ma-2" fab small v-on="on" v-bind="atts" @click="go(2, 'Precio del Combo')"
                 dark icon color="indigo"><v-icon>fa fa-tag</v-icon></v-btn>
        </template>
        <span>Precio</span>
      </v-tooltip>
    </v-toolbar>


    <v-card flat v-if="vista === 1" tile>
      <v-card flat tile>
        <v-toolbar flat color="grey lighten-4">
          <v-card-subtitle>Artículos en el combo</v-card-subtitle>
        </v-toolbar>
        <table>
          <thead>
          <tr>
            <th colspan="2">Codigo</th>
            <th colspan="1">Nombre</th>
            <th colspan="3">Detalle</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td colspan="2">{{Combo.codigo}}</td>
            <td colspan="1">{{Combo.nombre}}</td>
            <td colspan="3">{{Combo.detalle}}</td>
          </tr>
          </tbody>
          <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Articulos Incluidos</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Sub Familia</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in Combo.detalle_combo">
            <td>{{i+1}}</td>
            <td>{{item.articulo.codigo_sistema}}</td>
            <td>{{item.articulo.nombre_articulo}}</td>
            <td>{{item.articulo.modelo}}</td>
            <td>{{item.articulo.marca.nombre}}</td>
            <td>{{item.articulo.sub_familia_articulo.nombre}}</td>
          </tr>
          </tbody>
        </table>
      </v-card>
      <v-row no-gutters>
        <v-col cols="5">
          <v-card flat tile>
            <v-toolbar flat color="grey lighten-4">
              <v-card-subtitle>Sucursales disponibles</v-card-subtitle>
            </v-toolbar>
            <table>
              <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in sucursales">
                <td>{{item.abreviatura}}</td>
                <td>{{item.nombre}}</td>
              </tr>
              </tbody>
            </table>
          </v-card>
        </v-col>
        <v-col cols="7">
          <v-card flat tile>
            <v-toolbar flat color="grey lighten-4">
              <v-card-subtitle>Inventario en las sucursales</v-card-subtitle>
            </v-toolbar>
            <table>
              <thead>
              <tr>
                <th>Articulo</th>
                <th>Sucursal</th>
                <th class="text-center">Reingreso</th>
                <th class="text-center">Nuevo</th>
                <th class="text-center">Consignado</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in inventario">
                <td>{{item.sucursal.abreviatura}}</td>
                <td>{{item.articulo.nombre_articulo}}</td>
                <td class="text-center">{{item.stock_reingreso}}</td>
                <td class="text-center">{{item.stock_actual}}</td>
                <td class="text-center">{{item.stock_consignado}}</td>
              </tr>
              </tbody>
            </table>
          </v-card>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-text>*Siempre verifica que todos los artículos incluidos en el combo esten cargados.</v-card-text>
      <v-card-text>*Si un artículo no esta en tu piso de venta, siempre puedes mandar la solicitúd de crédito.</v-card-text>
    </v-card>


    <v-card flat v-else-if="vista === 2" tile>
      <v-toolbar flat color="grey lighten-4">
        <v-card-subtitle>Cotizador del combo - {{Combo.nombre}}</v-card-subtitle>
      </v-toolbar>
      <v-form ref="FormCotizadorCombo">
        <v-row>
          <v-col><v-text-field class="ma-2" label="Precio de contado" v-model="Precios.contado"
                               prefix="L. " outlined dense disabled></v-text-field></v-col>
          <v-col><v-text-field class="ma-2" label="Minimo de prima" prefix="L. " v-model="Precios.min_prima"
                               outlined dense disabled></v-text-field></v-col>
          <v-col><v-text-field class="ma-2" label="Saldo" prefix="L. " v-model="Precios.saldo"
                               outlined dense disabled></v-text-field></v-col>
          <v-col><v-text-field class="ma-2" label="Prima propuesta por el cliente" v-model="Precios.prima"
                               :rules="[rules.precios.prima]" @keyup="calcularSaldoNuevo"
                               color="green" prefix="L. " outlined dense :disabled="Precios.S_contado"></v-text-field></v-col>
          <v-col><v-text-field class="ma-2" label="Saldo a financiar" disabled v-model="Precios.saldo_nuevo"
                               prefix="L. " color="green" outlined dense></v-text-field></v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select dense label="*Forma de pagos" v-model="Precios.forma_pago" color="green" outlined
                      class="ma-2" :items="formaPagos" :disabled="Precios.S_contado"></v-select>
          </v-col>
          <v-col><v-text-field class="ma-2" @keyup.enter="calcularPagos" :disabled="Precios.S_contado"
                               v-model="Precios.meses"
                               color="green" label="*Cantidad de meses" suffix="meses" outlined dense></v-text-field></v-col>
          <v-col><v-text-field class="ma-2" label="Maximo de meses a financiar" v-model="Precios.maximo_financiamiento"
                               suffix="meses" outlined dense disabled></v-text-field></v-col>
          <v-col><v-text-field class="ma-2" color="green" label="Cuota" prefix="L. "
                               disabled outlined dense v-model="Precios.cuota"></v-text-field></v-col>
          <v-col><v-text-field class="ma-2" color="green" label="Total del credito"
                               prefix="L. " disabled outlined dense v-model="Precios.total_credito"></v-text-field></v-col>
        </v-row>
      </v-form>

      <v-card flat v-if="Precios.pagos.length > 0">
        <v-toolbar flat color="grey lighten-4">
          <v-card-subtitle>Tabla de Pagos</v-card-subtitle>
        </v-toolbar>
        <table>
          <thead>
          <tr>
            <th>#</th>
            <th>Fecha de Pago</th>
            <th>Saldo</th>
            <th>Cuota</th>
            <th>Saldo Restante</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in Precios.pagos">
            <td v-if="i === 0">{{item.num}}</td>
            <td v-else>Pago #{{item.num}}</td>
            <td>{{item.fecha}}</td>
            <td>{{int.format(item.saldo)}}</td>
            <td>{{int.format(item.cuota)}}</td>
            <td>{{int.format(item.saldo_a)}}</td>
          </tr>
          </tbody>
        </table>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="indigo" dark small tile class="ma-2" @click="go(3,'Solicitúd de Crédito')">Crear Soliciúd de Crédito</v-btn>
        </v-card-actions>
      </v-card>
    </v-card>


    <v-card flat v-else-if="vista === 3" tile>
      <v-card tile>
        <solicitud_credito v-if="sideSolicitud" :precio="Precios" :combo="true" :articulo="Combo" :forma_pago="forma_de_pago"/>
        <v-card flat tile v-else>
          <v-card-text>Se cerró la solicitúd de crédito, selecciona cualquier de las siguientes dos vistas.</v-card-text>
          <v-toolbar flat tile color="">
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{on, atts}">
                <v-btn class="ma-2" fab small v-on="on" v-bind="atts" @click="go(1, 'Datos del Combo')"
                       dark icon color="orange" ><v-icon>fa fa-boxes</v-icon></v-btn>
              </template>
              <span>Inicio del Combo</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{on, atts}">
                <v-btn class="ma-2" fab small v-on="on" v-bind="atts" @click="go(2, 'Precio del Combo')"
                       dark icon color="indigo"><v-icon>fa fa-tag</v-icon></v-btn>
              </template>
              <span>Precio</span>
            </v-tooltip>
          </v-toolbar>
        </v-card>
      </v-card>
    </v-card>
  </v-card>


</v-card>
</template>

<script>
import solicitud_credito from "@/components/Ventas/solicitud_credito.vue";
export default {
  name: "combo_vista_venta",
  components:{solicitud_credito},
  computed:{
    forma_de_pago(){
      if (this.Precios.forma_pago === 1)
        return 'Semanal';
      else if (this.Precios.forma_pago === 2)
        return 'Quincenal';
      else if (this.Precios.forma_pago === 3)
        return 'Mensual';
    },
    sideSolicitud:{
      get:function () {
        return this.$store.state.solicitud_credito.SolicitudCredito_view;
      },
      set: function (val) {
        this.$store.commit('solicitud_credito/cambiarValorVista', val);
      }
    },
  },
  data(){
    return{
      loadCombo: true,
      Combo: {},
      sucursales: [],
      inventario: [],
      vista: 1,
      titulo: '',
      Precios:{
        S_contado: false,
        contado:0,
        min_prima: 0,
        saldo: 0,
        pagosT: 0,
        prima: 0,
        saldo_nuevo: 0,
        financiamiento: 0,
        meses: 0,
        pagos: [],
        cuota: 0,
        forma_pago: 3,
        total_financiamiento: 0,
        total_credito: 0,
        maximo_financiamiento: 0,
        venta_sin_prima: false,
        prom_precio_contado: false,
        prom_cant_cuotas: 0
      },
      formaPagos:[
        {text:'Semanal', value:1},
        {text:'Quincenal', value:2},
        {text:'Mensual', value:3},
      ],
      rules:{
        envio:{
          req: v => !!v || 'Campo requerido',
          min:v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 carácteres.',
          max:v => (v && v.length <= 255) || 'Tiene que ser menor o igual a 255 carácteres.',
          mayor: v => v > 0 || 'Tiene que ser mayor a 0',
        },
        precios:{
          prima: v => v >= this.Precios.min_prima || `No puede ser menor a ${this.Precios.min_prima}`
        }
      },
      observacion: '',
      calcularP: false,
      int: Intl.NumberFormat(),
    }
  },
  props:{
    combo: Object
  },
  created() {
    this.$store.commit('guardarTitulo','Inventario > Combos > '+this.combo.nombre_articulo);
    this.cargarCombo();
    this.titulo = 'Datos del Combo'
    this.sideSolicitud = true
  },
  methods:{
    calcularPagos(){
      this.observacion = 'VENTA FINANCIADA'
      this.calcularP = true;
      let MESES = this.Precios.meses, FIN = this.Precios.financiamiento;

      let SALDO_F = this.Precios.saldo_nuevo;
      this.calcularSaldoNuevo();
      if (MESES <= this.Precios.maximo_financiamiento){
        if (MESES){
          this.Precios.cuota = 0
          this.Precios.pagos = [];
          let TASA_M = (FIN / 12).toFixed(4);

          let TASA = Math.pow(parseInt(1) + parseFloat(TASA_M), -MESES);

          TASA = TASA - 1;

          TASA = TASA / TASA_M;

          let pagos = 0;
          if (this.Precios.forma_pago === 1) {
            pagos = this.Precios.meses * 4;
            this.Precios.cuota = (-SALDO_F / TASA).toFixed(2);
            this.Precios.cuota = (this.Precios.cuota / 4).toFixed(2)
          }else if (this.Precios.forma_pago === 2) {
            pagos = this.Precios.meses * 2;
            this.Precios.cuota = (-SALDO_F / TASA).toFixed(2);
            this.Precios.cuota = (this.Precios.cuota / 2).toFixed(2)
          }else if (this.Precios.forma_pago === 3) {
            pagos = this.Precios.meses;
            this.Precios.cuota = (-SALDO_F / TASA).toFixed(2);
          }
          this.Precios.total_credito = 0;
          this.Precios.total_credito = (this.Precios.cuota * pagos).toFixed(2);

          this.crearPagos(pagos, this.Precios.forma_pago, TASA_M)
        }
      }else
        this.$store.commit('notificacion',{texto:'No es valida la cantidad de meses', color:'warning'})
    },
    calcularSaldoNuevo() {
      if (this.Precios.prima && this.Precios.prima >= this.Precios.min_prima) {
        this.Precios.saldo_nuevo = 0;
        this.Precios.saldo_nuevo = (parseFloat(this.Precios.contado) - parseFloat(this.Precios.prima)).toFixed(2)
      }
    },
    capturarPrecio(){
      this.Precios.contado = this.Combo.precio_contado;
      this.Precios.min_prima = this.Combo.minimo_prima;
      this.Precios.saldo = (parseFloat(this.Precios.contado) - parseFloat(this.Precios.min_prima)).toFixed(2)
      this.Precios.prima = this.Precios.min_prima;
      this.Precios.financiamiento = this.Combo.financiamiento_anual / 100;
      this.Precios.maximo_financiamiento = this.Combo.maximo_financiacion

      this.Precios.S_contado = this.Precios.min_prima === 0 && this.Precios.financiamiento === 0;
      this.calcularSaldoNuevo();
    },
    cargarCombo(){
      this.$axios.get('/2.0/combos/'+this.combo.articulo+'/consulta').then((res)=>{
        this.Combo      = res.data.combo;
        this.sucursales = res.data.sucursales;
        this.inventario = res.data.stock;
        this.loadCombo  = false;
        this.capturarPrecio();
      })
    },
    crearPagos(pagos, tipo){
      let dias= 0, saldo = this.Precios.total_credito;
      let ANTES = new Date(), cuota = this.Precios.cuota;

      if(this.Precios.prima > 0){
        this.Precios.pagos.push({
          "num": 'prima',
          "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
          "saldo": (parseFloat(saldo) + parseFloat(this.Precios.prima)).toFixed(2),
          "cuota": this.Precios.prima,
          "saldo_a": saldo
        });
      }
      this.totalRows++;
      if (tipo === 1 || tipo === 2){
        if (tipo === 1){
          dias = 7
        }else if (tipo === 2){
          dias = 15
        }
        for (let i = 0;  i < pagos; i++){
          ANTES.setDate(ANTES.getDate() + dias);
          this.Precios.pagos.push({
            "num": i+1,
            "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
            "saldo": saldo,
            "cuota": cuota,
            "saldo_a": (saldo - cuota).toFixed(2)
          });
          saldo = (saldo - cuota).toFixed(2);
        }
      }else{
        for (let i = 0;  i < pagos; i++){
          ANTES.setMonth(ANTES.getMonth() + 1);
          this.Precios.pagos.push({
            "num": i+1,
            "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
            "saldo": saldo,
            "cuota": cuota,
            "saldo_a": (saldo - cuota).toFixed(2)
          });
          saldo = (saldo - cuota).toFixed(2);
        }
      }
    },
    go(val, titulo){
      if (val === 1)
        this.vista = val
      else{
        let sucursales = this.sucursales.filter(item => item.id == this.$store.state.sucursal);
        if (sucursales.length > 0){
          this.titulo = titulo;
          this.vista = val;
        }else{
          this.$store.commit('notificacion',{texto:'Esta sucursal no tiene acceso a este combo', color:'warning'})
        }
      }
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
