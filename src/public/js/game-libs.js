
const geooptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
    },
    extraPointsByVaccines = 1,
    timeToPlayInMinutes = 10,
    pointsByPhase2 = 10,
    pointsByPhase1 = 5;


var state = {
    timeLeft: timeToPlayInMinutes * 60,
    actualSickState: 'H',
    actualPhotoSaved: false,
    lastPhoto: null,
    origin:null,
    username: Math.random().toString(),
    userPhoto: null,
    startTime: null,
    endTime: null,
    vaccines: 5,
    points: 0,
    iduser: null,
    savePhase1: 0,
    savePhase2: 0,
    idfindGeo: null,
    idTimer: null
};
var tracker = new tracking.ObjectTracker('face');
var img = document.createElement("img");

function bindState () {
    $('#time-left').text(getTime(state.timeLeft))
    $('#vaccines').html('<span class="vaccines">Vacunas: </span>' + state.vaccines)
    $('#points').html('<span class="points">Puntos: </span>' + state.points)
}

function getTime (n) {
    var hours = (n / 60)
    var rhours = Math.floor(hours)
    var minutes = (hours - rhours) * 60
    var rminutes = Math.floor(minutes)
    var seconds = (minutes - rminutes) * 60
    var rseconds = Math.round(seconds)

    if (rminutes < 10) {
        rminutes = '0' + rminutes
    }
    if (rseconds < 10) {
        rseconds = '0' + rseconds
    }
    return rhours + ':' + rminutes + ':' + rseconds
}

///////////////////////////////GEO FUNCTIONS//////////////////////////////////////

var getGeoLocation= (getPosition, error) => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, error, geooptions);
    } else {
        showMessages("Su dispositivo no es compatible con el scanner biológico");
    }
}

var startGeoLocationTracking = (getPosition, error) => {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(getPosition, error, geooptions);
    } else {
        showMessages("Su dispositivo no es compatible con el scanner biológico");
    }
}
var clearWatch = () => navigator.geolocation.clearWatch(state.idfindGeo);

var sendGeoLocation = (emitFunction) => {
    state.idfindGeo = startGeoLocationTracking((position) => {
        let crd = position.coords;
        //Send coords to server
        socket.emit('position', {userid: state.iduser, latitude:crd.latitude, longitude:crd.longitude})
    }, getGeoErrors);
}

var getGeoErrors = (error) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            showMessages("Su scanner biológico no tiene los permisos para localizarlo en el mapa.")
            break;
        case error.POSITION_UNAVAILABLE:
            showMessages("No podemos encontrar su posición en el mapa.")
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.")
            break;
    }
    restartGame();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////FACE FUNCTIONS//////////////////////////////////////

var startFaceTracking = (video) => {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    state.lastPhoto = null;
    state.actualPhotoSaved = false;
    state.actualSickState = '';

    var ctx = canvas.getContext('2d');
    tracker.setInitialScale(4);
    tracker.setStepSize(1);
    tracker.setEdgesDensity(0.1);

    tracking.track(video, tracker, {camera: true});

    tracker.on('track', function (event) {


        if (event.data.length !== 0) {
            // No targets were detected in this frame.
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        // event.data.forEach(function (data) {
        //     //Draw something in context
        //     //Capture a face photo
        //     //Send photo to server
        //

        bindState()
        // });
        event.data.forEach(function (rect) {
            if (!state.actualPhotoSaved) {
                ctx.drawImage(video, rect.x, rect.y, rect.width, rect.height);
                var dataURI = canvas.toDataURL('image/png');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                state.lastPhoto = dataURI;
                state.actualPhotoSaved = true;

            }

            context.strokeStyle = '#FFFFFF';
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            if (state.actualSickState == 'P1') {
                img.src = 'img/eyes.png';
            } else if (state.actualSickState == 'P2') {
                img.src = 'img/eyes.png';
            } else if (state.actualSickState == 'H') {
                img.src = 'img/eyes.png';
            } else {
                img.src = '';
            }

            context.drawImage(img, rect.x, rect.y + 25, rect.width, rect.height / 2);
        });


    });

    // var gui = new dat.GUI();
    // gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
    // gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
    // gui.add(tracker, 'stepSize', 1, 5).step(0.1);
}


var drawScanner = (canvas) => {

}
var drawSickOnface = (canvas) => {

}

var getFace = () => {
    var video = document.getElementById('video');
    startFaceTracking(video)
}

var showVideoForMyFace = ()=>{
    var video = document.querySelector('#video');

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, handleVideo, (err)=>console.log(err));
    }

    function handleVideo(stream) {
        video.src = window.URL.createObjectURL(stream);
    }
}

var restartMyFace = () => {
    var video = document.querySelector('#video');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, video.width, video.height);
    video.play();
}
var getMyFace = () => {
    var video = document.querySelector('#video');
    video.pause();
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, video.width, video.height);
    var dataURI = canvas.toDataURL('image/png');
    return dataURI;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////GAME FUNCTIONS//////////////////////////////////////

var getInitialData = (cb) => {
    var nickname = document.querySelector("#nick");
    getMyData(nickname.value);
    getGeoLocation((position)=>{
        cb(position.coords)
    },getGeoErrors);

}
var startTimeCounter = () => {
    if (state.timeLeft === 0 && state.idTimer === null)
        state.idTimer = setInterval(() => {
            state.timeLeft - 1
        }, 1000);
    else {
        //end the game
        clearInterval(state.idTimer);
        state.points += extraPointsByVaccines * state.vaccines;
    }

}

var clearTimerData = () => {
    if (state.idTimer !== null) {
        clearInterval(state.idTimer);
        state.timeLeft = 0;
        state.idTimer = null;
    }
}

var restartGame = () => {
    stopTimeCounter();
    let actualDate = new Date();
    state = {
        timeLeft: timeToPlayInMinutes * 60,
        actualSickState: 'H',
        actualPhotoSaved: false,
        lastPhoto: null,
        origin:null,
        username: Math.random().toString(),
        userPhoto: null,
        startTime: actualDate,
        endTime: actualDate.setMinutes(actualDate.getMinutes() + timeToPlayInMinutes),
        vaccines: 5,
        points: 0,
        iduser: null,
        savePhase1: 0,
        savePhase2: 0,
        idfindGeo: null,
        idTimer: null
    }
}

var startGame = () => {
    restartTimeCounter();
    getFace();
    sendGeoLocation()
};


var restartTimeCounter = () => {
    clearTimerData()
    startTimeCounter();
}


var stopTimeCounter = () => {
    clearTimerData()
}

var restoreVaccines = () => {
    socket.emit('restore-vaccine', {state});
}


var saveSickPhase1 = () => {
    sate.savePhase1++;
    state.points += pointsByPhase1;
}

var saveSickPhase2 = () => {
    if(state.vaccines > 0){
        sate.savePhase2++;
        state.vaccines--;
        state.points += pointsByPhase2;
    } else {
        showMessages("No tienes más vacunas. Vuelve al centro médico para recargar.")
    }

}
var getMyData = (username) => {
    state.username = username;
}

var sendMydata= () => {
    socket.emit('update-server', state);
}

var showMessages = (message)  => {
    var modal = document.createElement( 'div' );
    modal.classList.add( 'message-modal' );
    modal.append( message );
    window.setTimeout( function () { modal.classList.add( 'show-modal' ) }, 200 );
    window.setTimeout( function () { modal.classList.remove( 'show-modal' ) }, 5000 );
    document.body.append( modal );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.onload = () => {


    var but = document.querySelector("#photo");
    showVideoForMyFace();
    if(but)
        but.addEventListener("click", (ev)=>{
           state.userPhoto= getMyFace();
        })

    var butSendScan = document.querySelector("#scan");
    if(butSendScan)
    butSendScan.addEventListener("click", (ev) => {
        socket.emit('scanning', state);
    })
    var but2 = document.querySelector("#submitD");
    if(but2)
    but2.addEventListener("click", (ev)=>{
        HoldOn.open({
            theme:"sk-rect",
            message:"<h4 id='textload'>"+"Instalando paquetes de detección de enfermedades"+"</h4>"
        });
        // state.origin = {
        //     latitude: 10,
        //     longitude: 0
        // };
        //
        socket.emit('init-data', state)
        getInitialData((initialData)=>{
            state.origin = {
                latitude: initialData.latitude,
                longitude: initialData.longitude
                            };
            // HoldOn.close();
            socket.emit('init-data', state)
            var mess = document.querySelector('#textload');
            mess.innerHTML = 'Cargando datos del scanner biológico a su móvil';
        });
    })
    //
    // sendGeoLocation((coords) => console.log(coords))

}

