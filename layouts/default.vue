<template>
  <v-app>
    <side/>
    <v-app-bar  height="50" app>
      <v-row no-gutters>
        <v-col cols="9">
          <v-tabs height="50" v-model="tab" align-with-title hide-slider>
            <v-tab v-for="item in Pes" :key="item.key" class="blue-grey lighten-5">
              <small>{{ item.titulo }}</small>
              <div class="pl-5">
                <v-btn width="15px" height="15px" @click="$store.commit('quitar_pestania', item.valor)"
                       fab color="indigo" dark v-if="item.key > 0"> <small>x</small>
                </v-btn>
              </div>
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="3" class="d-flex justify-end align-center white">
          <v-progress-circular :width="3" v-if="estadoDescarga" color="green" indeterminate></v-progress-circular>
          <v-tooltip bottom>
            <template v-slot:activator="{on, attrs}">
              <v-btn color="indigo" v-on="on" v-bind="attrs" @click="$store.commit('cambiar_MENU')" dark fab text small>
                <v-icon v-if="$store.state.MENU">mdi-menu-open</v-icon>
                <v-icon v-else>mdi-menu</v-icon>
              </v-btn>
            </template>
            <span v-if="$store.state.MENU">Esconder Menú</span>
            <span v-else>Habilitar Menú</span>
          </v-tooltip>
          <v-badge v-if="$store.state.tipoUsuario < 5" :value="isNotificaciones" bordered bottom overlap offset-x="20" offset-y="20">
            <v-avatar class="cursor" height="35" ><v-icon>mdi-bell</v-icon></v-avatar>
          </v-badge>
          <v-chip color="transparent">
            {{USUARIO}}
            <v-menu rounded offset-y>
              <template v-slot:activator="{attrs, on}">
                <v-badge overlap flet offset-x="10"
                         offset-y="10" dot :value="isNotificaciones">
                  <v-btn small icon tile text color="grey" dark v-bind="attrs" v-on="on">
                    <v-icon>mdi-menu-down</v-icon>
                  </v-btn>
                </v-badge>
              </template>
              <v-list>
                <v-list-item v-if="$store.state.tipoUsuario < 5" link @click="go('/inicio/otras_gestiones/mi_perfil')">
                  <v-list-item-title v-text="'Mi Perfil'" ></v-list-item-title>
                </v-list-item>
                <v-list-item link @click="go('/inicio/otras_gestiones/ordenes_genericas')">
                  <v-list-item-title v-text="'Mis Ordenes'" ></v-list-item-title>
                </v-list-item>
                <v-list-item link>
                  <v-badge offset-x="10" :value="isNotificaciones" left :content="Notificaciones" color="success">
                    <v-list-item-title v-text="'Notificaciones'"></v-list-item-title>
                  </v-badge>
                </v-list-item>
                <v-list-item link>
                  <v-badge offset-x="10" :value="isNotificaciones" left :content="Notificaciones" color="success">
                    <v-list-item-title v-text="'Actualizaciones'" @click="go('/inicio/otras_gestiones/actualizaciones')"></v-list-item-title>
                  </v-badge>
                </v-list-item>
                <v-list-item link disabled>
                  <v-list-item-title v-text="'Versión '+$store.state.VERSION" ></v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-chip>
          <v-tooltip left>
            <template v-slot:activator="{on, attrs}">
              <v-btn color="grey" text fab small icon class="ml-1" @click="cerrarSesion" v-bind="attrs" v-on="on"><v-icon>mdi-account-arrow-right</v-icon></v-btn>
            </template>
            <span>Cerrar sesión</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-main app>
      <v-tabs-items v-model="tab" >
        <v-tab-item v-for="i in Pes" :key="i.key" >
          <nuxt                             v-if="i.key === 0"/>
          <caja                             v-if="i.key === 1"/>
          <cobros                           v-if="i.key === 2"/>
          <to_do_inidex                     v-if="i.key === 3"/>
          <perfiles                         v-if="i.key === 4"/>
          <cuentas                          v-if="i.key === 5"/>
          <inventario                       v-if="i.key === 6"/>
          <editar_inventario                v-if="i.key === 7"/>
          <articulo_nuevo                   v-if="i.key === 8"/>
          <motocicletas                     v-if="i.key === 9"/>
          <ordenes_entradas                 v-if="i.key === 10"/>
          <guia_remision_entradas           v-if="i.key === 11"/>
          <gastos_index                     v-if="i.key === 12"/>
          <ventas_canceladas                v-if="i.key === 13"/>
          <pestana_historial_cierres        v-if="i.key === 14"/>
          <pestana_venta_manual             v-if="i.key === 15"/>
          <pestana_anticipos_clientes       v-if="i.key === 16"/>
          <pestana_aplicar_anticipo_cliente v-if="i.key === 17"/>
          <pestana_validar_deposito         v-if="i.key === 18"/>
          <pestana_lista_inventario         v-if="i.key === 19"/>
          <whatsapp                         v-if="i.key === 20"/>
          <gmail                            v-if="i.key === 21"/>
          <equifax                          v-if="i.key === 22"/>
          <nuevo_proveedor                  v-if="i.key === 23"/>
          <precios                          v-if="i.key === 24"/>
          <soli                             v-if="i.key === 25"/>
          <mis_ventas                       v-if="i.key === 26"/>
          <soli_fac                         v-if="i.key === 27"/>
          <Revision_doc                     v-if="i.key === 28"/>
          <planillas                        v-if="i.key === 29"/>
          <Prospectos                       v-if="i.key === 30"/>
        </v-tab-item>
      </v-tabs-items>

      <v-overlay :value="over">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>


      <v-snackbar v-model="ACTUALIZACION" absolute timeout="1000000">
        Hay una actualización nueva de Tilk
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text @click="descargarNuevaVersion"
                 v-bind="attrs">
            Descargar
          </v-btn>
          <v-btn color="pink" text v-bind="attrs" @click="ACTUALIZACION = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="descargaTerminada" absolute timeout="1000000">
        Descargar de la actualización terminada. Si la instalas el programa se cerrará.
        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text
                 v-bind="attrs" @click="instalarVersion">
            Instalar
          </v-btn>
          <v-btn color="pink" text v-bind="attrs" @click="descargaTerminada = false">
            Despues
          </v-btn>
        </template>
      </v-snackbar>


    </v-main>
  </v-app>
</template>

<script>
import Motocicletas from "@/pages/ventas/motocicletas.vue";
import {ipcRenderer} from 'electron'
import ventas_canceladas from "@/components/Ventas/pes/ventas_canceladas.vue";
import nuevo_proveedor from "@/components/pestanas_externas/nuevo_proveedor.vue";
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
import side from "../components/dashboard/side";
import NuxtLoading from "../.nuxt/components/nuxt-loading";
import Cuerpo from "../components/Pestanas/Cuerpo";
import caja from "../components/caja/index";
import inicio from "@/components/cobros/inicio";
import to_do_inidex from "@/components/to_to/to_do_inidex";
import perfiles from "@/components/Ventas/pes/perfiles";
import cuentas from "@/components/Ventas/pes/cuentas";
import inventario from "@/components/Inventario/inventario";
import editar_inventario from "@/components/Inventario/editar_inventario";
import articulo_nuevo from "@/components/Inventario/articulo_nuevo";
import motocicletas from "@/components/Inventario/motocicletas.vue";
import ordenes_entradas from "@/components/Inventario/ordenes_entradas.vue";
import guia_remision_entradas from "@/components/Inventario/guia_remision_entradas.vue";
import gastos_index from "@/components/contabilidad/gastos_index.vue";
import pestana_historial_cierres from "@/components/caja/pes/pestana_historial_cierres.vue";
import pestana_venta_manual from "@/components/Ventas/pes/pestana_venta_manual.vue";
import pestana_anticipos_clientes from "@/components/contabilidad/pestanas/pestana_anticipos_clientes.vue";
import pestana_aplicar_anticipo_cliente from "@/components/contabilidad/pestanas/pestana_aplicar_anticipo_cliente.vue";
import pestana_validar_deposito from "@/components/contabilidad/pestanas/pestana_validar_deposito.vue";
import pestana_lista_inventario from "@/components/Inventario/pestanas/pestana_lista_inventario.vue";
import whatsapp from "@/components/pestanas_externas/whatsapp.vue";
import gmail from "@/components/pestanas_externas/gmail.vue";
import equifax from "@/components/pestanas_externas/equifax.vue";
import precios from "@/components/pestanas_externas/precios.vue";
import SolicitudesCreditos from "@/components/Pestanas/SolicitudesCreditos.vue";
import MisVentas from "@/components/Pestanas/MisVentas.vue";
import SolicitudesFacturacion from "@/components/Pestanas/SolicitudesFacturacion.vue";
import Revision_doc from "@/components/Pestanas/Revision_doc.vue";
import PlanillasPendientes from "@/components/Pestanas/PlanillasPendientes.vue";
import Prospectos from "@/components/Pestanas/Prospectos.vue";
export default {
  watch: {
    over (val) {
      val && setTimeout(() => {
      }, 500)
    },
  },
  components:{
    Motocicletas, NuxtLoading, side, Cuerpo, caja, cobros: inicio , pestana_historial_cierres,
    motocicletas, to_do_inidex, perfiles, cuentas, inventario, guia_remision_entradas,
    editar_inventario, articulo_nuevo, ordenes_entradas,gastos_index, ventas_canceladas,
    pestana_venta_manual, pestana_anticipos_clientes, pestana_aplicar_anticipo_cliente,
    pestana_validar_deposito, pestana_lista_inventario, whatsapp, gmail, equifax,
    nuevo_proveedor, precios, soli:SolicitudesCreditos, mis_ventas:MisVentas, soli_fac: SolicitudesFacturacion,
    Revision_doc, planillas: PlanillasPendientes, Prospectos
  },
  data(){
    return{
      dia: true,
      isNotificaciones: false,
      Notificaciones: 0,
      descargaTerminada: false,
      estadoDescarga:    false,
      actualizacion:  true,
      refe: null,
      Hora: 0,
      Minuto: 0,
      Segundo: 0,
      dirDescargado: ''
    }
  },
  created() {
    this.$store.commit('direcciones/cargar_COLONIAS');
    this.$store.commit('direcciones/cargar_DISTRITOS');
    this.$store.commit('direcciones/cargar_MUNICIPIOS');
    this.$store.commit('direcciones/cargar_DEPARTAMENTOS');
    this.calcularFecha();

    ipcRenderer.send('app_version');
    ipcRenderer.on('app_version',(event, arg)=>{
      this.$store.commit('guardarVERSION', arg.version);
    })
    ipcRenderer.on('descarga-version-terminada', (event, arg) => {
      this.dirDescargado = arg;
      this.descargaTerminada = true;
      this.estadoDescarga    = false;
    });
  },
  computed:{
    ACTUALIZACION:{
      get: function(){
        return this.$store.state.ACTUALIZACION;
      },
      set: function(item){
        this.$store.commit('agregarACTUALIZACION', item)
      }
    },
    ESTADOMENU:{
      get: function (){
        return this.$store.state.MENU;
      },
      set: function (val){
        this.$store.commit('cambiar_MENU');
      }
    },
    tab:{
      get: function (){
        return this.$store.state.tab;
      },
      set: function (val){
        this.$store.commit('cambiarTab', {val:val, tipo:true})
      }
    },
    titulo(){
      return this.$store.state.titulo
    },
    over(){
      return this.$store.state.over
    },
    Pes(){
      return this.$store.state.pestana
    },
    urlVersion(){
      return this.$store.state.URL_VERSION;
    },
    USUARIO(){
      return this.$store.state.usuario;
    }
  },
  methods:{
    calcularFecha(){
      let fecha =new Date();
      let diaS = fecha.getDay();
      let mes   = fecha.getMonth()
      let dia   = fecha.getDate();
      let fechaS = this.conocerDia(diaS)+', '+dia+' de '+this.concerMes(mes)+' de '+fecha.getFullYear();
      let fechaN = dia+'/'+mes+'/'+fecha.getFullYear();
      this.$store.commit('fecha/agregar_DIA_STRING', fechaS);
      this.$store.commit('fecha/agregar_DIA_PLECA', fechaN);
    },
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
    conocerDia(dia){
      let day = '';
      let dias = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sábado','Domingo']
      for (let i = 0; i < dias.length; i++){
        if ((parseInt(i) + parseInt(1)) === dia)
          day = dias[i]
      }
      return day
    },
    concerMes(mes){
      let meses = ['Enero','Febrero','Marzo','Abril','Mayo', 'Junio',
        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      let month = '';
      for (let i = 0; i < meses.length; i++){
        if (i === mes)
          month = meses[i]
      }
      return month;
    },
    descargarNuevaVersion(){
      if (this.urlVersion) {
        if (this.$store.state.DIR){
          let data = {
            dir: this.$store.state.DIR,
            url: this.urlVersion
          }
          ipcRenderer.send('descargar-nueva-version', data);
          this.estadoDescarga = true;
          this.ACTUALIZACION  = false;
        }else{
          this.$store.commit('notificacion',{color:'warning', texto:'No se puede descargar, porque no tienes un directorio agregado en Tilk.'});
        }
      }else
        this.$store.commit('notificacion',{color:'warning', texto:'Url no soportada'});
    },
    go(url){
      this.$router.push(url)
    },
    instalarVersion(){
      ipcRenderer.send('instalar-version', this.dirDescargado);
    },
  }
}
</script>

<style>
  ::-webkit-scrollbar{
    width: 8px;     /* Tamaño del scroll en vertical */
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #DADADA;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #C6C6C8;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
  }
  ::-webkit-scrollbar-thumb:active{
    background-color: #BBBBBB;
  }
  ::-webkit-scrollbar-track {
    background: #E8E8E8;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-track:hover, ::-webkit-scrollbar-track:active {
    background-color: #BBFDD6;
  }
  .pestanas .icon:hover{
    background-color: #7F828B;
    cursor: pointer;
  }
  #notification {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 200px;
    padding: 20px;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }
  .hidden {
    display: none;
  }
  .cursor:hover{
    cursor: pointer;
  }
</style>
