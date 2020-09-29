<template>
    <div>
      <v-row class="d-flex justify-end">
        <v-col cols="7">
          <strong>Envio de guía de remisión por correo</strong>
        </v-col>
        <v-col cols="5">
          <v-text-field label="Buscar Colaborador" v-model="search"></v-text-field>
        </v-col>
      </v-row>
      <v-data-table :headers="header" :items="Colaboradores" v-model="selected"
                    :search="search" class="rowsTable" show-select
                    :loading="load" loading-text="Cargando correos... espere un momento">
        <template v-slot:item.colaborador.nombres="{item}">
          {{item.colaborador.nombres}} {{item.colaborador.apellidos}}
        </template>
      </v-data-table>
      <v-divider></v-divider>
      <strong>Colaboradores Seleccionados:</strong>
      <div class="bordes pl-2 pt-2 pb-2">
        <div v-for="item in selected">
          {{item.colaborador.nombres}} {{item.colaborador.apellidos}} - {{item.email}}
        </div>
      </div>
      <br>
      <div class="d-flex justify-end" >
        <v-btn dark small class="ma-2"
               @click="$router.replace({path:'/inventario/traslados/remisiones'})"
               color="orange">No Enviar</v-btn>
        <v-btn v-if="selected.length > 0" class="ma-2"
               @click="envioCorreo" dark small color="success">Enviar Remisión</v-btn>
      </div>
    </div>
</template>

<script>
  import Swal from 'sweetalert2'
  export default {
    name: "envio",
    data(){
      return{
        selected: [],
        search: '',
        header:[
          {text:'Nombre Completo', value:'colaborador.nombres'},
          {text:'Sucursal', value:'colaborador.sucursal.nombre'},
          {text:'Usuario', value:'usuario'},
          {text:'Correo Eléctronico', value:'email'},
        ],
        Colaboradores: [],
        load: true
      }
    },
    methods:{
      cargarColaboradores(){
        this.$axios.get('colaborador_envio',{
          headers:{
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        }).then((res)=>{
          this.Colaboradores = res.data.colaboradores;
          this.load = false;
        })
      },
      envioCorreo(){
        this.$store.commit('activarOverlay', true);
        this.$store.commit('valorDialogo', false);
        this.$store.commit('valorDialogo2', false);
        this.$axios.post('envio_remision',{
          data: this.selected,
          dir: this.$store.state.file[0],
          remision: this.$store.state.file[1]
        },{
          headers:{
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('valorDialogo', true);
          this.$store.commit('valorDialogo2', true);
          Swal.fire(
            'Envio Exitoso',
            `Se envió la guía de remisión a todos los contactos seleccionados.`,
            'success'
          );
          this.$router.replace({path:'/inventario/traslados/remisiones'})
        })
      }
    },
    created() {
      this.cargarColaboradores();
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
  .bordes{
    border: solid #000 1px;
  }
</style>
