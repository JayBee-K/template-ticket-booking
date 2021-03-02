$(document).ready(function () {
	let themeBanner = new Swiper('#swiper-banner', {
		loop: true,
		spaceBetween: 50,
		speed: 250,
		effect: 'fade',
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		}
	});
	
	$(".flight-select").select2({
		placeholder: "Chọn địa điểm",
		templateResult: styleSelect,
	});
	
	function styleSelect(attrElm) {
		if (!attrElm.id) {
			return attrElm.text;
		}
		let html = $(`<div class="d-flex justify-content-between">
                        <div class="d-flex align-items-baseline">
                            <i class="fas fa-city mr-2 "></i>
                            <div class="font-weight-bold">
                                <span>${attrElm.title.split("|")[0]}</span>
                                <div>${attrElm.title.split("|")[1]}</div>
                            </div>
                        </div>
                        <div class="category">
                            ${attrElm.title.split("|")[2]}
                        </div>
                    </div>`);
		
		return html;
	}
});