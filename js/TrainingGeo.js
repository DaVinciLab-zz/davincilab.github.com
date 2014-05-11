/**
 * Created by Yongnanzhu on 4/18/2014.
 */
/**
 * Created by Yongnanzhu on 4/12/2014.
 */
/**
 * @author mrdoob / http://mrdoob.com/
 */

GeometryLoader = function ( manager,color ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    this.center = null;
    //----------------------------------
    this.bundleposition = null;
    this.bundlecolor = color;
    //-----------------------------------
};
GeometryLoader.prototype = {

    constructor: GeometryLoader,

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
        var totalFiberNum = lines[0];
        var startNum=1;

        var object = new THREE.Object3D();
        var material;
        var mesh;
        var positionminx=200,positionminy=200,positionminz=200;
        var positionmaxx=-200,positionmaxy=-200,positionmaxz=-200;
        for(var i=0;i<totalFiberNum;i++)
        {
            var geometry;
            var totalVertexNum = lines[startNum];
            var vertexPosition = [];
            for(var j = 1;j<=totalVertexNum;j+=2)
            {
                var vals = lines[startNum+j].split(/\s+/);
                vertexPosition.push( new THREE.Vector3( parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2]) ) );
                positionminx = Math.min(positionminx, parseFloat(vals[0]));
                positionminy = Math.min(positionminy, parseFloat(vals[1]));
                positionminz = Math.min(positionminz, parseFloat(vals[2]));

                positionmaxx = Math.max(positionmaxx, parseFloat(vals[0]));
                positionmaxy = Math.max(positionmaxy, parseFloat(vals[1]));
                positionmaxz = Math.max(positionmaxz, parseFloat(vals[2]));
                if(i===0)
                    this.bundleposition = new THREE.Vector3( parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2]));
            }
            this.center = new THREE.Vector3((positionminx + positionmaxx)/2.0,
                    (positionminy + positionmaxy)/2.0, (positionminz + positionmaxz)/2.0);
            geometry = new TubeGeometry(
                vertexPosition,
                    vertexPosition.length -1,
                0.5,
                6,
                false
            );
            geometry.uuid = i;
            if(this.bundlecolor === 'red')
                material = new THREE.MeshPhongMaterial({color:0xFF0000} );
            else if(this.bundlecolor === 'green')
                material = new THREE.MeshPhongMaterial({color:0x00FF00} );
            else if(this.bundlecolor === 'blue')
                material = new THREE.MeshPhongMaterial({color:0x0000FF} );
            else if(this.bundlecolor === 'yellow')
                material = new THREE.MeshPhongMaterial({color:0xFFFF00} );
            else if(this.bundlecolor === 'white')
                material = new THREE.MeshPhongMaterial({color:0xFFFFFF} );
            else
                material = new THREE.MeshPhongMaterial({color:0x00FFFF} );

            mesh = new THREE.Mesh( geometry, material );

            object.add( mesh );

            startNum+=parseInt(totalVertexNum)+1;
        }
        return object;
    }

};


