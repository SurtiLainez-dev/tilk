export const state = () =>({
    pestana:[
        {
            titulo: 'Pestana 1',
            key: 0,
        }
    ]
})
export const mutations = {
    sumar_pestanias(state){
        state.pestana.push({
            titulo: 'Titulo '+(parseInt(state.pestana.length) + parseInt(1)),
            key: state.pestana.length,
        })
    },
    quitar_pestania(state, key){
        if (state.pestana.length > 1) {
            state.pestana.splice(key, 1);
            state.pestana.forEach((i, cont)=>{
                i.key = parseInt(cont);
                i.titulo = 'titulo '+(parseInt(1) + parseInt(cont))
            })
        }
    },
}
