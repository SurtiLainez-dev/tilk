<template>
  <v-card flat>
    <v-toolbar flat color="grey lighten-3">
      <h5>Nueva entrada de Mobiliario</h5>
    </v-toolbar>
    <v-form class="ma-5" ref="FormMobNuevoMobiliario">
      <v-row >
        <v-col>
          <v-autocomplete :loading="LOAD_MODELO" :items="MODELOS" class="ma-2"
                          v-model="mob.modelo_id" :rules="rulesRequired"
                          dense label="Seleccione el Modelo" @change="capturarNombre">
          </v-autocomplete>
        </v-col>
        <v-col>
          <v-autocomplete :loading="loadSucursales" :items="Sucursales" class="ma-2"
                          :item-text="'nombre'" :item-value="'id'" v-model="mob.sucursal_id"
                          dense label="Seleccione la Sucursal" :rules="rulesRequired">
          </v-autocomplete>
        </v-col>
        <v-col>
          <v-autocomplete :loading="loadColaboradores" :items="Colaboradores" class="ma-2"
                          v-model="mob.colaborador_id" :rules="rulesRequired"
                          dense label="Colaborador Reponsable">
          </v-autocomplete>
        </v-col>
        <v-col>
          <v-select :items="selectEstado" class="ma-2" v-model="mob.estado"
                    dense label="Estado" :rules="rulesRequired">
          </v-select>
        </v-col>
      </v-row>
      <v-row >
        <v-col>
          <v-menu v-model="menuFecha" :nudge-right="40" offset-y min-width="auto"
                  :close-on-content-click="false" transition="scale-transition">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="mob.fecha_entrada" class="ma-2"
                            :rules="rulesRequired" dense
                            label="Fecha de Entrada" v-bind="attrs" v-on="on">
              </v-text-field>
            </template>
            <v-date-picker
                v-model="mob.fecha_entrada"
                @input="capturarAnio"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-text-field label="Año de la Depreciación" dense class="ma-2"
                        disabled v-model="mob.anio"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense label="Serie del Fabricante" v-model="mob.serie"
                        class="ma-2"  counter>
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense label="Precio de Costo" v-model="mob.costo" type="number"
                        :rules="rulesPrecio" class="ma-2" suffix="lps" @change="saldoActual">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense label="Precio Actual" class="ma-2" v-model="mob.precio_actual"
                        suffix="lps" :rules="rulesPrecio" type="number">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row >
        <v-col cols="3">
          <v-row no-gutters>
            <v-col>
              <v-switch v-model="mob.is_depreciacion" dense label="Crear depreciación">
              </v-switch>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col><v-switch v-model="mob.is_consumible" dense label="Es un consumible"></v-switch></v-col>
          </v-row>
          <v-row no-gutters>
            <v-col><v-switch v-model="mob.is_unidades" dense label="Se mide en unidades"></v-switch></v-col>
          </v-row>
          <v-row no-gutters>
            <v-col><v-switch v-model="mob.is_pieza" dense label="Es pieza de computadora"></v-switch></v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="success" block tile small @click="validarForm">Registrar Mobiliario</v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col>
              <v-text-field dense label="Cantidad Inicial" hint="Cantidad inicial"
                            persistent-hint :disabled="!mob.is_unidades"
                            class="ma-2" v-model="mob.unidades_inicio">
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field dense label="Nombre de la Unidad" hint="gramos, unidades, pies, metros etc..."
                            persistent-hint :disabled="!mob.is_unidades"
                            class="ma-2" v-model="mob.nombre_unidad">
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field dense label="Cantidad de la Unidad" persistent-hint
                            hint="2,480, 100, 3.5 etc..." :disabled="!mob.is_unidades"
                            class="ma-2" v-model="mob.unidades">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field dense label="Nombre del Mobiliario"
                            :rules="rulesSerie" counter v-model="mob.nombre"
                            class="ma-2"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="7">
              <v-text-field v-model="mob.detalle" label="Detalle" dense class="ma-2"></v-text-field>
            </v-col>
            <v-col cols="2" >
              <v-text-field v-model="mob.anios" label="Años Depreciación"
                            dense class="ma-2" suffix="Años" :disabled="!mob.is_depreciacion" type="number">
              </v-text-field>
            </v-col>
            <v-col cols="3" class="d-flex justify-end">
              <v-btn color="indigo" class="text-white ma-2" @click="addDepreciacion"
                     small tile :disabled="!mob.is_depreciacion">Crear Depreciación</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card flat :disabled="!mob.is_depreciacion" >
                <v-toolbar dense flat color="grey lighten-4">
                  <h6>Tabla de depreciación</h6>
                </v-toolbar>
                <v-simple-table class="rowsTable" dense>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th>Año</th>
                      <th>Precio</th>
                      <th>Depreciación</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in mob.Depreciacion">
                      <td>{{item.anio}}</td>
                      <td>L {{item.precio}}</td>
                      <td>L {{item.nuevoP}}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card flat>
                <v-toolbar flat dense color="grey lighten-4">
                  <h6>Referencias</h6>
                  <v-spacer></v-spacer>
                  <v-btn @click="addReferencias" small dark tile color="indigo">Añadir</v-btn>
                </v-toolbar>
                <v-simple-table dense class="rowsTable">
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th>Detalle</th>
                      <th>Referencia</th>
                      <th>Quitar</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in mob.Referencias">
                      <td>
                        <b-form-input size="sm" v-model="item.detalle"></b-form-input>
                      </td>
                      <td>
                        <b-form-input size="sm" v-model="item.referecia"></b-form-input>
                      </td>
                      <td>
                        <v-btn color="red" dark tile fab width="25" @click="removeReferencia(item.key)"
                               height="25"><v-icon>fa fa-times</v-icon></v-btn>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
    <v-divider></v-divider>
  </v-card>
</template>

<script>
export default {
  name: "nueva_entrada",
  data(){
    return{
      menuFecha: false,
      rulesPrecio:[
        v => !!v && v > 0 || 'Este campo es requerido',
      ],
      rulesSerie: [
        v => !!v || 'Este campo es requerido',
        v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres',
      ],
      rulesRequired:[
        v => !!v || 'Este campo es requerido',
      ],
      mob:{
        unidades_inicio: 0,
        anio:           0,
        anios:          0,
        porcentaje:     5,
        modelo_id:      '',
        sucursal_id:    '',
        colaborador_id: '',
        estado:         '',
        serie:          '',
        costo:          0,
        precio_actual:  0,
        fecha_entrada:  '',
        nombre:         '',
        nombre_unidad:  '',
        unidades:        0,
        detalle:         '',
        is_depreciacion: false,
        is_consumible:   false,
        is_unidades:     false,
        is_pieza:        false,
        Depreciacion:    [],
        Referencias:     [
          {key: 0, detalle:'Número de Factura', referecia: ''},
          {key: 1, detalle:'Número de Pedido',  referecia: ''},
          {key: 2, detalle:'Proveedor',  referecia: ''},
        ]
      },
      Colaboradores: [],
      Sucursales:    [],
      loadColaboradores: false,
      loadSucursales:    false,
      selectEstado:[
        {text:'Activo', value:1},
        {text:'Fuera de Servicio', value:2},
        {text:'Almacenado', value:3},
        {text:'Dañado', value:5},
        {text:'Mantenimiento', value:6},
      ]
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Contabilidad > Mobiliario > Nuevo Ingreso');
    this.$store.commit('activarOverlay', false);
    this.$store.commit('mob/familias/cargar_MODELOS');
    this.cargarSucursales();
    this.cargarColaboradores();
  },
  computed:{
    LOAD_MODELO(){
      return this.$store.state.mob.familias.LOADMODELOS;
    },
    MODELOS(){
      let modelos = [];
      this.$store.state.mob.familias.MODELOS.forEach((i)=>{
        modelos.push({
          text:   i.nombre +' - '+i.mob_marca.nombre+ ' - '+i.mob_familia.nombre+ ' - '+i.sub_f,
          value:  i.id,
          mo:     i
        })
      })
      return modelos;
    },
  },
  methods:{
    addDepreciacion(){
      if (this.mob.precio_actual > 0 && this.mob.costo > 0 && this.mob.is_depreciacion
          && this.mob.anios > 0 && this.mob.fecha_entrada){
        this.mob.Depreciacion = [];
        let porcentaje = this.mob.porcentaje;
        if (porcentaje >= 1)
          porcentaje = (porcentaje / 100).toFixed(2);

        let fecha = new Date(this.mob.fecha_entrada);
        let costo = this.mob.precio_actual, nuevo_precio = 0;
        console.log(this.mob.anios)
        for (let i = 0; i < this.mob.anios; i++){
          nuevo_precio = (costo / (i+1)).toFixed(2);
          this.mob.Depreciacion.push({
            anio: (fecha.getFullYear() + i),
            precio: costo,
            nuevoP: nuevo_precio
          });
        }
      }else{
        this.$store.commit('notificacion',{texto:'Por el momento no se puede calcular la depreciación',color:'warning'})
      }
    },
    addReferencias(){
      this.mob.Referencias.push({
        key:        this.mob.Referencias.length,
        detalle:    '',
        referencia: ''
      })
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
    capturarAnio(){
      console.log("ento")
      let Fecha      = new Date(this.mob.fecha_entrada);
      this.mob.anio  = Fecha.getFullYear();
      this.menuFecha = false
    },
    capturarNombre(){
      let modelo      = this.MODELOS.filter(item => item.value === this.mob.modelo_id);
      modelo          = modelo[0];
      this.mob.nombre = modelo.text.split('-')[0];
    },
    registrarMobiliario(){
      try {
        let detallesModelo = this.MODELOS.filter( item => item.value === this.mob.modelo_id);
        detallesModelo     = detallesModelo[0];
        console.log(detallesModelo)
        let cod_modelo     = detallesModelo.mo.mob_familia.cod;
        let depreiacion    = null;
        if (this.mob.Depreciacion)
          depreiacion      = JSON.stringify(this.mob.Depreciacion);


        this.$store.commit('activarOverlay', true);
        this.$axios.post('mob/mobiliarios',{
          sucursal_id:         this.mob.sucursal_id,
          colaborador_id:      this.mob.colaborador_id,
          mob_modelo_id:       this.mob.modelo_id,
          cod_familia:         cod_modelo,
          serie_fabricante:    this.mob.serie,
          precio_costo:        this.mob.costo,
          precio_actual:       this.mob.precio_actual,
          is_depreciacion:     this.mob.is_depreciacion,
          depreciacion:        depreiacion,
          is_consumible:       this.mob.is_consumible,
          is_unidades:         this.mob.is_unidades,
          unidades:            this.mob.unidades,
          unidad:              this.mob.nombre_unidad,
          fecha_entrada:       this.mob.fecha_entrada,
          estado:              this.mob.estado,
          nombre:              this.mob.nombre,
          detalles:            this.mob.detalle,
          referencias:         JSON.stringify(this.mob.Referencias),
          is_pieza:            this.mob.is_pieza,
          detalles_tecnicos:   detallesModelo.mo.ficha_tecnica,
          componentes:         JSON.parse(detallesModelo.mo.componentes),
          anio:                this.mob.anio,
          is_componente:       detallesModelo.mo.is_componentes,
          unidades_inicio:     this.mob.unidades_inicio
        },{
          timeout: 50000,
        }).then((res)=>{
          this.$store.commit('notificacion', {texto: res.data.msj, color:'success'});
          this.$store.commit('activarOverlay', false);
          this.$router.replace({path:'/contabilidad/mobiliario/'});
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          if (error.response.status === 422)
            this.$store.commit('notificacion',{texto: error.response.data.error, color:'error'});
          else
            this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor', color:'error'});
        })
      }catch (e){
        this.$store.commit('notificacion',{texto: 'Hubo un error', color:'error'})
      }
    },
    removeReferencia(fila){
      if (fila > 2){
        this.mob.Referencias.splice(fila,1);
        this.mob.Referencias.forEach((i, cont)=>{
          i.key = cont;
        });
      }else{
        this.$store.commit('notificacion',{texto:'No se puede eliminar esta referencia', color:'warning'});
      }
    },
    saldoActual(){
      this.mob.precio_actual = this.mob.costo;
    },
    validarForm(){
      if (this.mob.is_depreciacion){
        if (this.mob.Depreciacion.length > 0){
          if (this.$refs.FormMobNuevoMobiliario.validate())
            this.registrarMobiliario();
        }else{
          this.$store.commit('notificacion',{texto: 'No se ha creado la depreciación', color:'warning'})
        }
      }else{
        if (this.$refs.FormMobNuevoMobiliario.validate())
          this.registrarMobiliario();
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
