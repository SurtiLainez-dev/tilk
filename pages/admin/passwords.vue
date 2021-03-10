<template>
<v-card flat dark>
  <v-toolbar flat align="center">
    <h6>Panel de Contraseñas Administradas</h6>
    <v-spacer></v-spacer>
    <v-text-field dark dense label="Buscar" v-model="search" class="ma-2"></v-text-field>
    <v-spacer></v-spacer>
    <v-btn small tile color="indigo" @click="abrirDialogo" dark>Nueva Contraseña</v-btn>
  </v-toolbar>

  <v-data-table :headers="header"
                dense
                :items-per-page="20"
                :items="Contras"
                :search="search"
                :loading="loadPasswords"
                loading-text="Cargando Contraseñas Administradas"
                dark
                class="rowsTable">
    <template v-slot:item.colaborador.nombres="{item}">
      {{item.colaborador.nombres}} {{item.colaborador.apellidos}}
    </template>
    <template v-slot:item.estado="{item}">
      <v-chip dark x-small color="success" v-if="item.estado === 1">Activo</v-chip>
      <v-chip dark x-small color="red" v-else-if="item.estado === 0">Inactivo</v-chip>
    </template>
    <template v-slot:item.id="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <v-btn text fab tile x-small width="25" height="25" @click="abrirDialogoAcciones(2, item)"
                 color="indigo" dark v-on="on" v-bind="attrs"><v-icon>fa fa-eye</v-icon></v-btn>
        </template>
        <span>Ver contraseña</span>
      </v-tooltip>
      <v-btn text fab tile x-small width="25" height="25" @click="abrirDialogoEdit(item)"
      color="orange" dark><v-icon>fa fa-edit</v-icon></v-btn>
      <v-btn text fab tile x-small width="25" @click="abrirDialogoAcciones(1, item)"
      height="25" color="red" dark><v-icon>fa fa-times</v-icon></v-btn>
    </template>
    <template v-slot:item.observacion="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <span v-if="item.observacion" v-on="on" v-bind="attrs">{{item.observacion.substr(0,12)}} ...</span>
        </template>
        <span>{{item.observacion}}</span>
      </v-tooltip>
    </template>
    <template v-slot:item.colaborador.sucursal.nombre="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <span v-on="on" v-bind="attrs">{{item.colaborador.sucursal.abreviatura}}</span>
        </template>
        <span>{{item.colaborador.sucursal.nombre}}</span>
      </v-tooltip>
    </template>
    <template v-slot:item.colaborador.nombres="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <span v-on="on" v-bind="attrs">{{item.colaborador.nombres}} {{item.colaborador.apellidos.substr(0,5)}} ...</span>
        </template>
        <span>{{item.colaborador.nombres}} {{item.colaborador.apellidos}}</span>
      </v-tooltip>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogo" width="25%" dark>
    <v-card>
      <v-toolbar flat>
        <h6>{{Pass.titulo}}</h6>
      </v-toolbar>
      <v-form class="pb-5 pl-5 pr-5" ref="FormContrasenas">
        <v-select dense class="ma-2" label="Sucursal" :item-text="'nombre'" :item-value="'id'"
                  :loading="loadSucursales" loader-height="3" @change="cargarColaboradores"
                  :items="Sucursales" v-model="Pass.sucursal">
        </v-select>
        <v-autocomplete dense class="ma-2" v-model="Pass.colaborador"  :items="Colaboradores"
                  :loading="loadColaboradores" loader-height="3" :rules="[rule.proveedor.req]"
                  label="Colaborador" v-if="Pass.tipo === 1">
        </v-autocomplete>
        <v-text-field dense class="ma-2" v-model="Pass.colaborador" label="Colaborador"
                  v-else-if="Pass.tipo === 2" disabled>
        </v-text-field>
        <v-text-field counter dense class="ma-2" v-model="Pass.proveedor" label="Proveedor"
                      :rules="[rule.proveedor.req, rule.proveedor.max]">
        </v-text-field>
        <v-text-field counter dense class="ma-2" v-model="Pass.usuario" label="Usuario de Acceso"
                      :rules="[rule.proveedor.req, rule.user.max]">
        </v-text-field>
        <v-text-field dense class="ma-2" v-model="Pass.contrasena" label="Contraseña"
                      v-if="Pass.tipo === 1" :rules="[rule.proveedor.req, rule.contra.max]">
        </v-text-field>
        <v-select dense class="ma-2" label="Estado" v-model="Pass.estado"
                  :items="selectEstado" v-if="Pass.tipo === 2">
        </v-select>
        <v-textarea counter dense class="ma-2" v-model="Pass.observacion"
                    label="Observación" :rules="[rule.observacion.max]">
        </v-textarea>
      </v-form>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="orange" dark small tile @click="dialogo = false">Cerrar</v-btn>
        <v-btn color="success" dark small tile @click="validarForm">{{Pass.tituloBtn}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogoAcciones" width="25%" dark>
    <v-card>
      <v-toolbar flat>
        <h6>{{tituloaccion}}</h6>
      </v-toolbar>
      <v-card-text v-if="!statusPassword">Para realizar esta acción tienes que verificar la contraseña del administrador.</v-card-text>
      <v-text-field v-if="!statusPassword" label="Contraseña del Administrador" class="ma-2"
                    dense v-model="password" @keyup.enter="verificarContrasena">
      </v-text-field>
      <v-text-field class="ma-2" :label="'Contraseña de '+Pass.usuario"
                    v-if="statusPassword" v-model="Pass.contrasena" disabled></v-text-field>
      <v-card-actions class="d-flex justify-end">
        <v-btn dark small color="orange" @click="cerrarDialogoAcciones">Cerrar</v-btn>
        <v-btn dark small v-if="!statusPassword" color="success"
               @click="verificarContrasena">Verificar Contraseña</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "passwords",
  data(){
    return{
      search: '',
      dialogo: false,
      selectEstado:[
        {text: 'Activo', value:1},
        {text: 'Inactivo', value:0},
      ],
      rule: {
        proveedor: {
          req: v => !!v || 'Campo requerido',
          max: v => (v && v.length <= 80) || 'Tiene que ser menor o igual a 80 carácteres.',
        },
        contra:{
          max: v => (v && v.length <= 70) || 'Tiene que ser menor o igual a 70 carácteres.',
        },
        user:{
          max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
        },
        observacion:{
          max: v => (v.length <= 100) || 'Tiene que ser menor o igual a 100 carácteres.',
        }
      },
      header:[
        {text:'Sucursal',    value:'colaborador.sucursal.nombre'},
        {text:'Proveedor',   value:'proveedor'},
        {text:'Colaborador', value:'colaborador.nombres'},
        {text:'Usuario',     value:'usuario'},
        {text:'Observación', value:'observacion'},
        {text:'Estado',      value:'estado'},
        {text:'Acciones',    value:'id'},
      ],
      Pass:{
        id:          null,
        sucursal:    '',
        usuario:     '',
        colaborador: '',
        proveedor:   '',
        contrasena:  '',
        observacion: '',
        estado:      false,
        titulo:      '',
        tipo:        1,
        tituloBtn:   ''
      },
      loadSucursales:    false,
      loadColaboradores: false,
      loadPasswords:     false,
      Sucursales:    [],
      Colaboradores: [],
      Contras:       [],
      dialogoAcciones: false,
      tipoaccion:      1,
      tituloaccion:    '',
      password: '',
      statusPassword: false
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Administrador > Contraseñas');
    this.cargarContrasenas();
    this.cargarSucursales();
  },
  methods:{
    abrirDialogo(){
      this.Pass.titulo      = 'Nueva Contraseña Administrada';
      this.Pass.estado      = false;
      this.Pass.usuario     = '';
      this.Pass.observacion = '';
      this.Pass.contrasena  = '';
      this.Pass.tituloBtn   = 'Registrar';
      this.Pass.tipo        = 1;
      this.dialogo          = true;
    },
    abrirDialogoAcciones(val, data){
      this.tipoaccion      = val;
      this.Pass.id         = data.id;
      this.Pass.contrasena = data.contrasena;
      this.Pass.usuario    = data.usuario;
      if (val === 1)
        this.tituloaccion  = 'Eliminar Contraseña: '+data.usuario;
      else
        this.tituloaccion  = 'Ver Contraseña';
      this.dialogoAcciones = true;
    },
    abrirDialogoEdit(data){
      this.Pass.titulo      = 'Editando Contraseña '+data.usuario;
      console.log(data)
      this.Pass.estado      = data.estado;
      this.Pass.usuario     = data.usuario;
      if (data.observacion)
        this.Pass.observacion = data.observacion;

      this.Pass.contrasena  = data.contrasena;
      this.Pass.proveedor   = data.proveedor;
      this.Pass.sucursal    = data.colaborador.sucursal_id;
      this.Pass.colaborador = data.colaborador.nombres+ ' '+ data.colaborador.apellidos;
      this.Pass.id          = data.id;
      this.Pass.tituloBtn   = 'Editar Contraseña';
      this.Pass.tipo        = 2;
      this.dialogo          = true;
    },
    cargarColaboradores(){
      this.Colaboradores = [];
      this.loadColaboradores = true;
      this.$axios.get('empleados_plantilla/'+this.Pass.sucursal).then((res)=>{
        res.data.col.forEach((i)=>{
          this.Colaboradores.push({
            text:  i.nombres+' '+i.apellidos,
            value: i.id
          })
        })
        this.loadColaboradores = false;
      })
    },
    cargarContrasenas(){
      this.loadPasswords = true;
      this.$axios.get('admin/contrasenas_administradas').then((res)=>{
        this.Contras = res.data.contras;
        this.loadPasswords = false;
      })
    },
    cargarSucursales(){
      this.loadSucursales = true;
      this.$axios.get('/sucursales').then((res)=>{
        this.Sucursales = res.data.suc;
        this.loadSucursales = false;
      })
    },
    cerrarDialogoAcciones(){
      this.dialogoAcciones = false;
      this.statusPassword  = false;
    },
    deleteContra(){
      this.$axios.delete('admin/contrasenas_administradas/'+this.Pass.id).then((res)=>{
        this.notificacion(res.data.msj,'success');
        this.cargarContrasenas();
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        }, 4500);
      }).catch((error)=>{
        this.notificacion('Ha ocurrido un error','error');
      })
    },
    editarContra(){
      this.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.put('admin/contrasenas_administradas/'+this.Pass.id,{
        usuario:     this.Pass.usuario,
        proveedor:   this.Pass.proveedor,
        observacion: this.Pass.observacion,
        estado:      this.Pass.estado
      }).then((res)=>{
        this.notificacion(res.data.msj,'success');
        this.cargarContrasenas();
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        }, 4500);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.notificacion('Ocurrió un error inesperado','error');
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
    registrarContrasena(){
      this.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('admin/contrasenas_administradas',{
        colaborador_id: this.Pass.colaborador,
        usuario:        this.Pass.usuario,
        proveedor:      this.Pass.proveedor,
        contrasena:     this.Pass.contrasena,
        observacion:    this.Pass.observacion
      }).then((res)=>{
        this.notificacion(res.data.msj,'success');
        this.cargarContrasenas();
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        }, 4500);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.notificacion('Ocurrió un error inesperado','error');
      })
    },
    validarForm(){
      if (this.$refs.FormContrasenas.validate()){
        if (this.Pass.tipo === 1)
          this.registrarContrasena();
        else
          this.editarContra();
      }
    },
    verificarContrasena(){
      if (this.password){
        this.dialogoAcciones = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('admin/verificar_contrasena_admin',{
          password: this.password
        }).then((res)=>{
          this.notificacion(res.data.msj,'success');
          if (this.tipoaccion === 1)
            this.deleteContra();
          else{
            this.statusPassword = true;
            this.$store.commit('activarOverlay', false);
            this.dialogoAcciones = true;
            this.notificacion('Ha cargado exitosamente la contraseña','success');
          }
          this.password = '';
        }).catch((error)=>{
          if (error.response.status === 422)
            this.notificacion(error.response.data.error,'error');
          else
            this.notificacion('Ocurrió un error en el servidor','error');

          this.$store.commit('activarOverlay', false);
          this.dialogoAcciones = true;
        })
      }else{
        this.notificacion('Escribe una contraseña', 'warning');
      }
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
