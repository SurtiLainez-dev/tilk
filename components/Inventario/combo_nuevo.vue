<template>
  <v-card flat>
    <v-card-subtitle>Datos del combo</v-card-subtitle>
    <v-divider></v-divider>
    <v-form ref="FormNuevoCombo1">
      <v-row no-gutters>
        <v-col cols="9">
          <v-text-field dense class="ma-2" label="Nombre del Combo" counter></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-dialog ref="dialogFechaFinal" v-model="dialogos.fecha_final" :return-value.sync="combo.fecha_final"
                    persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field dense class="ma-2" label="Fecha de final" v-bind="attrs" v-on="on"
                            hint="Fecha en la que termina promoción" persistent-hint
                            v-model="combo.fecha_final"></v-text-field>
            </template>
            <v-date-picker v-model="combo.fecha_final" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogos.fecha_final = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.dialogFechaFinal.save(combo.fecha_final)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
    </v-form>

    <v-row no-gutters>
      <v-col cols="9"><v-card-subtitle>Seleccionar Artículos</v-card-subtitle></v-col>
      <v-col class="d-flex justify-end">
        <v-tooltip top>
          <template v-slot:activator="{on, sttrs}">
            <v-btn color="indigo" class="ma-2" fab v-on="on" v-bind="sttrs" @click="dialogos.inventario = true"
                   dark text x-small ><v-icon>fa fa-plus</v-icon></v-btn>
          </template>
          <span>Añadir Artículo</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-card height="130" class="ma-2">
      <table>
        <thead>
        <tr>
          <th>Código</th>
          <th>Marca/Modelo</th>
          <th>Artículo</th>
          <th>Precio Costo</th>
          <th>Precio Contado</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in combo.articulos">
          <td>{{item.cod}}</td>
          <td>{{item.marca}}/{{item.modelo}}</td>
          <td>{{item.articulo}}</td>
          <td>L. {{int.format(item.precio_costo)}}</td>
          <td>L. {{int.format(item.precio_contado)}}
            <v-progress-linear indeterminate v-if="item.load_precio"></v-progress-linear>
          </td>
        </tr>
        </tbody>
      </table>
    </v-card>

    <v-card-subtitle class="ma-2">Datos del precio</v-card-subtitle>
    <v-divider></v-divider>
    <v-form ref="FormNuevoCombo2">
      <v-row no-gutters>
        <v-col>
          <v-text-field suffix="lps"  v-model="combo.total_contado" dense
                        hint="El total de precio de contado de los artículos" persistent-hint
                        class="ma-2" label="Total de precio de contado" disabled></v-text-field>
        </v-col>
        <v-col>
          <v-select dense label="Seleccionar mmpuesto" :items="Impuestos"
                    @change="leerImpuesto" class="ma-2"
                    v-model="impuesto" :rules="[rules.req]"></v-select>
        </v-col>
        <v-col>
          <v-text-field :suffix="combo.margenUtilidadReal+'%'" dense class="ma-2" v-model="combo.margenUtilidad"
                        :rules="[rules.req, rules.impuesto.menor]" @change="calcularPrecioContado"
                        label="Margen de ganancia"></v-text-field>
        </v-col>
      </v-row>
    </v-form>

    <v-form ref="FormComboNuevo3">
      <v-row no-gutters>
        <v-col>
          <v-text-field v-model="combo.margen_prima" :suffix="combo.margen_prima+'%'"
                        @keyup="calcularPrima" label="Margen de prima" class="ma-2" dense
                        :rules="[rules.req,rules.impuesto.m]"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field :suffix="combo.finanaciamiento_mensual+'%'" :rules="[rules.req,rules.impuesto.m]"
                        label="Tasa anual"
                        v-model="combo.financiamiento_anual" dense class="ma-2"></v-text-field>
        </v-col>
        <v-col></v-col>
        <v-col></v-col>
      </v-row>
    </v-form>

    <v-card flat class="ma-2">
      <table>
        <thead>
        <tr>
          <th>Precio de Costo</th>
          <th>Ganancia</th>
          <th>Impuesto</th>
          <th>Precio de Contado</th>
          <th>Prima Mínina</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>L {{int.format(combo.precio_costo)}}</td>
          <td>L {{int.format(combo.margen_ganancia)}}</td>
          <td>L {{int.format(combo.impuesto2)}}</td>
          <td>L {{int.format(combo.precio_contado)}}</td>
          <td>L {{int.format(combo.prima)}}</td>
        </tr>
        </tbody>
      </table>
    </v-card>


    <v-dialog width="100%" v-model="dialogos.inventario">
      <v-card>
        <v-toolbar color="grey lighten-3">
          <v-card-title>Inventario</v-card-title>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" dense
                        label="Buscar artículo" single-line hide-details></v-text-field>
        </v-toolbar>
        <v-data-table :loading="LOADINVENTARIO" loading-text="Cargando artículos... por favor espere un momento"
                      :headers="header" :items="INVENTARIO" :search="search" dense
                      class="rowsTable" @click:row="goPrecio">

        </v-data-table>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" dark small tile @click="dialogos.inventario = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "combo_nuevo",
  data(){
    return{
      rules:{
        req: v => !!v || 'Campo Requerido',
        impuesto:{
          menor: v => v > 0 || 'Tiene que ser mayor a 0',
          m: v =>  v >= 0 || 'Dato Invalido',
        }
      },
      int: Intl.NumberFormat(),
      dialogos:{
        fecha_final: false,
        inventario: false
      },
      loadInventario: false,
      Inventario: [],
      search: '',
      header:[
        {text:'Proveedor',value:'proveedor'},
        {text:'Marca',value:'marca'},
        {text:'Módelo',value:'modelo'},
        {text:'Código Sístema',value:'codigo_sistema'},
        {text:'Nombre del Artículo',value:'nombre_articulo'},
        {text:'Código Proveedor',value:'codigo_proveedor'},
        {text:'Sub-familia',value:'fam'},
      ],
      combo:{
        fecha_final: '',
        articulos: [],
        precio_costo: 0,
        total_contado: 0, //es total del precio de contado que tienen los articulos actualmente
        precio_contado: 0, //es el precio de contado del articulo
        margenUtilidadReal: 0, //es el margen de utilidad en %
        margenUtilidad: 0, //es el margen de utilidad ingresado por el cliente
        margen_ganancia: 0, //es el margen de ganacia del precio de contado
        impuesto: 0, //es el impuesto seleccionado por el usuario
        impuesto2: 0, //es el impuesto en lps
        impuesto_id: 0, //es el id del impuesto que se selecciono,
        financiamiento_anual: 0,
        finanaciamiento_mensual:0,
        margen_prima: 0,
        prima: 0,
        precio_prima: 0
      },
      impuesto: '', //es el impuesto seleccionado por el cliente
      Impuestos: [] //son los impuestos registrados en tilk
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Contabilidad > Combos > Nuevo Combo');
    this.$store.commit('cargar_ARTICULOS_EDIT');
    this.getImpuestos();
  },
  computed:{
    INVENTARIO(){
      return this.$store.state.ARTICULOS_EDIT;
    },
    LOADINVENTARIO(){
      return this.$store.state.LOAD_ARTICULOS_EDIT;
    }
  },
  methods:{
    calcularInteres(){
      let MESES  = this.Precio.meses;
      if (MESES > 0){
        // this.Precio2.prueba = [];
        // this.Precio2.totalInteres = 0;
        // this.Precio2.totalCapital = 0
        // let SALDO_FINANCIAR = this.Precio2.precioConPrima;
        // let TASA_MENSUAL = this.Precio.financiamientoMensual / 100;
        // let TASA = Math.pow(parseInt(1) + parseFloat(TASA_MENSUAL),-MESES);
        // TASA = TASA - 1;
        // TASA = TASA / TASA_MENSUAL;
        // this.Precio2.cuota = (-SALDO_FINANCIAR/TASA).toFixed(2);
        //
        // this.probarFinanciamiento(TASA_MENSUAL, MESES);
      }

    },
    calcularPrecioContado(){
      this.combo.margenUtilidadReal = this.combo.margenUtilidad
      if (this.$refs.FormNuevoCombo2.validate()){
        if (this.combo.margenUtilidadReal > 1)
          this.combo.margenUtilidadReal = (this.combo.margenUtilidadReal / 100).toFixed(4);
        this.combo.margen_ganancia = (parseFloat(this.combo.precio_costo * this.combo.margenUtilidadReal)).toFixed(2)
        let PRECIO_S_IMPUESTO = (parseFloat(this.combo.margen_ganancia) + parseFloat(this.combo.precio_costo)).toFixed(2);
        this.combo.impuesto2 = (parseFloat(PRECIO_S_IMPUESTO * this.combo.impuesto)).toFixed(2)
        let PRECIO_C_IMPUESTO = (parseFloat(this.combo.impuesto2) + parseFloat(PRECIO_S_IMPUESTO)).toFixed(2);
        this.combo.precio_contado = PRECIO_C_IMPUESTO
      }
    },
    cargarPrecioActual(item){
      item.load_precio = true;
      this.$axios.get('precio_articulos/'+item.id).then((res)=>{
        if (res.data.precio.length > 0){
          item.precio_contado = res.data.precio[0].precio_contado;
        }else{
          item.precio_contado = 0;
          this.$store.commit('notificacion',{texto:`El artículo ${item.nombre_articulo} no tiene precio activo`, color:'warning'})
        }
        item.load_precio = false;
        this.sumarTotalContado();
      })
    },
    calcularPrima(){
      let MARGEN_PRIMA = this.combo.margen_prima;
      let PRECIO_CONTADO = this.combo.precio_contado;
      if (MARGEN_PRIMA >= 1){
        MARGEN_PRIMA = MARGEN_PRIMA / 100;
        this.combo.prima = (PRECIO_CONTADO * MARGEN_PRIMA).toFixed(2)
      }else if (MARGEN_PRIMA < 1){
        this.combo.prima = (PRECIO_CONTADO * MARGEN_PRIMA).toFixed(2)
      }
      this.combo.precio_prima = (parseFloat(PRECIO_CONTADO) - parseFloat(this.combo.prima)).toFixed(2)
      // this.calcularInteres()
    },
    getImpuestos(){
      this.$axios.get('impuestos').then((res)=>{
        if (res.status === 200){
          res.data.impuestos.forEach( (i) => {
            this.Impuestos.push({
              "text": i.nombre,
              "value"    : i.id+'-'+i.porcentaje
            })
          })
        }
      })
    },
    goPrecio(item){
      this.dialogos.inventario = false;
      let long = this.combo.articulos.length;
      this.combo.articulos.push({
        key:           long,
        id:            item.articulo,
        proveedor:     item.proveedor,
        marca:         item.marca,
        modelo:        item.modelo,
        cod:           item.codigo_sistema,
        articulo:      item.nombre_articulo,
        cod_proveedor: item.codigo_proveedor,
        sib_familia:   item.fam,
        precio_costo:  item.precio_costo,
        precio_contado:0,
        load_precio:   false
      });

      this.combo.precio_costo = (parseFloat(this.combo.precio_costo) + parseFloat(item.precio_costo)).toFixed(2);
      this.cargarPrecioActual(this.combo.articulos[long]);
    },
    leerImpuesto(){
      this.combo.impuesto_id = this.impuesto.split('-')[0];
      this.combo.impuesto    = this.impuesto.split('-')[1];
      if (this.$refs.FormNuevoCombo2.validate())
        this.calcularPrecioContado()
    },
    sacarFinanciamientoMensual(){
      let margen = this.combo.financiamiento_anual
      if (margen < 1)
        margen = margen * 100
      this.combo.finanaciamiento_mensual = (margen / 12).toFixed(2)
      // this.calcularInteres()
    },
    sumarTotalContado(){
      this.combo.total_contado = this.combo.articulos.reduce((num1, num2)=> num1 + parseFloat(num2.precio_contado),0)
      this.combo.total_contado = this.combo.total_contado.toFixed(2)
    }
  }
}
</script>

<style scoped>
  table{
    cursor: pointer;
    border: solid 1px #000000;
    width: 100%;
    padding: 2px;
    font-family: 'Roboto Mono', monospace;
  }
  table thead tr{
    border-bottom: solid 1px #000000;
  }
  table thead tr th{
    font-size: 12px;
    padding: 2px;
  }
  table tbody tr td{
    font-size: 11px;
    padding: 2px;
  }
  table tbody tr:hover {
    background-color: #e5e6ea;
  }
</style>
