<template>
  <div class="ml-2 mr-2">
    <v-row>
      <v-col>
        <v-card tile class="mx-auto" height="470px" :loading="LOAD_VENTAS">
          <v-toolbar tile flat>
            <v-toolbar-title>Ventas Pendientes</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn small tile text class="ma-2" color="indigo">Ir a Ventas</v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-simple-table>
            <template>
              <thead>
              <tr>
                <th>Nombre del Cliente</th>
                <th>Código</th>
                <th>Estado</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in VENTAS">
                <td>{{item.cliente.nombres}} {{item.cliente.apellidos}}</td>
                <td>{{item.cod}}</td>
                <td>
                  <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
                  <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
                  <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
                  <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
                </td>
              </tr>
              <tr v-if="i === 0" v-for="(item, i) in VENTAS">
                <td>{{item.cliente.nombres}} {{item.cliente.apellidos}}</td>
                <td>{{item.cod}}</td>
                <td>
                  <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
                  <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
                  <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
                  <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
                </td>
              </tr>
              <tr v-for="item in VENTAS">
                <td>{{item.cliente.nombres}} {{item.cliente.apellidos}}</td>
                <td>{{item.cod}}</td>
                <td>
                  <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
                  <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
                  <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
                  <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider v-if="VENTAS.length > 0"></v-divider>
          <v-card-text>Son las ventas pendientes del usuario</v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card :loading="LOAD_VENTAS" class="mx-auto" tile>
          <v-toolbar tile flat>
            <v-toolbar-title>SL To-Do</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn small tile text class="ma-2" color="indigo" @click="goTodo">Ir a To-Do</v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-simple-table>
            <template>
              <thead>
              <tr>
                <th>Título</th>
                <th>Grupo</th>
                <th>Etiqueta</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, i) in TAREAS" v-if="i < 5">
                <td>
                  <v-chip x-small dark v-if="USUARIO == item.user_id" color="success">Propia / {{item.user.usuario}}</v-chip>
                  <v-chip x-small dark v-else color="warning">Asignada / {{item.user.usuario}}</v-chip>
                </td>
                <td>
                  <v-row no-gutters>
                    <v-col cols="11">{{item.todo_grupo.nombre}}</v-col>
                    <v-col cols="1">
                      <div :style="'height: 100%; width: 7px; background-color: '+item.todo_grupo.color.substr(0,7)+' !important'"></div>
                    </v-col>
                  </v-row>
                </td>
                <td>
                  <v-row no-gutters>
                    <v-col cols="11">{{item.todo_estado.nombre}}</v-col>
                    <v-col cols="1">
                      <div :style="'height: 100%; width: 7px; background-color: '+item.todo_estado.color.substr(0,7)+' !important'"></div>
                    </v-col>
                  </v-row>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider v-if="TAREAS.length > 0"></v-divider>
          <v-card-text>Son las tareas del usuario</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <view_transferencias/>
      </v-col>
      <v-col>
        <v-card tile height="100%">
          <v-toolbar tile flat>
            <v-toolbar-title>Notificaciones de Tilk</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn small tile text class="ma-2" color="indigo" @click="goTodo">Abrir Burbuja</v-btn>
          </v-toolbar>
          <v-divider></v-divider>
        </v-card>
      </v-col>
    </v-row>
<!--    <v-row>-->
<!--      <v-col  lg="2" cols="6">-->
<!--        <v-card @click="vista =2">-->
<!--          <v-card-title>-->
<!--            Prospectos-->
<!--          </v-card-title>-->
<!--        </v-card>-->
<!--      </v-col>-->

<!--    </v-row>-->

<!--    <v-row v-if="vista === 1">-->
<!--      <v-col md="6" cols="12">-->
<!--        <view_transferencias/>-->
<!--      </v-col>-->
<!--      <v-col>-->

<!--&lt;!&ndash;        <view_seguimientos/>&ndash;&gt;-->
<!--      </v-col>-->
<!--    </v-row>-->

<!--    <x_sucursal v-if="vista === 2"/>-->
  </div>
</template>

<script>
  import seguimiento from "../../components/Ventas/seguimiento";
  import view_transferencias from "../../components/Inicio/view_transferencias";
  import view_seguimientos from "../../components/Inicio/view_seguimientos";
  import index from "../../components/Tareas/index"
  import x_sucursal from "@/components/Ventas/seguimientos/x_sucursal";
  export default {
    components:{view_transferencias, view_seguimientos, seguimiento, tareas:index, x_sucursal},
    name: "index",
    data(){
      return{
        vista: 1
      }
    },
    computed:{
      Pes(){
        return this.$store.state.pestana
      },
      USUARIO(){
        return this.$store.state.usuario_id;
      },
      VENTAS(){
        return this.$store.state.ventas.MIS_VENTAS.filter(item=>item.estado === 4);
      },
      LOAD_VENTAS(){
        return this.$store.state.ventas.LOAD_MIS_VENTAS;
      },
      LOAD_TAREAS(){
        return this.$store.state.todo.LOAD_TAREAS;
      },
      TAREAS(){
        return this.$store.state.todo.TAREAS;
      },
    },
    created() {
      this.$store.commit('activarOverlay', false);
      this.$store.commit('guardarTitulo', 'Inicio')
      this.$store.commit('valorDialogo', false);
      this.$store.commit('col/cargar_COLABORADORES');
      this.$store.commit('ventas/cargar_MIS_VENTAS');
      this.$store.commit('todo/cargar_TAREAS', this.USUARIO);
    },
    methods:{
      taraa(){
        this.$store.commit('tareas/cambiarTareas', 'esto es un cambio')
      },
      goTodo(){
        this.$store.commit('todo/asignar_TITULO', 'Tareas');
        this.$store.commit('todo/cargar_TAREAS', this.USUARIO);
        let bandera = 0;
        this.Pes.forEach((item)=>{
          if (item.key === 3)
            bandera++;
        });
        if (bandera === 0){
          this.$store.commit('anadirCaja', {titulo:'To-Do SL', key: 3});
          this.$store.commit('cambiarTab', {val:3, tipo:false});
        }
      }
    }
  }
</script>

<style scoped>
  .side{
    opacity: 0.99;
  }
</style>
