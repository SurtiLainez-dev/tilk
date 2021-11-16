<template>
    <v-navigation-drawer app dark permanent>
        <v-list>
          <v-list-item >
            <v-list-item-content>
              <v-list-item-title class="title">
                TILK
              </v-list-item-title>
              <v-list-item-subtitle>
                Surtidora Laínez
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-row>
            <v-col class="subMenu rounded-lg px-2" cols="3">
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
                  <v-col v-else-if="item.id === 3 && tipoUser == 2 || tipoUser == 1 || PERMISOS.includes(1)" class="d-flex justify-center">
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
                  <v-col v-else-if="item.id > 3" class="d-flex justify-center px-2">
                    <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="itemsMenu(item.id)" v-on="on" v-bind="attrs" :color="item.color" fab x-small dark>
                          <v-icon>{{item.icono}}</v-icon>
                        </v-btn>
                      </template>
                      <span>{{item.titulo}}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
            </v-col>

            <v-col cols="9" v-if="select === 1">
              <v-container class="px-2" style="color: #FFF">
                <strong>Inicio</strong>
              </v-container>
              <side-seguimientos/>
            </v-col>
            <v-col cols="9" v-if="select === 2">
                <v-list>
                  <admin/>
                  <side-sucursal/>
                </v-list>
            </v-col>
            <v-col cols="9" v-if="select === 3">
            <v-list>
              <side-colaboradores/>
              <side-planilla/>
            </v-list>
          </v-col>
            <v-col cols="9" v-if="select === 4">
            <v-list>
              <side-conta/>
              <articulos-conta/>
              <notas-credito/>
              <mobiliario/>
              <gastos/>
            </v-list>
          </v-col>
            <v-col cols="9" v-if="select === 5">
            <v-list>
              <side-inventario/>
            </v-list>
          </v-col>
            <v-col cols="9" v-if="select === 6">
            <v-list>
              <side-proveedores/>
            </v-list>
          </v-col>
            <v-col cols="9" v-if="select === 7">
            <v-list>
              <side-facturacion/>
            </v-list>
          </v-col>
            <v-col cols="9" v-if="select === 8">
            <v-list>
              <side-cuentas/>
            </v-list>
          </v-col>
            <v-col cols="9" v-if="select === 9">
            <v-list>
              <side-caja/>
            </v-list>
          </v-col>
        </v-row>
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
      gastos
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
            'url': '', 'id': 11, 'modulo': 0, 'accion': false},
          {'color':'light-blue darken-4', 'titulo':'Cerrar Sesión', 'icono':'fa fa-sign-in-alt',
            'url': '', 'id': 10, 'modulo': 0, 'accion': false}
        ]
    }
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
        if (val !== 10)
          this.select = val;
        else
          this.cerrarSesion();
      },
      go(url, id, accion){
        this.itemsMenu(id);
        if (accion)
          this.$router.push(url)
      },
    },
    computed:{
      tipoUser: function () {
        return this.$store.state.tipoUsuario
      },
      PERMISOS(){
        let permisos = this.$store.state.permisosUser.split(',');
        let per = [];
        permisos.forEach((item)=>{
          per.push(parseInt(item))
        })
        return per;
      },
      ESTADOMENU:{
        get: function (){
          return this.$store.state.MENU;
        },
        set: function (val){
          this.$store.commit('cambiar_MENU');
        }
      }
    }
  }
</script>

<style scoped>
    .subMenu{
        margin-top: 10px;
        background-color: #47494e;
    }

</style>
