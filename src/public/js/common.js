var instModal = function ( e ) {
    e.preventDefault();
    var target = e.target;
    if ( target.tagName != 'A' || target.tagName != 'a' )
        target = target.closest( 'a' );
    if ( document.querySelector( '.trans-overlay' ) == null ) {
        var trans = document.createElement( 'div' );
        trans.classList.add( 'trans-overlay' );
        trans.addEventListener( 'click', closeModal, false );
        document.body.append( trans );
    }
    else {
        var trans = document.querySelector( '.trans-overlay' );
    }

    var instructionModal = document.querySelector( '.modal-instrucciones' );

    trans.style.display = 'block';
    setTimeout( function() { instructionModal.classList.add( 'activated' ) }, 200 );
    document.body.classList.add( 'modal-active' );
    
    return false;
}

var qrModal = function ( e ) {
    e.preventDefault();
    var target = e.target;
    if ( target.tagName != 'A' || target.tagName != 'a' )
        target = target.closest( 'a' );
    if ( document.querySelector( '.trans-overlay' ) == null ) {
        var trans = document.createElement( 'div' );
        trans.classList.add( 'trans-overlay' );
        trans.addEventListener( 'click', closeModal, false );
        document.body.append( trans );
    }
    else {
        var trans = document.querySelector( '.trans-overlay' );
    }

    var qrModalElem = document.querySelector( '.modal-qr' );

    trans.style.display = 'block';
    setTimeout( function() { qrModalElem.classList.add( 'activated', 'activated-qr' ) }, 200 );
    document.body.classList.add( 'modal-active' );
    
    return false;
}

var instructionElem = document.querySelector( 'a.modal-instrucciones-handler' );
if ( instructionElem != null ) {
    instructionElem.addEventListener( 'click', instModal, false );
}
var qrElem = document.querySelector( 'a.modal-qr-handler' );
if ( qrElem != null ) {
    qrElem.addEventListener( 'click', qrModal, false );
}

var closeModal = function ( e ) {
    var target = e.target;
    var activeModal = document.querySelector( '.activated' );
    activeModal.classList.remove( 'activated', 'activated-qr' );
    if ( target.classList.contains( 'trans-overlay' ) ) {
        target.style.display = 'none';
    }
    else {
        var transOverl = document.querySelector( '.trans-overlay' );
        transOverl.style.display = 'none';
    }
    document.body.classList.remove( 'modal-active' );
}

var closeModalHandler = document.querySelector( 'a.close-modal' );
if ( closeModalHandler != null ) {
    closeModalHandler.addEventListener( 'click', closeModal, false );
}