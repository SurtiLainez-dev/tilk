<template>
    <v-card>
      <v-row class="grey lighten-3" no-gutters>
        <v-col cols="8"><v-card-title>Devoluciones de Artículos</v-card-title></v-col>
        <v-col cols="4" class="d-flex justify-end align-center">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn v-on="on" v-bind="attrs" @click="$store.commit('valorDialogo', true)"
                     class="ma-2" color="orange" dark fab x-small>
                <v-icon>fa fa-sign-out-alt</v-icon>
              </v-btn>
            </template>
            <span>Crear una Nueva Devolución</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row no-gutters class="d-flex justify-end">
        <v-col cols="3">
          <v-text-field class="ma-3" label="Buscar Devolución" dense v-model="search"></v-text-field>
        </v-col>
      </v-row>
      <hr>
      <v-data-table :headers="headers"
                    :items="Devoluciones"
                    :search="search"
                    dense>
        <template v-slot:item.razon="{item}">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <span v-on="on" v-bind="attrs">{{item.razon.substring(0, 20)}} ...</span>
            </template>
            <span>{{item.razon}}</span>
          </v-tooltip>
        </template>

        <template v-slot:item.id="{item}">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn v-on="on" v-bind="attrs" dark height="25px" @click="verDocumento(item.file_generado)"
                     width="25px" fab color="red">
                <v-icon size="18px">fa fa-file-pdf</v-icon>
              </v-btn>
            </template>
            <span>Ver documentos generado</span>
          </v-tooltip>
          <v-tooltip top v-if="item.file_subido">
            <template v-slot:activator="{on, attrs}">
              <v-btn v-on="on" v-bind="attrs" dark height="25px" @click="verDocumento(item.file_subido)"
                     width="25px" fab color="success">
                <v-icon size="18px">fa fa-file-pdf</v-icon>
              </v-btn>
            </template>
            <span>Ver documentos generado</span>
          </v-tooltip>
          <v-tooltip top v-else>
            <template v-slot:activator="{on, attrs}">
              <v-btn v-on="on" v-bind="attrs" dark height="25px" @click="abrirDialogo(item)"
                     width="25px" fab color="indigo">
                <v-icon size="18px">fa fa-upload</v-icon>
              </v-btn>
            </template>
            <span>Subir documento fírmado</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-dialog v-model="dialogo" width="90%">
        <v-card>
          <v-row class="grey lighten-3" no-gutters>
            <v-col cols="11"><v-card-title>Creando Nueva Devolución de Artículos a Proveedores</v-card-title></v-col>
            <v-col cols="1" class="d-flex justify-end align-center">
              <v-btn icon color="gray" @click="$store.commit('valorDialogo', false)" class="ma-2">
                <v-icon>fa fa-times</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <div >
            <devolucion :data="Ordenes"/>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="Devolucion.dialogo" width="25%">
        <v-card>
          <v-card-title class="grey lighten-3">Subir documento generado</v-card-title>
          <v-form ref="FormSubirDocumentoFirmadoDevolucionesProveedor" class="pl-3 pr-3">
            <v-file-input :rules="rules.file"
                          v-model="Devolucion.file"  label="Documento Fírmado"></v-file-input>
          </v-form>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="warning" small dark @click="Devolucion.dialogo = false">Cancelar</v-btn>
            <v-btn color="success" small dark @click="subirDocumento">Registrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      {{Devolucion.file}}
    </v-card>
</template>

<script>
  import {ipcRenderer} from "electron";
  import Swal from "sweetalert2";
  import devoluciones from "../../../../components/Inventario/notas_credito/devoluciones";
  export default {
    components:{devolucion: devoluciones},
    created() {
      this.$store.commit('guardarTitulo', 'Inventario > Devoluciones > Proveedor');
      this.$store.commit('valorDialogo', false);
      this.$store.commit('cargarDevoluciones');
      this.cargarOrdenes();
    },
    name: "devoluciones",
    computed:{
      dialogo:{
        get: function(){
          return this.$store.state.dialogo;
        },
        set: function (val) {
          this.$store.commit('valorDialogo', val)
        }
      },
      sucursal(){
        return this.$store.state.sucursal;
      },
      Devoluciones(){
        return this.$store.state.Devoluciones;
      }
    },
    data(){
      return{
        Devolucion:{
          id: '',
          file:  null,
          dialogo: false
        },
        rules: {
          file: [
            v => !!v || 'Campo requerido',
          ],
        },
        search: '',
        headers:[
          {text:'Código', value:'codigo'},
          {text:'Sucursal', value:'orden_entrada.sucursal.nombre'},
          {text:'Orden de Entrada', value:'orden_entrada.codigo'},
          {text:'Razón', value:'razon'},
          {text:'Usuario Responsables', value:'user.usuario'},
          {text:'Documentos', value:'id'},
        ],
        Ordenes: [],
      }
    },
    methods:{
      cargarOrdenes(){
        this.$axios.get('orden_entrada_pendientes/'+this.sucursal,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Ordenes = res.data.ordenes
        })
      },
      verDocumento(dir){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('leer_documento/',{
          ubicacion: dir
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url);
            this.$store.commit('activarOverlay', false);
          }
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
        })
      },
      abrirDialogo(data){
        this.Devolucion.id      = data.id;
        this.Devolucion.dialogo = true;
      },
      subirDocumento(){
        if (this.$refs.FormSubirDocumentoFirmadoDevolucionesProveedor.validate()){
          let data = new FormData();
          this.Devolucion.dialogo = false;
          this.$store.commit('activarOverlay', true);
          data.append('file', this.Devolucion.file);
          data.append('id', this.Devolucion.id);
          this.$axios({
            method: 'post',
            url: '/devoluciones_proveedor/file_firmado',
            data:data,
            headers:{
              'Authorization': 'Bearer ' + this.$store.state.token,
              'Content-Type': "multipart/form-data"
            }
          }).then((res)=>{
            this.$store.commit('cargarDevoluciones');
            this.$store.commit('activarOverlay', false);
            this.Devolucion.file = null;
            Swal.fire(
              'Registro Exitoso',
              `Se ha registrado exitosamente el documento fírmado.`,
              'warning'
            );
          }).catch((error)=>{
            this.Devolucion.dialogo = true;
            this.$store.commit('activarOverlay', false);
          })
        }
      }
    }
  }
</script>

<style scoped>
.btnpunto:hover{
  background-color: #7F828B;
  color: #FFFFFF;
}
</style>
