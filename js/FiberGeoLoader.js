/**
 * Created by Yongnanzhu on 4/17/2014.
 */
/**
 * Created by Yongnanzhu on 4/17/2014.
 */
/**
 * @author mrdoob / http://mrdoob.com/
 */

GeometryLoader = function ( manager, fiberIdx ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    //----------------------------------
    //this.minColor = null;
    //this.maxColor = null;
    this.center = null;
    this.fiberIdx = fiberIdx;
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
        //-------------------------------
        //var colorminx=1,colorminy=1,colorminz=1;
        //var colormaxx=0,colormaxy=0,colormaxz=0;
        var positionminx=200,positionminy=200,positionminz=200;
        var positionmaxx=-200,positionmaxy=-200,positionmaxz=-200;
        //------------------------------
        if(this.fiberIdx !==0)
        {
            var indexbegin = 0;
            indexbegin = this.fiberIdx[0] -1;
            var indexEnd = 0;
            var fiberLength = this.fiberIdx.length -1;
            indexEnd = this.fiberIdx[ fiberLength-1];
            var count =0;
        }

        for(var i=0;i<totalFiberNum;i++)
        {
            var geometry;
            var totalVertexNum = lines[startNum];
            var vertexPosition = [];

            var yellowState= false;
            for(var j = 1;j<=totalVertexNum;j++)
            {
                var vals = lines[startNum+j].split(/\s+/);
                vertexPosition.push( new THREE.Vector3( parseFloat(vals[0]), parseFloat(vals[1]), parseFloat(vals[2]) ) );
                positionminx = Math.min(positionminx, parseFloat(vals[0]));
                positionminy = Math.min(positionminy, parseFloat(vals[1]));
                positionminz = Math.min(positionminz, parseFloat(vals[2]));

                positionmaxx = Math.max(positionmaxx, parseFloat(vals[0]));
                positionmaxy = Math.max(positionmaxy, parseFloat(vals[1]));
                positionmaxz = Math.max(positionmaxz, parseFloat(vals[2]));

                /*vertexColor.push( new THREE.Vector3( parseFloat(vals[3]), parseFloat(vals[4]), parseFloat(vals[5]) ) );
                colorminx = Math.min(colorminx, parseFloat(vals[3]));
                colorminy = Math.min(colorminy, parseFloat(vals[4]));
                colorminz = Math.min(colorminz, parseFloat(vals[5]));

                colormaxx = Math.max(colormaxx, parseFloat(vals[3]));
                colormaxy = Math.max(colormaxy, parseFloat(vals[4]));
                colormaxz = Math.max(colormaxz, parseFloat(vals[5]));*/
            }
            this.center = new THREE.Vector3((positionminx + positionmaxx)/2.0,
                    (positionminy + positionmaxy)/2.0, (positionminz + positionmaxz)/2.0);
            //this.minColor =  new THREE.Color(colorminx, colorminy, colorminz);
            //this.maxColor =  new THREE.Color(colormaxx, colormaxy, colormaxz);

            if(i >= indexbegin && i<=indexEnd)
            {
                if(this.fiberIdx[count] == i)
                {
                     yellowState = true;

                     count ++;
                    if(count<fiberLength)
                        indexbegin = this.fiberIdx[count];
                    else
                        indexbegin = indexEnd+1;
                }
            }

            geometry = new TubeGeometry(
                vertexPosition,
                totalVertexNum -1,
                0.5,
                6,
                false,
                yellowState
            );
            yellowState = false;
            geometry.uuid = i;
            material = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors});
            //material = new THREE.MeshPhongMaterial();
            mesh = new THREE.Mesh( geometry, material );

            object.add( mesh );

            startNum+=parseInt(totalVertexNum)+1;
        }
        return object;
    }

};

