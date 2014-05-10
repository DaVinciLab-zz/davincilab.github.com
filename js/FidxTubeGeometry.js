/**
 * Created by Yongnanzhu on 4/13/2014.
 */

/**
 * @author WestLangley / https://github.com/WestLangley
 * @author zz85 / https://github.com/zz85
 * @author miningold / https://github.com/miningold
 *
 * Modified from the TorusKnotGeometry by @oosmoxiecode
 *
 * Creates a tube which extrudes along a 3d spline
 *
 * Uses parallel transport frames as described in
 * http://www.cs.indiana.edu/pub/techreports/TR425.pdf
 */

TubeGeometry = function( path, segments, radius, radialSegments, closed) {

    THREE.Geometry.call(this);

    this.path = path;
    this.segments = segments || 64;
    this.radius = radius || 1;
    this.radialSegments = radialSegments || 8;
    this.closed = closed || false;

    this.grid = [];

    var scope = this;

    var tangent;
    var normal;
    var binormal;

    var numpoints = this.segments + 1;

    var x;
    var y;
    var z;
    var tx;
    var ty;
    var tz;
    var u;
    var v;
    var cx;
    var cy;
    var pos = new THREE.Vector3();
    var pos2 = new THREE.Vector3();
    var i;
    var j;
    var ip;
    var jp;
    var a, b, c, d,
        uva, uvb, uvc, uvd;

    var frames = new TubeGeometry.FrenetFrames(this.path, this.segments, this.closed),
        tangents = frames.tangents,
        normals = frames.normals,
        binormals = frames.binormals;

    // proxy internals
    this.tangents = tangents;
    this.normals = normals;
    this.binormals = binormals;

    function vert(x, y, z) {
        return scope.vertices.push(new THREE.Vector3(x,
            y, z)) - 1;
    }

    //function color(r,g,b){
    //scope.colors.push( new THREE.Color( r,g, b ) ) ;
    //}

    // consruct the grid

    for (i = 0; i < numpoints - 1; i++) {

        this.grid[ i ] = [];

        //u = i / ( numpoints- 1  );
        pos = path[i];
        //pos = path.getPointAt( u );

        tangent = tangents[ i ];
        normal = normals[ i ];
        binormal = binormals[ i ];

        for (j = 0; j < this.radialSegments; j++) {

            v = j / this.radialSegments * 2 * Math.PI;

            cx = -this.radius * Math.cos(v); // TODO: Hack: Negating it so it faces outside.
            cy = this.radius * Math.sin(v);

            pos2.copy(pos);
            pos2.x += cx * normal.x + cy * binormal.x;
            pos2.y += cx * normal.y + cy * binormal.y;
            pos2.z += cx * normal.z + cy * binormal.z;

            this.grid[ i ][ j ] = vert(pos2.x, pos2.y, pos2.z);
            //color(vertexColor[i].x,vertexColor[i].y,vertexColor[i].z);
        }
    }

    var white = new THREE.Color(0xFFFFFF);
    var yellow = new THREE.Color(0xFFFF00);
    var red = new THREE.Color(0xFF0000);
    // construct the mesh for the tube
    var faceIdx = 0;
    for (i = 0; i < this.segments - 1; i++) {

        for (j = 0; j < this.radialSegments; j++) {

            ip = ( this.closed ) ? (i + 1) % this.segments : i + 1;
            jp = (j + 1) % this.radialSegments;

            a = this.grid[ i ][ j ];		// *** NOT NECESSARILY PLANAR ! ***
            b = this.grid[ ip ][ j ];
            c = this.grid[ ip ][ jp ];
            d = this.grid[ i ][ jp ];

            uva = new THREE.Vector2(i / (this.segments - 1), j / this.radialSegments);
            uvb = new THREE.Vector2(( i + 1 ) / (this.segments - 1), j / this.radialSegments);
            uvc = new THREE.Vector2(( i + 1 ) / (this.segments - 1), ( j + 1 ) / this.radialSegments);
            uvd = new THREE.Vector2(i / (this.segments - 1), ( j + 1 ) / this.radialSegments);

            this.faces.push(new THREE.Face3(a, b, d));
            this.faceVertexUvs[ 0 ].push([ uva, uvb, uvd ]);

            this.faces[ faceIdx ].vertexColors[0] = white;
            this.faces[ faceIdx ].vertexColors[1] = white;
            this.faces[ faceIdx ].vertexColors[2] = white;
            this.faces.push(new THREE.Face3(b, c, d));
            faceIdx++;
            this.faceVertexUvs[ 0 ].push([ uvb.clone(), uvc, uvd.clone() ]);

            this.faces[ faceIdx ].vertexColors[0] = white;
            this.faces[ faceIdx].vertexColors[1] = white;
            this.faces[ faceIdx ].vertexColors[2] = white;
            faceIdx++;
        }
    }

    // construct the mesh for the cap

    for (j = 0; j < this.radialSegments - 2; j++) {
        //a = this.grid[ 0 ][ 0 ];		// *** NOT NECESSARILY PLANAR ! ***
        //b = this.grid[ 0 ][ j+1 ];
        //c = this.grid[ 0][ j+2 ];
        //To do: need to calcuate the uv
        //uva = new THREE.Vector2( 0, j / this.radialSegments );
        //uvb = new THREE.Vector2( ( i + 1 ) / (this.segments -1), j / this.radialSegments );
        //uvc = new THREE.Vector2( ( i + 1 ) / (this.segments -1), ( j + 1 ) / this.radialSegments );
        //uvd = new THREE.Vector2( i / (this.segments -1), ( j + 1 ) / this.radialSegments );
        //this.faces.push(new THREE.Face3( a, b, c ));
        this.faces.push(new THREE.Face3(0, j + 1, j + 2));
        this.faces[ faceIdx ].vertexColors[0] = white;
        this.faces[ faceIdx ].vertexColors[1] = white;
        this.faces[ faceIdx ].vertexColors[2] = white;
        faceIdx++;
    }

    //for the back cap

    for (j = 0; j < this.radialSegments - 2; j++) {
        //a = this.grid[ this.segments-1 ][ 0 ];		// *** NOT NECESSARILY PLANAR ! ***
        //b = this.grid[ this.segments-1 ][ j+1 ];
        //c = this.grid[ this.segments-1][ j+2 ];
        //To do: need to calcuate the uv
        //uva = new THREE.Vector2( 0, j / this.radialSegments );
        //uvb = new THREE.Vector2( ( i + 1 ) / (this.segments -1), j / this.radialSegments );
        //uvc = new THREE.Vector2( ( i + 1 ) / (this.segments -1), ( j + 1 ) / this.radialSegments );
        //uvd = new THREE.Vector2( i / (this.segments -1), ( j + 1 ) / this.radialSegments );
        //this.faces.push(new THREE.Face3( a, b, c ));
        this.faces.push(new THREE.Face3(this.vertices.length - 1, this.vertices.length - j - 2, this.vertices.length - j - 3));
        this.faces[ faceIdx ].vertexColors[0] = white;
        this.faces[ faceIdx ].vertexColors[1] = white;
        this.faces[ faceIdx ].vertexColors[2] = white;
        faceIdx++;
    }

    this.computeCentroids();
    this.computeFaceNormals();
    this.computeVertexNormals();
    //this.computeBoundingBox();
};

TubeGeometry.prototype = Object.create( THREE.Geometry.prototype );

// For computing of Frenet frames, exposing the tangents, normals and binormals the spline
TubeGeometry.FrenetFrames = function(path, segments, closed)
{

    var	tangent = new THREE.Vector3(),
        normal = new THREE.Vector3(),
        binormal = new THREE.Vector3(),

        tangents = [],
        normals = [],
        binormals = [],

        vec = new THREE.Vector3(),
        mat = new THREE.Matrix4(),

        numpoints = segments + 1,
        theta,
        epsilon = 0.0001,
        smallest,

        tx, ty, tz,
        i, u, v;


    // expose internals
    this.tangents = tangents;
    this.normals = normals;
    this.binormals = binormals;

    // compute the tangent vectors for each segment on the path
    /*
     for ( i = 0; i < numpoints; i++ ) {

     u = i / ( numpoints - 1 );

     tangents[ i ] = path.getTangentAt( u );
     tangents[ i ].normalize();

     } */

    // compute the tangent vectors for each segment on the path
    for ( i = 1; i < numpoints; i++ )
    {

        //  i-2          i-1   |      i           i+1
        //--*------------*-----|------*-----------*----
        //  pos3         pos2  |     pos          pos0
        var tmp = new THREE.Vector3();
        tmp.subVectors(path[i], path[i-1]);
        tmp.normalize();
        tangents.push(tmp);
    }

    initialNormal3();

    function initialNormal1(lastBinormal)
    {
        // fixed start binormal. Has dangers of 0 vectors
        normals[ 0 ] = new THREE.Vector3();
        binormals[ 0 ] = new THREE.Vector3();
        if (lastBinormal===undefined) lastBinormal = new THREE.Vector3( 0, 0, 1 );
        normals[ 0 ].crossVectors( lastBinormal, tangents[ 0 ] ).normalize();
        binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] ).normalize();
    }

    function initialNormal2()
    {

        // This uses the Frenet-Serret formula for deriving binormal
        var t2 = path.getTangentAt( epsilon );

        normals[ 0 ] = new THREE.Vector3().subVectors( t2, tangents[ 0 ] ).normalize();
        binormals[ 0 ] = new THREE.Vector3().crossVectors( tangents[ 0 ], normals[ 0 ] );

        normals[ 0 ].crossVectors( binormals[ 0 ], tangents[ 0 ] ).normalize(); // last binormal x tangent
        binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] ).normalize();

    }

    function initialNormal3()
    {
        // select an initial normal vector perpenicular to the first tangent vector,
        // and in the direction of the smallest tangent xyz component

        normals[ 0 ] = new THREE.Vector3();
        binormals[ 0 ] = new THREE.Vector3();
        smallest = Number.MAX_VALUE;
        tx = Math.abs( tangents[ 0 ].x );
        ty = Math.abs( tangents[ 0 ].y );
        tz = Math.abs( tangents[ 0 ].z );

        if ( tx <= smallest )
        {
            smallest = tx;
            normal.set( 1, 0, 0 );
        }

        if ( ty <= smallest )
        {
            smallest = ty;
            normal.set( 0, 1, 0 );
        }

        if ( tz <= smallest )
        {
            normal.set( 0, 0, 1 );
        }

        vec.crossVectors( tangents[ 0 ], normal ).normalize();

        normals[ 0 ].crossVectors( tangents[ 0 ], vec );
        binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] );
    }


    // compute the slowly-varying normal and binormal vectors for each segment on the path

    for ( i = 1; i < numpoints-1; i++ )
    {

        normals[ i ] = normals[ i-1 ].clone();

        binormals[ i ] = binormals[ i-1 ].clone();

        vec.crossVectors( tangents[ i-1 ], tangents[ i ] );

        if ( vec.length() > epsilon )
        {

            vec.normalize();

            theta = Math.acos( THREE.Math.clamp( tangents[ i-1 ].dot( tangents[ i ] ), -1, 1 ) ); // clamp for floating pt errors

            normals[ i ].applyMatrix4( mat.makeRotationAxis( vec, theta ) );

        }

        binormals[ i ].crossVectors( tangents[ i ], normals[ i ] );

    }


    // if the curve is closed, postprocess the vectors so the first and last normal vectors are the same

    if ( closed )
    {

        theta = Math.acos( THREE.Math.clamp( normals[ 0 ].dot( normals[ numpoints-1 ] ), -1, 1 ) );
        theta /= ( numpoints - 1 );

        if ( tangents[ 0 ].dot( vec.crossVectors( normals[ 0 ], normals[ numpoints-1 ] ) ) > 0 ) {

            theta = -theta;

        }

        for ( i = 1; i < numpoints-1; i++ )
        {

            // twist a little...
            normals[ i ].applyMatrix4( mat.makeRotationAxis( tangents[ i ], theta * i ) );
            binormals[ i ].crossVectors( tangents[ i ], normals[ i ] );

        }

    }
};

