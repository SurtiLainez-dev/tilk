<template>
    <v-card :disabled="EstadoVista" class="pr-2 pl-2 pb-2 pt-2" flat>
        <h5>Artículo</h5>
        <hr>
        <v-container>
            <v-row v-if="Soli.is_combo === 0" no-gutters>
                <v-col cols="5">
                    <v-card>
                        <h6 class="text-center">{{foto.titulo}}</h6>
                        <div class="d-flex justify-center pb-5">
                            <v-img contain :lazy-src="foto.src" max-height="250"
                                   max-width="250" :src="foto.src"></v-img>
                        </div>
                    </v-card>
                </v-col>
                <v-col cols="7">
                    <div class="pl-5">
                        <table class="rowsTable">
                            <tbody>
                            <tr>
                                <th>Nombre del artículo:</th>
                                <td><input type="text" disabled :value="Articulo.nombre_articulo"></td>
                            </tr>
                            <tr>
                                <th>Descripción corta:</th>
                                <td><input type="text" disabled :value="Articulo.descripcion_corta"></td>
                            </tr>
                            <tr>
                                <th>Marca:</th>
                                <td><input type="text" disabled :value="Articulo.marca.nombre"></td>
                            </tr>
                            <tr>
                                <th>Proveedor:</th>
                                <td><input type="text" disabled :value="Articulo.marca.proveedor.nombre"></td>
                            </tr>
                            <tr>
                                <th>Módelo:</th>
                                <td><input type="text" disabled :value="Articulo.modelo"></td>
                            </tr>
                            <tr>
                                <th>Código del sístema:</th>
                                <td><input type="text" disabled :value="Articulo.codigo_sistema"></td>
                            </tr>
                            <tr>
                                <th>Código del proveedor:</th>
                                <td><input type="text" disabled :value="Articulo.codigo_proveedor"></td>
                            </tr>
                            <tr>
                                <th>Familía:</th>
                                <td><input type="text" disabled :value="Articulo.sub_familia_articulo.familia_articulo.nombre"></td>
                            </tr>
                            <tr>
                                <th>Sub-familía:</th>
                                <td><input type="text" disabled :value="Articulo.sub_familia_articulo.nombre"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </v-col>
            </v-row>
            <v-simple-table v-else-if="Soli.is_combo === 1">
              <template>
                <thead>
                <tr><th colspan="7">Nombre del Combo</th></tr>
                </thead>
                <tbody>
                <tr><td colspan="7">{{Soli.combo.nombre}}</td></tr>
                </tbody>
                <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Cod. Sistema</th>
                  <th>Cod. Proveedor</th>
                  <th>Familia</th>
                  <th>Sub_Familia</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Soli.combo.detalle_combo">
                  <td>{{item.articulo.nombre_articulo}}</td>
                  <td>{{item.articulo.marca.nombre}}</td>
                  <td>{{item.articulo.marca.proveedor.nombre}}</td>
                  <td>{{item.articulo.codigo_sistema}}</td>
                  <td>{{item.articulo.codigo_proveedor}}</td>
                  <td>{{item.articulo.sub_familia_articulo.familia_articulo.nombre}}</td>
                  <td>{{item.articulo.sub_familia_articulo.nombre}}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
        </v-container>
    </v-card>
</template>

<script>
    export default {
        name: "articulo",
        computed:{
          Soli:{
            get:function () {
              return this.$store.state.solicitud_credito.Solicitud;
            }
          },
            EstadoVista(){
                return this.$store.state.solicitud_credito.EstadoVistaSolicitud;
            },
            Articulo(){
                return this.$store.state.solicitud_credito.Solicitud.articulo;
            },
            Imgs(){
              let fotos = [];
              if (this.Soli.is_combo === 1){
                return [];
              }else
                return this.$store.state.solicitud_credito.Solicitud.articulo.fotos_articulos;
            },
            View_Tarea: {
                get: function () {
                    return this.$store.state.tareas.Tareas_view;
                },
                set: function (val) {
                    this.$store.commit('tareas/cambiarValorVista', val)
                }
            },
        },
        data(){
            return{
                foto:{
                    src: null,
                    titulo: ''
                }
            }
        },
        created() {
            if (this.Soli.is_combo === 0){
              this.Imgs.forEach( (i) => {
                if (i.isPrincipal == 1){
                  console.log(i)
                  this.foto.src = i.url;
                  this.foto.titulo = i.detalle
                }
              })
              if (!this.foto.src){
                this.foto.src = 'https://ign-surti.nyc3.digitaloceanspaces.com/no-found.png';
                this.foto.titulo = 'Foto no encontrada del artículo'
              }
            }
        }
    }
</script>

<style scoped>
    table{
        width: 95%;
    }
    table tbody{
        font-size: 12px;
    }
    table tbody tr td input[type=text], select{
        width: 100%;
        box-sizing: border-box;
        padding: 2px 10px;
        margin: 1px;
        border: 1px solid #ccc;
        border-radius: 1px;
        cursor: pointer;
    }
    table tbody tr td input:hover{
        background-color: #FFF !important;
    }
    table tbody tr:hover{
        background-color: #F4F4F4;
    }
    table thead{
        border-bottom: solid 1px #47494e;
    }
    .rowsTable{
        cursor: pointer;
    }
</style>
