/**
 * Инициализация полифилла object-fit
 */
;(function() {
	typeof objectFitImages === 'function' && objectFitImages();
})();


/**
 * Загрузка шрифтов
 */
;(function() {
	var fonts = [
		{
			name: 'PT Sans',
			weight: 'normal',
			style: 'normal'
		},
		{
			name: 'PT Sans',
			weight: 'bold',
			style: 'normal'
		},
		{
			name: 'Proxima Nova',
			weight: '900',
			style: 'normal'
		},
		{
			name: 'Proxima Nova',
			weight: 'bold',
			style: 'normal'
		},
		{
			name: 'Proxima Nova',
			weight: 'normal',
			style: 'normal'
		}
	];

	var html = document.documentElement;
	var cl = html.classList;

	cl.add('ctx-fonts-loading');

	// if (sessionStorage.fontsLoaded) {
	//     cl.remove('fonts-loading');
	//     cl.add('fonts-loaded');
	//     return;
	// }

	Promise
		.all(fonts.map(function(font) {
			return (new FontFaceObserver(font.name, {
				style: font.style,
				weight: font.weight
			})).load();
		}))
		.then(function () {
			cl.remove('ctx-fonts-loading');
			cl.add('ctx-fonts-loaded');
			cl.remove('ctx-fonts-fallback');
			// sessionStorage.fontsLoaded = true;
		})
		.catch(function () {
			cl.remove('ctx-fonts-loading');
			cl.add('ctx-fonts-failed');
			// sessionStorage.fontsLoaded = false;
		});
})();


/**
 * Отcлеживане загрузки основных ресурсов
 */
;(function() {

	function onLoad() {
		document.documentElement.classList.add('ctx-page-loaded');
	}

	window.addEventListener('load', onLoad, {
		once: true
	});
})();


/**
 * Работа меню
 */
;(function() {

	var pageHeader,
		inner,
		btn;

	pageHeader = document.querySelector('.page-header');
	inner = document.querySelector('.page-header__inner');
	btn = document.querySelector('.page-header__toggle');

	btn.addEventListener('click', function() {
		var isOpen = pageHeader.classList.contains('page-header_menu-open');
		var action = isOpen ? 'remove' : 'add';
		btn.classList[action]('menu-toggle_active');
		pageHeader.classList[action]('page-header_menu-open');
		inner.style.height = isOpen ? '' : inner.scrollHeight + 'px';
	});
})();


/**
 * Загрузка изображений в сплеш-секции после зарузки основных ресурсов
 */
;(function() {

	function onLoad() {
		var imagesContainer = document.getElementById('splash-images');
		if (!imagesContainer) return;
		imagesContainer.innerHTML = '\
			<picture>\
				<source media="(min-width: 721px)" srcset="assets/img/mountain-lg.png"/>\
				<source media="(min-width: 361px)" srcset="assets/img/mountain-md.png"/>\
				<source media="(min-width: 0px)" srcset="assets/img/mountain.png"/>\
				<img class="splash__image splash__image_bg" src="assets/img/mountain-lg.png" alt=""/>\
			</picture>\
			<picture>\
				<source media="(min-width: 1081px)" srcset="assets/img/flag-lg.png"/>\
				<source media="(min-width: 721px)" srcset="assets/img/flag-md.png"/>\
				<source media="(min-width: 0px)" srcset="assets/img/flag.png"/>\
				<img class="splash__image splash__image_flag" src="assets/img/flag-md.png" alt=""/>\
			</picture>\
			<picture>\
				<source media="(min-width: 1081px)" srcset="assets/img/mountain-side-lg.png"/>\
				<img class="splash__image splash__image_side" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt=""/>\
			</picture>\
		';
		typeof picturefill === 'function' && picturefill();
	}

	window.addEventListener('load', onLoad, {
		once: true
	});
})();