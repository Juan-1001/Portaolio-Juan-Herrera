const menu = document.getElementById('menu');
const indicador = document.getElementById('indicador');
const secciones = document.querySelectorAll('.seccion');

let tamanoIndicador = menu.querySelector('a').offsetWidth;
indicador.style.width = tamanoIndicador + 'px';

let indexSeccionActiva;


//Observer
const observer = new IntersectionObserver((entradas, observer) => {
    entradas.forEach(entrada => {
        if(entrada.isIntersecting){

            // Obtenemos cuál es la sección que está entrando en pantalla
            // Creamos un arreglo con las secciones y luego obtenemos el index de la sección que está en pantalla

        indexSeccionActiva = [...secciones].indexOf(entrada.target);
            indicador.style.transform = `translateX(${tamanoIndicador * indexSeccionActiva}px)`; 
        }
    });
}, {
    rootMargin: '-80px 0px 0px 0px',
    threshold: 0.2
});

// Agregamos observador al hero
observer.observe(document.getElementById('hero'));

// Asigno un observador a cada una de las secciones
secciones.forEach(seccion => observer.observe(seccion));

// Evento para identificar cuando la pantalla cambie de tamaño
const onResize = () => {
    // Calculo el nuevo tamaño que debería tener el indicador
    tamanoIndicador = menu.querySelector('a').offsetWidth;

    //Calculamos el tamaño del indicador
    indicador.style.width = `${tamanoIndicador}px`;

    // Posiocionamos el indicador
    indicador.style.transform = `translateX(${tamanoIndicador * indexSeccionActiva}px)`;
}

window.addEventListener('resize', onResize);

// Efecto texto diluido

/*
	This pen cleverly utilizes SVG filters to create a "Morphing Text" effect. Essentially, it layers 2 text elements on top of each other, and blurs them depending on which text element should be more visible. Once the blurring is applied, both texts are fed through a threshold filter together, which produces the "gooey" effect. Check the CSS - Comment the #container rule's filter out to see how the blurring works!
*/

const elts = {
	text1: document.getElementById("text1"),
	text2: document.getElementById("text2")
};

// The strings to morph between. You can change these to anything you want!
const texts = ["Gracias por ver", "te espero pronto", "Ten lindo día :)"];

// Controls the speed of morphing.
const morphTime = 1;
const cooldownTime = 0.25;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
	morph -= cooldown;
	cooldown = 0;

	let fraction = morph / morphTime;

	if (fraction > 1) {
		cooldown = cooldownTime;
		fraction = 1;
	}

	setMorph(fraction);
}

// A lot of the magic happens here, this is what applies the blur filter to the text.
function setMorph(fraction) {
	// fraction = Math.cos(fraction * Math.PI) / -2 + .5;

	elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
	elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

	fraction = 1 - fraction;
	elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
	elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

	elts.text1.textContent = texts[textIndex % texts.length];
	elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
	morph = 0;

	elts.text2.style.filter = "";
	elts.text2.style.opacity = "100%";

	elts.text1.style.filter = "";
	elts.text1.style.opacity = "0%";
}

// Animation loop, which is called every frame.
function animate() {
	requestAnimationFrame(animate);

	let newTime = new Date();
	let shouldIncrementIndex = cooldown > 0;
	let dt = (newTime - time) / 1000;
	time = newTime;

	cooldown -= dt;

	if (cooldown <= 0) {
		if (shouldIncrementIndex) {
			textIndex++;
		}

		doMorph();
	} else {
		doCooldown();
	}
}

// Start the animation.
animate();