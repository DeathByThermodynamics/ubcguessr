const nums = new Map();

nums.set('1', 'g')
nums.set('2', 'a')
nums.set('3', 'b')
nums.set('4', 'k')
nums.set('5', 'v')
nums.set('6', 'e')
nums.set('7', 'o')
nums.set('8', 't')
nums.set('9', 'z')
nums.set('0', 'q')
let point1 = {x: 49.27961, y: -123.24304}
let point2 = {x: 49.26783, y: -123.26404}
let point3 = {x: 49.25006, y: -123.24977}
let point4 = {x: 49.24288, y: -123.22948}


function slope(a, b) {
  return (a.y - b.y) / (a.x - b.x)
}

function checks(x, y) {
  if ((slope(point4, point1)) * (y - point4.y) > x - point4.x) {
    return false;
  }
  if (x > 49.26822382169008 && y > -123.24457524182039) {
    return false;
  }
  if (x < 49.24754656012032 && y < -123.23908136860038) {
    return false;
  }
  //if ((slope(point1, point2)) * (y - point2.y) > x - point2.x) {
  //  return false;
  //}
  //if (slope(point2, point3) * (y-point3.y) < x - point3.x ) {
  //  return false;
  //}
  //console.log(x);
  //console.log(y);
  return true;
}

function randomLatLng() {
    let random1 = point4.x + Math.random() * (point1.x - point4.x)
    let random2 = point2.y + Math.random() * (point4.y - point2.y)
    while (!checks(random1, random2)) {
      random1 = point4.x + Math.random() * (point1.x - point4.x)
      random2 = point2.y + Math.random() * (point4.y - point2.y)
    }
    // ok
    let location = {lat: random1, lng: random2}
    return location
}

  function latLngToString(latLng) {
    return latLng.lat.toString().substring(3, 7) + latLng.lng.toString().substring(5, 9);
  }

// Truncate the first 49. and -123. because those are always the same

function provideCode(rounds) {
    let points = "";
    for (let i = 0; i < rounds; i++) {
        points+=latLngToString(randomLatLng());
    }
    console.log(points)
    let code = "";
    for (let i = 0; i < points.length/2; i++) {
        code += String.fromCharCode(parseInt(points[2*i] + points[2*i+1]) + 32)
    }

    return code

}

export default randomLatLng;