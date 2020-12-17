<template>
    <div>
      <h3 class="text-center">Asignación de Precio de {{data.nombre_articulo}}</h3>
      <h6 class="text-center">{{data.descripcion_corta}}</h6>
      <hr>
      <v-row >
        <v-col cols="2">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Proveedor</v-list-item-title>
              <v-list-item-subtitle>{{data.proveedor}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Marca</v-list-item-title>
              <v-list-item-subtitle>{{data.marca}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Módelo</v-list-item-title>
              <v-list-item-subtitle>{{data.modelo}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Código del Sístema</v-list-item-title>
              <v-list-item-subtitle>{{data.codigo_sistema}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Código del Barras</v-list-item-title>
              <v-list-item-subtitle>{{data.codigo_barras}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
        <v-col cols="2">
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Familía</v-list-item-title>
              <v-list-item-subtitle>{{data.fam}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-card class="pl-2 pr-2 pb-2" elevation="5" :loading="!peps">
                <v-row >
                  <v-col cols="4"><v-card-title>Datos</v-card-title></v-col>
                  <v-col cols="8" class="d-flex align-center justify-end"><strong>Precio Unitario S/I del Proveedor Actual: L.</strong>{{data.precio_costo}}</v-col>
                </v-row>
                <hr>
                <div v-if="Peps.length > 0">
                  <small>Datos del último registro peps</small>
                  <v-row>
                    <v-col cols="6"><strong>Referencia:</strong> {{Peps[0].referencia}}</v-col>
                    <v-col cols="6" class="d-flex justify-end"><strong># de Registro:</strong> {{Peps[0].num_registro}}</v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="11">
                      <v-text-field v-model="Precio.peps" disabled label="Último precio ingresado en el peps"></v-text-field>
                    </v-col>
                    <v-col cols="1" class="d-flex align-center">
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs}">
                          <input type="checkbox" v-on="on" v-bind="attrs" @click="cambiarPrecio"
                                 v-model="Precio.selectPeps" />
                        </template>
                        <span>Seleccionar para usar como precio base</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                  <hr>
                </div>
                <small>Rellenar datos para determinar el precio</small>
                <v-form ref="FormVerificarImpuestoAsignacionPrecio">
                  <v-row>
                    <v-col cols="2">
                      <v-select v-model="Precio.imp" @change="leerImpuesto" :rules="[rules.impuesto.req]"
                                :items="Impuestos" label="Impuesto"></v-select>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field label="Precio de Costo sin Impuesto"
                                    disabled v-model="Precio.precio_s_i" suffix="lps"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field label="Margen de Utilidad" @keyup="calcularPrecioContado"
                                    :suffix="Precio.margenUtilidaReal+'%'"
                                    v-model="Precio.margenUtilidad"
                                    :rules="[rules.impuesto.req, rules.impuesto.menor]"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field label="Precio de Contado" v-model="Precio.precioContado"
                                    disabled suffix="lps"></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
                <v-form ref="FormVerificarMargenUtilidadAnual">
                  <v-row>
                    <v-col cols="3">
                      <v-text-field v-model="Precio.financiamientoAnual" :suffix="Precio.financiamientoMensual+'%'"
                                    @keyup="sacarFinanciamientoMensual" :rules="[rules.impuesto.req,rules.impuesto.m]"
                                    label="Financiamiento Anual"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field v-model="Precio.margenPrima" :suffix="Precio.margenPrima+'%'"
                                    @keyup="calcularPrima" label="Margen de Prima"
                                    :rules="[rules.impuesto.req,rules.impuesto.m]"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field label="Prima" disabled v-model="Precio.prima" suffix="lps"></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
                <small>Probar Financiamiento</small>
                <hr>
                <v-row>
                  <v-col cols="5">
                    <v-text-field @keyup="calcularInteres" dense v-model="Precio.meses" label="Probar con meses para probar interes"></v-text-field>
                  </v-col>
                </v-row>
                <v-card-actions class="d-flex justify-end">
                  <v-btn @click="registrarPrecio" color="orange" small dark>Registrar Precio</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card :loading="!cargarPRecio" elevation="5">
                <v-card-title>Datos del Precio Actual</v-card-title>
                <hr>
                <div v-if="PrecioArticulo.length > 0" >
                  <v-row>
                    <v-col cols="4">
                      <v-list-item two-line-line>
                        <v-list-item-content>
                          <v-list-item-title>Precio Costo Anterior</v-list-item-title>
                          <v-list-item-subtitle>L. {{PrecioArticulo[0].precio_costo_antiguo}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="4">
                      <v-list-item two-line-line>
                        <v-list-item-content>
                          <v-list-item-title>Precio Costo Actual</v-list-item-title>
                          <v-list-item-subtitle>L. {{PrecioArticulo[0].precio_costo_actual}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="4">
                      <v-list-item three-line-line>
                        <v-list-item-content>
                          <v-list-item-title>Margen de Ganacia</v-list-item-title>
                          <v-list-item-subtitle>{{PrecioArticulo[0].margen_ganancia}} %</v-list-item-subtitle>
                          <v-list-item-subtitle>L. {{(PrecioArticulo[0].precio_costo_actual * (PrecioArticulo[0].margen_ganancia/100)).toFixed(2)}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4">
                      <v-list-item three-line-line>
                        <v-list-item-content>
                          <v-list-item-title>Impuesto</v-list-item-title>
                          <v-list-item-subtitle>{{PrecioArticulo[0].impuesto.nombre}}</v-list-item-subtitle>
                          <v-list-item-subtitle>L. {{((parseFloat(PrecioArticulo[0].precio_costo_actual) + parseFloat(PrecioArticulo[0].precio_costo_actual * (PrecioArticulo[0].margen_ganancia/100).toFixed(2))) * PrecioArticulo[0].impuesto.porcentaje).toFixed(2)}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="4">
                      <v-list-item two-line-line>
                        <v-list-item-content>
                          <v-list-item-title>Precio de Contado</v-list-item-title>
                          <v-list-item-subtitle>L. {{PrecioArticulo[0].precio_contado}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                    <v-col cols="4">
                      <v-list-item two-line-line>
                        <v-list-item-content>
                          <v-list-item-title>Prima</v-list-item-title>
                          <v-list-item-subtitle>L. {{PrecioArticulo[0].minimo_prima}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="4"><v-list-item three-line-line-line>
                      <v-list-item-content>
                        <v-list-item-title>Financiaminto</v-list-item-title>
                        <v-list-item-subtitle>Anual: {{PrecioArticulo[0].financiamiento_anual}} %</v-list-item-subtitle>
                        <v-list-item-subtitle>Mensual: {{(PrecioArticulo[0].financiamiento_anual/12).toFixed(2)}} %</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item></v-col>
                    <v-col cols="4"><v-list-item two-line-line>
                      <v-list-item-content>
                        <v-list-item-title>Fecha Registro</v-list-item-title>
                        <v-list-item-subtitle>{{PrecioArticulo[0].created_at.split('-')[2].split('T')[0]}}/{{PrecioArticulo[0].created_at.split('-')[1]}}/{{PrecioArticulo[0].created_at.split('-')[0]}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item></v-col>
                    <v-col cols="4"><v-list-item two-line-line>
                      <v-list-item-content>
                        <v-list-item-title>Usuario de Registro</v-list-item-title>
                        <v-list-item-subtitle>{{PrecioArticulo[0].user.usuario}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item></v-col>
                  </v-row>
                </div>
                <div v-else>
                  <v-card-text>No hay registros de precios en este artículo.</v-card-text>
                </div>
                <hr>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-card class="pl-2 pb-2 pr-2" elevation="5">
                <v-card-title>Resultados del Precio</v-card-title>
                <hr>
                <v-row>
                  <v-col cols="8"><small>Precio de Costo:</small></v-col>
                  <v-col cols="4"><small><strong>L. {{Precio.precio_s_i}}</strong></small></v-col>
                </v-row>
                <v-row>
                  <v-col cols="8"><small>Margen de Ganancia:</small></v-col>
                  <v-col cols="4"><small><strong>L. {{Precio2.margenGanancia}}</strong></small></v-col>
                </v-row>
                <v-row>
                  <v-col cols="8"><small>Total del Impuesto:</small></v-col>
                  <v-col cols="4"><small><strong>L. {{Precio2.impuesto}}</strong></small></v-col>
                </v-row>
                <hr>
                <v-row>
                  <v-col cols="8"><small>Precio de Contado:</small></v-col>
                  <v-col cols="4"><small><strong>L. {{(parseFloat(Precio2.impuesto)+parseFloat(Precio2.margenGanancia)+parseFloat(Precio.precio_s_i)).toFixed(2)}}</strong></small></v-col>
                </v-row>
                <v-row>
                  <v-col cols="8"><small>Prima mínima:</small></v-col>
                  <v-col cols="4"><small><strong>L. {{Precio.prima}}</strong></small></v-col>
                </v-row>
                <hr>
                <v-row>
                  <v-col cols="8"><small>Precio a Financiar:</small></v-col>
                  <v-col cols="4"><small><strong>L. {{Precio2.precioConPrima}}</strong></small></v-col>
                </v-row>
                <v-row>
                  <v-col cols="8"><small>Cuota Mensual:</small></v-col>
                  <v-col cols="4"><small><strong>L. {{Precio2.cuota}}</strong></small></v-col>
                </v-row>
                <v-row>
                  <v-col cols="8"><small>Total de Intereses:</small></v-col>
                  <v-col cols="4"><small><strong>L. {{Precio2.totalInteres}}</strong></small></v-col>
                </v-row>
                <small>Reusltados de la prueba de financiación:</small>
                <v-simple-table v-if="Precio2.prueba.length > 0" class="rowsTable" fixed-header height="400px">
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th>#</th>
                      <th>Cuota</th>
                      <th>Saldo Antes</th>
                      <th>Capital</th>
                      <th>Intereses</th>
                      <th>Saldo Despues</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in Precio2.prueba">
                      <td>{{item.pago}}</td>
                      <td>L. {{item.cuota}}</td>
                      <td>L. {{item.antes}}</td>
                      <td>L. {{item.capital}}</td>
                      <td>L. {{item.intereses}}</td>
                      <td>L. {{item.despues}}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

    </div>
</template>

<script>
  import Swal from 'sweetalert2'
  export default {
    mounted() {
      this.getPeps();
      this.getImpuestos();
      this.cargarPrecioArticulo()
    },
    data(){
      return{
        PrecioArticulo: [],
        cargarPRecio: false,
        rules:{
          impuesto:{
            req: v => !!v || 'Campo Requerido',
            menor: v => v > 0 || 'Tiene que ser mayor a 0',
            m: v =>  v >= 0 || 'Dato Invalido'
          }
        },
        Peps:[],
        peps: false,
        Precio:{
          peps: '',
          selectPeps: false,
          imp: '',
          impuesto:'',
          impuesto_id: '',
          precio_s_i: this.data.precio_costo,
          margenUtilidad: '',
          precioContado: 0,
          margenUtilidaReal: '',
          financiamientoAnual:'',
          financiamientoMensual: '',
          margenPrima:'',
          prima:'',
          meses: '',
        },
        Precio2:{
          margenGanancia: 0,
          impuesto: '',
          precioConPrima: 0,
          cuota: 0,
          prueba: [],
          totalInteres:0,
          totalCapital: 0
        },
        Impuestos: []
      }
    },
    methods:{
      registrarPrecio(){
        if (this.$refs.FormVerificarMargenUtilidadAnual.validate() && this.$refs.FormVerificarImpuestoAsignacionPrecio.validate()){
          this.$store.commit('activarOverlay', true);
          this.$axios.put('precio_articulos/'+this.data.articulo,{
            precio_costo_antiguo: this.data.precio_costo,
            precio_costo_actual:  this.Precio.precio_s_i,
            precio_contado:       this.Precio.precioContado,
            prima:                this.Precio.prima,
            margen_ganancia:      this.Precio.margenUtilidad,
            financiamiento_anual: this.Precio.financiamientoAnual,
            impuesto:             this.Precio.impuesto_id
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.$store.commit('activarOverlay', false);
              Swal.fire(
                'Registro Exitoso',
                `Se registro exitosamente el nuevo precio del artículo ${this.data.nombre_articulo}.`,
                'success'
              );
              this.$store.commit('cambiarVistaPRecioArticulo', 1);
            }
          })
        }
      },
      calcularInteres(){
        let MESES  = this.Precio.meses;
        if (MESES > 0){
          this.Precio2.prueba = [];
          this.Precio2.totalInteres = 0;
          this.Precio2.totalCapital = 0
          let SALDO_FINANCIAR = this.Precio2.precioConPrima;
          let TASA_MENSUAL = this.Precio.financiamientoMensual / 100;
          let TASA = Math.pow(parseInt(1) + parseFloat(TASA_MENSUAL),-MESES);
          TASA = TASA - 1;
          TASA = TASA / TASA_MENSUAL;
          this.Precio2.cuota = (-SALDO_FINANCIAR/TASA).toFixed(2);

          this.probarFinanciamiento(TASA_MENSUAL, MESES);
        }

      },
      probarFinanciamiento(TASA_MENSUAL, T){
        let PAGOS = [];
        let antes = (parseFloat(this.Precio2.impuesto)+
          parseFloat(this.Precio2.margenGanancia)
          +parseFloat(this.Precio.precio_s_i)).toFixed(2);
        let despues =  (antes - this.Precio.prima).toFixed(2);
        let capital = 0
        PAGOS.push({
          "pago": 0,
          "cuota": this.Precio.prima,
          "antes": antes,
          "capital": capital,
          "intereses": 0,
          "despues": despues
        });
        let intereses = 0;
        for (let i = 0; i < T; i++){
          antes = despues;
          intereses = (antes * TASA_MENSUAL).toFixed(2);
          capital = (this.Precio2.cuota - intereses).toFixed(2);
          despues = (antes - capital).toFixed(2);
          PAGOS.push({
          "pago": parseInt(i) + parseInt(1),
          "cuota": this.Precio2.cuota,
          "antes": antes,
          "capital": capital,
          "intereses": intereses,
          "despues": despues
        });
        this.Precio2.totalCapital = (parseFloat(this.Precio2.totalCapital) + parseFloat(capital)).toFixed(2);
        this.Precio2.totalInteres = (parseFloat(this.Precio2.totalInteres) + parseFloat(intereses)).toFixed(2);
        }
        this.Precio2.prueba = PAGOS;
      },
      calcularPrima(){
        let MARGEN_PRIMA = this.Precio.margenPrima;
        let PRECIO_CONTADO = this.Precio.precioContado;
        if (MARGEN_PRIMA >= 1){
          MARGEN_PRIMA = MARGEN_PRIMA / 100;
          this.Precio.prima = (PRECIO_CONTADO * MARGEN_PRIMA).toFixed(2)
        }else if (MARGEN_PRIMA < 1){
          this.Precio.prima = (PRECIO_CONTADO * MARGEN_PRIMA).toFixed(2)
        }
        this.Precio2.precioConPrima = (parseFloat(PRECIO_CONTADO) - parseFloat(this.Precio.prima)).toFixed(2)
        this.calcularInteres()
      },
      sacarFinanciamientoMensual(){
        let margen = this.Precio.financiamientoAnual
        if (margen < 1)
          margen = margen * 100
        this.Precio.financiamientoMensual = (margen / 12).toFixed(2)
        this.calcularInteres()
      },
      getPeps(){
        this.Peps = [];
        this.peps = false;
        this.$axios.get('peps/ultimo_registro/'+this.data.articulo,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200 && res.data.peps.length > 0){
            this.Peps = res.data.peps;
            this.Precio.peps = this.Peps[0].valor_unitario;
          }
          this.peps = true;
        })
      },
      getImpuestos(){
        this.$axios.get('impuestos',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
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
      leerImpuesto(){
        this.Precio.impuesto_id = this.Precio.imp.split('-')[0];
        this.Precio.impuesto    = this.Precio.imp.split('-')[1];
        if (this.$refs.FormVerificarImpuestoAsignacionPrecio.validate())
          this.calcularPrecioContado()
      },
      cambiarPrecio(){
        if (!this.Precio.selectPeps)
          this.Precio.precio_s_i = this.Precio.peps;
        else
          this.Precio.precio_s_i = this.data.precio_costo;
        this.calcularPrecioContado()
        this.calcularPrima()
      },
      calcularPrecioContado(){
        this.Precio.margenUtilidaReal = this.Precio.margenUtilidad
        if (this.$refs.FormVerificarImpuestoAsignacionPrecio.validate()){
          if (this.Precio.margenUtilidaReal > 1)
            this.Precio.margenUtilidaReal = this.Precio.margenUtilidaReal / 100;
          this.Precio2.margenGanancia = (parseFloat(this.Precio.precio_s_i * this.Precio.margenUtilidaReal)).toFixed(2)
          let PRECIO_S_IMPUESTO = (parseFloat(this.Precio2.margenGanancia) + parseFloat(this.Precio.precio_s_i)).toFixed(2);
          this.Precio2.impuesto = (parseFloat(PRECIO_S_IMPUESTO * this.Precio.impuesto)).toFixed(2)
          let PRECIO_C_IMPUESTO = (parseFloat(this.Precio2.impuesto) + parseFloat(PRECIO_S_IMPUESTO)).toFixed(2);
          this.Precio.precioContado = PRECIO_C_IMPUESTO
        }
      },
      cargarPrecioArticulo(){
        this.$axios.get('precio_articulos/'+this.data.articulo,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.PrecioArticulo = res.data.precio;
          }
          this.cargarPRecio = true;
        })
      }
    },
    props:{data: Object},
    name: "AsignacionPrecio"
  }
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
