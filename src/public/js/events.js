
socket.on('user-saved', (data)=>{
    sessionStorage.setItem('userid', data._id);
    window.location.href= 'visor.html';
});


socket.on('started', (data) => {
    state = data;
    startGame();
});


socket.on('update-client', function (data) {
    _.each(data, function (value, key) {
        state[key] = value;
    })
});


socket.on('can-recharge', function (data) {
    //Show recharge button
});


socket.on('cant-recharge', function (data) {
    //Hide recharge button
});



socket.on('scanned', function (data) {
    //datos del usuario escaneado
    if (data.found) //devuelve true si el tipo escaneado ya se encontraba en base de datos.
    {
        console.log(data.actualSickState);
    } else {
        //aumentar las vacunas
        if (state.actualSickState == 'P1') {
            saveSickPhase1();
        } else if (state.actualSickState == 'P2') {
            saveSickPhase2();
        }
        state.actualPhotoSaved = false;
    }
});





