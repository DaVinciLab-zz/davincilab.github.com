/**
 * Created by Yongnanzhu on 4/17/2014.
 */
/**
 * Created by Yongnanzhu on 4/17/2014.
 */
/**
 * @author mrdoob / http://mrdoob.com/
 */

GeometryLoader = function ( manager, fiberIdx, loaderbox, loaderbox2, loaderbox3 ) {

    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
    //----------------------------------
    //this.minColor = null;
    //this.maxColor = null;
    this.center = null;
    this.fiberIdx = fiberIdx;

    this.box1 = loaderbox;
    this.box2 = loaderbox2;
    this.box3 = loaderbox3;

    this.startPoint =[];
    this.endPoint =[];
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
        function pointInBox(p,boxMin,boxMax)
        {
            return ( p.x >= (boxMin.x+112) && p.x <= (boxMax.x+112)
                && p.y >= (boxMin.y+124) && p.y <= (boxMax.y+124)
                && p.z >= (boxMin.z+70)  && p.z <= (boxMax.z+70) );
        }
        for(var i=0;i<totalFiberNum;i++)
        {
            var geometry;
            var totalVertexNum = lines[startNum];
            var vertexPosition = [];

            var ChoosenState= false;
            if(i >= indexbegin && i<=indexEnd)
            {
                if(this.fiberIdx[count] == i)
                {
                    ChoosenState = true;

                    count ++;
                    if(count<fiberLength)
                        indexbegin = this.fiberIdx[count];
                    else
                        indexbegin = indexEnd+1;
                }
            }
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
            }
            if(ChoosenState === true)
            {
                if( pointInBox( vertexPosition[0],this.box1.minVertex, this.box1.maxVertex )
                    || pointInBox( vertexPosition[0],this.box2.minVertex, this.box2.maxVertex )
                    || pointInBox(vertexPosition[0],this.box3.minVertex, this.box3.maxVertex ) )
                {
                    this.endPoint.push(vertexPosition[0]);
                    this.startPoint.push(vertexPosition[vertexPosition.length -2]);
                }
                /*else
                {
                    this.startPoint.push(vertexPosition[0]);
                    this.endPoint.push(vertexPosition[vertexPosition.length -2]);
                }*/


                if( pointInBox( vertexPosition[vertexPosition.length -2],this.box1.minVertex, this.box1.maxVertex )
                    || pointInBox( vertexPosition[vertexPosition.length -2],this.box2.minVertex, this.box2.maxVertex )
                    || pointInBox(vertexPosition[vertexPosition.length -2],this.box3.minVertex, this.box3.maxVertex ) )
                {
                    this.endPoint.push(vertexPosition[vertexPosition.length -2]);
                    this.startPoint.push(vertexPosition[0]);
                }
               // else
               //     this.startPoint.push(vertexPosition[vertexPosition.length -2]);

            }

            this.center = new THREE.Vector3((positionminx + positionmaxx)/2.0,
                    (positionminy + positionmaxy)/2.0, (positionminz + positionmaxz)/2.0);

            geometry = new TubeGeometry(
                vertexPosition,
                    vertexPosition.length -1,
                0.5,
                6,
                false,
                ChoosenState
            );
            geometry.uuid = i;
            material = new THREE.MeshPhongMaterial({vertexColors: THREE.VertexColors,shininess: 10});
            //material = new THREE.MeshPhongMaterial();
            mesh = new THREE.Mesh( geometry, material );

            object.add( mesh );

            startNum+=parseInt(totalVertexNum)+1;
        }
        return object;
    }

};

