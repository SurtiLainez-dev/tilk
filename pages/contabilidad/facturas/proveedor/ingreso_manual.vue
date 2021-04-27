<template>
  <v-card flat>
    <v-toolbar flat color="grey lighten-3">
      <h5>Ingreso Manual de una Factura a Cuenta Contable</h5>
    </v-toolbar>

    <v-card flat>
      <v-form class="ma-5" ref="FormContabilidadIngresoFacturaManual">
        <v-row>
          <v-col>
            <v-autocomplete :items="TipoFactura.Tipos" v-model="Factura.tipoP" :item-text="'nombre'"
                            :loading="TipoFactura.load" dense class="ma-2" @change="leerTipo"
                            label="Tipo de Factura" :item-value="'id'" :rules="[rules.req]">
            </v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete label="Proveedor" :items="Proveedores" :loading="loadproveedores"
                            :rules="[rules.req]" v-model="Factura.proveedor_id" class="ma-2" dense
                            :item-text="'nombre'" :item-value="'id'"></v-autocomplete>
          </v-col>
          <v-col>
            <v-dialog ref="dialogFechaRegistroFactura" v-model="dialogoFechaFacturada" persistent width="290px"
                      :return-value.sync="Factura.fecha_facturada">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="Factura.fecha_facturada" label="Fecha de facturación del proveedor"
                              readonly :rules="[rules.req]" dense class="ma-2" v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="Factura.fecha_facturada" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dialogoFechaFacturada = false">Cancelar</v-btn>
                <v-btn text color="primary" @click="$refs.dialogFechaRegistroFactura.save(Factura.fecha_facturada)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col>
            <v-dialog ref="dialogFechaRegistroFacturaInicio" v-model="dialogoFechaInicio" persistent width="290px"
                      :return-value.sync="Factura.fecha_inicio_pago">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="Factura.fecha_inicio_pago" label="Fecha del Pago Inicial"
                              readonly :rules="[rules.req]" dense class="ma-2" v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="Factura.fecha_inicio_pago" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dialogoFechaInicio = false">Cancelar</v-btn>
                <v-btn text color="primary" @click="$refs.dialogFechaRegistroFacturaInicio.save(Factura.fecha_inicio_pago)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col>
            <v-dialog ref="dialogFechaRegistroFacturaLimite" v-model="dialogoFechaLimite" persistent width="290px"
                      :return-value.sync="Factura.fecha_limite_pago">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="Factura.fecha_limite_pago" label="Fecha Límite de Pago"
                              readonly :rules="[rules.req]" dense class="ma-2" v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="Factura.fecha_limite_pago" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dialogoFechaLimite = false">Cancelar</v-btn>
                <v-btn text color="primary" @click="$refs.dialogFechaRegistroFacturaLimite.save(Factura.fecha_limite_pago)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field dense class="ma-2" label="Número de la Factura"
                          v-model="Factura.num"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field dense class="ma-2" label="Total de la Factura" @keyup="calcularSaldoPendiente"
                          prefix="L" v-model="Factura.total">
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field dense class="ma-2" prefix="L" @keyup="calcularSaldoPendiente"
                          label="Total Abonado" v-model="Factura.total_abonado">
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field dense class="ma-2" prefix="L" label="Saldo Pendiente" v-model="Factura.saldo_pendiente">
            </v-text-field>
          </v-col>
          <v-col>
            <v-text-field dense class="ma-2" label="Cantidad de Pagos" v-model="Factura.cantPagos" suffix="pagos">
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="8">
            <v-text-field class="ma-2" label="Observación" dense counter :rules="[rules.req, rules.max]"
                          placeholder="Esta Observación va ir de Comentario en la cuenta contable"
                          v-model="Factura.observacion" ></v-text-field>
          </v-col>
          <v-col class="d-flex justify-end">
            <v-file-input dense label="Documento Escaneado" accept="pdf"
                          v-model="Factura.file" counter></v-file-input>
          </v-col>
        </v-row>
      </v-form>
      <v-toolbar dense flat color="grey lighten-5">
        <h6>Cuerpo de la Factura</h6>
        <v-spacer></v-spacer>
        <v-btn color="orange" dark small class="ma-2" tile @click="Factura.cuerpo = []">Limpiar</v-btn>
        <v-btn color="indigo" dark small class="ma-2" tile @click="dialogoInventario = true">Agregar Artículo</v-btn>
      </v-toolbar>
      <v-simple-table dense height="200" class="blue-grey lighten-5">
        <template v-slot:default>
          <thead>
          <tr>
            <th>#</th>
            <th>Artículo</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Sub-total</th>
            <th>Impuesto</th>
            <th>Total</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(item,i) in Factura.cuerpo">
              <th width="5%">{{i+1}}</th>
              <td width="45%">{{item.articulo}}</td>
              <td width="10%">
                <v-text-field dense v-model="item.cantidad" type="number" @keyup="sumaTotal(item)"
                @change="sumaTotal(item)"></v-text-field>
              </td>
              <td width="10%">
                <v-text-field v-model="item.precio_unitario" @keyup="sumaTotal(item)" dense></v-text-field>
              </td>
              <td width="10%">
                <v-text-field v-model="item.sub_total" disabled dense></v-text-field>
              </td>
              <td width="10%">
                <v-select :items="Impuestos" @change="leerImpuesto(item)"
                          v-model="item.impuesto" :rules="[rules.req]"></v-select>
              </td>
              <td width="10%">
                <v-text-field v-model="item.total" disabled dense></v-text-field>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>


      <v-toolbar dense flat color="grey lighten-5">
        <h6>Pagos de la Factura</h6>
        <v-spacer></v-spacer>
        <v-btn small tile class="ma-2" dark color="indigo" @click="crearPagos">Crear Pagos</v-btn>
      </v-toolbar>
      <v-simple-table class="blue-grey lighten-5" dense height="400">
        <template v-slot:default>
          <thead>
          <tr>
            <th>#</th>
            <th>Descripción</th>
            <th>Total a Pagar</th>
            <th>Mora</th>
            <th>Total a Abonado</th>
            <th>Saldo Pendiente</th>
            <th>Fecha de Pago</th>
            <th>Estado</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in Factura.pagos">
            <th width="5%">{{item.num_pago}}</th>
            <td width="30%">
              <v-text-field dense v-model="item.descripcion"></v-text-field>
            </td>
            <td width="10%">
              <v-text-field dense disabled v-model="item.total_a_pagar"></v-text-field>
            </td>
            <td width="10%">
              <v-text-field dense v-model="item.mora"></v-text-field>
            </td>
            <td width="10%">
              <v-text-field dense @keyup="sumarTotalPago(item)" v-model="item.total_pagado"></v-text-field>
            </td>
            <td width="10%">
              <v-text-field dense v-model="item.saldo_pendiente"></v-text-field>
            </td>
            <td width="15%">
              <v-menu v-model="item.dialogo" :nudge-left="40" offset-y min-width="auto"
                      :close-on-content-click="false" transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="item.fecha_pago"
                                :rules="[rules.req]" dense
                                readonly v-bind="attrs" v-on="on">
                  </v-text-field>
                </template>
                <v-date-picker
                    v-model="item.fecha_pago"
                    @input="item.dialogo = false"></v-date-picker>
              </v-menu>
            </td>
            <td width="10%">
              <v-select dense :items="selectEstado" v-model="item.estado"></v-select>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" tile class="text--white" small :disabled="!btnEnvio" @click="validarForm">Registrar Factura</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialogoInventario">
      <v-card>
        <v-toolbar color="grey lighten-5">
          <h6>Inventario</h6>
          <v-spacer></v-spacer>
          <v-text-field dense label="Buscar" v-model="search"></v-text-field>
        </v-toolbar>
        <v-data-table :loading="isPeticon" @click:row="addArticulo"
                      loading-text="Cargando artículos... por favor espere un momento"
                      :headers="header" :items="Inventario" :search="search"
                      class="rowsTable">

        </v-data-table>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "ingreso_manual",
  data(){
    return{
      search: '',
      header:[
        {text:'Proveedor',value:'proveedor'},
        {text:'Marcá',value:'marca'},
        {text:'Módelo',value:'modelo'},
        {text:'Código Sístema',value:'codigo_sistema'},
        {text:'Nombre del Artículo',value:'nombre_articulo'},
        {text:'Código Proveedor',value:'codigo_proveedor'},
        {text:'Sub-familia',value:'fam'},
      ],
      dialogoInventario:     false,
      isPeticon:             false,
      Inventario:            [],
      Impuestos:             [],
      btnEnvio:              false,
      selectEstado:          [
        {text: 'Al Día', value:1},
        {text: 'Cancelada', value:2},
        {text: 'Retrasado', value:3},
      ],
      Proveedores:           [],
      loadproveedores:       false,
      dialogoFechaFacturada: false,
      dialogoFechaLimite:    false,
      dialogoFechaInicio:    false,
      Factura:{
        num:               '',
        fecha_facturada:   '',
        total:             0,
        fecha_limite_pago: '',
        fecha_inicio_pago: '',
        observacion:       '',
        total_abonado:     0,
        proveedor_id:      0,
        saldo_pendiente:   0,
        cantPagos:         0,
        pagos:             [],
        cuerpo:            [],
        file:              null,
        tipo:              '',
        tipoP:             ''
      },
      rules:{
        req: v => !!v || 'Campo requerido',
        max: v => v.length <= 75 || 'Tiene que ser menor a 60 letras'
      },
      TipoFactura:{
        load:  false,
        Tipos: []
      }
    }
  },
  created() {
    this.cargarProveedores();
    this.consultarInventario();
    this.cargarImpuestos();
    this.cargarTipoFacturas();
  },
  methods:{
    addArticulo(data){
      console.log(data)
      this.Factura.cuerpo.push({
        articulo_id:     data.articulo,
        articulo:        data.descripcion_corta,
        cantidad:        1,
        precio_unitario: 0,
        sub_total:       0,
        impuesto_id:     '',
        impuesto:        '',
        impue:           0,
        total:           0,
        observacion:     'Ingreso Manual'
      });
      this.dialogoInventario = false;
    },
    calcularSaldoPendiente(){
      if (this.Factura.total)
        this.Factura.saldo_pendiente = (this.Factura.total - this.Factura.total_abonado).toFixed(2);
    },
    cargarImpuestos(){
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
    cargarProveedores(){
      this.loadproveedores = true;
      this.$axios.get('proveedores',{
        headers:{
          'Authorization': 'Bearer '+ this.$store.state.token
        }
      }).then((res)=>{
        this.Proveedores     = res.data.proveedores;
        this.loadproveedores = false;
      })
    },
    cargarTipoFacturas(){
      this.TipoFactura.load = true
      this.$axios.get('tipo_facturas',{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      }).then((res)=>{
        if (res.status === 200){
          res.data.tipos.forEach( (i) =>{
            this.TipoFactura.Tipos.push({
              "nombre": i.nombre,
              "id"    : i.id+'-'+i.cantidad_pagos
            })
          })
          this.TipoFactura.load = false
        }
      })
    },
    consultarInventario(){
      this.isPeticon = true
      this.$axios.get('/2.0/inventario_contabilidad').then((res)=>{
        if (res.status === 200){
          this.Inventario = res.data.inventario
          this.isPeticon = false
        }
      })
    },
    crearPagos(){
      if (this.Factura.cantPagos > 0 && this.Factura.fecha_inicio_pago &&
          this.Factura.num && this.Factura.total && this.Factura.observacion){
        this.Factura.pagos = [];
        let fecha = new Date(this.Factura.fecha_inicio_pago+ ' 00:00:00');
        console.log(fecha)
        let pago = (this.Factura.total / this.Factura.cantPagos).toFixed(2);
        for (let i = 0; i < this.Factura.cantPagos; i++){
          this.Factura.pagos.push({
            descripcion:   'Pago #'+(i+1)+' de la factura '+this.Factura.num+' - '+this.Factura.observacion,
            numPago:         (i+1),
            total_a_pagar:   pago,
            total_pagado:    0,
            saldo_pendiente: pago,
            fecha_pago:      fecha.getFullYear()+'-'+(fecha.getMonth() + 1)+'-'+fecha.getDate(),
            estado:          0,
            mora:            0,
            dialogo:         false
          })

          fecha.setMonth(fecha.getMonth() + 1);
        }
        this.btnEnvio = true;
      }else{
        this.$store.commit('notificacion',{texto:'LLena los campos restantes', color:'warning'});
      }
    },
    leerImpuesto(item){
      item.impuesto_id = item.impuesto.split('-')[0];
      item.impue       = item.impuesto.split('-')[1];
      this.sumaTotal(item)
    },
    leerTipo(){
      this.Factura.tipo      = this.Factura.tipoP.split('-')[0];
      this.Factura.cantPagos = this.Factura.tipoP.split('-')[1];
    },
    sumaTotal(item){
      item.sub_total = (item.cantidad * item.precio_unitario).toFixed(2)
      if (item.impue > 0 ){
        item.total     = (item.sub_total * (parseFloat(item.impue) + parseInt(1))).toFixed(2)
      }
    },
    sumarTotalPago(item){
      item.total_a_pagar   = (parseFloat(item.mora) + parseFloat(item.total_a_pagar)).toFixed(2);
      item.saldo_pendiente = (item.total_pagado - item.total_a_pagar).toFixed(2);
    },
    registrar() {
      if (this.Factura.tipo !== 1) {
        let cuerpoFactura = JSON.stringify(this.Factura.cuerpo);
        let pagosGenerados = JSON.stringify(this.Factura.pagos);
        this.$store.commit('activarOverlay', true);
        let data = new FormData();
        data.append("proveedor_id", this.Factura.proveedor_id);
        data.append("tipo_factura_id", this.Factura.tipo);
        data.append("num_factura", this.Factura.num);
        data.append("fecha_facturada", this.Factura.fecha_facturada);
        data.append("total", this.Factura.total);
        data.append("fecha_limite_pago", this.Factura.fecha_limite_pago);
        data.append("fecha_inicio_pago", this.Factura.fecha_inicio_pago);
        data.append("file_subir", this.Factura.file);
        data.append("observacion", this.Factura.observacion);
        data.append("cuerpo", cuerpoFactura);
        data.append("pagos", pagosGenerados);
        data.append("total_abonado", this.Factura.total_abonado);
        data.append("saldo_pendiente", this.Factura.saldo_pendiente);

        this.$axios({
          method: 'post',
          url: '/facturas_proveedor/manual',
          data:data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.$store.commit('notificacion',{texto: res.data.msj,color:'success'});
          this.$router.replace({path:'/contabilidad/facturas/proveedor/'});
          setTimeout(()=>{
            this.$store.commit('activarOverlay', false);
          },3000);
        }).catch((error)=>{
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor',color:'error'});
          this.$store.commit('activarOverlay', false);
        })
      }else{
        this.$store.commit('notificacion',{texto:'No puedes registrar esta factura al contado', color:'warning'})
      }
    },
    validarForm(){
      if (this.$refs.FormContabilidadIngresoFacturaManual.validate())
        this.registrar();
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
