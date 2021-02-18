
let incSlider;
let threshSlider1;
let groundSlider;

const inc2 = 0.01; // cloud noise increment

function setup()
{
  createCanvas(1080, 720);
	pixelDensity(1);

  textSize(15);
  textAlign(LEFT, CENTER);
  fill(255);

  incSlider = createSlider(1, 11, 6); // slider for terrain increment (divide value by 1000)
  incSlider.position(10, 10);
  incSlider.style('width', '120px');
  incSlider.changed(redraw);

  threshSlider1 = createSlider(100, 210, 155); // slider for terrain threshold
  threshSlider1.position(10, 30);
  threshSlider1.style('width', '120px');
  threshSlider1.changed(redraw);

  groundSlider = createSlider(0, 1, 1); // slider for solid ground on/off
  groundSlider.position(10, 50);
  groundSlider.style('width', '120px');
  groundSlider.changed(redraw);

  noLoop();
}

function draw()
{
	background(0, 0, 0);
	loadPixels();

	let inc1 = incSlider.value() / 1000;
	let threshValue = 310 - threshSlider1.value();

  var yoffset1 = 0; // y-coordinate
  var yoffset2 = 0;
	var threshDirt = 25; // dirt layer thickness

	// TERRAIN LOOP
  for (var y = 0; y < height; ++y)
  {
		var xoffset1 = 0; // x-coordinate resets every new row
    var xoffset2 = 0;

		for (var x = 0; x < width; ++x)
  	{
  		var index = (x + y * width) * 4;
  		var r1 = noise(xoffset1, yoffset1); // create 2D perlin noise for island terrain
      var r2 = noise(xoffset2 + 9999, yoffset2 + 9999); // create noise with another seed for clouds

  		if (r1 * 255 > threshValue + threshDirt) // thresholding for stone core of islands
  		{
  			pixels[index] = r1 * 70 	// red
  			pixels[index + 1] = r1 * 70 	// green
  			pixels[index + 2] = r1 * 70 	// blue
  			pixels[index + 3] = 255 	// alpha
  		}
  		else if (r1 * 255 <= threshValue + threshDirt && r1 * 255 > threshValue) // thresholding for outer layer of islands
  		{
  			if (pixels[index + 2 - 4 * width] == 255 ||
  				  pixels[index + 2 - 8 * width] == 255 ||
            pixels[index + 2 - 12 * width] == 255||
            pixels[index + 2 - 16 * width] == 255)	// put grass whenever one of the four above pixels is full blue
  			{
  				pixels[index] = 0
  				pixels[index + 1] = 200
  				pixels[index + 2] = 0
  				pixels[index + 3] = 255	
  			}
  			else // otherwise put dirt
  			{
  				pixels[index] = r1 * 110
  				pixels[index + 1] = r1 * 70
  				pixels[index + 2] = r1 * 60
  				pixels[index + 3] = 255
  			}
  		}
      else // sky background
      {
        pixels[index] = 255 * r2
        pixels[index + 1] = 130 + 125 * r2
        pixels[index + 2] = 255
        pixels[index + 3] = 254
      }

  		xoffset1 += inc1; // increment x every new pixel
      xoffset2 += inc2;
  	}

		if(groundSlider.value() == 1 && y > height - threshValue + 20)
		{
			--threshValue;
		}

  	yoffset1 += inc1; // increment y every new row
    yoffset2 += inc2;
  }

  updatePixels();

  // slider labels
  text('Map size', 140, 20);
  text('Terrain density', 140, 40);
  text('Solid floor [off/on]', 140, 60);
}
