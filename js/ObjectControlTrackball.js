/**
 * Created by Yongnanzhu on 4/17/2014.
 */
/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 */

TrackballControls = function ( object, domElement ) {

    var _this = this;
    var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5 };

    this.object = object;
    this.domElement = ( domElement !== undefined ) ? domElement : document;

    // API

    this.enabled = true;

    this.screen = { left: 0, top: 0, width: 0, height: 0 };

    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.2;
    this.panSpeed = 0.3;

    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;
    this.noRoll = false;

    this.staticMoving = false;
    this.dynamicDampingFactor = 0.2;

    this.minDistance = 0;
    this.maxDistance = Infinity;

    this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

    this.rotationMatrix = THREE.Quaternion();


    // internals

    this.target = new THREE.Vector3();

    var lastPosition = new THREE.Vector3();

    var _state = STATE.NONE,
        _prevState = STATE.NONE,

        _eye = new THREE.Vector3(),

        _rotateStart = new THREE.Vector3(),
        _rotateEnd = new THREE.Vector3(),

        _zoomStart = new THREE.Vector2(),
        _zoomEnd = new THREE.Vector2(),

        _touchZoomDistanceStart = 0,
        _touchZoomDistanceEnd = 0,

        _panStart = new THREE.Vector2(),
        _panEnd = new THREE.Vector2();

    // for reset

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();

    // events

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start'};
    var endEvent = { type: 'end'};


    // methods

    this.handleResize = function () {

        if ( this.domElement === document ) {

            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

        } else {

            this.screen = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            var d = this.domElement.ownerDocument.documentElement;
            this.screen.left += window.pageXOffset - d.clientLeft;
            this.screen.top += window.pageYOffset - d.clientTop;

        }

    };

    this.handleEvent = function ( event ) {

        if ( typeof this[ event.type ] == 'function' ) {

            this[ event.type ]( event );

        }

    };
    this.update = function () {
            _this.dispatchEvent( changeEvent );
    };
    this.getMouseOnScreen = function ( pageX, pageY, vector ) {

        return vector.set(
                ( pageX - _this.screen.left ) / _this.screen.width,
                ( pageY - _this.screen.top ) / _this.screen.height
        );

    };

    this.getMouseProjectionOnBall = (function(){       //Convert the 2D screen position to 3D trackball point

        var  mouseOnBall = new THREE.Vector3();


        return function ( pageX, pageY ) {

            mouseOnBall.set(
                    ( pageX - _this.screen.width * 0.5 - _this.screen.left ) / (_this.screen.width*.5),
                    ( _this.screen.height * 0.5 + _this.screen.top - pageY ) / (_this.screen.height*.5),
                0.0
            );

            var length = mouseOnBall.length();

            if ( _this.noRoll ) {

                if ( length < Math.SQRT1_2 ) {

                    mouseOnBall.z = Math.sqrt( 1.0 - length*length );

                } else {

                    mouseOnBall.z = .5 / length;

                }

            } else if ( length > 1.0 ) {

                mouseOnBall.normalize();

            } else {

                mouseOnBall.z = Math.sqrt( 1.0 - length * length );

            }

            var trackballPoint = new THREE(mouseOnBall.x, mouseOnBall.y, mouseOnBall.z);
            return trackballPoint;
        }

    }());

    //Listeners
    function mousedown( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        if ( _state === STATE.NONE ) {

            _state = event.button;

        }

        if ( _state === STATE.ROTATE && !_this.noRotate ) {

            _rotateStart = _this.getMouseProjectionOnBall( event.pageX, event.pageY);
            _rotateEnd.copy(_rotateStart);

        } else if ( _state === STATE.ZOOM && !_this.noZoom ) {

            _this.getMouseOnScreen( event.pageX, event.pageY, _zoomStart );
            _zoomEnd.copy(_zoomStart);

        } else if ( _state === STATE.PAN && !_this.noPan ) {

            _this.getMouseOnScreen( event.pageX, event.pageY, _panStart );
            _panEnd.copy(_panStart)

        }

        document.addEventListener( 'mousemove', mousemove, false );
        document.addEventListener( 'mouseup', mouseup, false );
        _this.dispatchEvent( startEvent );


    }

    function mousemove( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        if ( _state === STATE.ROTATE && !_this.noRotate )
        {
            if(_rotateStart.distanceTo(_rotateEnd) <= Trackball.DOUBLE_EPSILON )
            {
                _this.rotationMatrix.set(0,0,0,1);
            }
            else
            {
                _rotateEnd = _this.getMouseProjectionOnBall( event.pageX, event.pageY);
                var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );
                if ( angle ) {
                    var axis = new THREE.Vector3();
                    axis.crossVectors( _rotateStart, _rotateEnd ).normalize();

                    angle *= _this.rotateSpeed;

                    _this.rotationMatrix.setFromAxisAngle( axis, -angle );//******************************//
                }
            }
        }
        else if ( _state === STATE.ZOOM && !_this.noZoom )
        {

            _this.getMouseOnScreen( event.pageX, event.pageY, _zoomEnd );

        } else if ( _state === STATE.PAN && !_this.noPan ) {

            _this.getMouseOnScreen( event.pageX, event.pageY, _panEnd );

        }

    }

    function mouseup( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        _state = STATE.NONE;

        document.removeEventListener( 'mousemove', mousemove );
        document.removeEventListener( 'mouseup', mouseup );
        _this.dispatchEvent( endEvent );

    }

    function mousewheel( event ) {

        if ( _this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;

        if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

            delta = event.wheelDelta / 40;

        } else if ( event.detail ) { // Firefox

            delta = - event.detail / 3;

        }
        if (delta) {
            object.position.z += delta * 30;
        }
        _this.dispatchEvent( startEvent );
        _this.dispatchEvent( endEvent );

    }

    this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

    this.domElement.addEventListener( 'mousedown', mousedown, false );

    this.domElement.addEventListener( 'mousewheel', mousewheel, false );
    this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox


    this.handleResize();

};
Trackball.DOUBLE_EPSILON = 1.0e-16;
TrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );

