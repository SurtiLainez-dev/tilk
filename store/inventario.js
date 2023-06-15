export const state = () => ({
    data: [],
    load: false,
    tipo_peticion: [
        {text:'Traer Todo el Inventario',value:1},
        {text:'Traer por Proveedor',value:2},
        {text:'Traer por Marca',value:3},
        {text:'Traer por Familia',value:4},
    ],
    valor_peticion: 1,
    segunda_peticion: null
});

export const mutations = {
    cargarInventario(state){
        state.load = true;
        let val;
        if(state.valor_peticion === 1)
            val = 1;
        else
            val = state.segunda_peticion;

        this.$axios.get('consultar_articulo/'+state.valor_peticion+'/'+val).then((res)=>{
            state.data = [];
            if (res.data.inventario){
                res.data.inventario.forEach(item=>{
                    state.data.push({
                        codigo_sistema:   item.codigo_sistema,
                        codigo_proveedor: item.codigo_proveedor,
                        marca:            item.marca,
                        modelo:           item.modelo,
                        nombre_articulo:  item.nombre_articulo,
                        fam:              item.fam,
                        combo:            false,
                        articulo:         item.articulo,
                        descripcion_corta: item.descripcion_corta
                    })
                })
            }

            if (res.data.combos){
                res.data.combos.forEach(item=>{
                    state.data.push({
                        codigo_sistema:   item.codigo,
                        codigo_proveedor: item.codigo_proveedor,
                        marca:            'Surti Lainez',
                        modelo:           'Surti Lainez',
                        nombre_articulo:  item.nombre,
                        fam:              item.fam,
                        combo:            true,
                        articulo:         item.id,
                        descripcion_corta: item.detalle
                    })
                })
            }

            state.load = false;
        })

    },
    cambiarValorPeticion(state, val){
        state.valor_peticion = val;
    },
    cambiarValorSegundaPeticion(state, val){

        state.segunda_peticion = val;
    }
}
