<template>
  <v-card flat>
    <v-card-subtitle>Datos del combo</v-card-subtitle>
    <v-divider></v-divider>
    <v-form ref="FormNuevoCombo1">
      <v-row no-gutters>
        <v-col cols="6">
          <v-text-field dense class="ma-2" label="Nombre del Combo"
                        :rules="[rules.req]" v-model="combo.nombre" counter></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-autocomplete dense class="ma-2" label="Seleccione una Sub-familia"
                          :items="subs" :loading="load_subs"
                          v-model="combo.sub_familia" :rules="[rules.req]"></v-autocomplete>
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
      <v-row no-gutters>
        <v-col>
          <v-text-field dense class="ma-2" label="Detalle del Combo" :rules="[rules.req]"
          v-model="combo.detalle" counter="100"></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col >
          <v-autocomplete dense class="ma-2" :items="SUCURSALES" :rules="[rules.req]"
                          :item-text="'nombre'" :item-value="'id'" multiple
                          v-model="combo.sucursales" chips small-chips
                          label="Seleccionar Sucursales" :loading="LOADSUCURSALES"></v-autocomplete>
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
          <th class="text-center">Eliminar</th>
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
          <td class="text-center">
            <v-btn color="red" text x-small fab width="15px" @click="deleteFila(item)"
                   height="15px"><v-icon size="13px">fa fa-times</v-icon></v-btn>
          </td>
        </tr>
        <tr>
          <td colspan="4"></td>
          <td style="border-top: solid 1px #000000">L. {{int.format(TotalPrecioContado)}}</td>
          <td></td>
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
        <v-col>
          <v-text-field dense class="ma-2" label="Cant. Max. de Uso" :rules="[rules.req, rules.impuesto.menor]"></v-text-field>
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
                        label="Tasa anual" @change="calcularFinanciamientoMensual"
                        v-model="combo.financiamiento_anual" dense class="ma-2"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field suffix="meses" :rules="[rules.req]"
                        label="Máximo de meses a financiar" @change="asignarMesPrueba"
                        v-model="combo.maximo_meses" dense class="ma-2"></v-text-field>
        </v-col>
        <v-col>
          <v-select label="Aceptar Venta sin Prima" v-model="combo.sin_prima"
                    dense class="ma-2" :items="SinPrimas"></v-select>
        </v-col>
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
          <th>Financiando</th>
          <th class="d-flex justify-center">
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-btn v-on="on" v-bind="attrs" x-small @click="dialogos.amortizacion = true"
                       text color="pink" dark tile>Meses Prueba</v-btn>

              </template>
              <span>Meses para probar la tabla de amoritzación. Click para desplegar tabla</span>
            </v-tooltip>
          </th>
          <th>Cuota</th>
          <th>Intereses</th>
          <th>Total</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>L {{int.format(combo.precio_costo)}}</td>
          <td>L {{int.format(combo.margen_ganancia)}}</td>
          <td>L {{int.format(combo.impuesto2)}}</td>
          <td>L {{int.format(combo.precio_contado)}}</td>
          <td>L {{int.format(combo.prima)}}</td>
          <td>L {{int.format(combo.precio_prima)}}</td>
          <td class="d-flex justify-center">
            <input type="number" v-model="combo.meses_prueba">
          </td>
          <td>L {{int.format(combo.cuota)}}</td>
          <td>L {{int.format(combo.intereses)}}</td>
          <td>L {{int.format(combo.total_credito)}}</td>
        </tr>
        </tbody>
      </table>
    </v-card>

    <v-card-actions class="d-flex justify-end">
      <v-btn color="success" dark small tile class="ma-2" @click="registrarComobo">Registrar Combo</v-btn>
    </v-card-actions>
    <v-divider></v-divider>


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

    <v-navigation-drawer right absolute id="side" width="65%" v-model="dialogos.amortizacion">
      <v-card flat>
        <v-row no-gutters>
          <v-col cols="9">
            <v-card-title>Tabla de Amortización</v-card-title>
          </v-col>
          <v-col cols="3" class="d-flex justify-end align-center">
            <v-btn fab text small color="red" dark class="ma-2"
                   @click="dialogos.amortizacion = !dialogos.amortizacion"><v-icon>fa fa-times</v-icon></v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-simple-table v-if="combo.amortizacion.length > 0" class="grey lighten-5 ma-5">
          <template v-slot:default>
            <thead>
            <tr>
              <th>#</th>
              <th>Cuota</th>
              <th>Capital</th>
              <th>Intereses</th>
              <th>Saldo Antes</th>
              <th>Saldo Despues</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in combo.amortizacion">
              <td>{{item.pago}}</td>
              <td>L. {{new Intl.NumberFormat().format(item.cuota)}}</td>
              <td>L. {{new Intl.NumberFormat().format(item.capital)}}</td>
              <td>L. {{new Intl.NumberFormat().format(item.intereses)}}</td>
              <td>L. {{new Intl.NumberFormat().format(item.antes)}}</td>
              <td>L. {{new Intl.NumberFormat().format(item.despues)}}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>


      </v-card>
    </v-navigation-drawer>
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
        inventario: false,
        amortizacion: false
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
      SinPrimas: [
        {text:'Si', value:1},
        {text:'No', value:0}
      ],
      combo:{
        sucursales: [],
        cant_usadas: 0,
        sub_familia: '',
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
        precio_prima: 0,
        maximo_meses: 1,
        cuota: 0,
        intereses: 0,
        capital: 0,
        total_financiado: 0,
        meses_prueba: 1,
        total_credito: 0,
        amortizacion: [],
        nombre: '',
        detalle: '',
        sin_prima: 0,
      },
      impuesto: '', //es el impuesto seleccionado por el cliente
      Impuestos: [], //son los impuestos registrados en tilk,
      subs: [],
      load_subs: true
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Contabilidad > Combos > Nuevo Combo');
    this.$store.commit('cargar_ARTICULOS_EDIT');
    this.$store.commit('suc/cargar_SUCURSALES');
    this.getImpuestos();
    this.cargarSubs();
  },
  computed:{
    INVENTARIO(){
      return this.$store.state.ARTICULOS_EDIT;
    },
    LOADINVENTARIO(){
      return this.$store.state.LOAD_ARTICULOS_EDIT;
    },
    LOADSUCURSALES(){
      return this.$store.state.suc.LOAD_SUCURSALES;
    },
    SUCURSALES(){
      return this.$store.state.suc.SUCURSALES;
    },
    TotalPrecioContado(){
      return this.combo.articulos.reduce((num1, num2)=> num1 + parseFloat(num2.precio_contado),0);
    }
  },
  methods:{
    asignarMesPrueba(){
      this.combo.meses_prueba = this.combo.maximo_meses;
      this.calcularInteres()
    },
    calcularFinanciamientoMensual(){
      let margen = this.combo.financiamiento_anual
      if (margen < 1)
        margen = margen * 100
      this.combo.finanaciamiento_mensual = (margen / 12).toFixed(2)
      this.calcularInteres()
    },
    calcularInteres(){
      let MESES  = this.combo.meses_prueba;
      if (MESES > 1){
        this.combo.amortizacion = [];
        this.combo.capital = 0;
        this.combo.intereses = 0;
        let SALDO_FINANCIAR = this.combo.precio_prima;
        let TASA_MENSUAL = this.combo.finanaciamiento_mensual / 100;
        let TASA = Math.pow(parseInt(1) + parseFloat(TASA_MENSUAL),-MESES);
        TASA = TASA - 1;
        TASA = TASA / TASA_MENSUAL;
        this.combo.cuota = (-SALDO_FINANCIAR/TASA).toFixed(2);
        this.combo.total_credito = (parseFloat(this.combo.cuota * MESES) + parseFloat(this.combo.prima)).toFixed(2)

        this.probarFinanciamiento(TASA_MENSUAL, MESES);
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
        let PRECIO_C_IMPUESTO = (parseFloat(this.combo.impuesto2) + parseFloat(PRECIO_S_IMPUESTO));
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
      if (this.combo.articulos.length === 0) {
        this.combo.precio_a_financiar = 0;
        this.combo.prima = 0;
      }else{
        let MARGEN_PRIMA = this.combo.margen_prima;
        let PRECIO_CONTADO = this.combo.precio_contado;
        if (MARGEN_PRIMA >= 1){
          MARGEN_PRIMA = MARGEN_PRIMA / 100;
          this.combo.prima = (PRECIO_CONTADO * MARGEN_PRIMA).toFixed(2)
        }else if (MARGEN_PRIMA < 1){
          this.combo.prima = (PRECIO_CONTADO * MARGEN_PRIMA).toFixed(2)
        }
        this.combo.precio_prima = (parseFloat(PRECIO_CONTADO) - parseFloat(this.combo.prima)).toFixed(2)
        this.calcularInteres()
      }
    },
    cargarSubs(){
      this.$axios.get('2.0/cargar_sub_familias').then((res)=>{
        res.data.subs.forEach((item)=>{
          this.subs.push({
            text: item.nombre +' - '+ item.familia_articulo.nombre,
            value: item.id
          })
        })
        this.load_subs = false;
      })
    },
    deleteFila(data){
      this.combo.articulos.splice(data.key, 1)
      this.combo.articulos.forEach( (i, item) => {
        i.key = item;
      });
      this.sumarPrecioCosto();
      this.calcularPrecioContado();
      this.sumarTotalContado();
      this.calcularPrima();
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

      // this.combo.precio_costo = (parseFloat(this.combo.precio_costo) + parseFloat(item.precio_costo)).toFixed(2);
      this.sumarPrecioCosto();
      this.cargarPrecioActual(this.combo.articulos[long]);
    },
    leerImpuesto(){
      this.combo.impuesto_id = this.impuesto.split('-')[0];
      this.combo.impuesto    = this.impuesto.split('-')[1];
      if (this.$refs.FormNuevoCombo2.validate())
        this.calcularPrecioContado()
    },
    probarFinanciamiento(TASA_MENSUAL, T){
      let PAGOS = [];
      let antes = this.combo.precio_contado;
      let despues =  (antes - this.combo.prima).toFixed(2);
      let capital = 0
      PAGOS.push({
        "pago": 0,
        "cuota": this.combo.prima,
        "antes": this.combo.precio_contado,
        "capital": capital,
        "intereses": 0,
        "despues": despues
      });
      let intereses = 0;
      for (let i = 0; i < T; i++){
        antes = despues;
        intereses = (antes * TASA_MENSUAL).toFixed(2);
        capital = (this.combo.cuota - intereses).toFixed(2);
        despues = (antes - capital).toFixed(2);
        PAGOS.push({
          "pago": parseInt(i) + parseInt(1),
          "cuota": this.combo.cuota,
          "antes": antes,
          "capital": capital,
          "intereses": intereses,
          "despues": despues
        });
        this.combo.capital = (parseFloat(this.combo.capital) + parseFloat(capital)).toFixed(2);
        this.combo.intereses = (parseFloat(this.combo.intereses) + parseFloat(intereses)).toFixed(2);
      }
      this.combo.amortizacion = PAGOS;
    },
    registrarComobo(){
      if (this.$refs.FormNuevoCombo1.validate() && this.$refs.FormNuevoCombo2.validate() && this.$refs.FormComboNuevo3.validate()){
        let th = this.combo;
        console.log(th);
        this.$store.commit('activarOverlay', true);

        this.$axios.post('2.0/combos',{
          nombre:               th.nombre,
          detalle:              th.detalle,
          sub_familia_articulo: th.sub_familia,
          fecha_final:          th.fecha_final,
          sucursales:           JSON.stringify(th.sucursales),
          total_precio_contado: this.TotalPrecioContado,
          precio_contado:       th.precio_contado,
          precio_costo:         th.precio_costo,
          minimo_prima:         th.prima,
          margen_ganancia:      th.margenUtilidad,
          financiamiento_anual: th.financiamiento_anual,
          impuesto_id:          th.impuesto_id,
          maximo_financiacion:  th.maximo_meses,
          articulos:            th.articulos,
          maximo_cant_usadas:   th.cant_usadas,
          venta_sin_prima:      th.sin_prima
        }).then((res)=>{
          this.$store.commit('inventario/combos/cargar_COMBOS');
          this.$store.commit('activarOverlay', false);
          this.$store.commit('inventario/combos/cambiar_VISTA', 1)
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        })
      } else
        this.$store.commit('notificacion',{texto:'Formulario incompleto', color:'warning'})
    },
    sacarFinanciamientoMensual(){
      let margen = this.combo.financiamiento_anual
      if (margen < 1)
        margen = margen * 100
      this.combo.finanaciamiento_mensual = (margen / 12).toFixed(2)
      // this.calcularInteres()
    },
    sumarPrecioCosto(){
      this.combo.precio_costo = this.combo.articulos.reduce((num1, num2)=> num1 +  parseFloat(num2.precio_costo),0)
    },
    sumarTotalContado(){
      this.combo.total_contado = this.combo.articulos.reduce((num1, num2)=> num1 + parseFloat(num2.precio_contado),0)
      // this.combo.total_contado = this.combo.total_contado.toFixed(2)
    },
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
  input{
    width: 50px;
    border: solid 1px #000000;
    padding: 2px;
    background-color: #f2f2f2;
  }
  #side{
    opacity: 1;
  }
  table tbody tr:hover{
    background-color: #BBBBBB;
  }
</style>
