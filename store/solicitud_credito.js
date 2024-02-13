import Vue from "vue"
export const state = () => ({
    token: null,
    data:  {
        Precio:               null,
        Articulo:             null,
        cliente_id:           null,
        detalles_precio:      [],
        financiaminto:        0,
        total_financiamiento: 0,
        prima:                0,
        meses:                0,
        forma_pago:           0,
        articulo_id:          null,
        detalles_articulos:   [],
        referencias:          [],
        avales:               [],
        observacion_precio:   ''
    },
    SolicitudCredito_view:  false,
    SolicitudCredito_vista: 1,
    Cliente_vista:          1,
    Cliente:{
        id:               null,
        exists:           false,
        identidad:        '',
        nombres:          '',
        apellidos:        '',
        telefonos:        [],
        direcciones:      [],
        archivos:         [
            {dir:'', detalle: 'Identidad',             num:1, status: false, key: 0, file:null, estado:0},
            {dir:'', detalle: 'Rtn',                   num:2, status: false, key: 1, file:null, estado:0},
            {dir:'', detalle: 'Constancia de ingreso', num:2, status: false, key: 2, file:null, estado:0},
            {dir:'', detalle: 'Recibo de luz',         num:2, status: false, key: 3, file:null, estado:0},
            {dir:'', detalle: 'IP 800',                num:2, status: false, key: 4, file:null, estado:0},
        ],
        rtn:              '',
        detalles:         [
            {detalle: 'Estado civil',             val:'', select: 1, datos:['Soletr@','Casad@', 'Unión libre']},
            {detalle: 'Nombre del conyugue',      val:'', select: 2, datos:[]},
            {detalle: 'Hijos',                    val:'', select: 1, datos:['Sí','No']},
            {detalle: 'Cantidad de hijos',        val:'', select: 2, datos:[]},
            {detalle: 'Cantidad de dependientes', val:'', select: 2, datos:[]},
            {detalle: 'Tipo de vivienda',         val:'', select: 1, datos:['Casa propia','Casa Familiar','Condiminio de apartamentos','apartamento','Guarderia']},
        ],
        fecha_nacimiento: '',
        sexo:             '',
        email:            '',
        nacionalidad:     'Hondureña',
        salario:          0,
        empresa_trabaja:  '',
        is_trabaja:       '',
        is_casa:          '',
        registro:         false,
        subiendo:         false
    },
    hiddenBtnCliente:       false,
    width: '40%',
    height: '300px',
    Solicitudes: [],
    loadSolicitudes: false,
    Solicitud: [],
    dialogoSolicitud: false,
    vista: 1,
    DetallesPrecio: [],
    AvalesEstaticos: [],
    EstadoVistaSolicitud: false
});

export const mutations = {
    agregarAvalesEstaticos(state, data){
        if (data.tipo === 1)
            state.AvalesEstaticos.push(data);
        else
            state.AvalesEstaticos = [];
    },
    asignarDetallesSolicitus(state, data){
        state.Solicitud.referencias =  data
    },
    agregadDetallesPrecios(state, data){
        state.DetallesPrecio = data;
    },
    agregarFile(state, url){
        state.Solicitud.file = url;
    },
    agregarTareas(state, data){
        state.Solicitud.tareas = data
    },
    asignarArchivosSolitud(state, data){
        state.Solicitud.aval_solicituds = data;
    },
    cambiarEstadovistaSolicitud(state, val){
        state.EstadoVistaSolicitud = val;
    },
    guardarToken(state, token){
        state.token = token
    },
    cambiarValorVista(state, val){
        state.SolicitudCredito_view = val;
    },
    cambiarVista(state, val){
        state.SolicitudCredito_vista = val;
    },
    vistaCliente(state, val){
        state.Cliente_vista = val;
    },
    cambiarValorBtnCliente(state, val){
        state.hiddenBtnCliente = val;
    },
    cambiarHeight(state, val){
        state.height = val;
    },
    cambiarWifth(state, val){
        state.width = val;
    },
    crearCliente(state){
        state.Cliente.subiendo = true;
        let data = new FormData(), cont=0;
        let direcciones = [];
        for (let i in state.Cliente.archivos){
            if (state.Cliente.archivos[i].file) {
                data.append(`file_cliente[${cont}]`, state.Cliente.archivos[i].file);
                cont++;
            }
        }

        state.Cliente.direcciones.forEach( (i) => {
            direcciones.push({
                "departamento": i.departamento,
                "municipio":    i.municipio,
                "ciudad":       i.ciudad,
                "colonia":      i.colonia,
                "detalle":      i.detalle.toUpperCase(),
                "key":          i.key,
                "Municipios":   null,
                "Ciudades":     null,
                "Colonias":     null
            })
        });

        data.append('nombres',          state.Cliente.nombres.toUpperCase());
        data.append('apellidos',        state.Cliente.apellidos.toUpperCase());
        data.append('identidad',        state.Cliente.identidad);
        data.append('rtn',              state.Cliente.rtn);
        data.append('detalles',         JSON.stringify(state.Cliente.detalles));
        data.append('fecha_nacimiento', state.Cliente.fecha_nacimiento);
        data.append('sexo',             state.Cliente.sexo);
        data.append('email',            state.Cliente.email.toLowerCase());
        data.append('telefonos',        JSON.stringify(state.Cliente.telefonos));
        data.append('nacionalidad',     state.Cliente.nacionalidad);
        data.append('salario',          state.Cliente.salario);
        data.append('empresa_trabaja',  state.Cliente.empresa_trabaja.toUpperCase());
        data.append('is_trabaja',       state.Cliente.is_trabaja);
        data.append('is_casa',          state.Cliente.is_casa);
        data.append('direcciones',      JSON.stringify(direcciones));
        data.append('archivos',         JSON.stringify(state.Cliente.archivos));
        this.$axios({
            method:'post',
            url:'clientes',
            data:data,
            headers:{
                'Authorization': 'Bearer ' + state.token,
                'Content-Type': "multipart/form-data"
            }
        }).
        then((res)=>{
            state.Cliente.id       = res.data.cliente;
            state.Cliente.registro = true;
            state.Cliente.subiendo = false;
            let archivos = res.data.files;
            state.Cliente.archivos = []
            archivos.forEach( (i)=>{
                state.Cliente.archivos.push({
                    dir: i.dir,
                    detalle: i.detalle,
                    num:     i.num,
                    status:  i.status,
                    key:     i.key,
                    file:    null,
                    estado:  i.estado
                })
            })
            Vue.$toast.open({
                message: `se han registrado los datos exitosamente.`,
                type: 'success',
                position: 'bottom-left',
                duration: 4000
            });
        }).catch( (error)=>{
            state.Cliente.registro = false;
            state.Cliente.subiendo = false;
        })
    },
    cambiarValorRegistro(state, val){
        state.Cliente.registro = val;
    },
    editarCliente(state){
        state.Cliente.subiendo = true;
        let data = new FormData(), cont=0;
        let direcciones = [];
        for (let i in state.Cliente.archivos){
            if (state.Cliente.archivos[i].file && !state.Cliente.status) {
                data.append(`file_cliente[${cont}]`, state.Cliente.archivos[i].file);
                cont++;
            }
        }

        state.Cliente.direcciones.forEach( (i) => {
            direcciones.push({
                "departamento": i.departamento,
                "municipio":    i.municipio,
                "ciudad":       i.ciudad,
                "colonia":      i.colonia,
                "detalle":      i.detalle.toUpperCase(),
                "key":          i.key,
                "Municipios":   null,
                "Ciudades":     null,
                "Colonias":     null
            })
        });
        let email = state.Cliente.email;
        if (email)
            email.toLowerCase();
        let empresa = state.Cliente.empresa_trabaja;
        if (empresa)
            empresa.toUpperCase();

        data.append('id',               state.Cliente.id);
        data.append('nombres',          state.Cliente.nombres.toUpperCase());
        data.append('apellidos',        state.Cliente.apellidos.toUpperCase());
        data.append('identidad',        state.Cliente.identidad);
        data.append('rtn',              state.Cliente.rtn);
        data.append('detalles',         JSON.stringify(state.Cliente.detalles));
        data.append('fecha_nacimiento', state.Cliente.fecha_nacimiento);
        data.append('sexo',             state.Cliente.sexo);
        data.append('email',            email);
        data.append('telefonos',        JSON.stringify(state.Cliente.telefonos));
        data.append('nacionalidad',     state.Cliente.nacionalidad);
        data.append('salario',          state.Cliente.salario);
        data.append('empresa_trabaja',  empresa);
        data.append('is_trabaja',       state.Cliente.is_trabaja);
        data.append('is_casa',          state.Cliente.is_casa);
        data.append('direcciones',      JSON.stringify(direcciones));
        data.append('archivos',         JSON.stringify(state.Cliente.archivos));

        this.$axios({
            method:'post',
            url:'clientes/edit',
            data:data,
            headers:{
                'Authorization': 'Bearer ' + state.token,
                'Content-Type': "multipart/form-data"
            }
        }).
        then((res)=>{
            state.Cliente.id       = res.data.cliente;
            state.Cliente.registro = true;
            state.Cliente.subiendo = false;
            let archivos = res.data.files;
            state.Cliente.archivos = []
            archivos.forEach( (i)=>{
                state.Cliente.archivos.push({
                    dir: i.dir,
                    detalle: i.detalle,
                    num:     i.num,
                    status:  i.status,
                    key:     i.key,
                    file:    null,
                    estado:  i.estado
                })
            })
            Vue.$toast.open({
                message: `se han registrado los datos exitosamente.`,
                type: 'success',
                position: 'bottom-left',
                duration: 4000
            });
        }).catch( (error)=>{
            state.Cliente.registro = false;
            state.Cliente.subiendo = false;
        })
    },
    cargarSolicitudes(state, val){
        state.loadSolicitudes = true;
        if (val.tipo === 1){
            if (!val.fecha){
                let date = new Date();
                val.fecha = date.getFullYear()+'-'+(date.getMonth() + 1)+'-01';
            }
            this.$axios.get('solicitudes_credito/fecha/'+val.fecha)
                .then((res)=>{
                    state.Solicitudes = res.data.solicitudes;
                    state.loadSolicitudes = false;
                })
        }else if (val.tipo === 2){
            this.$axios.get('solicitudes_credito/'+val.search)
                .then((res)=>{
                    state.Solicitudes = res.data.solicitudes;
                    console.log(res.data.solicitudes)
                    state.loadSolicitudes = false;
                })
        }
    },
    cargarSolicitud(state, ruta){
        state.loadSolicitudes = true;
        this.$axios.get(ruta)
            .then((res)=>{
                state.Solicitud = res.data.solicitud;
                state.loadSolicitudes = false;
            })

    },
    datoSolicitud(state, data){
        state.Solicitud = data
    },
    cambiarValorDialogoSolicitud(state, val){
        state.dialogoSolicitud = val
    },
    cambiarValorVistaVendedor(state, val){
        state.vista = val;
    }
}
