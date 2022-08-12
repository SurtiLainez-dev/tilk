export const state = () => ({
    LOAD_SUCURSALES: false,
    SUCURSALES: [],
    LOAD_COLABORADORES: false,
    COLABORADORES: []
});

export const mutations = {
    cargar_SUCURSALES(state) {
        if (state.SUCURSALES.length === 0){
            state.LOAD_SUCURSALES = true;
            this.$axios.get('sucursales').then((res)=>{
                state.SUCURSALES = res.data.suc;
                state.LOAD_SUCURSALES = false;
            })
        }
    },
    cargar_COLABORADORES(state, sucursal) {
        state.LOAD_COLABORADORES = true;
        state.COLABORADORES = [];
        this.$axios.get('empleados_plantilla/'+sucursal).then((res)=>{
            res.data.col.forEach((item)=>{
                state.COLABORADORES.push({
                    text: item.nombres+' '+item.apellidos,
                    value: item.id
                })
            })
            state.COLABORADORES.push({text:'Todos',value:0});
            state.LOAD_COLABORADORES = false;
        })
    }
}
