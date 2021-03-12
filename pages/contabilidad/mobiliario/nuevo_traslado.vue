<template>
<v-card>
  <v-toolbar color="grey lighten-3" flat>
    <h5>Nuevo Traslado de Mobiliario</h5>
  </v-toolbar>
  <v-form class="ma-5" ref="FormMobNuevoTraslado">
    <v-row no-gutters>
      <v-col>
        <v-autocomplete :loading="loadSucursales" :items="Sucursales" class="ma-2"
                        :item-text="'nombre'" :item-value="'id'"
                        v-model="traslado.sucursal_salida" @change="cargarMobiliario"
                        dense label="Sucursal de Salida" :rules="rulesRequired">
        </v-autocomplete>
      </v-col>
      <v-col>
        <v-autocomplete :loading="loadColaboradores" :items="Colaboradores" class="ma-2"
                        v-model="traslado.colaborador_salida" :rules="rulesRequired"
                        dense label="Colaborador Reponsable de Envio">
        </v-autocomplete>
      </v-col>
      <v-col>
        <v-autocomplete :loading="loadSucursales" :items="Sucursales" class="ma-2"
                        :item-text="'nombre'" :item-value="'id'" v-model="traslado.sucursal_destino"
                        dense label="Sucursal de Destino" :rules="rulesRequiredD">
        </v-autocomplete>
      </v-col>
      <v-col>
        <v-autocomplete :loading="loadColaboradores" :items="Colaboradores" class="ma-2"
                        v-model="traslado.colaborador_responsabe" :rules="rulesRequiredC"
                        dense label="Nuevo Colaborador Responsabe">
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-text-field dense label="Observación"
                      v-model="traslado.observacion" class="ma-2">
        </v-text-field>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-toolbar flat dense >
      <h6>Cuerpo del Traslado</h6>
      <v-spacer></v-spacer>
      <v-btn class="text-white ma-2" color="success" tile
             @click="validarForm" small>Registrar Traslado</v-btn>
      <v-btn class="text-white ma-2" :disabled="!btnColor" color="indigo" tile
             @click="dialogo = true" small>Agregar Mobiliario</v-btn>
    </v-toolbar>

    <v-data-table dense
                  :headers="headerMob"
                  :items="traslado.Cuerpo"
                  @dblclick:row="removeFila"
                  class="rowsTable">
      <template v-slot:item.precio_actual="{item}">
        L {{item.precio_actual}}
      </template>
      <template v-slot:item.estado="{item}">
        <v-chip x-small color="success" v-if="item.estado === 1" dark>Activo</v-chip>
        <v-chip x-small color="red" v-else-if="item.estado === 2" dark>Fuera de Servicio</v-chip>
        <v-chip x-small color="indigo" v-else-if="item.estado === 3" dark>Almacenado</v-chip>
        <v-chip x-small color="orange" v-else-if="item.estado === 4" dark>Movimiento</v-chip>
      </template>
    </v-data-table>
  </v-form>

  <v-dialog v-model="dialogo" width="90%">
    <v-card class="pl-5 pr-5 pb-5">
      <v-toolbar flat color="grey lighten-3">
        <h5>Mobiliario Existente</h5>
        <v-spacer></v-spacer>
        <v-text-field dense label="Buscar" v-model="search"></v-text-field>
      </v-toolbar>
      <v-data-table dense
                    :search="search"
                    class="rowsTable"
                    :loading="loadMobiliarios"
                    :items="Mobiliarios"
                    loading-text="Cargando Mobiliarios"
                    :headers="header">
        <template v-slot:item.colaborador.nombres="{item}">
          {{item.colaborador.nombres}} {{item.colaborador.apellidos}}
        </template>
        <template v-slot:item.estado="{item}">
          <v-chip x-small color="success" v-if="item.estado === 1" dark>Activo</v-chip>
          <v-chip x-small color="red" v-else-if="item.estado === 2" dark>Fuera de Servicio</v-chip>
          <v-chip x-small color="indigo" v-else-if="item.estado === 3" dark>Almacenado</v-chip>
          <v-chip x-small color="orange" v-else-if="item.estado === 4" dark>Movimiento</v-chip>
        </template>
        <template v-slot:item.id="{item}">
          <v-btn fab tile color="indigo" height="25" width="25" @click="addCuerpo(item)"
                 dark><v-icon>fa fa-arrow-right</v-icon></v-btn>
        </template>
      </v-data-table>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="orange" dark small tile @click="dialogo = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
export default {
  name: "nuevo_traslado",
  data(){
    return{
      search: '',
      btnColor: false,
      dialogo: false,
      rulesRequired:[
        v => !!v || 'Este campo es requerido',
      ],
      rulesRequiredD:[
        v => !!v || 'Este campo es requerido',
      ],
      rulesRequiredC:[
        v => !!v || 'Este campo es requerido',
      ],
      headerMob:[
        {text:'Colaborador Responsable Actual', value:'colaborador'},
        {text:'Artículo',                       value:'nombre'},
        {text:'Modelo',                         value:'modelo'},
        {text:'Marca',                          value:'marca'},
        {text:'Serie del Fabricante',           value:'serie_f'},
        {text:'Familía',                        value:'familia'},
        {text:'Sub-familia',                    value:'familia'},
        {text:'Serie del Sistema',              value:'serie_s'},
        {text:'Precio Actual',                  value:'precio_actual'},
        {text:'Estado',                         value:'estado'},
      ],
      traslado:{
        observacion: '',
        sucursal_salida:        '',
        colaborador_salida:     '',
        sucursal_destino:       '',
        colaborador_responsabe: '',
        Cuerpo:                 []
      },
      Sucursales: [],
      Colaboradores: [],
      Mobiliarios:   [],
      loadSucursales: false,
      loadColaboradores: false,
      loadMobiliarios:   false,
      header:[
        {text: 'Nombre',           value:'nombre'},
        {text: 'Marca',            value:'mob_modelo.mob_marca.nombre'},
        {text: 'Sub-familia',      value:'mob_modelo.sub_f'},
        {text: 'Serie Fabricante', value:'serie_f'},
        {text: 'Serie Sistema',    value:'serie_s'},
        {text: 'Precio Actual',    value:'precio_actual'},
        {text: 'Estado Actual',    value:'estado'},
        {text:'Seleccionar',       value:'id'},
      ]
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Contabilidad > Mobiliario > Nuevo Traslado');
    this.$store.commit('activarOverlay', false);
    this.cargarSucursales();
    this.cargarColaboradores();
  },
  methods:{
    addCuerpo(data){
      let item = this.traslado.Cuerpo.filter(i => i.mob_id === data.id);
      if (item.length === 0){
        this.traslado.Cuerpo.push({
          key:           this.traslado.Cuerpo.length,
          nombre:        data.nombre,
          colaborador:   data.colaborador.nombres+' '+data.colaborador.apellidos,
          modelo:        data.mob_modelo.nombre,
          marca:         data.mob_modelo.mob_marca.nombre,
          familia:       data.mob_modelo.mob_familia.nombre,
          sub:           data.mob_modelo.sub_f,
          serie_f:       data.serie_f,
          serie_s:       data.serie_s,
          precio_actual: data.precio_actual,
          estado:        data.estado,
          mob_id:        data.id
        });
        this.dialogo = false;
      }else{
        this.$store.commit('notificacion',{texto:'Ya agregaste este artículo',color:'warning'})
      }
    },
    cargarSucursales(){
      this.loadSucursales = true;
      this.$axios.get('sucursales').then((res)=>{
        this.Sucursales     = res.data.suc;
        this.loadSucursales = false
      })
    },
    cargarColaboradores(){
      this.loadColaboradores = true;
      this.$axios.get('colaboradores_2').then((res)=>{
        res.data.colaboradores.forEach((i)=>{
          this.Colaboradores.push({
            text:  i.nombres+' '+i.apellidos,
            value: i.id
          })
        })
        this.loadColaboradores = false;
      })
    },
    cargarMobiliario(){
      this.loadMobiliarios = true;
      this.loadSucursales  = true;
      this.$axios.get('mob/mobliarios/sucursal/'+this.traslado.sucursal_salida).then((res)=>{
        this.Mobiliarios     = res.data.mobiliarios;
        this.loadMobiliarios = false;
        this.btnColor        = true;
        this.loadSucursales  = false;
      })
    },
    registrarTraslado(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('mob/mobiliarios/traslados',{
        sucursal_id:      this.traslado.sucursal_salida,
        colaborador_id:   this.traslado.colaborador_salida,
        sucursal_destino: this.traslado.sucursal_destino,
        col_responsable:  this.traslado.colaborador_responsabe,
        observaciones:    this.traslado.observacion,
        cuerpo:           this.traslado.Cuerpo
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$router.replace({path:'/contabilidad/mobiliario/traslados'})
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Error en el servidor', color:'error'});
      })
    },
    removeFila(data,val){
      this.traslado.Cuerpo.splice(val.item.key, 1);
      this.traslado.Cuerpo.forEach((i, cont)=>{
        i.key = cont
      });
      this.$store.commit('notificacion',{texto:'Se elimino la fila', color:'warning'});
    },
    validarForm(){
      let cont = 0;
      if (this.$refs.FormMobNuevoTraslado.validate())
        cont++;

      if (this.traslado.Cuerpo.length > 0)
        cont++;
      else
        this.$store.commit('notificacion',{texto:'No hay cuerpo en el traslado', color:'warning'});

      if (cont === 2)
        this.registrarTraslado();
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
