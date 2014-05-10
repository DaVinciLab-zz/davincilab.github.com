/**
 * Created by Yongnanzhu on 4/16/2014.
 */

BoxLoader = function ( manager ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    this.center = null;
    this.minVertex = null;
    this.maxVertex = null;
};
BoxLoader.prototype = {

    constructor: BoxLoader,

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
        var exclusive = lines[0];

        var vals_min = lines[1].split(/\s+/);
        var min = new THREE.Vector3( parseFloat(vals_min[0]), parseFloat(vals_min[1]), parseFloat(vals_min[2]) );
        this.minVertex = min;
        var vals_max = lines[2].split(/\s+/);
        var max = new THREE.Vector3( parseFloat(vals_max[0]), parseFloat(vals_max[1]), parseFloat(vals_max[2]) );
        this.maxVertex = max;
        this.center = new THREE.Vector3((min.x+max.x)/2, (min.y+max.y)/2, (min.z+max.z)/2);
        var geometry = new BoxGeometry(min,max);
        //var material = new THREE.MeshPhongMaterial();
        /*var material = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 'yellow'
        });
        var mesh = new THREE.Mesh( geometry, material );

        return mesh;*/
        return geometry;
    }
};