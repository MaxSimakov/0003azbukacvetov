jQuery(document).ready(function(){
	//Обратный звонок
	jQuery(document).on("click","#sendc",function(){
		jQuery("#namec,#telc").removeClass("invalid");
		var namec = jQuery("#namec").val();
		var telc = jQuery("#telc").val();
		if(namec!="" && telc!=""){
			jQuery.ajax({
				type:"POST",
				url:"/ajax/callback.php",
				data:({namec:namec,telc:telc}),
				success:function(data){
					jQuery("#formc").hide();
					jQuery("#thanksc").show();
				}
			});
		}else{
			if(namec==""){
				jQuery("#namec").addClass("invalid");
				jQuery("#namec").next(".form_alert").fadeIn(50);
				setTimeout(function(){jQuery("#namec").next(".form_alert").fadeOut(500);},1500);
			}
			if(telc==""){
				jQuery("#telc").addClass("invalid");
				jQuery("#telc").next(".form_alert").fadeIn(50);
				setTimeout(function(){jQuery("#telc").next(".form_alert").fadeOut(500);},1500);
			}
		}
	});
	//Вопрос из контактов
	jQuery(document).on("click","#sendco",function(){
		jQuery("#nameco,#telco,#questionco").removeClass("invalid");
		var nameco = jQuery("#nameco").val();
		var telco = jQuery("#telco").val();
		var questionco = jQuery("#questionco").val();
		if(questionco==""){questionco="-";}
		if(nameco!="" && telco!=""){
			jQuery.ajax({
				type:"POST",
				url:"/ajax/contacts.php",
				data:({nameco:nameco,telco:telco,questionco:questionco}),
				success:function(data){
					jQuery("#formco").hide();
					jQuery("#thanksco").show();
				}
			});
		}else{
			if(nameco==""){
				jQuery("#nameco").addClass("invalid");
				jQuery("#nameco").next(".form_alert").fadeIn(50);
				setTimeout(function(){jQuery("#nameco").next(".form_alert").fadeOut(500);},1500);
			}
			if(telco==""){
				jQuery("#telco").addClass("invalid");
				jQuery("#telco").next(".form_alert").fadeIn(50);
				setTimeout(function(){jQuery("#telco").next(".form_alert").fadeOut(500);},1500);
			}
		}
	});
	
	/*jQuery(document).on("click","#morepopular",function(){
		jQuery.ajax({
			type:"POST",
			url:"/ajax/"+jQuery(this).attr('id')+".php",
			data:({}),
			success:function(data){
				
			}
		});
	});*/
	function number_format(number, decimals, dec_point, separator ) {
		number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
		var n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof separator === 'undefined') ? ',' : separator ,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function(n, prec) {
		  var k = Math.pow(10, prec);
		  return '' + (Math.round(n * k) / k)
			.toFixed(prec);
		};
		// Фиксим баг в IE parseFloat(0.55).toFixed(0) = 0;
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
		.split('.');
		if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '')
		.length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1)
		  .join('0');
		}
		return s.join(dec);
	}
	function updatePrices(){
		var newpricead=0;
		var discountall=0;
		jQuery("div[id=basketItem]").each(function(indx,elem){
			var count = parseInt(jQuery(this).find("div[class*=baskquan] input").val());
			var price = parseInt(jQuery(this).attr('price'));
			var discount = parseInt(jQuery(this).attr('discount'));
			newpricead+=(count*price);
			discountall+=(count*discount);
			
			//Ставим сумму на элемент
			jQuery(this).find("#itemsum").text(number_format((count*price),0,'',' ')+" руб.");
			if(indx==(jQuery("div[id=basketItem]").length-1)){
				jQuery("div[id=priceall]").text(number_format(newpricead,0,'',' ')+" руб.");
				jQuery("div[id=discountall]").find("del").text(number_format((newpricead+discountall),0,'',' ')+" руб.");
			}
		});
	}
	
	//Добавление в корзину
	jQuery(document).on("click","a[class*=inbasket]",function(){
		jQuery.ajax({
			type:"POST",
			url:"/ajax/cart.php",
			data:({id:jQuery(this).attr('tovid'),quantity:jQuery(this).attr('quantity')}),
			success:function(data){
				jQuery(".h_basketWrap").html(data);
			}
		});
	});
	//Изменение количества в корзине
	jQuery(document).on("click",".baskquan",function(){
		var $this = jQuery(this);
		updatePrices();
		jQuery.ajax({
			type:"POST",
			url:"/ajax/cartquantity.php",
			data:({id:$this.find("input").attr('tovid'),quantity:$this.find("input").val()})
		});
	});
	//Удаление товара из корзины
	jQuery(document).on("click","a[class*=bt_delBut]",function(){
		var $this = jQuery(this);
		$this.parent().parent().remove();
		
		if(jQuery("div[id=basketItem]").length==0){
			jQuery("#basket").remove();
			jQuery("#basketzero").show();
		}else{
			updatePrices();
		}
		jQuery.ajax({
			type:"POST",
			url:"/ajax/cartdelete.php",
			data:({id:jQuery(this).attr('tovid'),countitems:jQuery("div[id=basketItem]").length}),
			success:function(data){
				jQuery(".h_basketWrap").html(data);
				window.location.href="index.html";
			}
		});
	});
	
	jQuery(document).on("click","#popularMore,#hitMore,#newMore,#pohozMore",function(){
		var $this = jQuery(this);
		var insertIn = $this.parent().parent().find("div[class=prodItem]:last");
		var count = $this.parent().parent().find("div[class=prodItem]").length;
		var thisID = $this.attr("id");
		var allCount = jQuery("#"+thisID+"All").val();
		jQuery.ajax({
			type:"POST",
			url: window.location.href,
			data:({count:count,block:thisID,ajax:"Y"}),
			success:function(data){
				insertIn.after(data);
				setHeights();
				count = $this.parent().parent().find("div[class=prodItem]").length;
				if(allCount==count){
					$this.parent().hide();
				}
			}
		});
	});
	
	jQuery(document).on("click",".onlyOne",function(){
		var $this = jQuery(this);
		var price = $this.find(".pcp_piece").attr("price");
		var quan = $this.find("input").val();
		$this.find(".pcp_total").text(number_format((+price * +quan),0,'',' ')+" руб.");
		$this.find(".inbasket").attr("quantity",quan);
	});
	
});