let numCircles = 3000; 
let sphereRadius = 320; 
let circleRadius = 5; 
let circleCenters = []; // Array to store circle centers
let velocities = []; // Array to store velocities for each circle
//frameCount(2);

// Define constants for the number of continents and their sizes
const numContinents = 50;
const continentSizes = [0.1];

function setup() {
  createCanvas(700, 700, WEBGL);
  
  for (let i = 0; i < numCircles; i++) {
    circleCenters[i] = randomPointOnSphere(sphereRadius);
    velocities[i] = p5.Vector.random3D(); // Random initial velocity
    velocities[i].mult(random(0.01, 0.04)); // Scale velocity
  }
}

function draw() {
  background(0);
  //translate(width / 2, height / 2, 0);

  for (let i = 0; i < numCircles; i++) {
    let center = circleCenters[i];
    let velocity = velocities[i];

    // Update position based on velocity
    center.add(velocity);

    // Keep the circle on the surface of the sphere
    center.normalize();
    center.mult(sphereRadius);

    // Determine the continent for this circle
    let continent = getContinent(center);

    noStroke();
    
    // Calculate a unique offset for each circle based on its index
    let offset = (i * 800) % 800000; // Change transparency every 1000 milliseconds
    
    // Interpolate opacity using a sine function for smooth oscillation
    let t = (millis() + offset) % 6000 / 6000.0;
    let alpha = 255 * (sin(TWO_PI * t) * 0.5 + 0.5); // Sine wave for smooth transition

    let colour = color(39, 122, 255, alpha);
    
    fill(colour);
    
    ellipse(center.x, center.y, circleRadius, circleRadius);
    stroke(71, 189, 109, 20);
    line(0, 0, center.x, center.y);

    // If the circle goes off screen, reset its position and velocity
    if (center.mag() > sphereRadius * 1.1) {
      circleCenters[i] = randomPointOnSphere(sphereRadius);
      velocities[i] = p5.Vector.random3D();
      velocities[i].mult(random(0.005, 0.03));
    }
  }
 
}


function getContinent(pos) {
  // Compute latitude and longitude of the position
  let latitude = asin(pos.z / sphereRadius);
  let longitude = atan2(pos.y, pos.x);
  
  // Normalize longitude to [0, TWO_PI]
  if (longitude < 0) {
    longitude += TWO_PI;
  }
  
  // Determine the continent based on latitude and longitude
  let continent = int(map(longitude, 0, TWO_PI, 0, numContinents));
  
  return continent;
}

function randomPointOnSphere(r) {
  let theta = random(0, TWO_PI);
  let phi = random(0, PI);
  let x = r * sin(phi) * cos(theta);
  let y = r * sin(phi) * sin(theta);
  let z = r * cos(phi);
  return createVector(x, y, z);
}
