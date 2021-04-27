<template>
  <v-container class="pl-2 pr-2">
    <v-card flat>
      <v-toolbar flat color="grey lighten-5">
        <h6>Catálogo Contable</h6>
        <v-spacer></v-spacer>
        <v-text-field label="Buscar Cuenta" v-model="search"></v-text-field>
      </v-toolbar>
      <v-progress-linear color="success" indeterminate v-if="LOAD"></v-progress-linear>

      <b-table small bordered hover :filter="search" :fields="field" :items="CUENTAS">
        <template v-slot:cell(total)="scope">L {{int.format(scope.item.total)}}</template>
        <template v-slot:cell(registros)="scope">
          <b-link @click="abrirDialogo(scope.item)">Ver Datos</b-link>
        </template>
        <template v-slot:cell(id)="scope">
          <div class="d-flex justify-center">
            <v-btn tile fab x-small color="success" :disabled="scope.item.cod < 3000"
                   class="text--white"><v-icon x-small>fa fa-plus</v-icon></v-btn>
          </div>
        </template>
      </b-table>
    </v-card>

    <v-dialog v-model="registros.dialogo" width="100%">
      <v-card class="pb-5 pl-5 pr-5">
        <v-toolbar  flat color="grey lighten-4">
          <h6>Datos de la Cuenta <strong>{{registros.datos.nombre}}</strong></h6>
          <v-spacer></v-spacer>
          <v-btn tile color="red" fab x-small dark  @click="registros.dialogo = false"><v-icon>fa fa-times</v-icon></v-btn>
        </v-toolbar>
        <v-row no-gutters>
          <v-col cols="11">
            <v-card flat v-if="vista === 0">
              <v-card class="ma-5">
                <v-toolbar flat>
                  <h6>Registros de la Cuenta <strong>{{registros.datos.nombre}}</strong></h6>
                  <v-spacer></v-spacer>
                  <v-text-field dense label="Buscar en registros"
                                class="ma-2" v-model="registros.search"></v-text-field>
                </v-toolbar>
                <v-data-table :items-per-page="5" dense :headers="header" :items="registros.data"
                              :search="registros.search">
                  <template v-slot:item.tipo="{item}">
                    <v-chip v-if="item.tipo === 0" x-small color="indigo" dark>Crédito</v-chip>
                    <v-chip v-else-if="item.tipo === 1" x-small color="success" dark>Débito</v-chip>
                  </template>
                  <template v-slot:item.total="{item}">
                    L {{int.format(item.total)}}
                  </template>
                </v-data-table>
              </v-card>

              <v-alert dense color="orange" class="ma-5" v-if="!registros.estado && registros.cuentas.length > 0"
                       dismissible dark>
                El total de la cuenta con el total de las sub-cuentas no es igual. Tienes
                que readecuar el total de la cuenta.
              </v-alert>

              <v-row no-gutters>
                <v-col cols="3">
                  <v-card class="ma-5">
                    <v-toolbar flat>
                      <h6>Datos</h6>
                    </v-toolbar>
                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                        <tr>
                          <th>Nombre:</th>
                          <td>{{registros.datos.nombre}}</td>
                        </tr>
                        <tr>
                          <th>Código:</th>
                          <td>{{registros.datos.cod}}</td>
                        </tr>
                        <tr>
                          <th>Código Dependiente:</th>
                          <td>{{registros.datos.cod_dep}}</td>
                        </tr>
                        <tr>
                          <th>Cuenta Dependiente:</th>
                          <td><b-link @click="abrirDialogo(registros.dep)">{{registros.dep.nombre}}</b-link></td>
                        </tr>
                        <tr>
                          <th>Total de la Cuenta:</th>
                          <td>L {{int.format(registros.datos.total)}}</td>
                        </tr>
                        <tr>
                          <th>Total de Registros:</th>
                          <td>{{registros.total}}</td>
                        </tr>
                        <tr>
                          <th>Total de Sub-cuentas:</th>
                          <td>L {{int.format(registros.totalSubs)}}</td>
                        </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card>
                </v-col>
                <v-col cols="9">
                  <v-card class="ma-5">
                    <v-toolbar flat >
                      <h6>Sub Cuentas de la Cuenta <strong>{{registros.datos.nombre}}</strong></h6>
                    </v-toolbar>
                    <v-data-table :items-per-page="7" dense :items="registros.cuentas"
                                  :headers="registros.header">
                      <template v-slot:item.id="{item}">
                        <b-link @click="abrirDialogo(item)">Ver</b-link>
                      </template>
                      <template v-slot:item.total="{item}">
                        L {{int.format(item.total)}}
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>

            <v-card flat v-if="vista === 1">
              <v-toolbar flat>
                <h6>Registros de la Cuenta <strong>{{registros.datos.nombre}}</strong></h6>
                <v-spacer></v-spacer>
                <v-text-field dense label="Buscar en registros"
                              class="ma-2" v-model="registros.search"></v-text-field>
              </v-toolbar>
              <v-data-table :items-per-page="15" dense :headers="header" :items="registros.data"
                            :search="registros.search">
                <template v-slot:item.tipo="{item}">
                  <v-chip v-if="item.tipo === 0" x-small color="indigo" dark>Crédito</v-chip>
                  <v-chip v-else-if="item.tipo === 1" x-small color="success" dark>Débito</v-chip>
                </template>
                <template v-slot:item.total="{item}">
                  L {{int.format(item.total)}}
                </template>
              </v-data-table>
            </v-card>

            <v-card flat v-if="vista === 2">
              <v-toolbar flat >
                <h6>Sub Cuentas de la Cuenta <strong>{{registros.datos.nombre}}</strong></h6>
              </v-toolbar>
              <v-data-table :items-per-page="15" dense :items="registros.cuentas"
                            :headers="registros.header">
                <template v-slot:item.id="{item}">
                  <b-link @click="abrirDialogo(item)">Ver</b-link>
                </template>
                <template v-slot:item.total="{item}">
                  L {{int.format(item.total)}}
                </template>
              </v-data-table>
            </v-card>

            <v-card flat v-if="vista === 5" class="d-flex justify-center ma-5">
              <v-card width="40%" class="ma-5">
                <v-card-title>Cuenta Nueva</v-card-title>
                <v-form ref="FormNuevaSubCuenta">
                  <v-text-field dense disabled v-model="registros.datos.nombre"
                                label="Cuenta Padre" class="ma-2"></v-text-field>
                  <v-text-field dense disabled v-model="registros.datos.cod"
                                label="Código de Cuenta Padre" class="ma-2"></v-text-field>
                  <v-text-field dense
                                label="Nombre de la Nueva Cuenta" class="ma-2"></v-text-field>
                  <v-text-field dense
                                label="Comentario de la Cuenta Nueva" class="ma-2"></v-text-field>
                  <v-divider></v-divider>
                  <v-card-actions class="d-flex justify-end">
                    <v-btn color="success" tile small dark >Registrar Cuenta</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-card>

          </v-col>


          <v-col cols="1">
            <v-row v-for="item in btns"><v-col class="d-flex justify-center">
              <v-tooltip left>
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark class="ma-1" :color="item.color" v-on="on"
                         v-bind="attrs" fab @click="vista =item.val">
                    <v-icon>{{item.icon}}</v-icon>
                  </v-btn>
                </template>
                <span>{{item.text}}</span>
              </v-tooltip>
            </v-col></v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    name: "index",
    computed:{
      LOAD(){
        return this.$store.state.contabilidad.catalogo.LOADCUENTAS;
      },
      CUENTAS(){
        return this.$store.state.contabilidad.catalogo.CUENTAS;
      }
    },
    data(){
      return{
        int: new Intl.NumberFormat(),
        Cuentas: [],
        field:[
          {key:'cod', label:'Código'},
          {key:'cod_dep', label:'Cuenta Dependiente'},
          {key:'nombre', label:'Nombre de la Cuenta'},
          {key:'total', label:'Total'},
          {key:'registros', label:'Datos'},
        ],
        search:'',
        registros:{
          datos: '',
          data: [],
          dialogo: false,
          search: '',
          cuentas: [],
          header:[
            {text:'Codigo', value:'cod'},
            {text:'Codigo Dependiente', value:'cod_dep'},
            {text:'Nombre', value:'nombre'},
            {text:'Total', value:'total'},
            {text:'Datos', value:'id'},
          ],
          total: 0,
          dep: {},
          select: null,
          totalSubs: 0,
          estado: false
        },
        header:[
          {text:'Tipo', value:'tipo'},
          {text:'Fecha', value:'fecha'},
          {text:'Total', value:'total'},
          {text:'Detalle', value:'detalle'},
          {text:'Partida', value:'partida'},
        ],
        vista: 0,
        itemHistorial: 5,
        itemSubs:      5,
        btns:[
          {color:'pink darken-1',        text: 'Ver Historial',    icon: 'fa fa-history',      val: 1},
          {color:'indigo darken-1',      text: 'Ver Sub-cuentas',  icon: 'fa fa-sitemap',      val: 2},
          {color:'teal darken-1',        text: 'Ver Información',  icon: 'fa fa-info',         val: 3},
          {color:'deep-orange darken-1', text: 'Crear un Débito',  icon: 'fa fa-sign-out-alt', val: 4},
          {color:'blue-grey darken-1',   text: 'Crear Sub-cuenta', icon: 'fa fa-plus',         val: 5},
        ]
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Contabilidad > Catálogo Contable');
      this.$store.commit('contabilidad/catalogo/cargar_CUENTAS');
      // this.distribuirCuentas()
    },
    methods:{
      abrirDialogo(item){
        this.vista               = 0;
        this.registros.totalSubs = 0;
        this.registros.datos     = item;
        if (item.registros) {
          this.registros.data    = JSON.parse(item.registros);
          this.registros.total   = this.registros.data.length;
        }else {
          this.registros.data    = [];
          this.registros.total   = 0;
        }

        if (item.cod_dep === 0) {
          this.registros.dep = item;
        }else {
          let cuentaDep = []
          cuentaDep = this.CUENTAS.filter(i => i.cod === item.cod_dep);
          this.registros.dep = cuentaDep[0];
        }
        console.log(this.registros.dep)
        this.registros.cuentas = this.CUENTAS.filter(i=> i.cod_dep === item.cod);
        this.registros.cuentas.forEach((i)=>{
          if (i.cod > 0){
            if (i.total)
              this.registros.totalSubs = parseFloat(this.registros.totalSubs) + parseFloat(i.total);
            else
              this.registros.totalSubs = parseFloat(this.registros.totalSubs) + parseInt(0);
          }
        });

        this.registros.estado = this.registros.totalSubs === this.registros.datos.total;

        this.registros.dialogo = true;
      },
      go(url){
        this.$router.replace({path: url})
      }
    }
  }
</script>

<style scoped>

</style>
