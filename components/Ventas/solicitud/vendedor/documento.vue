<template>
    <v-card class="pr-2 pl-2 pb-2 pt-2" flat>
        <h5>Documento de facturación</h5>
        <hr>
        <b-link @click="solicitarClave">Generar Solicitud</b-link>
        <v-container style="height: 530px; overflow-y: auto" v-if="url"
                     class="d-flex align-center justify-center rowsTable">
            <v-card height="180px" width="180px" color="red" dark @click="verDocumento">
                <v-card-title>Ver documento</v-card-title>
                <div class="d-flex justify-center">
                    <v-icon size="100">fa fa-file-pdf</v-icon>
                </div>
            </v-card>
        </v-container>
        <v-container v-else style="height: 530px; overflow-y: auto">
            <v-card-title>Subir solicitud de crédito del cliente</v-card-title>
            <v-file-input label="Solicitud escaneada" v-model="file"
                          accept="application/pdf"></v-file-input>

        </v-container>
        <v-card-actions class="d-flex justify-end" v-if="!url">
            <v-btn color="success" @click="registrarDocumento"
                   small>Subir Documento</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {ipcRenderer} from "electron";
    import Vue from "vue";
    export default {
        name: "documento",
        data(){
            return{
                file: null,
                url: ''
            }
        },
        computed:{
          user(){
            return this.$store.state.usuario;
          },
            EstadoVista(){
                return this.$store.state.solicitud_credito.EstadoVistaSolicitud;
            },
            Soli(){
                return this.$store.state.solicitud_credito.Solicitud;
            },
            dialogo:{
                get: function () {
                    return this.$store.state.solicitud_credito.dialogoSolicitud;
                },
                set: function (val) {
                    this.$store.commit('solicitud_credito/cambiarValorDialogoSolicitud', val);
                }
            },
        },
        created() {
            this.url = this.Soli.file;
        },
        methods:{
            notificacion(text, color){
                Vue.$toast.open({
                    message: text,
                    type: color,
                    position: 'bottom-left',
                    duration: 4000
                });
            },
          print(clave){
            let url = this.$axios.defaults.baseURL+'documentos/ventas/solicitud_credito/usuario='+this.user+'/solicitud='+this.Soli.codigo+'/'+clave
            ipcRenderer.send('pint_navegador', url);
            this.$store.commit('activarOverlay', false);
            this.dialogoArchivo = true;
          },
            registrarDocumento(){
                if (this.file){
                    this.dialogo = false;
                    this.$store.commit('tareas/cambiarValorVista', false);
                    this.$store.commit('activarOverlay', true);
                    let data = new FormData();
                    data.append('file', this.file);
                    data.append('id', this.Soli.id);
                    this.$axios({
                        method: 'post',
                        url:    'solicitud_credito/update_file',
                        data:   data,
                        headers:{
                            'Authorization': 'Bearer ' + this.$store.state.token,
                            'Content-Type': "multipart/form-data"
                        }
                    }).then((res)=>{
                        this.dialogo = true;
                        this.$store.commit('tareas/cambiarValorVista', true);
                        this.$store.commit('activarOverlay', false);
                        this.$store.commit('solicitud_credito/agregarFile', res.data.url);
                        this.url = res.data.url;
                        this.notificacion('Se registró exitosamente el documento.','success')
                    }).catch((error)=>{
                        this.dialogo = true;
                        this.$store.commit('tareas/cambiarValorVista', true);
                        this.$store.commit('activarOverlay', false);
                        this.notificacion('Hubo error al cargar el documento.','error')
                    })
                }else{
                    this.notificacion('No hay archivos para enviar.','error');
                }
            },
          solicitarClave(){
            this.$store.commit('activarOverlay', true);
            this.$axios.post('solicitar_clave_doucmento').then((res)=>{
              this.$store.commit('notificacion',{texto:'Cargando inventario', color:'success'});
              this.print(res.data.clave)
            }).catch((error)=>{
              this.$store.commit('activarOverlay', false);
              this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'danger'});
            })
          },
            verDocumento(){
                this.dialogo = false;
              this.$store.commit('tareas/cambiarValorVista', false);
                this.$store.commit('activarOverlay', true);
                this.$axios.post('leer_documento/',
                    {ubicacion: this.url}).then((res)=>{
                  this.$store.commit('tareas/cambiarValorVista', true);
                    if (res.status === 200){
                        ipcRenderer.send('open-nav', res.data.url);
                        this.$store.commit('activarOverlay', false);
                        this.dialogo = true;
                    }
                }).catch((error)=>{
                  this.$store.commit('tareas/cambiarValorVista', true);
                    this.$store.commit('activarOverlay', false);
                    this.dialogo = true;
                })
            }
        }
    }
</script>

<style scoped>
.rowsTable{
    cursor: pointer;
}
</style>
