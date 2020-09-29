<template>
    <div class="pr-2">
      <v-bottom-navigation color="deep-orange lighten-1" horizontal>
        <v-btn @click="Solicitar.dialogo = true">
          <span>Solicitar</span>
          <v-icon>fa fa-exchange-alt</v-icon>
        </v-btn>
        <v-btn>
          <span>Precio</span>
          <v-icon>fa fa-tag</v-icon>
        </v-btn>
        <v-btn>
          <span>Fotos</span>
          <v-icon>fa fa-images</v-icon>
        </v-btn>
        <v-btn>
          <span>Motocicletas</span>
          <v-icon>fa fa-motorcycle</v-icon>
        </v-btn>
      </v-bottom-navigation>
      <v-row>
      <v-col cols="5">
        <v-hover v-slot:default="{ hover }" open-delay="0">
          <v-card :elevation="hover ? 16 : 2" class="pl-2 pr-2">
            <v-card-title>Sucursales Disponibles</v-card-title>
            <hr>
            <v-simple-table height="300px" fixed-header class="rowsTable">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>Sucursal</th>
                  <th class="text-center">Reingreso</th>
                  <th class="text-center">Stock</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Stock">
                  <td>{{item.sucursal.nombre}} ({{item.sucursal.abreviatura}})</td>
                  <td class="text-center">{{item.stock_reingreso}}</td>
                  <td class="text-center">{{item.stock_actual}}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-hover>
      </v-col>
      <v-col cols="7">
        <v-hover v-slot:default="{ hover }" open-delay="0">
          <v-card :elevation="hover ? 16 : 2" class="pl-2 pr-2">
            <v-card-title>Artículo Desintegrado</v-card-title>
            <hr>
            <v-simple-table height="300px" fixed-header class="rowsTable">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>Sucursal</th>
                  <th>Cód. Sístema</th>
                  <th>Serie</th>
                  <th>Estado</th>
                  <th>Precio</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Remision">
                  <td>{{item.sucursal.abreviatura}}</td>
                  <td>{{item.serie_sistema}}</td>
                  <td>{{item.serie_fabricante}}</td>
                  <td>{{item.estado_articulo.nombre}}</td>
                  <td>L. {{item.precio_actual}}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-hover>
      </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-hover v-slot:default="{ hover }" open-delay="0">
            <v-card :elevation="hover ? 16 : 2" class="pl-2 pr-2">
              <v-card-title>Detalles Técnicos</v-card-title>
              <hr>
              <v-simple-table height="345px" class="rowsTable">
                <template v-slot:default>
                  <tbody>
                  <tr v-for="item in Detalles">
                    <td>{{item.detalle}}</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-hover>
        </v-col>
        <v-col cols="5">
          <v-hover v-slot:default="{ hover }" open-delay="0">
            <v-card  :elevation="hover ? 16 : 2" class="pl-2 pr-2">
              <v-card-title>Inventario Compuesto</v-card-title>
              <hr>
              <v-simple-table class="rowsTable" fixed-header height="344px">
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Sucursal</th>
                    <th class="text-center">Nuevo</th>
                    <th class="text-center">Reingreso</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in Compuestos">
                    <td>{{item.nombre}}</td>
                    <td>{{item.sucursal}}</td>
                    <td class="text-center">{{item.stock}}</td>
                    <td class="text-center">{{item.reingreso}}</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-hover>
        </v-col>
        <v-col cols="3">
          <v-hover v-slot:default="{ hover }" open-delay="0">
            <v-card :elevation="hover ? 16 : 2" class="pl-2 pr-2">
              <v-card-title>Detalles del Artículo</v-card-title>
              <hr>
              <v-list>
                <v-list-item-group>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Código del Sístema'"></v-list-item-title>
                      <v-list-item-subtitle v-text="data.codigo_sistema"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Módelo'"></v-list-item-title>
                      <v-list-item-subtitle v-text="data.modelo"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Familía'"></v-list-item-title>
                      <v-list-item-subtitle v-text="data.familia"></v-list-item-subtitle>
                      <v-list-item-subtitle v-text="'Sub-familia: '+data.fam"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Código del Proveedor'"></v-list-item-title>
                      <v-list-item-subtitle v-text="data.codigo_proveedor"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Código de Barras'"></v-list-item-title>
                      <v-list-item-subtitle v-text="data.codigo_barras"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>

      <v-dialog v-model="Solicitar.dialogo" width="30%">
        <v-card class="pl-5 pr-5">
          <v-card-title>Solicitud de {{data.nombre_articulo}} [{{data.codigo_sistema}}]</v-card-title>
          <hr>
          <v-form ref="FormSolicitudTransferencia">
            <v-row>
              <v-col cols="5">
                <v-text-field v-model="Solicitar.cantidad"
                              label="Cantidad a Solicitar"
                              :rules="[rules.envio.req, rules.envio.mayor]"
                              type="number">
                </v-text-field>
              </v-col>
              <v-col cols="7">
                <v-select v-model="Solicitar.estado"
                          :items="Solicitar.itemEstado"
                          :rules="[rules.envio.req]"
                          label="Estado del Artículo"
                          @change="validarStock"
                          type="number">
                </v-select>
              </v-col>
            </v-row>
            <v-select v-model="Solicitar.stock"
                      :rules="[rules.envio.req]"
                      @change="validarStock"
                      :items="Solicitar.Sucursales"
                      label="Sucursal de Origen"
                      type="number">
            </v-select>
            <v-text-field v-model="suc"
                          label="Sucursal Solicitante"
                          disabled>
            </v-text-field>
            <v-text-field v-model="user"
                          label="Usuario Solicitante"
                          disabled>
            </v-text-field>
            <v-select :items="Motivos"
                      :item-text="'motivo'"
                      :rules="[rules.envio.req]"
                      v-model="Solicitar.motivo"
                      label="Motivo de Solicitud"
                      :item-value="'id'"></v-select>
            <v-textarea v-model="Solicitar.observacion"
                        rows="3"
                        :rules="[rules.envio.req, rules.envio.min, rules.envio.max]"
                        label="Observación"
                        :counter="244">
            </v-textarea>
          </v-form>

          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" small dark @click="Solicitar.dialogo = false">Cancelar</v-btn>
            <v-btn color="success" small dark @click="validarSolicitudEnvio">Solicitar Artículo</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
  import Swal from "sweetalert2";
  export default {
    name: "info",
    computed:{
      Sucursal(){
        return this.$store.state.sucursal;
      },
      suc(){
        return this.$store.state.sucursal_id;
      },
      user(){
        return this.$store.state.usuario;
      }
    },
    props:{data: Object},
    data(){
      return{
        rules:{
          envio:{
            req: v => !!v || 'Campo requerido',
            min:v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 carácteres.',
            max:v => (v && v.length <= 255) || 'Tiene que ser menor o igual a 255 carácteres.',
            mayor: v => v > 0 || 'Tiene que ser mayor a 0',
          }
        },
        Solicitar:{
          Sucursales: [],
          dialogo:false,
          cantidad: 1,
          origen: '',
          estado: '',
          stock: '',
          suc: '',
          motivo: '',
          observacion: '',
          itemEstado:[
            {text:'Nuevo', value:1},
            {text:'Reingreso', value:2},
          ]
        },
        PrecioArticulo: [],
        Detalles: [],
        Stock: [],
        Remision: [],
        Compuestos: [],
        Motivos: []
      }
    },
    mounted() {
      this.cargarPrecio();
      this.cargarDetalles();
      this.cargarRemision();
      this.cargarMotivosTraslados()
    },
    methods:{
      cargarMotivosTraslados(){
        this.$axios.get('motivos_traslados',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Motivos = res.data.motivos
        })
      },
      cargarDetalles(){
        this.$axios.get('detalles_sucursales/'+this.data.articulo,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Detalles   = res.data.detalles;
          this.Stock      = res.data.stock;
          res.data.compuestos.forEach( (i) => {
            i.inventario_compuestos.forEach( (a) => {
              this.Compuestos.push({
                "nombre": i.detalle,
                "sucursal": a.sucursal.abreviatura,
                "stock": a.stock_nuevo,
                "reingreso": a.stock_reingreso
              });
            });
          });
          this.Stock.forEach( (i)=>{
            this.Solicitar.Sucursales.push({
              "value": i.sucursal.id+'-'+i.stock_actual+'-'+i.stock_reingreso,
              "text": i.sucursal.nombre
            });
          })
        })
      },
      cargarPrecio(){
        this.$axios.get('precio_articulos/'+this.data.articulo,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.PrecioArticulo = res.data.precio;
          }
        })
      },
      cargarRemision(){
        this.$axios.get('remision_articulos/'+this.data.articulo,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Remision = res.data.articulos
        })
      },
      validarSolicitudEnvio(){
        if (this.Solicitar.origen != this.Sucursal){
          if (this.$refs.FormSolicitudTransferencia.validate())
            this.registrarSolicitud()
        }else{
          Swal.fire(
            'Error',
            `La sucursal que seleccionaste no es valida.`,
            'error'
          );
        }
      },
      validarStock(){
        this.Solicitar.origen = this.Solicitar.stock.split('-')[0];
        let stock_nuevo       = this.Solicitar.stock.split('-')[1];
        let stock_reingreso   = this.Solicitar.stock.split('-')[2];
        stock_nuevo = parseInt(stock_nuevo)
        console.log(this.Solicitar.cantidad)
        if (this.Solicitar.estado == 1){
          if (this.Solicitar.cantidad > stock_nuevo){
            Swal.fire(
              'Cantidad Excesiva',
              `Haz excedido el stock nuevo con el que cuenta la sucursal que seleccionaste. La sucursal
               cuenta con ${stock_nuevo} y tu estas solicitando ${this.Solicitar.cantidad}.`,
              'error'
            );
            this.Solicitar.cantidad = 0
          }
        }else if (this.Solicitar.estado == 2){
          if (this.Solicitar.cantidad > stock_reingreso){
            Swal.fire(
              'Cantidad Excesiva',
              `Haz excedido el stock de reingreso con el que cuenta la sucursal que seleccionaste.`,
              'error'
            );
            this.Solicitar.cantidad = 0
          }
        }
      },
      registrarSolicitud(){
        this.Solicitar.dialogo = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('peticion_traslado',{
          origen:      this.Solicitar.origen,
          motivo:      this.Solicitar.motivo,
          destino:     this.Sucursal,
          observacion: this.Solicitar.observacion,
          estado:      this.Solicitar.estado,
          cantidad:    this.Solicitar.cantidad,
          articulo:    this.data.articulo
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.Solicitar.observacion = '';
          this.Solicitar.cantidad    = 1;
          this.Solicitar.motivo      = '';
          this.Solicitar.estado      = '';
          this.Solicitar.stock       = '';
          Swal.fire(
            'Solicitud Exitosa',
            `Se ha realizado exitosamente la solicitus de transferencia.`,
            'success'
          );
        })
      }
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
