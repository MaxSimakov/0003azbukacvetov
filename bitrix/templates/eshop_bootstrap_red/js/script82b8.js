var respons = {
	winState: "",
	smallMedium: false,
	mediumLarge: false,
	sw: 0,
	scrollW: 0,
	large: 1000,
	medium: 640,
	sbWidth: function(){
		$("body").append("<div id='sbarWidth' style='overflow-y: scroll; width: 50px; height: 50px;visibility: hidden'></div>");
		var div = $("#sbarWidth")[0];
		var scrollWidth = div.offsetWidth - div.clientWidth;
		document.body.removeChild(div);
		return scrollWidth;
	},
	sbCheck: function(){
		var b;
		if($(window).height() >= $(document).height()){
			b = false;
		}else{
			b = true;
		}
		return b;
	},
	rCheck : function(){
		if(this.sbCheck()){
			this.sw = $(window).width()+this.scrollW;
		}else{
			this.sw = $(window).width();
		}
	    if(this.sw > this.medium){
	    	if(!this.mediumLarge){
		        /* Вызов функций для больших и средних экранов */
		    	this.mediumLarge = true;
	    	}
	    	if(this.sw > this.large){
		        if(this.winState != "large"){
		        	/* Вызов функций для больших экранов */
		        	this.winState = "large";
			    	this.smallMedium = false;
		        };
	    	};
	    };
	    if(this.sw <= this.large){
	    	if(!this.smallMedium){
		        /* Вызов функций для средних и маленьких экранов */
		    	this.smallMedium = true;
	    	}
	    	if(this.sw > this.medium && this.sw <= this.large){
		        if(this.winState != "medium"){
		        	/* Вызов функций для планшетных экранов */

		        	this.winState = "medium";
		        }
		    }else{
		        if(this.winState != "small"){
		        	/* Вызов функций для мобильных экранов */
		        	this.mediumLarge = false;
		        	this.winState = "small";
		        }
		    };
	    }
	},
	init: function(){
		var $this = this;
		$this.scrollW = $this.sbWidth();
		$this.rCheck();
		$(window).resize(function(){
			$this.rCheck();
		});
	}
};
function viewMore(){
	function colHeight(){
		$("[class*='column_'].nowrap").each(function(){
			var maxHeight = 0;
			$(this).children().each(function(){
				if($(this).outerHeight() > maxHeight){
					maxHeight = $(this).outerHeight();
				};
			});
			$(this).height(maxHeight);
		});
	};
	$(".moreProd").on("click", function(e){
		e.preventDefault();
		var parent = $(this).siblings(".nowrap").length == true ? $(this).siblings(".nowrap") : $(this).parent().siblings(".nowrap");
		parent.addClass("active");
	});
	colHeight();
	$(window).resize(colHeight);
};
function catMenu(){
	$(".hcm_lvl1 > li > a").on("click", function(){
		var submenu = $(this).siblings(".hcm_lvl2"),
			liItem = $(this).parent();
		if(!liItem.hasClass("active")){
			$(".hcm_lvl1 > li").removeClass("active");
		}
		if(submenu.length){
			liItem.toggleClass("active");
		};
	});
	$(window).on("click", function(e){
		if(!$(e.target).closest(".hcm_lvl1").length){
			$(".hcm_lvl1 > li").removeClass("active");
		};
	});
	$(window).on("resize", function(){
		$(".hcm_lvl1 > li").removeClass("active");
	});
};
var mMenu = {
	but: $(".hmh_but"),
	body: $(".hmh_body"),
	wrap: $(".h_mobileHidden"),
	close: $(".hmh_close"),
	overlay: $("<div class='hmh_overlay'></div>"),
	init: function(){
		mMenu.but.on("click.mobileMenu", function(){
			if(mMenu.body.is(":hidden")){
				show();
				
			}else{
				hide();
			};
		});
		$(window).on("click.mobileMenu", function(e){
			if(!$(e.target).closest(mMenu.wrap).length){
				hide();
			};
		});
		mMenu.close.on("click.mobileMenu", function(e){
			hide();
		});
		$(".ht_callback").on("click", function(){
			hide();
		});
		function hide(){
			mMenu.overlay.remove();
			mMenu.but.removeClass("active");
		};
		function show(){
			$("body").append(mMenu.overlay);
			mMenu.but.addClass("active");
		};
	},
	destroy: function(){
		mMenu.but.off(".mobileMenu").removeClass("active");
		$(window).off(".mobileMenu");
	},
};
function changeCity(){
	$(".hc_current").on("click", function(){
		$(this).parents(".h_city").toggleClass("active");
	});
	$(window).on("click", function(e){
		if(!$(e.target).closest(".h_city").length){
			$(".h_city").removeClass("active");
		};
	});
	$(window).on("resize", function(e){
		$(".h_city").removeClass("active");
	});
};
function showMinBasket(){
	$(document).on("click",".hb_but", function(){
		$(this).toggleClass("active");
	});
	$(window).on("click", function(e){
		if(!$(e.target).closest(".h_basketWrap").length){
			$(".hb_but").removeClass("active");
		};
	});
	$(window).on("resize", function(e){
		$(".hb_but").removeClass("active");
	});
};
setHeights = function(){
	$(".products").each(function(){
		var $items = $(this).find( '.prodItem' ),
			$list = $items.parent();
			$items.css( 'height', 'auto' );

		var perRow = Math.floor( $list.width() / $items.width());
		if( perRow == null || perRow < 2 ) 
			return true;
		for( var i = 0, j = $items.length; i < j; i += perRow ){
			var maxHeight   = 0,
			$row  = $items.slice( i, i + perRow );
		 	$row.imagesLoaded( function() {
				$row.each( function(){
					var itemHeight = parseInt( $( this ).outerHeight() );
					if ( itemHeight > maxHeight ) 
							maxHeight = itemHeight;
				});
				$row.css( 'height', maxHeight );
			});
		}
	});
};
 
setHeights();
$( window ).on( 'resize', setHeights );
$(".products").find( 'img' ).on( 'load', setHeights );
 
var galleryMap = {
	wrap: $(".pc_gallery"),
	mapCanvas: {
		$el: $(".pcg_img"),
		width: $(".pcg_img").width(),
		height: $(".pcg_img").height(),
	},
	circle: $(".pcg_circle"),
	img:  $(".pcg_circle img"),
	timeout: 0,
	objects: [],
	init: function(){
		for(var i=0; galleryMap.objects.length>i; i++){
			var el = $("<a href='#' data-numc='"+i+"'></a>");
			if(galleryMap.objects[i].amount==0 || galleryMap.objects[i].amount==""){
				el.append("<span>"+ galleryMap.objects[i].name +"</span>&nbsp;"+ galleryMap.objects[i].amount);
			}else{
				el.append("<span>"+ galleryMap.objects[i].name +"</span>&nbsp;"+ galleryMap.objects[i].amount +"шт");
			}
			$(".pc_viewPart").append(el);
		};
		$(".pc_viewPart a").each(function(i){
			$(this).on("click", function(e){
				e.preventDefault();
				galleryMap.show(i);	
				$("html, body").animate({
					scrollTop: $(".pc_gallery").offset().top
				}, 500);
			});
		});
	},
	show: function(i){
		clearInterval(this.timeout);
		var $this = this;
		this.circle.css({
			width: this.objects[i].size,
			paddingTop: this.objects[i].size,
			left: this.objects[i].pos.x,
			top: this.objects[i].pos.y,
		});
		imgSet();
		this.mapCanvas.$el.addClass("active");
		$(window).on("resize.gallery", function(){
			imgSet();
		});
		$(window).on("click.gallery", function(e){
			if(!$(e.target).closest($this.wrap).length){
				$this.hide();
			}
		});
		this.timeout = setTimeout(function(){
			$this.hide();
		}, 5000);
		function imgSet(){
			$this.img.css({
				left: -$this.circle.position().left,
				marginTop: -$this.circle.position().top,
				width: $this.mapCanvas.$el.width(),
			});
		};
	},
	hide: function(){
		this.circle.width(0);
		this.mapCanvas.$el.removeClass("active");
		$(window).off(".gallery");
	},
};
function colorDropList(){
	console.log("colorDropList");
	var select = ".dropList",
		text = ".dl_select",
		drop = ".dl_dropList",
		item = ".dl_item";

	$("body").on("click", select, function(e){
		if($(e.target).closest(drop).length){
			return false;
		};
		if($(drop).is(":visible")){
			$(drop).hide();
		}else{
			$(drop).show();
		};
	});
	$(window).on("click", function(e){
		if(!$(e.target).closest(select).length){
			$(drop).hide();
		}
	});
};	
$(function(){
	$("input, select").styler();
	$(".fancybox").fancybox({
		padding: 0
	});

	showMinBasket();  //Всплывающая мини-корзина

	if($(".cs_rev").length){  //Новостная карусель
		$(".cs_rev").owlCarousel({
			items: 1,
			nav: true
		});
	}; //
	//viewMore() //Показ товаров при клике на "показать больше"
	catMenu(); //Выпадающее меню каталога
	mMenu.init(); //Скрытие/показ всплыающей шапки на мобильном
	changeCity(); //Выпадающий список городов

	$('.timepicker').timepicker({
		showPeriodLabels: false,
	});
    $.timepicker.regional['ru'] = {
            hourText: 'Часы',
            minuteText: 'Минуты',
            amPmText: ['AM', 'PM'],
            closeButtonText: 'Готово',
            nowButtonText: 'Сейчас',
            deselectButtonText: 'Снять выделение' }
    $.timepicker.setDefaults($.timepicker.regional['ru']);
    $(".datepicker").datepicker();
    $.datepicker.regional['ru'] = {
		closeText: 'Закрыть',
		prevText: '&#x3c;Пред',
		nextText: 'След&#x3e;',
		currentText: 'Сегодня',
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
		'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
		'Июл','Авг','Сен','Окт','Ноя','Дек'],
		dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false
	}
    $.datepicker.setDefaults($.datepicker.regional['ru']);
    if($(".phonemask").length){
    	$(".phonemask").mask("+7 (999) 999-99-99");
    };
	colorDropList();//Выпадающий список выбора цвета в карточке



});