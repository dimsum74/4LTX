function CloseVisualization(){
    console.log("release memory");
    var canvasparent = document.getElementById("VisualizationContainer");
    var canvas = canvasparent.getElementsByTagName('canvas');
    wood_1 = undefined;
    metal_1 = undefined;
    brackettexture = undefined;
    material !== undefined
    if (canvas.length>0) {
        canvasparent.removeChild(canvas[0]);
    }
    window.cancelAnimationFrame(requestId);
    requestId = undefined;
}

function generate3D(){
    document.getElementById('showmodal2').click();
    //document.getElementById("Visualization").style.visibility = "visible";

    init();
    animate();



}

function updatemouselocation(){
    mousex = event.clientX;
    mousey = event.clientY;
    console.log(mousex+" "+mousey);
}

var scene, camera, renderer;
var geometry, material, mesh, container;
var cameraControls, headlight;
var clock = new THREE.Clock();
var wood_1, metal_1, brackettexture;
var requestId;
var mousex,mousey;
var steelthickness;


function init() {

    steelthickness = 0.06*scale;
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 300, 300, 300 );
    //camera.lookAt( new THREE.Vector3( 300, 300, 0 ) );



    //create frames
    var framels = document.getElementsByClassName("frame");
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0, length = 0;
    container = new THREE.Object3D();
    for (var i=0; i<framels.length; ++i){
        x1 = framels[i].getAttribute('x1');
        y1 = framels[i].getAttribute('y1');
        x2 = framels[i].getAttribute('x2');
        y2 = framels[i].getAttribute('y2');
        length = Math.max(+Math.abs(+x1- +x2), +Math.abs(+y1- +y2));
        if (+x1 == +x2){
            container.add(createframe(framels[i].getAttribute("thickness")*scale,
                length, framels[i].getAttribute('width')*scale, (+x1+ +x2)/2, -(+y1+ +y2)/2, steelthickness, -500, framels[i].getAttribute('material')));
        }else{
            container.add(createframe(length, framels[i].getAttribute("thickness")*scale,
                    framels[i].getAttribute('width')*scale, (+x1+ +x2)/2, -(+y1+ +y2)/2, steelthickness, -500, framels[i].getAttribute('material')));
        }
    }

    //generate brackets
    var nodels = document.getElementsByClassName("node");
    var x = 0, y = 0, direction = 0;
    for (var i=0; i<nodels.length; ++i){
        x = nodels[i].getAttribute('x');
        y = nodels[i].getAttribute('y');
        direction = nodels[i].getAttribute('direction');
        container.add(createbracket(+document.getElementById('width').value*scale+ +0.5*steelthickness, x , -y, direction, -500, false));
        container.add(createbracket(0, x , -y, direction, -500, true));
    }

    scene.add(container);


    //add ground
    var solidGround = new THREE.Mesh(
        new THREE.PlaneGeometry( 2000, 500 ),
        new THREE.MeshPhongMaterial({ color: 0xFFFFFF,
            // polygonOffset moves the plane back from the eye a bit, so that the lines on top of
            // the grid do not have z-fighting with the grid:
            // Factor == 1 moves it back relative to the slope (more on-edge means move back farther)
            // Units == 4 is a fixed amount to move back, and 4 is usually a good value
            polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 4.0
        }));
    solidGround.receiveShadow = true;
    solidGround.rotation.x = -Math.PI / 2;
    solidGround.translateX(500);
    solidGround.translateY(-250);
    scene.add( solidGround );

    //add wall
    var solidWall = new THREE.Mesh(
        new THREE.PlaneGeometry( 2000, 1500 ),
        new THREE.MeshPhongMaterial({ color: 0xFFFFFF,
            // polygonOffset moves the plane back from the eye a bit, so that the lines on top of
            // the grid do not have z-fighting with the grid:
            // Factor == 1 moves it back relative to the slope (more on-edge means move back farther)
            // Units == 4 is a fixed amount to move back, and 4 is usually a good value
            polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 4.0
        }));
    solidWall.receiveShadow = true;
    solidWall.translateX(500);
    solidWall.translateY(750);
    //solidWall.translateZ(0);
    //solidWall.rotation.x = -Math.PI / 2;
    scene.add( solidWall );



    renderer = new THREE.WebGLRenderer();
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setClearColor( 0xffffff, 1);
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
    mousex = 400;
    mousey = 310;
    cameraControls.target.set(400,310,0);

    var canvasparent = document.getElementById("VisualizationContainer");
    var canvas = canvasparent.getElementsByTagName('canvas');
    if (canvas.length>0) {
        canvasparent.removeChild(canvas[0]);
    }
    canvasparent.appendChild( renderer.domElement );
    var axes = buildAxes( 1500 );
    scene.add(axes);

    headlight = new THREE.PointLight( 0xFFFFFF,1.0 );
    scene.add(headlight);

    spotlight = new THREE.SpotLight( 0xFFFFFF, 1.0 );
    spotlight.position.set( 800, 1200, 800 );
    spotlight.angle = 20 * Math.PI / 180;
    spotlight.exponent = 1;
    spotlight.target.position.set( 400, 300, 0 );
    spotlight.castShadow = true;
    spotlight.shadowMapWidth = 2048;
    spotlight.shadowMapHeight = 2048;
    scene.add( spotlight );



}
function loadtexture(texture){
    var texturereturn = THREE.ImageUtils.loadTexture( texture+".jpeg" );
    texturereturn.wrapS = THREE.RepeatWrapping;
    texturereturn.wrapT = THREE.RepeatWrapping;
    texturereturn.repeat.set( 2, 2 );
    return texturereturn;
}
function createframe(length, width, depth, locationx, locationy, locationzoffset, offset, text){
    geometry = new THREE.BoxGeometry( length, width, depth );
    switch(text) {
        case "wood_1":
            if (wood_1 === undefined) {
                wood_1 = loadtexture(text);
            }
            material = new THREE.MeshLambertMaterial( { map: wood_1 } );
            break;
        case "metal_1":
            if (metal_1 === undefined) {
                metal_1 = loadtexture(text);
            }
            material = new THREE.MeshPhongMaterial({
                map: metal_1 ,
                ambient: 0x030303,
                specular: 0xffffff,
                shininess: 90
            });
            break;
        default:
            alert("cannot find texture: "+text);
    }

    var cube = new THREE.Mesh( geometry, material );
    cube.matrixAutoUpdate = false;
    cube.matrix.makeTranslation( +locationx, locationy-offset, +(depth/2)+ +locationzoffset/2 );
    cube.castShadow = true;
    cube.receiveShadow = true;
    return cube;

}
//mark!
function createbracket(depth, locationx, locationy, direction, offset, flip){
    var pts = [];
    pts.push(new THREE.Vector3( -halfthick*scale-steelthickness, -halfthick*scale, steelthickness ));//0
    pts.push(new THREE.Vector3( -halfthick*scale-steelthickness, -(2.5+halfthick)*scale, steelthickness ));//1
    pts.push(new THREE.Vector3( +halfthick*scale+ +steelthickness, -(2.5+halfthick)*scale, steelthickness ));//2
    pts.push(new THREE.Vector3( +halfthick*scale+ +steelthickness, -(1.5+halfthick)*scale, steelthickness ));//3
    pts.push(new THREE.Vector3( (1.5+halfthick)*scale, -halfthick*scale-steelthickness, steelthickness ));//4
    pts.push(new THREE.Vector3( (2.5+halfthick)*scale, -halfthick*scale-steelthickness, steelthickness ));//5
    pts.push(new THREE.Vector3( (2.5+halfthick)*scale, +halfthick*scale+ +steelthickness, steelthickness ));//6
    pts.push(new THREE.Vector3( halfthick*scale, +halfthick*scale+ +steelthickness, steelthickness ));//7

    var extrudeSettings = {
        amount			: steelthickness,
        steps			: 1,
        material		: 0,
        extrudeMaterial : 0,
        bevelEnabled	: false,
        bevelThickness  : 2,
        bevelSize       : 4,
        bevelSegments   : 1
    };

    var geometry = new THREE.ExtrudeGeometry( new THREE.Shape( pts ), extrudeSettings );
    if (brackettexture === undefined) {
        brackettexture = loadtexture("brackettexture");
    }

    material = new THREE.MeshPhongMaterial({
        map: brackettexture,
        specular: 0xCCCCCC,
        shininess: 20
    });

    var bracketbody = new THREE.Mesh( geometry, material );
    var container = new THREE.Object3D();
    container.add(bracketbody);

    //#1
    container.add(createbox(material, 2.5*scale, steelthickness, 2*halfthick*scale,
            (1.25+halfthick)*scale, +halfthick*scale+ +0.5*steelthickness, -halfthick*scale));
    //#2
    container.add(createbox(material, 2*halfthick*scale, steelthickness, 2*halfthick*scale,
            2.5*scale, -halfthick*scale-0.5*steelthickness, -halfthick*scale));
    //#3
    container.add(createbox(material, 2.5*scale, steelthickness, 2*halfthick*scale,
            -halfthick*scale-0.5*steelthickness, -(1.25+halfthick)*scale, -halfthick*scale, new THREE.Vector3(0,0,1), -90));
    //#4
    container.add(createbox(material, 2*halfthick*scale, steelthickness, 2*halfthick*scale,
            +halfthick*scale+ 0.5*steelthickness, -2.5*scale, -halfthick*scale, new THREE.Vector3(0,0,1), -90));

    container.matrixAutoUpdate = false;
    container.castShadow = true;
    container.receiveShadow = true;

    var multitransform;
    if (flip === true){
        container.matrix.makeTranslation( +locationx, locationy-offset, steelthickness );
        multitransform = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1,-1,0).normalize() , Math.PI);
        multitransform = multitransform.multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0,0,1).normalize() , direction*Math.PI/180));
    }else{
        container.matrix.makeTranslation( +locationx, locationy-offset, depth );
        multitransform = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0,0,1).normalize() , -direction*Math.PI/180);
    }
    container.matrix.multiply(multitransform);
    return container;

}


function createbox(materials, length, width, depth, locationx, locationy, locationz, raxis, rdegree){
    geometry = new THREE.BoxGeometry( length, width, depth );
    var result = new THREE.Mesh( geometry, materials );
    result.matrixAutoUpdate = false;
    result.matrix.makeTranslation( locationx, locationy, locationz );
    if (raxis !== undefined) {
        result.matrix.multiply(new THREE.Matrix4().makeRotationAxis(raxis.normalize(), rdegree * Math.PI / 180));
    }
    return result;
}


function animate() {

    requestId = requestAnimationFrame( animate );
    //cameraControls.addEventListener( 'change', render );
    //container.rotation.x += 0.001;
    //container.rotation.y += 0.002;

    //renderer.render( scene, camera );
    render();

}

function buildAxes( length ) {
    var axes = new THREE.Object3D();
    console.log(length);
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
    axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

    return axes;

}


function buildAxis( src, dst, colorHex, dashed ) {
    var geom = new THREE.Geometry(),
        mat;

    if(dashed) {
        mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
    } else {
        mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
    }

    geom.vertices.push( src.clone() );
    geom.vertices.push( dst.clone() );
    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

    var axis = new THREE.Line( geom, mat, THREE.LinePieces );

    return axis;

}

function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);

    // Student: set the headlight's position here.
    headlight.position.set(camera.position.x+100, camera.position.y+100, camera.position.z);
    //cameraControls.target.set(mousex,mousey,0);
    ///////////////
    renderer.render(scene, camera);
}