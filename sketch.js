var song 
var img
var fft
var particles = []

var imgOptions = ['https://cdn.pixabay.com/photo/2015/12/01/20/28/forest-1072828_960_720.jpg','https://cdn.pixabay.com/photo/2013/04/04/12/34/mountains-100367_960_720.jpg','https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg','https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072821_960_720.jpg','https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_960_720.jpg','https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_960_720.jpg','https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_960_720.jpg','https://cdn.pixabay.com/photo/2021/11/21/21/14/mountain-6815304_960_720.jpg']

function preload() {
	song = loadSound('song/'+floor(random(1,4))+'.mp3')
	img = loadImage(imgOptions[floor(random(0,imgOptions.length))])
}

function setup() {
	createCanvas(windowWidth,0.9*windowHeight)
	angleMode(DEGREES)
	song.play()
	imageMode(CENTER)
	rectMode(CENTER)
	fft = new p5.FFT(0.25)
	img.filter(BLUR,12)
}

function draw() {
	background(0)

	translate(width/2,height/2)

	fft.analyze()
	amp = fft.getEnergy(20,200)

	push()
	if(amp > 225) {
		rotate(random(-1,1))
	}
	image(img,0,0,width+100,height+100)
	pop()

	var alpha = map(amp,0,255,180,150)
	fill(0,alpha)
	noStroke()
	rect(0,0,width,height)

	stroke(255)
	strokeWeight(random(0,5))
	noFill()

	var wave = fft.waveform()

	// x axis
	beginShape()
	for(var i = 0; i <= 180; i++) {
		var index = floor(map(i,0,180,0,wave.length-1))
		var r = map(wave[index],-1,1,150,350)
		var x = r * sin(i)
		var y = r * cos(i)
		vertex(x,y)
	}
	endShape()

	// neg x axis
	beginShape()
	for(var i = 0; i <= 180; i++) {
		var index = floor(map(i,0,180,0,wave.length-1))
		var r = map(wave[index],-1,1,150,350)
		var x = r * -sin(i)
		var y = r * cos(i)
		vertex(x,y)
	}
	endShape()

	var p = new Particle()
	particles.push(p)

	for(var i = particles.length-1; i >= 0; i--) {
		if(!particles[i].edges()) {
			particles[i].update(amp > 225) // check based on song
			particles[i].show()
		} else {
			particles.splice(i,1)
		}
	}
}

function mouseClicked() {
	if(song._paused) 
		song.play()
	else
		song.pause()
}

class Particle {
	constructor() {
		this.pos =  p5.Vector.random2D().mult(250)
		this.vel = createVector(0,0)
		this.acc = this.pos.copy().mult(random(0.0001,0.00001))
		this.w = random(3,5)
		this.color = [random(200,255),random(200,255),random(200,255)]
	}
	update(cond) {
		this.vel.add(this.acc)
		this.pos.add(this.vel)
		if(cond) {
			this.pos.add(this.vel)
			this.pos.add(this.vel)
			this.pos.add(this.vel)
		}
	}
	edges() {
		if(this.pos.x < -width/2 || this.pos.x > width/2 || this.pos.y < -height/2 || this.pos.y > height/2) {
			return true
		} else {
			return false
		}
	}
	show() {
		noStroke()
		fill(this.color)
		ellipse(this.pos.x,this.pos.y,this.w)
	}
}