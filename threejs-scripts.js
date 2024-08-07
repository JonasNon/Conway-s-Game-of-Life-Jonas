import * as THREE from 'three';
// import { DragControls } from 'three/addons/controls/DragControls.js';


let gray = 0x808080
let lime = 0x00ff00
let black = 0x000000
let white = 0xFFFFFF

let zoomAdjuster = 100 //bigger number = more zoomed in
let storedDots = []
let offScreenDots = []
let panSpeed = 50 //lower number = faster panning
let zoomSpeed = .0001; //
let gridWidth = screen.width/25  // starting grid size 45==good base zoom size \\ lower = bigger grid
let gridHeight = screen.height/25
let gridArea = gridHeight*gridWidth
let fadeDistanceX = screen.availWidth/90
let fadeDistanceY = screen.availHeight/90
let rightEdge
let leftEdge
let topEdge
let bottomEdge




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
let leftModulusCounter = -15.6
let rightMoudulusCounter = -15
let upperModulusCounter = -9
let lowerModulusCounter = -8
let farthestRightDot
let farthestLeftDot
let farthestUpDot
let farthestDownDot

let oldFarthestRightDot
let oldFarthestLeftDot
let oldFarthestUpDot
let oldFarthestDownDot

let bottomLeftDot
let middleDot
let topRightdot

let once = true

//instead of bottom left... find the center you dingus

//array[Math.trunc(array.length/2)]
// Math.min(...storedDots.map(o => o.row)) + (Math.max(...storedDots.map(o => o.row)) - Math.min(...storedDots.map(o => o.row)))
// Math.min(...storedDots.map(o => o.column)) + (Math.max(...storedDots.map(o => o.column)) - Math.min(...storedDots.map(o => o.column)))

const findBottomLeft = () => {


  for (let i = 0; i < storedDots.length; i++) { //if current dot has lowest row value and lowest column value it gets returned
    if (storedDots[i].row == Math.min(...storedDots.map(o => o.row)) && storedDots[i].column == Math.min(...storedDots.map(o => o.column))) {
      return storedDots[i]
    }
  }
}


const findMiddle = () => {




  //close, but it doesn't count visible living dots right now

  //store living dots in seperate array? and only pushes them to that array when they would be deleted?


  // let middleRow = Math.min(...filteredItems.map(o => o.row)) + Math.trunc(((Math.max(...filteredItems.map(o => o.row)) - Math.min(...filteredItems.map(o => o.row)))/2))
  // let middleColumn = Math.min(...filteredItems.map(o => o.column)) + Math.trunc(((Math.max(...filteredItems.map(o => o.column)) - Math.min(...filteredItems.map(o => o.column)))/2))

  let middleRow = Math.min(...storedDots.map(o => o.row)) + Math.trunc(((Math.max(...storedDots.map(o => o.row)) - Math.min(...storedDots.map(o => o.row)))/2))
  let middleColumn = Math.min(...storedDots.map(o => o.column)) + Math.trunc(((Math.max(...storedDots.map(o => o.column)) - Math.min(...storedDots.map(o => o.column)))/2))

  for (let i = 0; i < storedDots.length; i++) { //if current dot has lowest row value and lowest column value it gets returned
    if (storedDots[i].row == middleRow && storedDots[i].column == middleColumn) {
      return storedDots[storedDots.indexOf(storedDots[i])]
    }
  }
}



const onMouseMove = (e) =>{
  // console.log("Mouse Movement")
  if (mouseDown) {

   
    // cube.position.x += e.movementX/panSpeed
    // cube.position.y -= e.movementY/panSpeed
        
   

    for (let i = 0; i < storedDots.length; i++) {
      storedDots[i].w += e.movementX/panSpeed
      storedDots[i].h += e.movementY/panSpeed //what does this do again??

      storedDots[i].mesh.position.x += e.movementX/panSpeed
      storedDots[i].mesh.position.y -= e.movementY/panSpeed

      // storedDots[i].outline.position.x += e.movementX/panSpeed
      // storedDots[i].outline.position.y -= e.movementY/panSpeed
    }
  }

    farthestRightDot = storedDots[storedDots.map(function(e) { return e.row; }).indexOf(Math.max(...storedDots.map(o => o.row)))]
    farthestLeftDot = storedDots[storedDots.map(function(e) { return e.row; }).indexOf(Math.min(...storedDots.map(o => o.row)))]
    farthestUpDot = storedDots[storedDots.map(function(e) { return e.column; }).indexOf(Math.max(...storedDots.map(o => o.column)))]
    farthestDownDot = storedDots[storedDots.map(function(e) { return e.column; }).indexOf(Math.min(...storedDots.map(o => o.column)))]

    bottomLeftDot = findBottomLeft()
    middleDot = findMiddle()

    //lowest row: Math.min(...storedDots.map(o => o.row)) 
    //lowest column: Math.min(...storedDots.map(o => o.column))
    // all column values: storedDots.map(function(e) { return e.column; }
    // all row values: storedDots.map(function(e) { return e.row; }

    
    

    if (once) {
      once = false

    }





    // console.log("up: ", farthestUpDot, "down: ", farthestDownDot)


    // console.log(farthestLeftDot, "left")
    // console.log(farthestRightDot, "right")
    // console.log(Math.max(...storedDots.map(o => o.row))) //once this reaches 0 things start to break

    oldx = e.pageX;
    oldy = e.pageY;

    // renderVisibleDots()

    
    // renderByRowColumn()
    // console.log(storedDots[0].mesh.position.x)
    // console.log(Math.abs(Math.trunc(storedDots[0].mesh.position.x)) % moudulusCounter)
    // console.log(moudulusCounter)
    // console.log(storedDots[storedDots.length-1])
    // storedDots[storedDots.length-1].mesh.material.color.setHex(lime)
    // farthestLeftDot.mesh.material.color.setHex(lime)
    // farthestRightDot.mesh.material.color.setHex(lime)
    // farthestUpDot.mesh.material.color.setHex(lime)
    // farthestDownDot.mesh.material.color.setHex(lime)
    middleDot.mesh.material.color.setHex(lime)
    // bottomLeftDot.mesh.material.color.setHex(lime)
    cameraO.updateProjectionMatrix()
    
    // console.log(Math.abs(Math.trunc(farthestRightDot.mesh.position.x)))
    // console.log("Down: ",farthestDownDot.mesh.position.y)

    //these four ifs determine what direction the dots should to be generated in
    // console.log(oldFarthestLeftDot, farthestLeftDot) 

    // console.log("Up",farthestUpDot.mesh.position.y)

    // console.log("x:",middleDot.mesh.position.x)
    // console.log("y:",middleDot.mesh.position.y)

// let leftModulusCounter = -15.6
// let rightMoudulusCounter = -15
// let upperModulusCounter = -9
// let lowerModulusCounter = -8

    middleDot.isAlive = true
    //sometimes the farthest dot num skips the number it should modulus againts? theyby skipping the regen
    //seems to happen at a fixed height/depth though

    if (middleDot.mesh.position.x < -0.5) {
      renderByRowColumn("left")
    } else if (middleDot.mesh.position.x > 0.5) {
      renderByRowColumn("right")
    } else if (middleDot.mesh.position.y < -0.5) {
      renderByRowColumn("up")
    } else if (middleDot.mesh.position.y > 0.5) {
      renderByRowColumn("down")
    }

  
}
renderer.domElement.addEventListener('mousemove', onMouseMove)





function zoom(event) { //completely broken do NOT zoom under any circumstance
  event.preventDefault();
  console.log(event)

  if (event.deltaY > 0) {
    console.log("Zoom out")
    cameraO.zoom = cameraO.zoom/2
    // zoomAdjuster -= zoomSpeed
    // cameraO.setViewOffset(cameraO.view.fullWidth + zoomSpeed, cameraO.view.fullHeight + zoomSpeed, cameraO.pageX, cameraO.pageY, cameraO.view.width + zoomSpeed, cameraO.view.height + zoomSpeed)

  } else {
    console.log("Zoom in")
    cameraO.zoom = cameraO.zoom*2

    // zoomAdjuster += zoomSpeed
    // cameraO.setViewOffset(cameraO.view.fullWidth - zoomSpeed, cameraO.view.fullHeight - zoomSpeed, cameraO.pageX, cameraO.pageY, cameraO.view.width - zoomSpeed, cameraO.view.height - zoomSpeed)

  }
  console.log(cameraO)

  cameraO.updateProjectionMatrix()
  
}

renderer.domElement.onwheel = zoom;





// const panCamera = () => {

// }




    //lowest row: Math.min(...storedDots.map(o => o.row)) 
    //lowest column: Math.min(...storedDots.map(o => o.column))
    // all column values: storedDots.map(function(e) { return e.column; }
    // all row values: storedDots.map(function(e) { return e.row; }












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





let previousStart
let newDotArray
const renderByRowColumn = (direction) => {
  if (storedDots[0] == undefined) { //if this array is undefined then no dots have been rendered, and this function will render a w x h grid of dots
    for (let w = 0; w < gridWidth; w++) {
      for (let h = 0; h < gridHeight; h++) {
        
        

      
        let newMesh = new THREE.PlaneGeometry( 1, 1 )
        let newMaterial = new THREE.MeshBasicMaterial( {color: white, side: THREE.DoubleSide} )
        const plane = new THREE.Mesh(newMesh, newMaterial);
        plane.position.x = w - gridWidth/2
        plane.position.y = h - gridHeight/2
        plane.renderOrder = 1
        scene.add(plane)


        // let newOutline = new THREE.PlaneGeometry( 1, 1 )
        // let newOutlineMaterial = new THREE.MeshBasicMaterial( {color: black, side: THREE.DoubleSide} )
        // const planeOutline = new THREE.Mesh(newOutline, newOutlineMaterial);
        // planeOutline.position.x = w - gridWidth/2
        // planeOutline.position.y = h - gridHeight/2
        // planeOutline.position.z -= 5
        // planeOutline.renderOrder = 1
        // scene.add(planeOutline)

        
        let newDot = new DOT(w, h, false, plane)
        newDot.x = w
        newDot.y = h
        storedDots.push(newDot)
        // console.log(newDot)
        
        previousStart = storedDots[0].mesh.position

        oldFarthestRightDot = farthestRightDot
        oldFarthestLeftDot = farthestLeftDot
        oldFarthestUpDot = farthestUpDot
        oldFarthestDownDot = farthestDownDot
        
      }
    }
  } else {

    let toBeSpliced = []
    let rightEdgePieces = []
    let leftEdgePieces = []
    let topEdgePieces = []
    let bottomEdgePieces = []
    
    //instead of that \/ if statment, to a math.max of the relative ditances with x,-x,y,-y from the start and the largest value is the if we go into

    console.log(direction)

    if (direction == "up") {
      console.log("go up")
    } else if (direction == "down") {
      console.log("go down")
    } else if (direction == "left") {
      console.log("go left")
    } else if (direction == "right") {
      console.log("go right")
    }
    // console.log(storedDots[0].mesh.position.x) //when this equals 7 it regenerates the left column?
    if (direction == "left") { //a box scrolled offscreen to the left //except not and this line needs to be fixed to better determine that

      rightEdge = Math.max(...storedDots.map(o => o.row))
      leftEdge = Math.min(...storedDots.map(o => o.row))
      console.log(leftEdge)


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



      //generate a new line
      for (let r = 0; r < rightEdgePieces.length; r++) {

        let newRow = rightEdgePieces[r].row + 1
        let newColumn = rightEdgePieces[r].column



        let newX = rightEdgePieces[r].mesh.position.x + 1
        let newY = rightEdgePieces[r].mesh.position.y



        let newGeometry = generatePlanes(newX, newY)




        let replacementDot = new DOT(newRow, newColumn, false, newGeometry.plane)

        for (let d = 0; d < offScreenDots.length; d++) {
          if (offScreenDots[d].row == newRow && offScreenDots[d].column == newColumn) {
            replacementDot.isAlive = true
            replacementDot.mesh.material.color.setHex(lime)

          }
        }


        storedDots.push(replacementDot)

      }

      for (let i = storedDots.length - 1; i >= 0; i--) {
        if (storedDots[i].row == leftEdge) {
          if (storedDots[i].isAlive == true) {
            let alreadyExists = false
            for (let d = 0; d < offScreenDots.length; d++) {
              if (offScreenDots[d].row == storedDots[i].row && offScreenDots[d].column == storedDots[i].column) {
                alreadyExists = true
              }
            }
            if (!alreadyExists) {
              offScreenDots.push(storedDots[i])
              console.log("one added:", offScreenDots)

            }
          }
          storedDots[i].mesh.material = undefined
          storedDots[i].mesh.geometry = undefined
          scene.remove(storedDots[i].mesh)
          storedDots.splice(i, 1)
        }
      }
      toBeSpliced = []


      // farthestRightDot.mesh.position.x > 0 && 
    } else if (direction == "right") { //a box scrolled offscreen to the right


      rightEdge = Math.max(...storedDots.map(o => o.row))
      leftEdge = Math.min(...storedDots.map(o => o.row))

      newDotArray = storedDots
      toBeSpliced = []
      rightEdgePieces = []
      leftEdgePieces = []
      
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

        let newRow = leftEdgePieces[r].row - 1
        let newColumn = leftEdgePieces[r].column

        let newX = leftEdgePieces[r].mesh.position.x - 1
        let newY = leftEdgePieces[r].mesh.position.y

        let newGeometry = generatePlanes(newX, newY)




        let replacementDot = new DOT(newRow, newColumn, false, newGeometry.plane)
        for (let d = 0; d < offScreenDots.length; d++) {
          if (offScreenDots[d].row == newRow && offScreenDots[d].column == newColumn) {
            replacementDot.isAlive = true
            replacementDot.mesh.material.color.setHex(lime)

          }
        }
        storedDots.push(replacementDot)

      }
      // console.log(rightEdge)
      // console.log(storedDots)
      for (let i = storedDots.length - 1; i >= 0; i--) {
        if (storedDots[i].row == rightEdge) {
          if (storedDots[i].isAlive == true) {
            offScreenDots.push(storedDots[i])
            console.log("one added:", offScreenDots)
          }
          storedDots[i].mesh.material = undefined
          storedDots[i].mesh.geometry = undefined
          scene.remove(storedDots[i].mesh)
          storedDots.splice(i, 1)
        }
      }
      toBeSpliced = []
     //do deletion of right edge and generation of an edge to the left

    } else if (direction == "up") { //a box scrolled offscreen to the bottom

      topEdge = Math.max(...storedDots.map(o => o.column))
      bottomEdge = Math.min(...storedDots.map(o => o.column))
      // console.log(rightEdge)


      toBeSpliced = []
      topEdgePieces = []
      bottomEdgePieces = []
      
      // console.log(storedDots.length)

      for (let j = 0; j < storedDots.length; j++) {
        if (storedDots[j].column == topEdge) {
          topEdgePieces.push(storedDots[j])
          toBeSpliced.push(j)
        }
      }
      for (let j = 0; j < storedDots.length; j++) {
        if (storedDots[j].column == bottomEdge) {
          bottomEdgePieces.push(storedDots[j])
        }
      }


      for (let r = 0; r < topEdgePieces.length; r++) {
        let newRow = topEdgePieces[r].row 
        let newColumn = topEdgePieces[r].column + 1

        let newX = topEdgePieces[r].mesh.position.x 
        let newY = topEdgePieces[r].mesh.position.y + 1

        let newGeometry = generatePlanes(newX, newY)




        let replacementDot = new DOT(newRow, newColumn, false, newGeometry.plane)
        for (let d = 0; d < offScreenDots.length; d++) {
          if (offScreenDots[d].row == newRow && offScreenDots[d].column == newColumn) {
            replacementDot.isAlive = true
            replacementDot.mesh.material.color.setHex(lime)

          }
        }
        storedDots.push(replacementDot)

      }

      for (let i = storedDots.length - 1; i >= 0; i--) {
        if (storedDots[i].column == bottomEdge) {
          if (storedDots[i].isAlive == true) {
            offScreenDots.push(storedDots[i])
            console.log("one added:", offScreenDots)
          }
          storedDots[i].mesh.material = undefined
          storedDots[i].mesh.geometry = undefined
          scene.remove(storedDots[i].mesh)
          storedDots.splice(i, 1)
        }
      }
      toBeSpliced = []

    } else if (direction == "down") { //a box scrolled offscreen to the top
      topEdge = Math.max(...storedDots.map(o => o.column))
      bottomEdge = Math.min(...storedDots.map(o => o.column))
      // console.log(rightEdge)

      toBeSpliced = []
      topEdgePieces = []
      bottomEdgePieces = []
      
      // console.log(storedDots.length)

      for (let j = 0; j < storedDots.length; j++) {
        if (storedDots[j].column == topEdge) {
          topEdgePieces.push(storedDots[j])
          toBeSpliced.push(j)
        }
      }
      for (let j = 0; j < storedDots.length; j++) {
        if (storedDots[j].column == bottomEdge) {
          bottomEdgePieces.push(storedDots[j])
        }
      }


      for (let r = 0; r < topEdgePieces.length; r++) {
        let newRow = bottomEdgePieces[r].row
        let newColumn = bottomEdgePieces[r].column - 1

        let newX = bottomEdgePieces[r].mesh.position.x 
        let newY = bottomEdgePieces[r].mesh.position.y - 1

        let newGeometry = generatePlanes(newX, newY)



        let replacementDot = new DOT(newRow, newColumn, false, newGeometry.plane)
        for (let d = 0; d < offScreenDots.length; d++) {
          if (offScreenDots[d].row == newRow && offScreenDots[d].column == newColumn) {
            replacementDot.isAlive = true
            replacementDot.mesh.material.color.setHex(lime)

          }
        }
        storedDots.push(replacementDot)

      }

      for (let i = storedDots.length - 1; i >= 0; i--) {
        if (storedDots[i].column == topEdge) {
          if (storedDots[i].isAlive == true) {
            offScreenDots.push(storedDots[i])
            console.log("one added:", offScreenDots)
          }
          storedDots[i].mesh.material = undefined
          storedDots[i].mesh.geometry = undefined
          scene.remove(storedDots[i].mesh)
          storedDots.splice(i, 1)
        }
      }
      toBeSpliced = []

    }

  }
  cameraO.updateProjectionMatrix()

  oldFarthestRightDot = farthestRightDot
  oldFarthestLeftDot = farthestLeftDot
  oldFarthestUpDot = farthestUpDot
  oldFarthestDownDot = farthestDownDot

}
renderByRowColumn()





const generatePlanes = (xPos, yPos) => {
  let newMesh = new THREE.PlaneGeometry( 1, 1 )
  let newMaterial = new THREE.MeshBasicMaterial( {color: white, side: THREE.DoubleSide} )
  const plane = new THREE.Mesh(newMesh, newMaterial);
  plane.position.x = xPos
  plane.position.y = yPos
  plane.renderOrder = 1
  scene.add(plane)


  // let newOutline = new THREE.PlaneGeometry( 1, 1 )
  // let newOutlineMaterial = new THREE.MeshBasicMaterial( {color: black, side: THREE.DoubleSide} )
  // const planeOutline = new THREE.Mesh(newOutline, newOutlineMaterial);
  // planeOutline.position.x = xPos
  // planeOutline.position.y = yPos
  // planeOutline.position.z -= 5
  // planeOutline.renderOrder = 1
  // scene.add(planeOutline)

  return {
    plane: plane
    // planeOutline: planeOutline
  }
}