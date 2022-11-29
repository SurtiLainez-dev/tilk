<template>
    <v-container>
        <v-toolbar flat color="teal darken-2" rounded dark>
            <v-toolbar-title>Solicitud de crédito de {{Solicitud.cliente.nombres}} {{Solicitud.cliente.apellidos}} - {{Solicitud.cliente.identidad}}</v-toolbar-title>
        </v-toolbar>
        <v-tabs vertical class="grey lighten-5">
            <v-tab @click="cambiarVista('Datos del cliente')">Cliente</v-tab>
            <v-tab @click="cambiarVista('Datos del artículo')">Artículo</v-tab>
            <v-tab @click="cambiarVista('Datos del precio')">Precio</v-tab>
            <v-tab @click="cambiarVista('Referencias/Avales')">Referencias</v-tab>
            <v-tab @click="cambiarVista('Comentarios')">Comentarios</v-tab>
            <v-tab @click="cambiarVista('Tareas')">Tareas</v-tab>
            <v-tab >Perfil</v-tab>

            <v-tab-item>
                <v-card class="pl-5 pr-5 pb-5">
                    <v-card flat :disabled="cardDisabled">
                        <v-row no-gutters>
                            <v-col cols="8"><v-card-title>{{titulo}}</v-card-title></v-col>
                            <v-col cols="4" class="d-flex align-center justify-end">
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="Tareas.dialogo = true"
                                               color="indigo" x-small fab dark>
                                            <v-icon>fa fa-tasks</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Agregar tarea al creador</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoComentario = true"
                                               color="success" x-small fab dark>
                                            <v-icon>fa fa-comments</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Agregar comentario a la solicitud</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoDecision = true"
                                               color="deep-orange" x-small fab :disabled="!btnRegistro">
                                            <v-icon color="white">fa fa-clipboard-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Tomar decisión sobre solicitud</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-divider></v-divider>
                    <v-row no-gutters>
                        <v-col>
                            <table>
                                <tbody>
                                <tr>
                                    <th>Nombre completo:</th>
                                    <td><input type="text" disabled :value="Cliente.nombres+' '+Cliente.apellidos"></td>
                                </tr>
                                <tr>
                                    <th>Identidad:</th>
                                    <td><input type="text" disabled :value="Cliente.identidad"></td>
                                </tr>
                                <tr>
                                    <th>Rtn:</th>
                                    <td><input type="text" disabled :value="Cliente.rtn"></td>
                                </tr>
                                <tr>
                                    <th>Fecha de nacimiento:</th>
                                    <td v-if="Cliente.fecha_nacimiento">{{Cliente.fecha_nacimiento.split('-')[2]}}/{{Cliente.fecha_nacimiento.split('-')[1]}}/{{Cliente.fecha_nacimiento.split('-')[0]}}</td>
                                </tr>
                                <tr>
                                    <th>Correo eléctronico:</th>
                                    <td><input type="text" disabled :value="Cliente.email"></td>
                                </tr>
                                </tbody>
                            </table>
                        </v-col>
                        <v-col>
                            <table>
                                <tbody>
                                <tr>
                                    <th>Nacionalidad:</th>
                                    <td><input type="text" disabled :value="Cliente.nacionalidad"></td>
                                </tr>
                                <tr>
                                    <th>Trabaja:</th>
                                    <td>
                                        <v-chip small v-if="Cliente.is_trabaja === 1" color="success">Sí</v-chip>
                                        <v-chip small v-else color="red">No</v-chip>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Lugar de trabajo:</th>
                                    <td><input type="text" disabled :value="Cliente.empresa_trabaja"></td>
                                </tr>
                                <tr>
                                    <th>Salario:</th>
                                    <td><input type="text" disabled :value="'L '+Cliente.nacionalidad"></td>
                                </tr>
                                <tr>
                                    <th>Casa propia:</th>
                                    <td>
                                        <v-chip small v-if="Cliente.is_casa === 1" color="success">Sí</v-chip>
                                        <v-chip small v-else color="red">No</v-chip>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </v-col>
                    </v-row>
                    <br>
                    <v-row no-gutters>
                        <v-col>
                            <small>Detalles</small>
                            <v-divider></v-divider>
                            <table>
                                <tbody>
                                <tr v-for="item in JSON.parse(Cliente.detalles)">
                                    <th>{{item.detalle}}:</th>
                                    <td><input type="text" disabled :value="item.val"></td>
                                </tr>
                                </tbody>
                            </table>
                        </v-col>
                        <v-col>
                            <small>Archivos</small>
                            <v-divider></v-divider>
                            <table>
                                <tbody>
                                <tr v-for="item in JSON.parse(Cliente.archivos)">
                                    <th>{{item.detalle}}:</th>
                                    <td>
                                        <b-link @click="verDoucumeto(item.dir, 1)" v-if="item.dir">ver {{item.detalle}}</b-link>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </v-col>
                        <v-col>
                            <small>Telefonos</small>
                            <v-divider></v-divider>
                            <table>
                                <tbody>
                                <tr v-for="item in JSON.parse(Cliente.telefonos)">
                                    <th>{{item.detalle}}</th>
                                    <td>{{item.num}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </v-col>
                    </v-row>
                    <br>
                    <v-row no-gutters>
                        <v-col>
                            <small>Direcciones</small>
                            <table>
                                <tbody>
                                <tr>
                                    <th>Departamento</th>
                                    <th>Municipio</th>
                                    <th>Ciudad/Aldea/Caserio</th>
                                    <th>Colonia</th>
                                    <th>Dirección</th>
                                </tr>
                                </tbody>
                                <tbody>
                                <tr v-for="item in this.Direcciones">
                                    <td width="20%">
                                        <select class="select-css" disabled v-model="item.departamento">
                                            <option v-for="i in Departamentos" :value="i.id">{{i.nombre}}</option>
                                        </select>
                                    </td>
                                    <td width="20%">
                                        <select class="select-css" v-model="item.municipio" disabled>
                                            <option v-for="i in item.Municipios" :value="i.id">{{i.nombre}}</option>
                                        </select>
                                    </td>
                                    <td width="20%">
                                        <select class="select-css" v-model="item.ciudad" disabled>
                                            <option v-for="i in item.Ciudades" :value="i.id">{{i.nombres}}</option>
                                        </select>
                                    </td>
                                    <td width="20%">
                                        <select class="select-css" v-model="item.colonia" disabled>
                                            <option v-for="i in item.Colonias" :value="i.id">{{i.nombre}}</option>
                                        </select>
                                    </td>
                                    <td width="40%">
                                        {{item.detalle}}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card class="pl-5 pr-5 pb-5">
                    <v-card :disabled="cardDisabled" flat>
                        <v-row no-gutters>
                            <v-col cols="8"><v-card-title>{{titulo}}</v-card-title></v-col>
                            <v-col cols="4" class="d-flex align-center justify-end">
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="Tareas.dialogo = true"
                                               color="indigo" x-small fab dark>
                                            <v-icon>fa fa-tasks</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Agregar tarea al creador</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoComentario = true"
                                               color="success" x-small fab dark>
                                            <v-icon>fa fa-comments</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Agregar comentario a la solicitud</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoDecision = true"
                                               color="deep-orange" x-small fab :disabled="!btnRegistro">
                                            <v-icon color="white">fa fa-clipboard-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Tomar decisión sobre solicitud</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-divider></v-divider>
                    <v-row no-gutters>
                        <v-col cols="8">
                            <table class="rowsTable">
                                <tbody>
                                <tr>
                                    <th>Nombre:</th>
                                    <td><input type="text" disabled :value="Articulo.nombre_articulo"></td>
                                </tr>
                                <tr>
                                    <th>Descripción:</th>
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
                                    <th>Familía:</th>
                                    <td><input type="text" disabled :value="Articulo.sub_familia_articulo.familia_articulo.nombre"></td>
                                </tr>
                                <tr>
                                    <th>Sub-familía:</th>
                                    <td><input type="text" disabled :value="Articulo.sub_familia_articulo.nombre"></td>
                                </tr>
                                <tr>
                                    <th>Código del sistema:</th>
                                    <td><input type="text" disabled :value="Articulo.codigo_sistema"></td>
                                </tr>
                                <tr>
                                    <th>Código del proveedor:</th>
                                    <td><input type="text" disabled :value="Articulo.codigo_proveedor"></td>
                                </tr>
                                </tbody>
                            </table>
                        </v-col>
                    </v-row>
                    <br>
                    <small><strong>Datos de la solicitud</strong></small>
                    <v-divider></v-divider>
                    <v-row no-gutters>
                        <v-col cols="8">
                            <table class="rowsTable">
                                <tbody>
                                <tr>
                                    <th>Código:</th>
                                    <td>
                                        <input type="text" :value="Solicitud.codigo" disabled>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Estado:</th>
                                    <td>
                                        <v-chip x-small dark color="warning" v-if="Solicitud.estado === 1">Pendiente revisión</v-chip>
                                        <v-chip x-small dark color="indigo" v-if="Solicitud.estado === 2">Falta de documentos</v-chip>
                                        <v-chip x-small dark color="red" v-if="Solicitud.estado === 3">Rechazada</v-chip>
                                        <v-chip x-small dark color="success" v-if="Solicitud.estado === 4">Aprobado</v-chip>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Creado por:</th>
                                    <td>
                                        <input type="text" disabled :value="Solicitud.user.colaborador.nombres+' '+Solicitud.user.colaborador.apellidos">
                                    </td>
                                </tr>
                                <tr>
                                    <th>Creador el:</th>
                                    <td>
                                        <input type="text" disabled :value="Solicitud.fecha_creado">
                                    </td>
                                </tr>
                                  <tr>
                                    <th>Solicitúd firmada</th>
                                    <td v-if="Solicitud.file" @click="verDoucumeto(Solicitud.file, 2)"><b-link>Ver solicitúd</b-link></td>
                                    <td v-else>No se ha cargado</td>
                                  </tr>
                                </tbody>
                            </table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-tab-item>


            <v-tab-item>
                <v-card class="pl-5 pr-5 pb-5">
                    <v-card flat :disabled="cardDisabled">
                        <v-row no-gutters>
                            <v-col cols="8"><v-card-title>{{titulo}}</v-card-title></v-col>
                            <v-col cols="4" class="d-flex align-center justify-end">
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="Tareas.dialogo = true"
                                               color="indigo" x-small fab dark>
                                            <v-icon>fa fa-tasks</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Agregar tarea al creador</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoComentario = true"
                                               color="success" x-small fab dark>
                                            <v-icon>fa fa-comments</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Agregar comentario a la solicitud</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoDecision = true"
                                               color="deep-orange" x-small fab :disabled="!btnRegistro">
                                            <v-icon color="white">fa fa-clipboard-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Tomar decisión sobre solicitud</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-divider></v-divider>
                    <v-row>
                        <v-col>
                            <table class="rowsTable">
                                <tbody>
                                <tr>
                                    <th>Forma de pago:</th>
                                    <td><input type="text" disabled :value="Solicitud.forma_pago"></td>
                                </tr>
                                <tr>
                                    <th>Tiempo del crédito:</th>
                                    <td><input type="text" disabled :value="Solicitud.tiempo+' meses'"></td>
                                </tr>
                                <tr>
                                    <th>Prima: </th>
                                    <td><input type="text" disabled :value="'L'+Solicitud.prima"></td>
                                </tr>
                                </tbody>
                            </table>
                        </v-col>
                        <v-col>
                            <table>
                                <tbody>
                                <tr>
                                    <th>Cuota:</th>
                                    <td><input type="text" disabled :value="'L'+Solicitud.cuota"></td>
                                </tr>
                                <tr>
                                    <th>Saldo a financiar:</th>
                                    <td><input type="text" disabled :value="'L'+Solicitud.saldo_financiar"></td>
                                </tr>
                                <tr>
                                    <th>Precio de contado:</th>
                                    <td><input type="text" disabled :value="'L'+Solicitud.precio_contado"></td>
                                </tr>
                                </tbody>
                            </table>
                        </v-col>
                    </v-row>
                    <br>
                    <b-link v-if="Articulo.is_motocicleta === 0">Quitar traspaso de la prima</b-link>
                    <br>
                    <small>Tabla de pagos</small>
                    <hr>
                    <table class="rowsTable">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Cuota</th>
                            <th>Fecha de pago</th>
                            <th>Saldo</th>
                            <th>Nuevo Saldo</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in Precio.pagos">
                            <td>{{item.num}}</td>
                            <td>L {{item.cuota}}</td>
                            <td>L {{item.fecha}}</td>
                            <td>L {{item.saldo}}</td>
                            <td>L {{item.saldo_a}}</td>
                        </tr>
                        </tbody>
                    </table>
                </v-card>
            </v-tab-item>


            <v-tab-item>
                <v-card class="pl-5 pr-5 pb-5">
                    <v-card flat :disabled="cardDisabled">
                        <v-row no-gutters>
                            <v-col cols="8"><v-card-title>{{titulo}}</v-card-title></v-col>
                            <v-col cols="4" class="d-flex align-center justify-end">
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="Tareas.dialogo = true"
                                               color="indigo" x-small fab dark>
                                            <v-icon>fa fa-tasks</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Agregar tarea al creador</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoComentario = true"
                                               color="success" x-small fab dark>
                                            <v-icon>fa fa-comments</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Agregar comentario a la solicitud</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoDecision = true"
                                               color="deep-orange" x-small fab :disabled="!btnRegistro">
                                            <v-icon color="white">fa fa-clipboard-check</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Tomar decisión sobre solicitud</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-divider></v-divider>
                    <table class="rowsTable">
                        <thead>
                        <tr>
                            <th>Nombre completo</th>
                            <th>Parentesco</th>
                            <th>Dirección</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in Ref" @click="abrirSideComentarioReferencia(item)">
                            <td >{{item.nombre}}</td>
                            <td >{{item.parentesco}}</td>
                            <td >{{item.direccion}}</td>
                        </tr>
                        </tbody>
                    </table>
                    <br>
                    <small>Avales</small>
                    <v-divider></v-divider>
                    <table class="rowsTable">
                        <thead>
                        <tr>
                            <th>Identidad</th>
                            <th>Nombre Completo</th>
                            <th>Solicitúd</th>
                            <th class="d-flex justify-center">Documentos</th>
                            <th>Rechazar</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-if="Avales" v-for="item in Avales">
                                <td>{{item.cliente.identidad}}</td>
                                <td>{{item.cliente.nombres}} {{item.cliente.apellidos}}</td>
                                <td>
                                    <b-link v-if="item.documento" @click="verDoucumeto(item.documento, 1)">Ver Solicitúd</b-link>
                                    <span v-else>No hay documento aún</span>
                                </td>
                              <td class="d-flex justify-center">
                                <v-btn width="22px" height="22px" @click="abrirDialogoArchivos(item.cliente)" text fab color="red">
                                  <v-icon size="15">fa fa-file-pdf</v-icon>
                                </v-btn>
                              </td>
                              <td>
                                <v-tooltip top>
                                  <template v-slot:activator="{on, attrs}">
                                    <v-btn v-if="item.estado === 1" height="25" width="25" color="red" v-on="on" v-bind="attrs" text
                                           dark fab @click="declinarAval(item)"><v-icon size="10">fa fa-times</v-icon></v-btn>
                                    <v-btn v-if="item.estado === 0" height="25" width="25" color="success" v-on="on" v-bind="attrs" text
                                           dark fab @click="declinarAval(item)"><v-icon size="10">fa fa-check</v-icon></v-btn>
                                  </template>
                                  <span v-if="item.estado === 0">Si este aval fue declinado, lo puedes aceptar nuevamente.</span>
                                  <span v-else-if="item.estado === 1">Declinar aval.</span>
                                </v-tooltip>
                              </td>

                            </tr>
                        </tbody>
                    </table>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card flat :disabled="cardDisabled">
                    <v-row no-gutters>
                        <v-col cols="8"><v-card-title>{{titulo}}</v-card-title></v-col>
                        <v-col cols="4" class="d-flex align-center justify-end">
                            <v-tooltip top>
                                <template v-slot:activator="{on, attrs}">
                                    <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="Tareas.dialogo = true"
                                           color="indigo" x-small fab dark>
                                        <v-icon>fa fa-tasks</v-icon>
                                    </v-btn>
                                </template>
                                <span>Agregar tarea al creador</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{on, attrs}">
                                    <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoComentario = true"
                                           color="success" x-small fab dark>
                                        <v-icon>fa fa-comments</v-icon>
                                    </v-btn>
                                </template>
                                <span>Agregar comentario a la solicitud</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{on, attrs}">
                                    <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoDecision = true"
                                           color="deep-orange" x-small fab :disabled="!btnRegistro">
                                        <v-icon color="white">fa fa-clipboard-check</v-icon>
                                    </v-btn>
                                </template>
                                <span>Tomar decisión sobre solicitud</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                </v-card>
                <v-divider></v-divider>
                <v-container class="d-flex justify-center">
                    <v-card height="600px" width="60%" color="teal darken-1" style="overflow-y: auto">
                        <v-card class="ma-2" v-for="item in CM">
                            <v-row no-gutters>
                                <v-col cols="10">
                                    <small class="pl-3"><strong>{{item.titulo}}</strong></small>
                                </v-col>
                                <v-col cols="2" class="d-flex justify-end">
                                    <v-btn class="ma-1" color="red" @click="removeComentario(item)"
                                           text fab width="22px" height="22px">
                                        <v-icon size="15">fa fa-times</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <p style="font-size: 12px" class="pl-2 pr-2 pb-2">{{item.detalle}}</p>
                        </v-card>
                    </v-card>
                </v-container>
            </v-tab-item>
            <v-tab-item>
                <v-card flat :disabled="cardDisabled">
                    <v-row no-gutters>
                        <v-col cols="8"><v-card-title>{{titulo}}</v-card-title></v-col>
                        <v-col cols="4" class="d-flex align-center justify-end">
                            <v-tooltip top>
                                <template v-slot:activator="{on, attrs}">
                                    <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="Tareas.dialogo = true"
                                           color="indigo" x-small fab dark>
                                        <v-icon>fa fa-tasks</v-icon>
                                    </v-btn>
                                </template>
                                <span>Agregar tarea al creador</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{on, attrs}">
                                    <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoComentario = true"
                                           color="success" x-small fab dark>
                                        <v-icon>fa fa-comments</v-icon>
                                    </v-btn>
                                </template>
                                <span>Agregar comentario a la solicitud</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{on, attrs}">
                                    <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="dialogoDecision = true"
                                           color="deep-orange" x-small fab :disabled="!btnRegistro">
                                        <v-icon color="white">fa fa-clipboard-check</v-icon>
                                    </v-btn>
                                </template>
                                <span>Tomar decisión sobre solicitud</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                </v-card>
                <v-divider></v-divider>
                <v-container>
                    <v-container class="d-flex justify-center">
                        <v-card height="600px" width="60%" color="teal darken-1" style="overflow-y: auto">
                            <b-card no-body class="ma-2" v-for="item in Tareas.data">
                                <v-row no-gutters class="pt-2 pr-2">
                                    <v-col cols="10" class="d-flex align-center">
                                        <b-card-text style="font-size: 12px" class="pl-2 pr-2 pb-2">{{item.detalle}}</b-card-text>
                                    </v-col>
                                    <v-col cols="1">
                                        <div v-if="item.estado" style="background-color: green; height: 20px; width: 20px; border-radius: 10px 10px 10px 10px;"></div>
                                        <div v-else style="background-color: red; height: 20px; width: 20px; border-radius: 10px 10px 10px 10px;"></div>
                                    </v-col>
                                    <v-col cols="1" class="d-flex justify-center">
                                        <v-btn color="red" width="20px" height="20px" fab x-small @click="removeTarea(item)"
                                               text><v-icon size="15">fa fa-times</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </b-card>
                        </v-card>
                    </v-container>
                </v-container>
            </v-tab-item>

            <v-tab-item>
              <cliente/>
            </v-tab-item>
        </v-tabs>


        <v-dialog v-model="sideComentarioReferencia" width="50%">
            <v-card class="pl-5 pr-5" v-if="dataComentarioReferencia">
                <v-row>
                    <v-col cols="1" class="d-flex align-center">
                        <v-btn class="ma-2" dark fab x-small text color="red" @click="sideComentarioReferencia = false">
                            <v-icon>fa fa-times</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="11" class="d-flex justify-center align-center"><h4>Referencia {{dataComentarioReferencia.nombre}}</h4></v-col>
                </v-row>
                <div class="d-flex justify-center pb-5">
                    <table class="rowsTable">
                        <tbody>
                        <tr>
                            <th>Nombre completo:</th>
                            <td>{{dataComentarioReferencia.nombre}}</td>
                        </tr>
                        <tr>
                            <th>Telefono:</th>
                            <td>{{dataComentarioReferencia.telefono}}</td>
                        </tr>
                        <tr>
                            <th>Parentesco:</th>
                            <td>{{dataComentarioReferencia.parentesco}}</td>
                        </tr>
                        <tr>
                            <th>Dirección:</th>
                            <td>{{dataComentarioReferencia.direccion}}</td>
                        </tr>
                        </tbody>
                    </table>
                    <br>
                </div>
                <v-textarea v-model="dataComentarioReferencia.comentario" filled label="Comentarios sobre el cliente"></v-textarea>

                <v-card-actions class="d-flex justify-end">
                    <b-checkbox v-model="dataComentarioReferencia.estado">Referencia aceptada</b-checkbox>
                    <v-btn class="ma-2" color="success" @click="sideComentarioReferencia = false" small>Cerrar información de la referencia</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogoArchivos" width="40%">
            <v-card class="pl-5 pr-5">
                <v-card-title>Archivos</v-card-title>
                <v-divider></v-divider>
                <table>
                    <tbody>
                    <tr v-for="item in dataArchivos">
                        <th>{{item.detalle}}:</th>
                        <td>
                            <b-link @click="verDoucumeto(item.dir, 2)" v-if="item.dir">ver {{item.detalle}}</b-link>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <v-divider></v-divider>
                <v-card-actions class="d-flex justify-end">
                    <v-btn color="success" dark small @click="dialogoArchivos = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogoComentario" width="30%">
            <v-card class="pl-5 pr-5">
                <v-card-title>Nuevo comentario</v-card-title>
                <v-divider></v-divider>
                <v-form v-on:submit.prevent>
                    <v-text-field label="Título" @keyup.enter="$refs.campoDetalleComentario.focus()"
                                  filled v-model="Comentario.titulo" dense></v-text-field>
                    <v-textarea ref="campoDetalleComentario" label="Detalle" filled v-model="Comentario.detalle" dense></v-textarea>
                </v-form>
                <v-divider></v-divider>
                <v-card-actions class="d-flex justify-end">
                    <v-btn class="ma-2" color="warning" small dark @click="dialogoComentario = false">Cancelar</v-btn>
                    <v-btn class="ma-2" color="success" small dark @click="addComentario">Registrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="Tareas.dialogo" width="25%">
            <v-card class="pl-5 pr-5">
                <v-card-title>Agregando Tarea</v-card-title>
                <v-divider></v-divider>
                <v-form v-on:submit.prevent>
                    <v-textarea v-model="Tareas.detalle" filled></v-textarea>
                </v-form>
                <v-card-actions class="d-flex justify-end">
                    <v-btn color="warning" dark small @click="Tareas.dialogo = false">Cerrar</v-btn>
                    <v-btn color="success" dark small @click="addTareas">Crear Tarea</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogoDecision" width="50%">
            <v-card class="pl-5 pr-5">
                <v-card-title>Decisión de la solicitud de crédito</v-card-title>
                <v-divider></v-divider>
                    <small><strong>Comentarios de las referencias</strong></small>
                <table class="rowsTable">
                    <tbody>
                    <tr v-for="item in Ref">
                        <th>{{item.nombre}}</th>
                        <td>{{item.comentario}}</td>
                        <td><b-checkbox v-model="item.estado" disabled></b-checkbox></td>
                    </tr>
                    </tbody>
                </table>
                <v-divider></v-divider>
                <small><strong>Comentarios</strong></small>
                <table>
                    <tbody>
                    <tr v-for="item in CM">
                        <th>{{item.titulo}}</th>
                        <td>{{item.detalle}}</td>
                    </tr>
                    </tbody>
                </table>
                <v-divider></v-divider>
                <small><strong>Tareas</strong></small>
                <table>
                    <tbody class="rowsTable">
                    <tr v-for="item in Tareas.data">
                        <th>{{item.detalle}}</th>
                    </tr>
                    </tbody>
                </table>
                <v-divider></v-divider>
                <v-card-actions class="d-flex justify-end">
                    <v-btn class="ma-2" color="warning"  small dark @click="dialogoDecision = false">Cerrar</v-btn>
                    <v-btn class="ma-2" color="red" :disabled="btnEnvio" small dark @click="validarEnvio(3)">Rechazar solicitud</v-btn>
                    <v-btn class="ma-2" color="indigo" :disabled="btnEnvio" small dark @click="validarEnvio(2)">Revisión de solicitud</v-btn>
                    <v-btn class="ma-2" color="success" :disabled="btnEnvio" small dark @click="validarEnvio(4)">Aceptar solicitud</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogoTraspaso">
          <v-card>
            <v-toolbar flat dense color="grey lighten-3">
              <v-card-title>Monto del traspaso</v-card-title>
            </v-toolbar>

            <v-container>
              <v-form ref="FormTraspaso" v-on:submit.prevent>
                <v-text-field label="Monto del traspaso" dense v-model="traspaso"></v-text-field>
              </v-form>
              <v-card-actions class="d-flex justify-end">
                <v-btn color="success" dark tile small >Registrar</v-btn>
              </v-card-actions>
            </v-container>
          </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import {ipcRenderer} from "electron";
    import Vue from "vue";
    import _cliente from "@/pages/clientes/_cliente";
    export default {
        components:{cliente:_cliente},
        name: "solicitud",
        data(){
            return{
                traspaso: 0,
                dialogoTraspaso: false,
                cardDisabled: false,
                btnRegistro: true,
                dialogoDecision: false,
                tab: null,
                titulo: 'Datos del cliente',
                Departamentos: [],
                Ref: [],
                sideComentarioReferencia: false,
                dataComentarioReferencia: null,
                dialogoArchivos: false,
                dataArchivos:    null,
                dialogoComentario: false,
                Comentario:{
                    titulo: '',
                    detalle: '',
                },
                CM: [],
                Tareas:{
                    data: [],
                    dialogo: false,
                    detalle: '',
                },
                ID: null,
                btnEnvio: false
            }
        },
        computed:{
            Solicitud(){
                return this.$store.state.solicitud_credito.Solicitud;
            },
            Cliente(){
              this.$route.params.cliente = this.$store.state.solicitud_credito.Solicitud.cliente.id
              return this.$store.state.solicitud_credito.Solicitud.cliente;
            },
            Direcciones:{
                get:function () {
                    return JSON.parse(this.$store.state.solicitud_credito.Solicitud.cliente.direcciones);
                }
            },
            Articulo(){
                return this.$store.state.solicitud_credito.Solicitud.articulo;
            },
            Precio(){
                return JSON.parse(this.$store.state.solicitud_credito.Solicitud.detalles_precio);
            },
            Referencias(){
                return JSON.parse(this.$store.state.solicitud_credito.Solicitud.referencias);
            },
            Avales(){
                return this.$store.state.solicitud_credito.Solicitud.aval_solicituds;
            },
            Comentarios(){
                if (this.$store.state.solicitud_credito.Solicitud.comentarios)
                    return JSON.parse(this.$store.state.solicitud_credito.Solicitud.comentarios);
                else
                    return [];
            },
            Tareass(){
                if (this.$store.state.solicitud_credito.Solicitud.tareas)
                    return JSON.parse(this.$store.state.solicitud_credito.Solicitud.tareas);
                else
                    return [];
            }
        },
        created() {
            if (this.Solicitud.estado < 3)
                this.cardDisabled = false;
            else
                this.cardDisabled = true;
            this.cargarDepartamentos();
            this.cargarDirecciones(this.Direcciones);
            this.Ref = this.Referencias;
            this.CM  = this.Comentarios;
            this.ID  = this.Solicitud.id;
            this.Tareas.data = this.Tareass;
        },
        methods:{
            addComentario(){
                let titulo;
                if (this.Comentario.titulo.length > 0)
                    titulo = this.Comentario.titulo;
                else
                    titulo = `Comentario ${parseInt(this.Comentarios.length + parseInt(1))}`;

                this.CM.push(
                    {
                        "titulo":  titulo.toUpperCase(),
                        "detalle": this.Comentario.detalle.toUpperCase(),
                        "key":     this.Comentarios.length,
                        "ingresado":  false
                    }
                );

                this.dialogoComentario = false;
                this.notificacion('Se ha agregado el comentario exitosamente','success');
                this.Comentario.titulo = '';
                this.Comentario.detalle = '';
            },
            addTareas(){
                this.Tareas.data.push(
                    {
                        "detalle":   this.Tareas.detalle.toUpperCase(),
                        "key":       this.Tareas.data.length,
                        "estado":    false,
                        "ingresado": false
                    }
                );
                this.Tareas.dialogo = false;
                this.notificacion('La tarea se ha agregado exitosamente','success');
                this.Tareas.detalle = '';
            },
            abrirDialogoArchivos(item){
                if (item.archivos)
                    this.dataArchivos = JSON.parse(item.archivos);
                this.dialogoArchivos = true
            },
            abrirSideComentarioReferencia(item){
                  this.sideComentarioReferencia = true;
                  this.dataComentarioReferencia = item;
            },
            cambiarVista(titulo){
                this.titulo = titulo;
            },
            cargarCiudades: function (item) {
                this.$axios.get('/ciudades/'+item.municipio,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    item.Ciudades = res.data.ciudades;
                })
            },
            cargarColonias: function (item) {
                this.$axios.get('/colonias/'+item.ciudad,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    item.Colonias = res.data.colonias;
                })
            },
            cargarDepartamentos(){
                this.$axios.get('/departamentos',{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    this.Departamentos = res.data.depto
                })
            },
            cargarDirecciones(direcciones){
                direcciones.forEach( (i) => {
                    this.cargarMunicipios(i);
                    this.cargarCiudades(i);
                    this.cargarColonias(i)
                })
            },
            cargarMunicipios: function (item) {
                this.$axios.get('/municipios/'+item.departamento,{
                    headers:{
                        'Authorization': 'Bearer '+ this.$store.state.token
                    }
                }).then((res)=>{
                    console.log(res.data)
                    console.log(item)
                    item.Municipios = res.data.municipios;
                    console.log(item)
                })
            },
            declinarAval(data){
              this.$store.commit('activarOverlay', true);
              this.$axios.post('venta/declinar_aval',{
                aval: data.id
              }).then((res)=>{
                this.$store.commit('activarOverlay', false);
                this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
              }).catch((error)=>{
                this.$store.commit('activarOverlay', false);
                this.$store.commit('notificacion', {texto:'Hubo un error en el servidor', color:'success'});
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
            registrarSoliitud(tipo){
                this.btnEnvio = true;
                this.dialogoDecision = false;
                this.CM.forEach( (i) => {
                    i.ingresado = true;
                });
                this.$store.commit('tareas/cambiarValorVista', false);
                this.$store.commit('activarOverlay', true);
                this.$axios.put('solicitud_credito/'+this.ID,{
                    estado:      tipo,
                    comentarios: JSON.stringify(this.CM),
                    tareas:      this.Tareas.data,
                    referencias: JSON.stringify(this.Ref)
                }).then((res)=>{
                    this.$store.commit('tareas/cambiarValorVista', true);
                    this.$store.commit('activarOverlay', false);
                    this.btnRegistro = false;
                    this.notificacion('Se han registrado los datos de solicitud exitosamente','success');
                    this.$store.commit('solicitud_credito/cargarSolicitudes');
                    this.notificacion('Para ver los cambios actualizados salga y vuelva anetrar.');
                }).catch((error)=>{
                    this.$store.commit('tareas/cambiarValorVista', true);
                    this.$store.commit('activarOverlay', false);
                    this.btnEnvio = false;
                })
            },
            removeComentario(data){
                let item = 0;
                if (!data.ingresado){
                    this.CM.splice(data.key, 1);
                    this.CM.forEach( (i) => {
                        i.key = item;
                        item++;
                    })
                }
            },
            removeTarea(data){
                console.log(data)
                let item = 0;
                if (!data.ingresado){
                    this.Tareas.data.splice(data.fila, 1);
                    this.Tareas.data.forEach( (i) => {
                        i.key = item;
                        item++;
                    })
                }
            },
            validarEnvio(tipo){
                if (tipo === 4) {
                    if (this.validarReferencias()) {
                        this.registrarSoliitud(tipo);
                    }
                }else{
                    this.registrarSoliitud(tipo);
                }
            },
            validarReferencias(){
                let cont = 0;
                this.Ref.forEach( (i) => {
                    if (i.estado)
                        cont++;
                });

                if (cont >= 4)
                    return true;
                else{
                    this.notificacion('Tienes que calificar como buena minimo 4 referencias','warning');
                    return  false;
                }

            },
            verDoucumeto(dir, tipo){
                if (tipo === 2)
                    this.dialogoArchivos = false;

                this.$store.commit('activarOverlay', true);
                this.$store.commit('tareas/cambiarValorVista', false);
                this.$axios.post('leer_documento/', {
                    ubicacion: dir
                }).then((res)=>{
                    if (res.status === 200){
                        this.$store.commit('tareas/cambiarValorVista', true);
                        ipcRenderer.send('open-nav', res.data.url);
                        this.$store.commit('activarOverlay', false);
                        if (tipo === 2)
                            this.dialogoArchivos = false;
                    }
                }).catch((error)=>{
                    this.$store.commit('tareas/cambiarValorVista', true);
                    this.$store.commit('activarOverlay', false);
                    if (tipo === 2)
                        this.dialogoArchivos = false;
                })
            }
        }
    }
</script>

<style scoped>
    .rowsTable{
        cursor: pointer;
    }
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
        background-color: #cccccc;
    }
    .contenedorTable{
        height: 400px;
        overflow-y: auto;
    }
    table thead{
        border-bottom: solid 1px #47494e;
    }
    .select-css {
        display: block;
        font-size: 12px;
        font-weight: 400;
        color: #444;
        line-height: 1.3;
        max-width: 100%;
        box-sizing: border-box;
        border: 1px solid #aaa;
        box-shadow: 0 1px 0 1px rgba(0,0,0,.03);
        border-radius: .3em;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        background-color: #fff;
        background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
        linear-gradient(to bottom, #ffffff 0%,#f7f7f7 100%);
        background-repeat: no-repeat, repeat;
        background-position: right .7em top 50%, 0 0;
        background-size: .65em auto, 100%;
    }
</style>
