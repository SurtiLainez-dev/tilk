<template>
<v-card flat>
  <v-toolbar flat color="grey lighten-5">
    <h6>Modelos de Mobiliario</h6>
    <v-spacer></v-spacer>
    <div class="d-flex justify-end">
      <v-text-field dense v-model="search" label="Buscar Modelo"></v-text-field>
    </div>
  </v-toolbar>

  <v-data-table dense :items="MODELOS"
                :headers="header"
                :loading="LOAD_MODELO"
                @click:row="datosData"
                loading-text="Cargando Modelos"
                :search="search"
                class="rowsTable">
    <template v-slot:item.is_componentes="{item}">
      <v-chip x-small dark color="success" v-if="item.is_componentes === 1">Sí</v-chip>
      <v-chip x-small dark color="red" v-else>No</v-chip>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogo" width="70%">
    <v-card class="pl-5 pr-5 pb-5 ">
      <v-toolbar flat color="grey lighten-4">
        <h6>Datos del Modelo</h6>
      </v-toolbar>

      <v-form ref="FormMobEditarModelo" class="ma-2">
        <v-row no-gutters>
          <v-col>
            <v-autocomplete dense label="Familía" :items="FAMILIAS" v-model="data.familia"
                            class="ma-2" :loading="LOAD_FAMILIAS" loader-height="3" :rules="rulesRequired"
                            :item-text="'nombre'" :item-value="'id'" @change="cambiarSubs">
            </v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete dense label="Sub-amilía" :item-value="'nombre'" :item-text="'nombre'"
                            :items="Subs" class="ma-2" v-model="data.sub_f" :rules="rulesRequired">
            </v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete dense label="Marca" class="ma-2" :items="MARCAS" :item-text="'nombre'"
                            v-model="data.marca" :item-value="'id'" :loading="LOAD_MARCAS"
                            loader-height="3" :rules="rulesRequired">
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field dense label="Nombre del Modelo" class="ma-2" counter
                          v-model="data.nombre" :rules="rulesRequired">
            </v-text-field>
          </v-col>
          <v-col>
            <v-select label="Es un Componente" class="ma-2" dense :items="select"
                      @change="estadoComponente"
                      v-model="data.is_componentes" :rules="rulesRequired">
            </v-select>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row no-gutters class="ma-2">
          <v-col>
            <small>Detalles Técnicos</small>
            <v-divider></v-divider>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                <tr v-for="item in data.detalles">
                  <td>
                    <b-form-input size="sm" v-model="item.nombre"></b-form-input>
                  </td>
                  <td>
                    <b-form-input size="sm" v-model="item.detalle"></b-form-input>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col>
            <small>Componentes</small>
            <v-divider></v-divider>
            <v-simple-table>
              <template v-slot:default>
                <tbody>
                <tr v-for="item in data.componentes">
                  <td>
                    <b-form-input size="sm" v-model="item.nombre"></b-form-input>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" dark small tile @click="dialogo = false">Cerrar</v-btn>
          <v-btn color="success" dark small tile @click="validarForm">Registrar Cambios</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

</v-card>
</template>

<script>
export default {
  name: "index",
  data(){
    return{
      select:[
        {text:'Es componente', value:1},
        {text:'No es componente', value:0},
      ],
      dialogo: false,
      search: '',
      rules: [
        v => !!v || 'El nombre es requerido',
        v => (v && v.length >= 2) || 'Tiene que ser mayor a 2 carácteres',
      ],
      rulesRequired:[
        v => !!v || v === 0 || 'El nombre es requerido',
      ],
      data:{
        modelo_id:     '',
        nombre:        '',
        marca:         '',
        familia:       '',
        sub_f:         '',
        detalles:      [],
        componentes:   [],
        is_componentes: 0
      },
      Subs: [],
      header:[
        {text: 'Marca',value:'mob_marca.nombre'},
        {text: 'Nombre',value:'nombre'},
        {text: 'Componente',value:'is_componentes'},
        {text: 'Familía',value:'mob_familia.nombre'},
        {text: 'Sub-familía',value:'sub_f'},
        {text: 'Stock',value:'stock'},
      ]
    }
  },
  computed:{
    LOAD_MODELO(){
      return this.$store.state.mob.familias.LOADMODELOS;
    },
    MODELOS(){
      return this.$store.state.mob.familias.MODELOS;
    },
    LOAD_MARCAS(){
      return this.$store.state.mob.familias.LOADMARCAS;
    },
    MARCAS(){
      return this.$store.state.mob.familias.MARCAS;
    },
    LOAD_FAMILIAS(){
      return this.$store.state.mob.familias.LOADFAMILIAS;
    },
    FAMILIAS(){
      return this.$store.state.mob.familias.FAMILIAS;
    }
  },
  methods:{
    cambiarSubs(){
      let sub = this.FAMILIAS.filter(i => i.id === this.data.familia);
      let subs = []
      if (sub[0].subd) {
        subs = JSON.parse(sub[0].subd);
      }else
        subs = [];

      this.Subs = subs;
    },
    datosData(data){
      console.log(this.data)
      this.data.modelo_id      = data.id;
      this.data.nombre         = data.nombre;
      this.data.marca          = data.mob_marca.id;
      this.data.familia        = data.mob_familia.id;
      this.data.sub_f          = data.sub_f;
      if (data.ficha_tecnica)
        this.data.detalles       = JSON.parse(data.ficha_tecnica);
      else
        this.data.detalles       = [];

      this.data.is_componentes   = data.is_componentes;

      if (data.componentes)
        this.data.componentes    = JSON.parse(data.componentes);
      else
        this.data.componentes    = [];

      this.cambiarSubs();
      this.dialogo               = true;
    },
    editarModelo(){
      this.$store.commit('activarOverlay', true);
      this.dialogo = false;
      this.$axios.put('mob/modelos/'+this.data.modelo_id,{
        marca_id:       this.data.marca,
        ficha:          JSON.stringify(this.data.detalles),
        is_componentes: this.data.is_componentes,
        componente:     JSON.stringify(this.data.componentes),
        familia_id:     this.data.familia,
        sub_f:          this.data.sub_f,
        nombre:         this.data.nombre
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('mob/familias/cargar_MODELOS');
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        },4500);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor',color:'success'});
        this.dialogo = true;
      })
    },
    estadoComponente(){
      if (this.mod.is_componente === 0)
        this.data.componentes = [];
    },
    validarForm(){
      if (this.$refs.FormMobEditarModelo.validate())
        this.editarModelo();
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
