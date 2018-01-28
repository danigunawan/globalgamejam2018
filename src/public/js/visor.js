var playSound = function ( e ) {
	var _target = e.target;
	var sound = _target.getAttribute( 'data-sound' );
	if ( sound != null ) {
		var soundEl = document.querySelector( '#' + sound );
		soundEl.play();
	}
}

var soundBtn = document.querySelectorAll( '.app-control-btn' );
if ( soundBtn != null ) {
	for ( var item of soundBtn ) {
        item.addEventListener( 'click', playSound, false );
    }
}


// showMessage( 'Hola esto es un mensaje' );