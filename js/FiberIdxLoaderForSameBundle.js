/**
 * Created by Yongnanzhu on 4/18/2014.
 */
/**
 * Created by Yongnanzhu on 4/17/2014.
 */

FiberIdxLoader = function ( manager ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
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
        var fibernum = parseFloat(lines[1]);
        var fibers = [];
        for(var i=2; i<= fibernum+1; ++i)
        {
            fibers.push( parseFloat(lines[i]));
        }
        return fibers;
    }
};