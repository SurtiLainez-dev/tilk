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
        if(state.valor_peticion == 1)
            val = 1;
        else
            val = state.segunda_peticion;

        this.$axios.get('consultar_articulo/'+state.valor_peticion+'/'+val).then((res)=>{
            if (res.status === 200){
                state.data = res.data.inventario;
                state.load = false;
            }
        })

    },
    cambiarValorPeticion(state, val){
        state.valor_peticion = val;
    },
    cambiarValorSegundaPeticion(state, val){

        state.segunda_peticion = val;
    }
}
