<template>
  <v-card :disabled="!visible">
    <v-row no-gutters>
      <v-col>
        <v-text-field class="ma-4" dense disabled label="Identidad del Cliente" :value="CUENTA.cliente.identidad"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-4" dense disabled label="Nombres del Cliente" :value="CUENTA.cliente.nombres"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-4" dense disabled label="Apellidos del Cliente" :value="CUENTA.cliente.apellidos"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-4" dense disabled label="Código de la Venta" :value="CUENTA.cod"></v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-text-field class="ma-4" dense disabled label="Saldo Inicial"
                      suffix="lps" :value="CUENTA.total"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-4" dense disabled label="Saldo Actual"
                      suffix="lps" :value="CUENTA.saldo_actual"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-4" dense disabled label="Saldo Abonado"
                      suffix="lps" :value="CUENTA.total_abonado"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-4" dense disabled label="# de Cuotas"
                      suffix="cuotas" :value="CUENTA.num_cuotas"></v-text-field>
      </v-col>
      <v-col>
        <v-autocomplete :loading="LOADSUCURSALES" :items="SUCURSALES" :item-value="'id'" :item-text="'nombre'"
                        label="Sucursal de ingreso" class="ma-4" dense v-model="sucursal_id"></v-autocomplete>
      </v-col>
    </v-row>
    <v-card-text>Pagos de la Cuenta</v-card-text>
    <v-data-table :headers="header" dense :items="cuenta.pagos" :items-per-page="5">
      <template v-slot:item.pago_inicial="{item}">L. {{int.format(item.pago_inicial)}}</template>
      <template v-slot:item.mora="{item}">L. {{int.format(item.mora)}}</template>
      <template v-slot:item.total_pago="{item}">L. {{int.format(item.total_pago)}}</template>
      <template v-slot:item.total_abonado="{item}">L. {{int.format(item.total_abonado)}}</template>
      <template v-slot:item.saldo_actual="{item}">L. {{int.format(item.saldo_actual)}}</template>
      <template v-slot:item.estado="{item}">
        <v-chip x-small color="indigo" dark v-if="item.estado >= 3">Cancelado</v-chip>
        <v-chip x-small color="danger" dark v-if="item.estado === 2">Mora</v-chip>
        <v-chip x-small color="orange" dark v-if="item.estado === 1">Al día</v-chip>
      </template>
    </v-data-table>
    <v-card-text>Datos del Artículo</v-card-text>
    <v-simple-table dense>
      <thead>
      <tr>
        <th>Codigo del Articulo</th>
        <th>Articulos</th>
        <th>Serie del Sistema</th>
        <th>Serie del Fabricante</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in CUENTA.facturas_contados">
        <td>{{item.articulo.codigo_sistema}}</td>
        <td>{{item.articulo.nombre_articulo}}</td>
        <td v-if="item.remision_articulo_id && item.remision_articulo_id > 0">{{item.remision_articulo.serie_sistema}}</td>
        <td v-else>-----</td>
        <td v-if="item.remision_articulo_id && item.remision_articulo_id > 0">{{item.remision_articulo.serie_fabricante}}</td>
        <td v-else>-----</td>
      </tr>
      </tbody>
    </v-simple-table>
    <v-card-text>Sí el artículo es un acuerdo de pago o algún servicio ofrecido por Surtidora Laínez que sea diferente a
    un artículo, presionar la casilla de abajo, ya que sino se selecciona el, se va a cargar al inventario.</v-card-text>
    <v-checkbox v-model="eliminar" dense label="No es un artículo"></v-checkbox>
    <v-card-text>Sí es una anulación de cuennta por garantía. Presiona el siguiente checkbox. Se cargará el artículo
    al inventario de reingreso, mientras que al cliente se le aplicará una nota de crédito por el saldo que a abonado a
    capital.</v-card-text>
    <v-checkbox v-model="garantia" dense label="Anulación por garantía"></v-checkbox>
    <v-card-text>Cuando registres esta anulación, ten en cuenta que la cuenta por cobrar del cliente quedará totalmente
    en 0 lps. Esto implica que está cuenta pasa a un estado de condonado.</v-card-text>
    <v-row no-gutters>
      <v-col cols="10">
        <v-text-field label="Observación de la Anulación de la Cuenta" outlined class="ma-4" hint="Son los de detalles del levantamiento"
                      dense v-model="cuenta.observacion" counter persistent-hint></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-text-field label="Precio Nuevo" outlined class="ma-4" hint="Precio nuevo del artículo"
                      persistent-hint dense suffix="lps" v-model="cuenta.precio"></v-text-field>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="success" dark small tile @click="validar">Anular cuenta</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "devolucion",
  data(){
    return{
      sucursal_id: 0,
      eliminar: false,
      garantia: false,
      visible: true,
      int: new Intl.NumberFormat(),
      header:[
        {text:'Pago Inicial',value:'pago_inicial'},
        {text:'Mora',value:'mora'},
        {text:'Total del Pago',value:'total_pago'},
        {text:'Total Abonado',value:'total_abonado'},
        {text:'Saldo Actual',value:'saldo_actual'},
        {text:'Estado',value:'estado'},
      ],
      selectPago:[
        {text:'Al día', value:1},
        {text:'Mora', value:2},
        {text:'Cancelado', value:3},
        {text:'Condonado', value:4},
      ],
      cuenta:{
        pagos:[],
        precio: 0,
        observacion: ''
      }
    }
  },
  created() {
    this.cuenta.pagos = this.CUENTA.pagos_contratos;
    this.$store.commit('activarOverlay', false);
    this.$store.commit('suc/cargar_SUCURSALES');
  },
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
    LOADSUCURSALES(){
      return this.$store.state.suc.LOAD_SUCURSALES;
    },
    SUCURSALES(){
      return this.$store.state.suc.SUCURSALES;
    }
  },
  methods:{
    registrarAnulacion(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('cuenta/anulacion',{
        venta_id: this.CUENTA.id,
        observacion: this.cuenta.observacion,
        total_articulo: this.cuenta.precio,
        articulo:       !this.eliminar,
        garantia:       this.garantia,
        saldo:          this.CUENTA.saldo_actual,
        cliente:        this.CUENTA.cliente.id,
        sucursal_id:    this.sucursal_id
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.visible = false;
      }).catch((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'success'});
      })
    },
    validar(){
      if (this.cuenta.observacion.length > 10 && this.sucursal_id > 0){
        if (!this.eliminar){
          if (this.cuenta.precio > 0)
            this.registrarAnulacion();
          else
            this.$store.commit('notificacion',{texto:'El precio tiene que ser mayor a 0', color:'warning'});
        }else{
          this.registrarAnulacion();
        }
      }else{
        this.$store.commit('notificacion',{texto:'La observación tiene que ser mayor a 10 carácteres o no haz selecciona la sucursal de destino', color:'warning'});
      }
    }
  }
}
</script>

<style scoped>

</style>
