$(document).ready(function () {
	let windowWidth = $(window).width();
	if (windowWidth < 992) {
		$('header .navigation > ul').prepend('<li><a href="javascript:void(0)" class="d-flex d-lg-none" id="close-menu"><i class="fas fa-times"></i></a></li>');
		$("header .navigation > ul > li > ul").each(function (index) {
			$(this).prev().attr({
				"href": "#subMenu" + index,
				"data-toggle": "collapse"
			});
			$(this).attr({
				"id": "subMenu" + index,
				"class": "collapse list-unstyled mb-0",
				"data-parent": "#hasMenu"
			});
		})
	}
	
	function callMenu() {
		if ($('body').hasClass('show-navigation')) {
			$('body').removeClass('show-navigation');
		} else {
			$('body').addClass('show-navigation');
		}
	}
	
	$(document).on("click", "#hamburger, #close-menu, .header-overlay", function () {
		callMenu();
	});
	
	
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
	
	// Địa điểm - Đi & đến
	$('.flight-select').each(function () {
		dropdownParent = $(this).parents('.inner');
		$(this).select2({
			dropdownParent: dropdownParent,
			placeholder: "Chọn địa điểm",
			templateResult: styleSelect,
		});
	});
	
	function styleSelect(attrElm) {
		if (!attrElm.id) {
			return attrElm.text;
		}
		let html = $(`<div class="d-flex align-items-center">
                        <div class="sel-icon">
                            <i class="fal fa-plane-departure mb-0 h6"></i>
                        </div>
                        <div class="sel-content">
                            <div class="sel-title font-weight-bold">${attrElm.title.split("|")[0]}</div>
                            <div class="text-muted sel-subtitle">${attrElm.title.split("|")[1]}</div>
                        </div>
	                    <div class="sel-code text-right">
	                        ${attrElm.title.split("|")[2]}
	                    </div>
                    </div>`);
		
		return html;
	}
	
	$("#changeFlight").on("click", function () {
		let dari = $("#flightDeparture")
			.parent()
			.find(".select2-selection__rendered");
		let dariValue = $("#flightDeparture").val();
		let dariHtml = dari.html();
		let ke = $("#flightDestination")
			.parent()
			.find(".select2-selection__rendered");
		let keValue = $("#flightDestination").val();
		let keHtml = ke.html();
		dari.html(keHtml);
		ke.html(dariHtml);
		$("#flightDeparture").val(keValue);
		$("#flightDestination").val(dariValue);
	});
	
	const altFormat = "l, d F Y";
	const departureFlatpickrConfig = {
		defaultDate: [Date.now()],
		mode: "single",
		altInput: true,
		altFormat: altFormat,
		showMonths: $(".mobie-DepartureDatepicker").length === 0 ? 2 : 1,
		minDate: "today",
		onOpen: function (selectedDates, dateStr, instance) {
			dateDeparture.set('positionElement', $("#date-departure")[0]);
			dateDeparture.set("mode", "single");
		},
	};
	const returnFlatpickrConfig = {
		defaultDate: [Date.now()],
		mode: "single",
		altInput: true,
		altFormat: altFormat,
		showMonths: $(".mobie-ReturnDatepicker").length === 0 ? 2 : 1,
		minDate: "today",
		onOpen: function (selectedDates, dateStr, instance) {
			dateDeparture.set('positionElement', $("#date-return")[0]);
			dateReturn.set("mode", "single");
		},
		onChange: function (selectedDates, dateStr, instance) {
			const [departure_val, return_val] = selectedDates;
			if (return_val) {
				const checkOutDate = flatpickr.formatDate(return_val, altFormat);
			}
		},
	};
	dateDeparture = $("#date-departure").flatpickr(departureFlatpickrConfig);
	
	
	let htmlRender = '';
	let dateReturn = '';
	$('input[name="choose-flight"]').change(function (e) {
		if ($('#choose-flight-02:checked').length > 0) {
			htmlRender = `<div class="col">
							<div class="inner inner-last position-relative p-3">
								<label class="trigger-flat" data-calendar="2" for="">Ngày trở về</label>
								<div class="d-flex align-items-center box-inner">
									<i class="fad fa-calendar-alt color-main h6 mb-0"></i>
									<input type="text" placeholder="Departure Date"
									       class="border-0 rounded-0 py-0 form-control form-date flatpickr flatpickr-input"
									       id="date-return"/>
								</div>
							</div>
						</div>`;
			
			$('.form-choose-date > .row').append(htmlRender);
			dateReturn = $("#date-return").flatpickr(returnFlatpickrConfig);
		} else {
			htmlRender = ``;
			$('.form-choose-date > .row > .col:nth-child(2)').remove();
		}
	});
	
	$(document).on('click', '.trigger-flat', function () {
		if($(this).data('calendar') == 1)
			dateDeparture.open();
		else
			dateReturn.open();
	})
	
	addEventCounterActions(
		".passenger-event",
		".value-count-baby",
		"#total-people",
		plusCounterHandle,
		minusCounterHandle
	);
	
	function checkMaxPeople(
		inputCounterElement,
		count,
		countBaby,
		totalCount,
		maxPeople,
		maxBaby
	) {
		if (
			(inputCounterElement.hasClass("value-count-baby") && count >= maxBaby) ||
			(!inputCounterElement.hasClass("value-count-baby") &&
				totalCount - countBaby >= maxPeople)
		) {
			return true;
		}
		
		return false;
	}
	
	function plusCounterHandle(
		inputCounterElement,
		htmlCounterElement,
		plusCounterElement,
		minusCounterElement,
		counterBabyElement,
		totalCounterElement
	) {
		let count = inputCounterElement.val();
		let countBaby = counterBabyElement.val();
		let countText = htmlCounterElement.html();
		let totalCount = totalCounterElement.html();
		totalCount = Number(totalCount);
		count = Number(count);
		countBaby = Number(countBaby);
		
		if (
			checkMaxPeople(inputCounterElement, count, countBaby, totalCount, 9, 4)
		) {
			return;
		}
		
		totalCount += 1;
		count += 1;
		countText = count;
		
		minusCounterElement.removeClass("disabled");
		
		inputCounterElement.val(count);
		htmlCounterElement.html(countText);
		totalCounterElement.html(totalCount);
		
		if (
			checkMaxPeople(inputCounterElement, count, countBaby, totalCount, 9, 4)
		) {
			plusCounterElement.addClass("disabled");
		}
	}
	
	function minusCounterHandle(
		inputCounterElement,
		htmlCounterElement,
		plusCounterElement,
		minusCounterElement,
		counterBabyElement,
		totalCounterElement
	) {
		let count = inputCounterElement.val();
		let countBaby = counterBabyElement.val();
		let countText = htmlCounterElement.html();
		let totalCount = totalCounterElement.html();
		totalCount = Number(totalCount);
		count = Number(count);
		countBaby = Number(countBaby);
		
		if (count <= 0 || totalCount <= 1) {
			return;
		}
		
		if (
			checkMaxPeople(inputCounterElement, count, countBaby, totalCount, 9, 4)
		) {
			plusCounterElement.removeClass("disabled");
		}
		
		count -= 1;
		countText = count;
		totalCount -= 1;
		
		inputCounterElement.val(count);
		htmlCounterElement.html(countText);
		totalCounterElement.html(totalCount);
		
		if (count <= 0) {
			minusCounterElement.addClass("disabled");
		}
	}
	
	function prepareCounterElements(
		parentCounterElement,
		counterBabyElement,
		totalCounterElement,
		handleCounter
	) {
		const inputCounterElement = parentCounterElement.find(
			".value-passenger-counter"
		);
		const htmlCounterElement = parentCounterElement.find(
			".passenger-counter"
		);
		
		const minusCounterElement = parentCounterElement.find(
			".passenger-minus"
		);
		
		const plusCounterElement = parentCounterElement.find(
			".passenger-plus"
		);
		
		return handleCounter(
			inputCounterElement,
			htmlCounterElement,
			plusCounterElement,
			minusCounterElement,
			counterBabyElement,
			totalCounterElement
		);
	}
	
	function addEventCounterActions(
		counterClass,
		counterBabyClass,
		totalCounterId,
		plusCounterHandle,
		minusCounterHandle
	) {
		const totalCounterElement = $(totalCounterId);
		$(counterClass).on("click", ".passenger-plus", function () {
			const parentCounterElement = $(this).parents(counterClass);
			const counterBabyElement = parentCounterElement
				.parents(".passenger-dropdown-container")
				.find(counterBabyClass);
			prepareCounterElements(
				parentCounterElement,
				counterBabyElement,
				totalCounterElement,
				plusCounterHandle
			);
		});
		$(counterClass).on("click", ".passenger-minus", function () {
			const parentCounterElement = $(this).parents(counterClass);
			const counterBabyElement = parentCounterElement
				.parents(".passenger-dropdown-container")
				.find(counterBabyClass);
			prepareCounterElements(
				parentCounterElement,
				counterBabyElement,
				totalCounterElement,
				minusCounterHandle
			);
		});
	}
	
	
	$(".passenger-dropdown").click(function () {
		$(".passenger-dropdown-content").fadeToggle();
	});
	
	$("#passenger-close").click(function () {
		$(".passenger-dropdown-content").fadeOut();
	});
	
	$('.trigger-select').on("click", function () {
		$(this).next('.box-inner').find('select').select2('open');
	});
});