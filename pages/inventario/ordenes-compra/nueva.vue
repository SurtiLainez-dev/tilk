<template>
    <v-container class="pl-2 pr-2">
      <v-card>
        <v-card-title>Creando una Orden de Compra</v-card-title>
        <v-form ref="FormNuevaOrdenCompra">
          <div class="pl-3 pr-3 bordes">
            <v-row >
              <v-col cols="4">
                <v-select v-model="Orden.proveedor" :items="Proveedores" :item-value="'id'"
                          :rules="[rule.req]" :loading="loadProveedor" :loader-height="2"
                          :item-text="'nombre'" @change="cargarInventario" label="Proveedor"></v-select>
              </v-col>
              <v-col cols="4">
                <v-select v-model="Orden.sucursal" :items="Sucursales" :item-text="'nombre'"
                          :item-value="'id'" label="Sucursal de Entrada" :rules="[rule.req]"></v-select>
              </v-col>
              <v-col class="d-flex align-center justify-center">
                <h1>L. <strong>{{int.format(totales.totalF)}}</strong></h1>
              </v-col>
            </v-row>
          </div>
          <div class="bordes">
            <v-simple-table fixed-header :height="400" dense >
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-center" >
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="addFila" width="20px" height="20px"  v-on="on" v-bind="attrs" color="success" fab x-small dark>
                          <v-icon size="15">fa fa-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Añadir Fila</span>
                    </v-tooltip>
                  </th>
                  <th class="text-center" colspan="2">Artículo</th>
                  <th >Cant.</th>
                  <th >Precio Costo</th>
                  <th >Impuesto</th>
                  <th >Precio c/i</th>
                  <th >Total</th>
                  <th >Eliminar</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in Orden.Articulos">
                  <td class="text-center" width="5%"> {{index + 1}}</td>
                  <td width="3%">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn width="25px" height="25px"  v-on="on" @click="abrirModal(index)"
                               v-bind="attrs" color="success" fab x-small dark>
                          <v-icon size="15px">fa fa-search</v-icon>
                        </v-btn>
                      </template>
                      <span>Buscar Artículos</span>
                    </v-tooltip>
                  </td>
                  <td width="47%">
                    <v-text-field dense v-model="item.articulo" :rules="[rule.req]"></v-text-field>
                  </td>
                  <td width="5%"><v-text-field dense style="width: 40px"  @keyup.enter="addFila"
                                               @keyup="multiplicarTotalFila(index)" :rules="[rule.mayor]"
                                               type="number" min="1" v-model="item.cantidad" @change="multiplicarTotalFila(index)"></v-text-field></td>
                  <td width="10%"><v-text-field @keyup="multiplicarTotalFila(index)" :rules="[rule.mayor]"
                                                dense v-model="item.precio" ></v-text-field></td>
                  <td width="5%"><v-text-field @keyup="multiplicarTotalFila(index)" dense v-model="item.impuesto" ></v-text-field></td>
                  <td width="10%"><v-text-field disabled dense v-model="item.precio_s" ></v-text-field></td>
                  <td width="10%"><v-text-field disabled dense v-model="item.total" ></v-text-field></td>
                  <td width="5%" class="d-flex align-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="removeFila(index)" width="25px" height="25px"  v-on="on" v-bind="attrs" color="red" fab x-small dark>
                          <v-icon size="15px">fa fa-times</v-icon>
                        </v-btn>
                      </template>
                      <span>Eliminar Fila</span>
                    </v-tooltip>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
          <div class="bordes">
            <v-row>
              <v-col cols="3" class="d-flex justify-center"><small>Total de Artículo: <strong>{{totales.cantidad}}</strong></small></v-col>
              <v-col cols="3" class="d-flex justify-center"><small>Total: <strong>L. {{int.format(totales.total)}}</strong></small></v-col>
              <v-col cols="3" class="d-flex justify-center"><small>Total de Impuestos: <strong>L. {{int.format(totales.impuesto)}}</strong></small></v-col>
              <v-col cols="3" class="d-flex justify-center"><small>Total Final: <strong>L. {{int.format(totales.totalF)}}</strong></small></v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-col class="d-flex justify-end ma-2">
                <v-btn dark color="orange" @click="registrarOrden" small>Crear Orden</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </v-card>

      <v-dialog v-model="modalInventario">
        <v-card class="pl-5 pr-5">
          <v-card-title>Artículos Disponibles</v-card-title>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="4">
              <v-text-field v-model="search" append-icon="mdi-magnify"
                            label="Buscar artículo" single-line hide-details></v-text-field>
            </v-col>
          </v-row>
          <v-data-table :headers="header" :items-per-page="10"
                        :items="Inventario" class="rowsTable" :search="search">
            <template v-slot:item.precio_costo="{item}">
              L. {{int.format(item.precio_costo)}}
            </template>
            <template v-slot:item.id="{item}">
              <v-btn color="success" @click="registrarFila(item)" small dark>Seleccionar</v-btn>
            </template>
          </v-data-table>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn small dark color="orange" @click="modalInventario = false">Registrar / Cerrar</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  export default {
    name: "nueva",
    watch: {
      overlay (val) {
        val && setTimeout(() => {
        }, 500)
      },
    },
    data(){
      return{
        int: new Intl.NumberFormat(),
        overlay: false,
        search: '',
        rule:{
          req: v => !!v || 'Campo requerido',
          mayor: v => (v && v.length > 0 || v > 0) || 'Mayor a 0'
        },
        header:[
          {text:'Proveedor', value:'proveedor'},
          {text:'Familía', value:'familia'},
          {text:'Sub-família', value:'fam'},
          {text:'Código', value:'codigo_sistema'},
          {text:'Artículo', value:'nombre_articulo'},
          {text:'Módelo', value:'modelo'},
          {text:'Precio Costo', value:'precio_costo'},
          {text:'Seleccionar', value:'id'},
        ],
        Proveedores: [],
        isLoad: false,
        Orden:{
          proveedor: '',
          sucursal: '',
          Articulos: [
            {fila:0, articulo:'', required:false, requiredC: false, cantidad:1, impuesto:15, precio:0, total:0, precio_s:0,art: null}
          ]
        },
        error: false,
        errorRequired:'Este campo no puede quedar vacio',
        Sucursales: [],
        Inventario: [],
        isPeticion: false,
        modalInventario: false,
        modalId: null,
        totales:{
          cantidad: 0,
          total: 0,
          impuesto: 0,
          totalF: 0
        },
        msgPrompt: null,
        isPrompt: false,
        redirectOrden: null,
        loadProveedor: false
      }
    },
    created() {
      this.isLoad = true
      this.$store.commit('guardarTitulo', 'Ordenes de Compra > Nueva');
      this.cargarProveedor()
      this.cargarSucursales()
    },
    methods:{
      abrirModal(fila){
        this.modalId = fila
        this.modalInventario = true
      },
      addFila(){
        let fila = this.Orden.Articulos.length
        this.Orden.Articulos.push({
          "fila": fila ,
          "articulo": '',
          "required": false,
          "requiredC": false,
          "cantidad": 1,
          "impuesto": 15,
          "precio": 0,
          "total": 0,
          "art": null
        })
      },
      cargarInventario(){
        this.isPeticion = true
        this.Orden.Articulos = [
          {fila:0, articulo:'', required:false, requiredC: false, cantidad:1, impuesto:15, precio:0, total:0, precio_s:0,art: null}
        ]
        this.$axios.get('busqueda_x_proveedor/'+this.Orden.proveedor,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            if (this)
              this.Inventario = res.data.inventario
            this.isPeticion = false
          }
        })
      },
      cargarProveedor(){
        this.loadProveedor = true;
        this.$axios.get('proveedores',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Proveedores   = res.data.proveedores
          this.loadProveedor = false;
        })
      },
      cargarSucursales(){
        this.$axios.get('/sucursales',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Sucursales = res.data.suc
            this.isLoad = false
          }
        })
      },
      multiplicarTotalFila(fila){
        let impuesto = this.Orden.Articulos[fila].impuesto / 100
        impuesto = impuesto + 1
        let precio = this.Orden.Articulos[fila].precio * impuesto
        this.Orden.Articulos[fila].precio_s = precio.toFixed(2)
        let total = (this.Orden.Articulos[fila].cantidad * precio).toFixed(2)
        this.Orden.Articulos[fila].total = total
        this.totalOrder()
      },
      nuevo(){
        this.Orden.proveedor = null;
        this.Orden.sucursal  = null;
        this.Orden.Articulos= [
          {fila:0, articulo:'', required:false, requiredC: false, cantidad:1, impuesto:15, precio:0, total:0, precio_s:0,art:null}
        ]
        this.isPrompt = false
      },
      redireccionar(){
        this.isPrompt = false
        this.$router.replace({path:'/inventario/ordenes-compra/ordenes/'+this.redirectOrden})
      },
      registrarFila(tr){
        this.Orden.Articulos[this.modalId].articulo = tr.modelo+' - '+tr.nombre_articulo +' - '+tr.codigo_proveedor
        this.Orden.Articulos[this.modalId].precio = tr.precio_costo
        this.Orden.Articulos[this.modalId].art = tr.articulo
        this.multiplicarTotalFila(this.modalId)
        this.modalInventario = false
      },
      registrarOrden(){
        if (this.$refs.FormNuevaOrdenCompra.validate()){
          this.overlay = true
          this.error = false
          this.isLoad = true
          this.$axios.post('orden_compra',{
            proveedor: this.Orden.proveedor,
            sucursal:  this.Orden.sucursal,
            articulos: this.Orden.Articulos,
            total:     this.totales.totalF
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              Swal.fire(
                'Registro Exitoso',
                `Se registro exitosamente la orden de compra.`,
                'success'
              )
              this.overlay = false
              this.$router.replace({path: '/inventario/ordenes-compra/'})
            }
          })
        }
        // let long = this.Orden.Articulos.length;
        // let bandera = 0, banderaC = 0;
        // for (let i in this.Orden.Articulos){
        //   if (this.Orden.Articulos[i].articulo.length < 5){
        //     this.Orden.Articulos[i].required = true
        //   }else{
        //     bandera ++;
        //     this.Orden.Articulos[i].required = false
        //   }
        //   if (this.Orden.Articulos[i].cantidad < 1 || !this.Orden.Articulos[i].cantidad){
        //     this.Orden.Articulos[i].requiredC = true
        //   }else{
        //     banderaC ++;
        //     this.Orden.Articulos[i].requiredC = false
        //   }
        // }
        // if (bandera === long && banderaC === long){
        //   // if (this.$refs.FormNuevaOrdenCompra.required()){
        //     this.overlay = true
        //     this.error = false
        //     this.isLoad = true
        //     this.$axios.post('orden_compra',{
        //       proveedor: this.Orden.proveedor,
        //       sucursal:  this.Orden.sucursal,
        //       articulos: this.Orden.Articulos,
        //       total:     this.totales.totalF
        //     },{
        //       headers: {
        //         'Authorization': 'Bearer ' + this.$store.state.token
        //       }
        //     }).then((res)=>{
        //       if (res.status === 200){
        //         Swal.fire(
        //           'Registro Exitoso',
        //           `Se registro exitosamente la orden de compra.`,
        //           'success'
        //         )
        //         this.overlay = false
        //       }
        //     })
        //   // }
        // }
      },
      removeFila(fila){
        if (this.Orden.Articulos.length < 2){
          alert("No puedes eliminar esta fila.")
        }else{
          this.Orden.Articulos.splice(fila, 1)
          for (let item in this.Orden.Articulos){
            this.Orden.Articulos[item].fila = item
          }
          this.totalOrder()
        }
      },
      totalOrder(){
        let precios = 0, cantidad = 0
        let impuestos = 0
        let fila = this.Orden.Articulos
        for( let item in fila) {
          cantidad = (parseInt(cantidad) + parseInt(fila[item].cantidad))
          precios = parseFloat(precios) + (parseFloat(fila[item].precio) * fila[item].cantidad)
          impuestos = ((fila[item].impuesto/100).toFixed(2) * precios).toFixed(2)
        }
        this.totales.cantidad = cantidad
        this.totales.total = precios.toFixed(2)
        this.totales.impuesto = impuestos
        this.totales.totalF = (parseFloat(impuestos) + parseFloat(precios)).toFixed(2)
      }
    }
  }
</script>

<style scoped>
.bordes{
  border: solid #000 1px;
}
.rowsTable{
  cursor: pointer;
}
</style>
