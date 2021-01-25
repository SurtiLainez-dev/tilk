export const state = () =>({
    DEPARTAMENTOS: [],
    MUNICIPIOS:    [],
    DISTRITOS:     [],
    COLONIAS:      []
})

export const mutations = {
    cargar_DEPARTAMENTOS(state){
        this.$axios.get('departamentos').then((res)=>{
            console.log(state.DEPARTAMENTOS)
           state.DEPARTAMENTOS = res.data.depto;
           console.log(state.DEPARTAMENTOS)
        })
    },
    cargar_MUNICIPIOS(state){
        this.$axios.get('municipios').then((res)=>{
            state.MUNICIPIOS = res.data.municipios;
        })
    },
    cargar_DISTRITOS(state){
        this.$axios.get('ciudades').then((res)=>{
            state.DISTRITOS = res.data.ciudades;
        })
    },
    cargar_COLONIAS(state){
        this.$axios.get('colonias').then((res)=>{
            state.COLONIAS = res.data.colonias
        })
    }
}
