const parametro = new URLSearchParams(window.location.search)
const user = parametro.get('usuario')

if(user in sessionStorage === false){
    window.location = '/index.html'
}

document.getElementById('usuarioreg').textContent = user

let btnsalir = document.getElementById('btnsalir')
btnsalir.addEventListener('click', cerrars)

function cerrars(){
    sessionStorage.removeItem(user)
    window.location.reload()
    //window.location = '../index.html'
}