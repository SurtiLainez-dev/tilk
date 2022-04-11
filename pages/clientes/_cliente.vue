<template>
<v-card flat>
  <v-card flat :loading="LOAD_CLIENTE">
    <v-row no-gutters>
      <v-col cols="3" class="ma-2">
        <v-card height="670" width="256" class="mx-auto">
          <v-navigation-drawer permanent>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  <v-btn color="warning" x-small tile dark fab
                         @click="$router.replace({path:'/clientes/'})"><v-icon >fa fa-arrow-left</v-icon></v-btn>
                  {{tituloMenu}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav>
              <v-list-item v-for="item in items" :key="item.title" link @click="cambiarDatosMenu(item)">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-row align="center" no-gutters>
              <v-col class="text-center">
                <div class="my-2">
                  <v-btn  color="indigo" @click="dialogoNotas = true"
                          small depressed dark>Agregar una Nota</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-navigation-drawer>
        </v-card>
      </v-col>

      <v-col class="ma-2" v-if="!LOAD_CLIENTE">
        <v-card >
          <v-toolbar flat class="grey lighten-3">
            <v-card-title>{{tituloMenu}}</v-card-title>
            <v-spacer></v-spacer>
            <h6>Perfil de <span v-if="CLIENTE">{{CLIENTE.nombres}} {{CLIENTE.apellidos}}</span></h6>
          </v-toolbar>

          <div class="pa-1">
            <v-container style="max-height: 620px; min-height: 200px" class="overflow-y-auto pa-1">
              <datos_personales v-if="vistaMenu === 1"/>
              <detalles_cliente :permiso="PERMISOS"  v-if="vistaMenu === 2"/>
              <telefonos_cliente v-if="vistaMenu === 3"/>
              <direcciones_cliente v-if="vistaMenu === 4"/>
              <documentos_cliente v-if="vistaMenu === 5"/>
              <cuentas_clientes v-if="vistaMenu === 6"/>
              <notas_cliente v-if="vistaMenu === 9"/>
              <solicitudes_cliente v-if="vistaMenu === 11"/>
            </v-container>
          </div>
        </v-card>

      </v-col>
    </v-row>
  </v-card>

  <v-dialog width="30%" v-model="dialogoNotas">
    <v-card>
      <v-container>
        <v-card-actions>Notas para el cliente</v-card-actions>
        <v-divider></v-divider>
        <v-form ref="FormNotasCliente">
          <v-text-field label="Título de la Nota"
                        :rules="[rules.titulo.req, rules.titulo.min, rules.titulo.max]"
                        counter v-model="Notas.titulo"></v-text-field>
          <v-textarea label="Detalle de la nota" filled v-model="Notas.detalle" counter
                      :rules="[rules.titulo.req, rules.detalle.min, rules.detalle.max]"
                      placeholder="Desribir porque se hace la nota"></v-textarea>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="warning" small dark tile @click="dialogoNotas = false">Cerrar</v-btn>
          <v-btn color="success" small dark tile @click="validarEnvioNota">Registrar Nota</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import datos_personales from "../../components/cliente/datos_personales";
import detalles_cliente from "../../components/cliente/detalles_cliente";
import telefonos_cliente from "../../components/cliente/telefonos_cliente";
import direcciones_cliente from "../../components/cliente/direcciones_cliente";
import documentos_cliente from "../../components/cliente/documentos_cliente";
import cuentas_clientes from "../../components/cliente/cuentas_clientes";
import solicitudes_cliente from "../../components/cliente/solicitudes_cliente";
import notas_cliente from "../../components/cliente/notas_cliente";
import Vue from "vue";
export default {
  components:{
    datos_personales,
    detalles_cliente,
    telefonos_cliente,
    direcciones_cliente,
    documentos_cliente,
    cuentas_clientes,
    solicitudes_cliente,
    notas_cliente
  },
  name: "cliente_perfil",
  data(){
    return{
      tituloMenu: 'Datos Personales',
      vistaMenu: 1,
      items: [
        { title: 'Datos Personales', icon: 'fa fa-user', val:1},
        { title: 'Detalles del Cliente', icon: 'fa fa-table', val:2},
        { title: 'Telefonos', icon: 'fa fa-address-book', val:3 },
        { title: 'Direcciones', icon: 'fa fa-map-marker-alt', val:4 },
        { title: 'Documentos', icon: 'fa fa-file-pdf', val:5 },
        { title: 'Cuentas Asociadas', icon: 'fa fa-th-list', val:6 },
        { title: 'Notas de Crédito', icon: 'fa fa-file', val:7 },
        { title: 'Agregar Doc. x Cobrar', icon: 'fa fa-money-check-alt', val:8 },
        { title: 'Notas', icon: 'fa fa-sticky-note', val:9 },
        { title: 'Pagos Realizados', icon: 'fa fa-file-invoice-dollar', val:10 },
        { title: 'Solicitudes de Crédito', icon: 'fa fa-file', val:11 }
      ],
      right: null,
      dialogoNotas: false,
      Notas:{
        titulo: '',
        detalle: ''
      },
      rules: {
        titulo: {
          req: v => !!v || 'Campo requerido',
          min: v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
          max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 20 carácteres.',
        },
        detalle:{
          min: v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 carácteres.',
          max: v => (v && v.length <= 200) || 'Tiene que ser menor o igual a 200 carácteres.',
        }
      }
    }
  },
  computed:{
    CLIENTE(){
      return this.$store.state.cliente.CLIENTE;
    },
    LOAD_CLIENTE(){
      return this.$store.state.cliente.LOAD_CLIENTE;
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
  },
  methods:{
    cambiarDatosMenu(data){
      this.tituloMenu = data.title;
      this.vistaMenu  = data.val;
    },
    guardarNota(){
      this.dialogoNotas = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('notas_cliente',{
        detalle: this.Notas.detalle,
        titulo:  this.Notas.titulo,
        id:      this.CLIENTE.id
      }).then((res)=>{
        this.Notas.titulo = '';
        this.Notas.detalle = '';
        this.$store.commit('activarOverlay', false);
        this.notificacion('Se agregó la nota exitosamente.','success');
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.notificacion('Hubo un error','error');
      })
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    validarEnvioNota(){
      if (this.$refs.FormNotasCliente.validate())
        this.guardarNota();
    }
  },
  async fetch (){
    this.$store.commit('cliente/cargar_CLIENTE', this.$route.params.cliente)
  }
}
</script>

<style >
.rowsTable{
  cursor: pointer;
}
</style>
