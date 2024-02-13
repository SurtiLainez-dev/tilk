<template>
    <v-navigation-drawer color="grey darken-3" v-if="$store.state.MENU" app dark permanent>
        <v-list>
          <v-list-item >
            <v-list-item-content>
              <v-list-item-title class="title">
                TILK
              </v-list-item-title>
              <v-list-item-subtitle>
                <span v-if="tipoUser < 5">Surtidora Laínez</span> <span v-else>Surti Créditos - {{$store.state.sucursal_id}}</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-row v-if="tipoUser < 5">
            <v-col class="subMenu rounded-lg px-2 grey darken-2" cols="3">
                <v-row v-for="item in opciones">
                  <v-col v-if="item.id === 1" class="d-flex justify-center" @click="go(item.url, item.id, item.accion)">
                      <v-tooltip right>
                          <template v-slot:activator="{ on, attrs }">
                              <v-btn @click="itemsMenu(item.id)" v-on="on" v-bind="attrs" :color="item.color" fab x-small dark>
                                  <v-icon>{{item.icono}}</v-icon>
                              </v-btn>
                          </template>
                          <span>{{item.titulo}}</span>
                      </v-tooltip>
                  </v-col>
                  <v-col v-else-if="item.id === 2 && tipoUser == 1" class="d-flex justify-center">
                    <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="go(item.url, item.id, item.accion)" v-on="on" v-bind="attrs" :color="item.color" fab x-small dark>
                          <v-icon>{{item.icono}}</v-icon>
                        </v-btn>
                      </template>
                      <span>{{item.titulo}}</span>
                    </v-tooltip>
                  </v-col>
                  <v-col v-else-if="item.id === 3 && (tipoUser == 2 || tipoUser == 1)" class="d-flex justify-center">
                    <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="go(item.url, item.id, item.accion)" v-on="on" v-bind="attrs"
                               :color="item.color" fab x-small dark>
                          <v-icon>{{item.icono}}</v-icon>
                        </v-btn>
                      </template>
                      <span>{{item.titulo}}</span>
                    </v-tooltip>
                  </v-col>
                  <v-col
                      v-else-if="(item.id > 3 && item.id < 11 && PERMISOS.length > 0) && (
                          (item.id === 6 && PERMISOS.includes(2)) || (item.id === 5 && PERMISOS.includes(3)) ||
                          (item.id === 4 && PERMISOS.includes(4) || (item.id === 7 && (PERMISOS.includes(6) || PERMISOS.includes(8))) ||
                          (item.id === 8 && (PERMISOS.includes(7) || PERMISOS.includes(14)))
                          || (item.id === 9 && (PERMISOS.includes(15))) || (item.id === 10 && (PERMISOS.includes(16))))
                          )"
                      class="d-flex justify-center px-2">
                    <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn v-if="item.id !== 9" @click="itemsMenu(item.id)" v-on="on" v-bind="attrs" :color="item.color" fab x-small dark>
                          <v-icon>{{item.icono}}</v-icon>
                        </v-btn>
                        <v-btn v-else @click="go(item.url, item.id, item.accion)" v-on="on" v-bind="attrs" :color="item.color" fab x-small dark>
                          <v-icon>{{item.icono}}</v-icon>
                        </v-btn>
                      </template>
                      <span>{{item.titulo}}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
            </v-col>

<!--          INICIO-->
            <v-col cols="9" v-if="select === 1">
              <v-container class="px-2" style="color: #FFF">
                <strong>Inicio</strong>
              </v-container>
              <side-seguimientos :permisos="PERMISOS"/>
            </v-col>
<!--          aDMINISTRADOR-->
            <v-col cols="9" v-if="select === 2">
                <v-list>
                  <admin :permisos="PERMISOS"/>
                  <side-sucursal/>
                </v-list>
            </v-col>
<!--          COLABORADORES-->
            <v-col cols="9" v-if="select === 3">
            <v-list>
              <side-colaboradores/>
              <side-planilla v-if="PERMISOS.includes(1) || PERMISOS.includes(133) || PERMISOS.includes(134)"/>
              <mobiliario/>
            </v-list>
          </v-col>
<!--          CONTABILIDAD-->
            <v-col cols="9" v-if="select === 4 && PERMISOS.includes(4)">
            <v-list>
              <side-conta v-if="PERMISOS.includes(41) || PERMISOS.includes(42) || PERMISOS.includes(43) ||
                PERMISOS.includes(48) ||PERMISOS.includes(44) || PERMISOS.includes(46) ||
                PERMISOS.includes(47) || PERMISOS.includes(49) || PERMISOS.includes(410) ||
                PERMISOS.includes(411) || PERMISOS.includes(412)"/>
              <articulos-conta v-if="PERMISOS.includes(413) || PERMISOS.includes(414) || PERMISOS.includes(415)"/>
              <notas-credito v-if="PERMISOS.includes(416) || PERMISOS.includes(417) || PERMISOS.includes(419)"/>
              <gastos v-if="PERMISOS.includes(418)"/>
            </v-list>
          </v-col>
<!--          INVENTARIO-->
            <v-col cols="9" v-if="select === 5 && PERMISOS.includes(3)">
            <v-list>
              <side-inventario/>
            </v-list>
          </v-col>
<!--          PROVEEDORES-->
            <v-col cols="9" v-if="select === 6 && PERMISOS.includes(2)">
            <v-list>
              <side-proveedores/>
            </v-list>
          </v-col>
<!--          FACTURACI[ON-->
            <v-col cols="9" v-if="select === 7 && (PERMISOS.includes(6) || PERMISOS.includes(8))">
            <v-list>
              <side-facturacion/>
            </v-list>
          </v-col>
<!--          CUENTAS-->
            <v-col cols="9" v-if="select === 8 && (PERMISOS.includes(7) || PERMISOS.includes(14))">
              <v-list>
                <side-cuentas/>
              </v-list>
          </v-col>
<!--          CAJA-->
            <v-col cols="9" v-if="select === 9 && (PERMISOS.includes(15))">
            <v-list>
              <side-caja/>
            </v-list>
          </v-col>
<!--          REPORTES-->
            <v-col cols="9" v-if="select === 10 && (PERMISOS.includes(16))">
            <v-list>
              <side-reportes/>
            </v-list>
          </v-col>
        </v-row>

      <div v-else-if="tipoUser == 5">
        <v-list-item class="itemOpciones" @click="goFinanciera('/inicio/')">
          Inicio
        </v-list-item>
        <v-list-group color="green">
          <template v-slot:activator value="true">
            <v-tooltip top>
              <span>Opciones de la financiera</span>
              <template v-slot:activator="{on, attrs}"><v-list-item-title v-on="on" v-bind="attrs">Opciones</v-list-item-title></template>
            </v-tooltip>
          </template>
          <v-list-item class="itemOpciones" @click="goFinanciera('/financiera/solicitud_nueva')">
            Crear Solicitúd
          </v-list-item>
          <v-list-item class="itemOpciones" @click="goFinanciera('/financiera/solicitudes')">
            Ver Solicitudes
          </v-list-item>
          <v-list-item class="itemOpciones" @click="goFinanciera('/financiera/ventas')">
            Ver Ventas
          </v-list-item>
          <v-list-item class="itemOpciones" @click="goFinanciera('/financiera/cuadro_ventas')">
            Cuadro de Ventas
          </v-list-item>
          <v-list-item class="itemOpciones" @click="goFinanciera('/financiera/clientes')">
            Mis Clientes
          </v-list-item>
        </v-list-group>
      </div>
    </v-navigation-drawer>
</template>

<script>
  import sideSeguimientos from "./inicio/sideSeguimientos";
  import admin from "./admin/admin";
  import sideSucursal from "./admin/sideSucursal";
  import sideColaboradores from "./colaboradores/sideColaboradores";
  import sidePlanilla from "./colaboradores/sidePlanilla";
  import sideConta from "./contabilidad/sideConta";
  import sideProveedores from "./proveedores/sideProveedores";
  import sideInventario from "./inventario/sideInventario";
  import articulosConta from "./contabilidad/articulosConta";
  import sideFacturacion from "./facturacion/sideFacturacion";
  import notasCredito from "./contabilidad/notasCredito";
  import sideCuentas from "./cuentas/sideCuentas";
  import sideCaja from "./sideCaja";
  import mobiliario from "./contabilidad/mobiliario";
  import gastos from "@/components/dashboard/contabilidad/gastos";
  import sideReportes from "@/components/dashboard/sideReportes";

  export default {
    components:{
      admin,
      sideSucursal,
      sideColaboradores,
      sidePlanilla,
      sideConta,
      sideProveedores,
      sideInventario,
      articulosConta,
      sideFacturacion,
      notasCredito,
      sideSeguimientos,
      sideCuentas,
      sideCaja,
      mobiliario,
      gastos,
      sideReportes
    },
    name: "side",
    data(){
      return{
        Permisos: this.$store.state.permisosUser,
        select: 1,
        items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard' },
          { title: 'Photos', icon: 'mdi-image' },
          { title: 'About', icon: 'mdi-help-box' },
        ],
        right: null,
        opciones:[
          {'color': 'teal darken-3',   'titulo':'Inicio',        'icono':'fa fa-tachometer-alt',
            'url':'/inicio/', 'id':1, 'modulo': 0, 'accion': true},
          {'color': 'primary',         'titulo':'Administrador', 'icono':'fa fa-users-cog',
            'url':'/admin/user/', 'id':2, 'modulo': 0, 'accion': false},
          {'color': 'red darken-2',    'titulo':'Colaboradores', 'icono':'fa fa-users',
            'url':'/inicio/','id':3, 'modulo': 0, 'accion': false},
          {'color': 'teal darken-2',   'titulo':'Contabilidad',  'icono':'fa fa-calculator',
            'url':'/inicio/', 'id':4, 'modulo': 0, 'accion': false},
          {'color': 'orange darken-4', 'titulo':'Inventario',    'icono':'fa fa-boxes',
            'url':'/inicio/', 'id':5, 'modulo': 0, 'accion': false},
          {'color': 'pink darken-3',   'titulo':'Proveedores',   'icono':'fa fa-user-friends',
            'url':'/inicio/', 'id':6, 'modulo': 0, 'accion': false},
          {'color': 'brown darken-3',  'titulo':'Facturación',   'icono':'fa fa-share-alt',
            'url':'/inicio/', 'id':7, 'modulo': 0, 'accion': false},
          {'color': 'purple',  'titulo':'Cuentas',  'icono':'fa fa-file-invoice',
            'url':'/inicio/', 'id':8, 'modulo': 0, 'accion': false},
          {'color':'pink darken-4', 'titulo':'Caja', 'icono':'fa fa-cash-register',
            'url': '/caja/', 'id': 9, 'modulo': 0, 'accion': true},
          {'color':'green darken-4', 'titulo':'Reportes', 'icono':'fa fa-file-contract',
            'url': '', 'id': 10, 'modulo': 0, 'accion': false},
        ]
    }
    },
    created() {
      console.log(this.PERMISOS.length)
    },
    methods:{
      cerrarSesion(){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('logout').then((res)=>{
          this.$store.commit("guardarToken", null);
          this.$store.commit("solicitud_credito/guardarToken", null);
          this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
          setTimeout(()=>{
            this.$store.commit('activarOverlay', false);
          },2000);

          window.Echo.channel('channel').disconnect('NewMessage', ()=>{})

          this.$router.replace({path:'/'});
        }).catch((error)=>{
          this.$store.commit("guardarToken", null);
          this.$store.commit("solicitud_credito/guardarToken", null);
          this.$store.commit('notificacion', {texto:'Se ha cerrado sesión exitosamente', color:'success'});
          this.$store.commit('activarOverlay', false);
          this.$router.replace({path:'/'});
        })
      },
      itemsMenu(val){
        if (val !== 11)
          this.select = val;
        else
          this.cerrarSesion();
      },
      go(url, id, accion){
        this.itemsMenu(id);
        if (accion)
          this.$router.push(url)
      },
      goFinanciera(url){
        this.$router.push(url)
      }
    },
    computed:{
      tipoUser: function () {
        return this.$store.state.tipoUsuario
      },
      PERMISOS(){
        let permisos = this.$store.state.permisosUser.split(',');
        let per = [];
        if (permisos.length > 1){
          permisos.forEach((item)=>{
            per.push(parseInt(item))
          })
          return per;
        }else
          return [];
      },
      ESTADOMENU:{
        get: function (){
          return this.$store.state.MENU;
        },
        set: function (val){
          this.$store.commit('cambiar_MENU');
        }
      },
    }
  }
</script>

<style scoped>
    .subMenu{
        margin-top: 10px;
        background-color: #47494e;
    }
    .itemOpciones{
      font-size: 10px !important;
      margin-left: 6px;
      cursor: pointer;
    }
    .itemOpciones:hover{
      background-color: #47494e;
      margin-left: 8px;
      font-size: 14px !important;
    }
</style>
