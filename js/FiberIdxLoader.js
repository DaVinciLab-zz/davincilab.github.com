/**
 * Created by Yongnanzhu on 4/17/2014.
 */

FiberIdxLoader = function ( manager ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    this.fiberIdx = [];
};
FiberIdxLoader.prototype = {
    constructor: FiberIdxLoader,

    load: function ( url, onLoad, onProgress, onError ) {

        var scope = this;

        var loader = new THREE.XHRLoader();
        loader.setCrossOrigin( this.crossOrigin );
        loader.load( url, function ( text ) {

            onLoad( scope.parse( text  ) );

        } );

    },

    parse: function ( text ) {
        var lines = text.split("\n");
        var fibernum = lines[0];
        var fibers = [];
        for(var i=1; i<= fibernum; ++i)
        {
            fibers.push( parseFloat(lines[i]));
        }
        this.fiberIdx = fibers ;
        return fibers;
    }
};