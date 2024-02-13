<template>
  <v-card flat tile>
    <div v-if="vista === 0" style="height: 95vh">
      <v-card class="pa-2" flat tile style="height: 95%;overflow-y: auto; overflow-x: hidden">
        <div class="mt-3 d-flex justify-start" style="width: 100%; height: 50px;">
          <div style="width: 70%; height: 100%" class="d-flex align-center">
            <div class="titleTable">Prospectos</div>
          </div>
          <div style="width: 30%; height: 100%">
            <div class="d-flex justify-start" style="display: flex">
              <span class="titleBuscar">Buscar</span>
            </div>
            <div style="border: solid 1px #b2b0b0; height: 60%; padding: 2px">
              <div style="height: 100%">
                <input class="ml-1" v-model="search" type="text" placeholder="...">
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3 d-flex justify-start" style="width: 100%; height: 50px;">
          <div style="width: 70%;height: 100%">
            <div class="d-flex justify-start">
              <span class="titleAcciones">Filtros:</span>
            </div>
            <div class="d-flex justify-start align-center">

            </div>
          </div>
          <div style="width: 30%;height: 100%">
            <div class="d-flex justify-start">
              <span class="titleAcciones">Acciones:</span>
            </div>
            <div class="d-flex justify-start align-center">
              <v-progress-circular
                  indeterminate
                  color="primary"
                  :size="20"
                  v-if="load"
              ></v-progress-circular>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attr}">
                  <v-btn v-on="on" v-bind="attr" color="indigo" text
                         @click="cargarSeguimientos"
                         fab x-small icon><v-icon small>fa fa-sync</v-icon></v-btn>
                </template>
                <span>Recargar Datos</span>
              </v-tooltip>
            </div>
          </div>
        </div>

        <v-divider></v-divider>
        <div>
          <table>
            <thead>
            <tr>
              <th>Identidad</th>
              <th>Nombre Completo</th>
              <th>Articulo</th>
              <th>Fecha de Inicio</th>
              <th>Sucursal</th>
              <th>Colaborador Creador</th>
              <th>Estado</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in filterDatos" @click="selectSeguimiente(item)">
              <td>{{item.identidad}}</td>
              <td>{{item.nombres}} {{item.apellidos}} <span style="font-size: 7px">{{item.comentario}}</span></td>
              <td>{{item.nombre_articulo}}</td>
              <td>{{item.fecha_inicio.split('-')[2]}}/{{item.fecha_inicio.split('-')[1]}}/{{item.fecha_inicio.split('-')[0]}}</td>
              <td>{{item.suc}}</td>
              <td>{{item.colN}} {{item.colA}}</td>
              <td>
                <v-chip v-if="item.estado === 0 || item.estado === false" class="ma-1" color="red" x-small dark>Pendiente</v-chip>
                <v-chip v-else color="success" class="ma-1" x-small dark>Realizado</v-chip>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </v-card>

      <v-card-actions class="grey" style=" width: 100%; height: 5%">
        <v-row no-gutters>
          <v-col cols="2"><span class="text-white" style="font-size: 10px">Resultados: <strong>{{resultados}}</strong> articulos</span></v-col>
          <v-col cols="2">
            <v-row no-gutters>
              <v-col><span class="text-white" style="font-size: 10px">Filas a mostrar</span></v-col>
              <v-col>
                <select v-model="filas">
                  <option :value="100">100</option>
                  <option :value="250">250</option>
                  <option :value="500">500</option>
                  <option :value="1000">1000</option>
                  <option :value="1500">1500</option>
                  <option :value="2000">2000</option>
                  <option :value="5000">5000</option>
                  <option :value="10000">10000</option>
                  <option :value="20000">20000</option>
                </select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="8" class="d-flex justify-end">
            <v-pagination
                v-model="page"
                :length="paginas"
                :total-visible="6"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-card-actions>
    </div>

    <v-card v-else flat>
      <v-toolbar dense flat >
        <v-row no-gutters>
          <v-col cols="1" class="d-flex justify-start">
            <v-btn fab class="ma-1" x-small dark color="orange" @click="vista = 0"><v-icon>fa fa-arrow-left</v-icon></v-btn>
          </v-col>
          <v-col>
            <div class="pt-2">Seguimiento de Venta a:  <strong> {{Seguimiento.nombres}} {{Seguimiento.apellidos}} <small style="font-size: 12px">{{Seguimiento.comentario}}</small></strong></div>
          </v-col>
        </v-row>
      </v-toolbar>

      <v-card class="ma-2 pa-2" tile>
        <div class="row no-gutters">
          <div class="col">
            <div><span class="titleDatos" style="font-size: 20px !important;">Datos Generales</span></div>
          </div>
        </div>
        <v-divider></v-divider>
        <div class="row no-gutters">
          <div class="col">
            <div><span class="titleDatos">Nombre del Prospecto</span></div>
            <div><span class="subtitleDatos">{{Seguimiento.identidad}} - {{Seguimiento.nombres}} {{Seguimiento.apellidos}} {{Seguimiento.comentario? ' - '+Seguimiento.comentario:''}}</span></div>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col">
            <div><span class="titleDatos">Colaborador Creador</span></div>
            <div><span class="subtitleDatos">{{Seguimiento.colN}} {{Seguimiento.colA}}</span></div>
          </div>
          <div class="col">
            <div><span class="titleDatos">Articulo</span></div>
            <div><span class="subtitleDatos">{{Seguimiento.nombre_articulo}}</span></div>
          </div>
          <div class="col">
            <div><span class="titleDatos">Fecha de Inicio</span></div>
            <div><span class="subtitleDatos">{{Seguimiento.fecha_inicio.split('-')[2]}}/{{Seguimiento.fecha_inicio.split('-')[1]}}/{{Seguimiento.fecha_inicio.split('-')[0]}}</span></div>
          </div>
          <div class="col">
            <div><span class="titleDatos">Sucursal</span></div>
            <div><span class="subtitleDatos">{{Seguimiento.suc}}</span></div>
          </div>
          <div class="col">
            <div><span class="titleDatos">Estado</span></div>
            <div><span class="subtitleDatos">
              <v-chip v-if="Seguimiento.estado === 0 || Seguimiento.estado === false" class="ma-1" color="red" x-small dark>Pendiente</v-chip>
                <v-chip v-else color="success" class="ma-1" x-small dark>Realizado</v-chip>
            </span></div>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col">
            <div><span class="titleDatos">Conclución</span></div>
            <div><span class="subtitleDatos">{{Seguimiento.conclucion? Seguimiento.conclucion:''}}</span></div>
          </div>
        </div>
      </v-card>

      <v-card class="ma-2 pa-2" tile>
        <div class="row no-gutters">
          <div class="col">
            <div><span class="titleDatos">Comentarios</span></div>
          </div>
        </div>

        <table>
          <thead>
          <tr>
            <th>Fecha de Gestión</th>
            <th>Detalle de la Gestión</th>
            <th>Resultado de la Gestión</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in JSON.parse(Seguimiento.detalles)">
            <td>{{item.fecha}}</td>
            <td>{{item.detalle}}</td>
            <td>{{item.val}}</td>
          </tr>
          </tbody>
        </table>

      </v-card>

      <v-card class="ma-2 pa-2 mb-5" tile>
        <div class="row no-gutters">
          <div class="col">
            <div><span class="titleDatos">Contactos al Cliente</span></div>
          </div>
        </div>

        <table>
          <thead>
          <tr>
            <th>Fecha</th>
            <th>Detalle</th>
            <th>Respuesta</th>
            <th>Forma de Contacto</th>
            <th>Estado</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in JSON.parse(Seguimiento.tareas)">
            <td>
              {{item.fecha}}
            </td>
            <td>
              <v-tooltip top>
                <template v-slot:activator="{on,attrs}">
                  <span v-on="on" v-bind="attrs">{{item.detalle.substring(0, 17)}}...</span>
                </template>
                <span>{{item.detalle}}</span>
              </v-tooltip>
            </td>
            <td>
              {{item.respuesta}}
            </td>
            <td >
              <select :disabled="!item.view">
                <option v-for="item in formaContactar"
                        :value="item.value">{{item.text}}</option>
              </select>
            </td>
            <td >
              <v-chip v-if="item.estado === 0 || item.estado === false" class="ma-1" color="red" x-small dark>Pendiente</v-chip>
              <v-chip v-else color="success" class="ma-1" x-small dark>Realizado</v-chip>
            </td>
          </tr>
          </tbody>
        </table>

      </v-card>

    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "Prospectos",
  data(){
    return{
      vista: 0,
      search: '',
      load: false,
      resultados: 0,
      paginas: 0,
      filas: 50,
      page: 1,
      Seguimientos: [],
      Seguimiento: {},
      formaContactar:[
        {text:'Llamada',value:1},
        {text:'Mensaje',value:2},
        {text:'Correo Eléctronico',value:3},
        {text:'Vísita Informal',value:4},
        {text:'Vísita Formal',value:5},
        {text:'El cliente contacto',value:6},
        {text:'Facebook',value:7},
        {text:'WhatsApp',value:8},
        {text:'Telegram',value:9},
      ],
    }
  },
  created() {
    this.cargarSeguimientos();
  },
  computed:{
    filterDatos(){
      let filtro = [];
      filtro = this.Seguimientos.filter(fila =>{
        let nombres = fila.nombres.toString().toLowerCase();
        let apellidos = fila.apellidos.toString().toLowerCase();
        let nombreCol = fila.colN.toString().toLowerCase();
        let apellidosCol = fila.colA.toString().toLowerCase();
        let comentario   = '';
        if (fila.comentario)
          comentario = fila.comentario.toString().toLowerCase();
        let search   = this.search.toLowerCase()
        //
        return nombres.includes(search) || apellidos.includes(search) || nombreCol.includes(search) ||
          apellidosCol.includes(search) || comentario.includes(search)
      });
      this.resultados = filtro.length;
      if (filtro.length > 0) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }
      return filtro
    },
  },
  methods:{
    cargarSeguimientos(){
      this.load = true;
      this.$axios.get('seguimientos').then((res)=>{
        this.load = false;
        this.Seguimientos = res.data.seguimientos
      })
    },
    selectSeguimiente(data){
      this.Seguimiento = data;
      this.vista       = 1;
    }
  }
}
</script>

<style scoped>
.titleTable{
  font-family: 'Rubik', sans-serif;
  font-size: 18px;
  font-weight: bold;
}
.titleAcciones{
  font-size: 10px;
  font-family: 'Rubik', sans-serif;
  color: #aaaaaa;
}
.titleBuscar{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
input{
  font-size: 14px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
.header div span{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  color: #7F828B;
}
.body div span{
  font-size: 10px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
table{
  width: 100%;
  border-collapse: collapse;
}
table thead tr th{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  color: #7F828B;
  text-align: start;
}
table tbody tr td{
  font-size: 11px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
  height: 22px;
  border-bottom: solid 1px #DADADA;
}
table tbody tr:hover{
  cursor: pointer;
  background-color: #f6f6f6;
}
.titleDatos{
  font-family: 'Rubik', sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #272727;
}
.subtitleDatos{
  font-family: 'Rubik', sans-serif;
  font-size: 11px;
  color: #3a3a3a;
}
</style>
