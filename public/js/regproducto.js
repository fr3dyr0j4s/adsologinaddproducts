pedirId()

document.getElementById('registrarp').addEventListener('click', (e)=>{
    e.preventDefault()
    postDatos()
})

function pedirId(){
    let url = '/app/productos'

    fetch(url)
        .then(respuesta => respuesta.json())
            .then(datos =>{
                const tam = datos.length
                const ult = datos[tam-1]
                let ultid = parseInt(ult.id) + 1
                let id = document.getElementById('idp')
                id.value = ultid
                id.readOnly = true
            })
}

async function postDatos(){
    const formulario = document.getElementById('enviardatos')
    let datos = new FormData(formulario)
    //let datosjson = Object.fromEntries(datos.entries())

    let url = '/app/productos'

    const cont = {
        method: 'POST',
        body: datos
    }
    try{
        let peticion = await fetch(url, cont)
        if(!peticion.ok){
            throw new Error('Hubo un problema al realizar la petición')
        }
        let valores = await peticion.json()
        alert('Producto registrado')
        document.getElementById('enviardatos').reset()
    }catch(error){
        console.error('Error', error)
    }

}