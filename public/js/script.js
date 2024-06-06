
document.getElementById('logear')
    .addEventListener('click', (e)=>{
        e.preventDefault()
        const formulogin = document.getElementById('loginform')
        let datos = new FormData(formulogin)
        let datosjson =  Object.fromEntries(datos.entries())
        //alert(JSON.stringify(datosjson))
        loginPost(datosjson)
    })


async function loginPost(datosjson){
    //alert(JSON.stringify(datosjson))
        
    const url = '/app/login'
    
    const cont = {
        method: 'POST',
        headers:{
            'Content-Type':'application/json' 
        },
        body: JSON.stringify(datosjson)
    }
    try{
        let peticion = await fetch(url, cont)
        if(!peticion.ok) {
            throw new Error('Hubo un problema con las credenciales')
        } 
        let valores = await peticion.json()
        //sessionStorage.setItem('jwtToken', valores)
        //window.location = '/views/restringido.html'
        let usuario = valores.nombreus
        sessionStorage.setItem(usuario, valores.token)
        let rutahtml = valores.rutahtml
        window.location = `${rutahtml}?usuario=${usuario}`
        

        //console.log('Respuesta del servidor:', valores)
    }catch{
        console.log('Error')
    }
}


