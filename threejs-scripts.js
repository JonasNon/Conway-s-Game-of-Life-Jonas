import * as THREE from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';


let gray = 0x808080
let lime = 0x00ff00
let black = 0x000000
let white = 0xFFFFFF

let zoomAdjuster = 100 //bigger number = more zoomed in
let storedDots = []
let panSpeed = 150 //lower number = faster panning
let zoomSpeed = .0001; //
let gridWidth = screen.width/50  // starting grid size
let gridHeight = screen.height/50
let gridArea = gridHeight*gridWidth
let fadeDistanceX = screen.availWidth/90
let fadeDistanceY = screen.availHeight/90
console.log(screen.width/80)





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const cameraO = new THREE.OrthographicCamera( screen.width / - zoomAdjuster, screen.width / zoomAdjuster, screen.height / zoomAdjuster, screen.height / - zoomAdjuster, 1, 100 );
cameraO.setViewOffset(10000, 10000, 0, 0, 10000, 10000)
camera.updateProjectionMatrix()

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: lime } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 5;
cameraO.position.z = 20;


function animate() {
  // cube.rotateY(.02)
	renderer.render( scene, cameraO );
}
renderer.setAnimationLoop( animate );




let mouseDown = false
const togglePanMode = () => {
  console.log("Toggle Pan Mode")

  //just toggles mousedown from on to off or off to on
  if (mouseDown == true) {
    mouseDown = false
  } else {
    mouseDown = true
  }
}
renderer.domElement.addEventListener('mousedown', togglePanMode)
renderer.domElement.addEventListener('mouseup', togglePanMode)
renderer.domElement.addEventListener('contextmenu', event => event.preventDefault());


let oldx = 0;
let oldy = 0;
let moudulusCounter = 17
let leftModulusCounter = 17

const onMouseMove = (e) =>{
  // console.log("Mouse Movement")
  if (mouseDown) {

   
    cube.position.x += e.movementX/panSpeed
    cube.position.y -= e.movementY/panSpeed
        
   

    for (let i = 0; i < storedDots.length; i++) {
      storedDots[i].w += e.movementX/panSpeed
      storedDots[i].h += e.movementY/panSpeed

      storedDots[i].mesh.position.x += e.movementX/panSpeed
      storedDots[i].mesh.position.y -= e.movementY/panSpeed

      storedDots[i].outline.position.x += e.movementX/panSpeed
      storedDots[i].outline.position.y -= e.movementY/panSpeed
    }



    oldx = e.pageX;
    oldy = e.pageY;

    // renderVisibleDots()

    // renderByRowColumn()
    // console.log(storedDots[0].mesh.position.x)
    // console.log(Math.abs(Math.trunc(storedDots[0].mesh.position.x)) % moudulusCounter)
    // console.log(moudulusCounter)
    console.log(Math.abs(Math.trunc(storedDots[storedDots.length-1].mesh.position.x))  % leftModulusCounter)
    if (Math.abs(Math.trunc(storedDots[0].mesh.position.x)) % moudulusCounter == 0) {
      renderByRowColumn()
    } else if (Math.abs(Math.trunc(storedDots[storedDots.length-1].mesh.position.x)) % leftModulusCounter == 0) {
      renderByRowColumn()
    }

  } else {
    return
  }
}
renderer.domElement.addEventListener('mousemove', onMouseMove)







function zoom(event) {
  event.preventDefault();
  console.log(event)

  if (event.deltaY > 0) {
    console.log("Zoom out")
    zoomAdjuster -= zoomSpeed
    cameraO.setViewOffset(cameraO.view.fullWidth + zoomSpeed, cameraO.view.fullHeight + zoomSpeed, cameraO.pageX, cameraO.pageY, cameraO.view.width + zoomSpeed, cameraO.view.height + zoomSpeed)

  } else {
    console.log("Zoom in")
    zoomAdjuster += zoomSpeed
    cameraO.setViewOffset(cameraO.view.fullWidth - zoomSpeed, cameraO.view.fullHeight - zoomSpeed, cameraO.pageX, cameraO.pageY, cameraO.view.width - zoomSpeed, cameraO.view.height - zoomSpeed)

  }
  console.log(cameraO)

  cameraO.updateProjectionMatrix()
  
}

renderer.domElement.onwheel = zoom;





// const panCamera = () => {

// }










class DOT {
  constructor(row, column, isAlive, mesh, outline) {
    this.row = row
    this.column = column
    this.isAlive = isAlive
    this.mesh = mesh
    this.outline = outline
  }

  getLivingNeighbors() {


    return //count of all neiboring dots that are alive
  }
}



//add modulus that once passes, adds the amount of the modulus to a counter. that counter subtracts from camereO.position.x 

let distanceCounter = 0


let establishedRightSide = false
let farRight





const renderVisibleDots = () => {
  if (storedDots[0] == undefined) {
    for (let w = 0; w < gridWidth; w++) {
      for (let h = 0; h < gridHeight; h++) {
        
      
        let newMesh = new THREE.PlaneGeometry( 0.9, 0.9 )
        let newMaterial = new THREE.MeshBasicMaterial( {color: white, side: THREE.DoubleSide} )
        const plane = new THREE.Mesh(newMesh, newMaterial);
        plane.position.x = w - gridWidth/2
        plane.position.y = h - gridHeight/2
        plane.renderOrder = 1
        scene.add(plane)


        let newOutline = new THREE.PlaneGeometry( 1, 1 )
        let newOutlineMaterial = new THREE.MeshBasicMaterial( {color: black, side: THREE.DoubleSide} )
        const planeOutline = new THREE.Mesh(newOutline, newOutlineMaterial);
        planeOutline.position.x = w - gridWidth/2
        planeOutline.position.y = h - gridHeight/2
        planeOutline.position.z -= 5
        planeOutline.renderOrder = 1
        scene.add(planeOutline)

        
        let newDot = new DOT(w, h, false, plane, planeOutline)
        newDot.x = w
        newDot.y = h
        storedDots.push(newDot)
        // console.log(newDot)
    

        
      }
    }
  } else {
    // console.log((storedDots[0].mesh.position.x - cameraO.position.x))
    let newDotArray = storedDots
    let toBeSpliced = []
    if (establishedRightSide != true) {
      farRight = Math.max(...storedDots.map(o => o.row), 0);
      establishedRightSide = true
    }
    for (let i = 0; i < storedDots.length; i++) {
      // console.log(storedDots[0].mesh.position.x - cameraO.position.x)

      if (Math.round(storedDots[i].mesh.position.x - cameraO.position.x) % (fadeDistanceX - distanceCounter)) {}

      if (Math.abs(storedDots[i].mesh.position.x - cameraO.position.x) > fadeDistanceX || Math.abs(storedDots[i].mesh.position.y - cameraO.position.x) > fadeDistanceY) {
        if (storedDots[i].mesh.position.x - cameraO.position.x < 0) {//a box scrolled offscreen to the left
          // console.log(storedDots.map(function(e) { return e.row; }).indexOf(farRight)) //this line is calling on every mouse movement
          establishedRightSide = false
          
          let newX = storedDots[storedDots.map(function(e) { return e.row; }).indexOf(farRight)].mesh.position.x + 1

          // console.log(newX)
          let newMesh = new THREE.PlaneGeometry( 0.9, 0.9 )
          let newMaterial = new THREE.MeshBasicMaterial( {color: white, side: THREE.DoubleSide} )
          const plane = new THREE.Mesh(newMesh, newMaterial);
          plane.position.x = newX
          plane.position.y = storedDots[i].mesh.position.y
          plane.renderOrder = 1
          scene.add(plane)


          let newOutline = new THREE.PlaneGeometry( 1, 1 )
          let newOutlineMaterial = new THREE.MeshBasicMaterial( {color: black, side: THREE.DoubleSide} )
          const planeOutline = new THREE.Mesh(newOutline, newOutlineMaterial);
          planeOutline.position.x = newX
          planeOutline.position.y = storedDots[i].outline.position.y
          planeOutline.position.z -= 5
          scene.add(planeOutline)

          let newRow = Math.max(...storedDots.map(o => o.row), 0)
          let newColumn = storedDots[i].column + 1


          let replacementDot = new DOT(newRow, newColumn, false, plane, planeOutline)
          toBeSpliced.push(i)
          newDotArray.push(replacementDot)
          console.log(replacementDot)
          // let replacementDot = new DOT((Math.max.apply(Math, storedDots.map(function(o) { return o.row; }))) + 1, storedDots[i].column, false)
        } else if (storedDots[i].mesh.position.x - cameraO.position.x > 0){//a box scrolled offscreen to the right
          let replacementDot = new DOT()
        } else {

        }
        // storedDots.splice(i, 1)
        //generate another dot on the opposite side of the deleted dot
      }

      // if (storedDots[i].mesh.position.distanceTo(cameraO.position) > fadeDistance) {
      //   storedDots.splice(i, i+1)
      // }
    }
    storedDots = newDotArray
    for (let i = toBeSpliced.length - 1; i > 0; i--) {
      storedDots.splice(toBeSpliced[i], 1)
    }
    toBeSpliced = []
    
  }
  cameraO.updateProjectionMatrix()
  
  // console.log(storedDots)
}
// renderVisibleDots()










let previousStart
let newDotArray
const renderByRowColumn = () => {
  if (storedDots[0] == undefined) {
    for (let w = 0; w < gridWidth; w++) {
      for (let h = 0; h < gridHeight; h++) {
        
      
        let newMesh = new THREE.PlaneGeometry( 0.9, 0.9 )
        let newMaterial = new THREE.MeshBasicMaterial( {color: white, side: THREE.DoubleSide} )
        const plane = new THREE.Mesh(newMesh, newMaterial);
        plane.position.x = w - gridWidth/2
        plane.position.y = h - gridHeight/2
        plane.renderOrder = 1
        scene.add(plane)


        let newOutline = new THREE.PlaneGeometry( 1, 1 )
        let newOutlineMaterial = new THREE.MeshBasicMaterial( {color: black, side: THREE.DoubleSide} )
        const planeOutline = new THREE.Mesh(newOutline, newOutlineMaterial);
        planeOutline.position.x = w - gridWidth/2
        planeOutline.position.y = h - gridHeight/2
        planeOutline.position.z -= 5
        planeOutline.renderOrder = 1
        scene.add(planeOutline)

        
        let newDot = new DOT(w, h, false, plane, planeOutline)
        newDot.x = w
        newDot.y = h
        storedDots.push(newDot)
        // console.log(newDot)
        previousStart = storedDots[0].mesh.position.x

        
      }
    }
  } else {
    let rightEdge
    let leftEdge
    let toBeSpliced = []
    let rightEdgePieces = []
    let leftEdgePieces = []
    
    console.log(storedDots[0].mesh.position.x)
    if (storedDots[0].mesh.position.x < 0) { //a box scrolled offscreen to the left //except not and this line needs to be fixed to better determine that
      previousStart = storedDots[0].mesh.position.x

      rightEdge = Math.max(...storedDots.map(o => o.row), 0)
      leftEdge = Math.min(...storedDots.map(o => o.row))
      console.log(leftEdge)


      newDotArray = storedDots
      toBeSpliced = []
      rightEdgePieces = []
      leftEdgePieces = []
      
      console.log(storedDots.length)

      for (let j = 0; j < storedDots.length; j++) {
        if (storedDots[j].row == rightEdge) {
          rightEdgePieces.push(storedDots[j])
        }
        // console.log(storedDots[j].column)
      }
      for (let j = 0; j < storedDots.length; j++) {
        if (storedDots[j].row == leftEdge) {
          leftEdgePieces.push(storedDots[j])
          toBeSpliced.push(j)
        }
        // console.log(storedDots[j].column)
      }


      for (let r = 0; r < rightEdgePieces.length; r++) {
        // console.log("Hello",newX, newY)

        // let newY = storedDots[storedDots.map(function(e) { return e.row; }).indexOf(rightEdge - 1)].mesh.position.y
        let newX = rightEdgePieces[r].mesh.position.x + 1
        let newY = rightEdgePieces[r].mesh.position.y

        let newMesh = new THREE.PlaneGeometry( 0.9, 0.9 )
        let newMaterial = new THREE.MeshBasicMaterial( {color: white, side: THREE.DoubleSide} )
        const plane = new THREE.Mesh(newMesh, newMaterial);
        plane.position.x = newX
        plane.position.y = newY
        plane.renderOrder = 1
        scene.add(plane)
  
  
        let newOutline = new THREE.PlaneGeometry( 1, 1 )
        let newOutlineMaterial = new THREE.MeshBasicMaterial( {color: black, side: THREE.DoubleSide} )
        const planeOutline = new THREE.Mesh(newOutline, newOutlineMaterial);
        planeOutline.position.x = newX
        planeOutline.position.y = newY
        planeOutline.position.z -= 5
        planeOutline.renderOrder = 1
        scene.add(planeOutline)


        let newRow = rightEdgePieces[r].row + 1
        let newColumn = storedDots[r].column


        let replacementDot = new DOT(newRow, newColumn, false, plane, planeOutline)
        newDotArray.push(replacementDot)

      }
      storedDots = newDotArray
      console.log(leftEdge)
      // console.log(storedDots)
      for (let i = storedDots.length - 1; i >= 0; i--) {
        // console.log()
        if (storedDots[i].row == leftEdge) {
          storedDots.splice(i, 1)
        }
      }
      toBeSpliced = []



    } else if (storedDots[storedDots.length-1].mesh.position.x > 0) { //a box scrolled offscreen to the right
      previousStart = storedDots[0].mesh.position.x

      rightEdge = Math.max(...storedDots.map(o => o.row), 0)
      leftEdge = Math.min(...storedDots.map(o => o.row))
      console.log(rightEdge)


      newDotArray = storedDots
      toBeSpliced = []
      rightEdgePieces = []
      leftEdgePieces = []
      
      console.log(storedDots.length)

      for (let j = 0; j < storedDots.length; j++) {
        if (storedDots[j].row == rightEdge) {
          rightEdgePieces.push(storedDots[j])
          toBeSpliced.push(j)
        }
      }
      for (let j = 0; j < storedDots.length; j++) {
        if (storedDots[j].row == leftEdge) {
          leftEdgePieces.push(storedDots[j])
        }
      }


      for (let r = 0; r < leftEdgePieces.length; r++) {

        let newX = leftEdgePieces[r].mesh.position.x - 1
        let newY = leftEdgePieces[r].mesh.position.y

        let newMesh = new THREE.PlaneGeometry( 0.9, 0.9 )
        let newMaterial = new THREE.MeshBasicMaterial( {color: white, side: THREE.DoubleSide} )
        const plane = new THREE.Mesh(newMesh, newMaterial);
        plane.position.x = newX
        plane.position.y = newY
        plane.renderOrder = 1
        scene.add(plane)
  
  
        let newOutline = new THREE.PlaneGeometry( 1, 1 )
        let newOutlineMaterial = new THREE.MeshBasicMaterial( {color: black, side: THREE.DoubleSide} )
        const planeOutline = new THREE.Mesh(newOutline, newOutlineMaterial);
        planeOutline.position.x = newX
        planeOutline.position.y = newY
        planeOutline.position.z -= 5
        planeOutline.renderOrder = 1
        scene.add(planeOutline)


        let newRow = leftEdgePieces[r].row - 1
        let newColumn = storedDots[r].column


        let replacementDot = new DOT(newRow, newColumn, false, plane, planeOutline)
        newDotArray.push(replacementDot)

      }
      storedDots = newDotArray
      console.log(rightEdge)
      // console.log(storedDots)
      for (let i = storedDots.length - 1; i >= 0; i--) {
        // console.log()
        if (storedDots[i].row == rightEdge) {
          storedDots.splice(i, 1)
        }
      }
      toBeSpliced = []
     //do deletion of right edge and generation of an edge to the left

    }

  }
  cameraO.updateProjectionMatrix()
}
renderByRowColumn()