$(function(){
	loading();
	getMeters(true);
	$("input#username").focus();
	$("#admin").bind("click",adminPanel);
});

//show admin console
function adminPanel(){
	$.post("admin",{"admin":true},function(data){
		$("#admin_panel .admin_panel_cont").html(data);
		$("#admin_panel").show();

		$(".cls_admin").click(function(){
			$("#admin_panel").hide();
		});
		adminAction();

	});
}

//administrator functions
function adminAction(){
  $("input[type='checkbox']").click(function(){
   var meter_ = $(this).attr("meter");
   var	action = $(this).attr("name");
   if( $(this).is(":checked") ){
	val_ = 0;
    }else{
	val_ = 1;
    }

	$.post("admin/action",{"meter":meter_,"action":action,"do":val_},function(data){
	$("#admin_panel .admin_panel_cont").html(data);
		adminAction();
	});
  });
}

//get all active meters
function getMeters(init){
	$.post("meters",{"meters":"all","cnt":res_cnt,"sd":today(),"ed":today()},function(data){
		meters = JSON.parse(data);
		meters_ = meters.meters;
		// console.log(meters_);
		
		//	$("body").html("<span id='error_'>There seems to have been an Authentication issue.<br/>Please <a href='/meteriod'>Reload</a> page or <a href='logout'>Logout</a> and Login again to remedy. <br/>If problem persists contact your ServiceDesk @ ext. #4333.</span>");
	//	}else{
			
				addKiloMeters(meters_,init);	
				addMetersToNavBar(meters_);	
			
	//	}
	});

}

//accessibility navigation for active meters
function addMetersToNavBar(meters){
    var gmr_html = "";
    var bmr_html = "";
    var flr_html = "";
	$.each(meters,function(i,data){
	
	   var meter_tab  = "";
    	   var meter_flt_tab = "";
	   var meter_off_tab = "";

	   if(data.active){
		var meter_tab = "<li class='tab'><a href='#"+data.meter+"' >Meter <b class='mn_num'>"+data.meter+"</b></a></li>";
		var meter_flt_tab = "<li class='tab flatline'><a href='#"+data.meter+"' id='"+data.meter+"' class='flat_meter'>Meter <b class='mn_num'>"+data.meter+"</b></a></li>";
		var meter_off_tab = "<li class='tab offline'><a href='#"+data.meter+"' id='"+data.meter+"' class='bad_meter'>Meter <b class='mn_num'>"+data.meter+"</b></a></li>";
	   }
   	   if(data.ReadData.length > 0 && isGoodData(data.ReadData)){
              gmr_html += meter_tab;
           }else if(data.ReadData.length > 0 && !isGoodData(data.ReadData)){
              mflatline.push(data.meter);
              flr_html += meter_flt_tab;
           }else{
              moffline.push(data.meter);
              bmr_html += meter_off_tab;
           }

	});
	
	$(".meters_tab").html(gmr_html+flr_html+bmr_html);
	$(".meters_tab .tab").bind("click",setActiveTab);
	
	var ms =$(".mn_num");//meters

	$.each(ms,function(i){
		$(this).parent().parent().attr("index",(i+1));
	});


	setTimeout(function(){
		if($(".meters_tab .tab").length > 0)
			setScroller();

		$(".meters_tab .tab:eq(0)").addClass("active");
	},100);

	smoothScroll();
}


function showMeterDetail(){
	var meter = $(this).attr("meter");
	$(this).toggleClass("active");
	
	if($(this).hasClass("active"))
		$("#"+meter+".details").show();
	else
		$("#"+meter+".details").hide();

}

//maximize meter details in layout 2 
function detachMeterInfo(){
	var meter = $(this).attr("meter");
	$(this).toggleClass("max");

	if($(this).hasClass("max"))
		$("#cont_"+meter+".details_bt").addClass("maximize");
	else
		$("#cont_"+meter+".details_bt").removeClass("maximize");
}

function chartLayout(layout,data){
	
	switch(layout){
		case 1:
			return layout1(data);
			break;
		case 2:
			return layout2(data);
			break;
		default:
			return 0;
	}

}

function hideFaultyMeterDetails(){
	var fault_meters = "<li class='dropdown tab'><a class='dropdown-toggle' data-toggle='dropdown' href='#'>Faulty Meters <b class='fa fa-caret'></b></a><ul class='dropdown-menu'>";

		if(moffline.length > 0){
				$.each(moffline,function(i,v){
					fault_meters += "<li><a href='#"+v+"' id='"+v+"' class='bad_meter' data-toggle='tooltip' title='This Meter is offline'>Meter #"+v+" <span class='right'><i class='fa fa-ban'></i></a></span></li>";

					$("#cont_"+v).remove();
			});
		}

		if(mflatline.length > 0){
			$.each(mflatline,function(i,v){
				fault_meters += "<li><a href='#"+v+"' id='"+v+"' class='bad_meter'data-toggle='tooltip' title='This Meter flatlined'>Meter #"+v+" <span class='right'><i class='fa fa-line-chart'></i></a></span></li>";

				$("#cont_"+v).remove();
			});
		}

		fault_meters += "</ul></li>";

		$(".meters_tab").append(fault_meters);

		$("a.bad_meter").bind("click",showFaultMeter);
}

function showFaultMeter(){
	var metern = $(this).attr("id");
	
	$(".show_fault_meter .cont_").html("<span id='loading'>Loading last read data for Meter #"+metern+"..........<i class='fa fa-spinner faa-spin animated fa-5x'></i></span>");
	$(".show_fault_meter").show();
	$.post("meter/lastread",{"meter":metern,"cnt":res_cnt},function(data){
       // console.log(data);
       meter = JSON.parse(data);
       // console.log(meter);
		//


	
        mtr_info = chartLayout(1,meter.meters);

		$(".show_fault_meter .cont_").html(mtr_info);
		$(".cd_").bind("mouseover",removeHighlight);
        $(".cd_").bind("mouseout",addHighlight);
        $(".cd_").bind("click",showMeterDetail);

    setTimeout(function(){
    
        elem = meter.meters.meter;
        at = meter.meters.mac_addr;
        meter_data = readMeterData(meter.meters.ReadData,elem);

        labels = meter_data[0];
        kilos = meter_data[1];
        apms1 = meter_data[2];
        apms2 = meter_data[3];
        apms3 = meter_data[4];


        pwr1 = meter_data[5];
        pwr2 = meter_data[6];
        pwr3 = meter_data[7];

        wts1 = meter_data[8];
        wts2 = meter_data[9];
        wts3 = meter_data[10];

        vls1 = meter_data[11];
        vls2 = meter_data[12];
        vls3 = meter_data[13];

        kilowattPlot(elem,kilos,labels,at);
        linesPlot(elem,apms1,apms2,apms3,labels,at,"Amps");
        linesPlot(elem,pwr1,pwr2,pwr3,labels,at,"Power");
        linesPlot(elem,wts1,wts2,wts3,labels,at,"Watts");
        linesPlot(elem,vls1,vls2,vls3,labels,at,"Volts");
    
        doToolTip();

    },1000);
		$(".show_fault_meter").show("slow");
		$(".show_fault_meter .cls_fault_meter").click(function(){
			$(".show_fault_meter").hide("slow");
		})
	});
	
}

function kiloWattUsageWidget(meter,type){

   if(type == "def"){
	var kilo_usage = (parseFloat(meter.kilos.kilo_now) - parseFloat(meter.kilos.kilo_then));
  	var kilo_dis_def = '<span class="ku">\
		                  <h4><b>Kilowatt Usage: Today</b></h4>\
		                  From: <b class="kf_date">'+meter.kilos.kilo_fd+'</b><br/>\
		                  Last Read: <b class="ku_date">'+meter.kilos.kilo_td+'</b><br/>\
		                  <span class="kwh">\
		                    <img src="static/img/kwh.png"/>\
		                    <i class="kilos">'+kilo_usage.toFixed(4)+'</i>\
		                  </span><br/>\
		                </span><br/><br/>';
		                // console.log(meter)

		   setTimeout(function(){
			    $("#kut_"+meter.meter).html(kilo_dis_def);
		   },1000);       
                // default kilo display
    
   }else if(type == "all"){
	var kilo_usage = parseFloat(meter.kilos.kilo_now);
  	var kilo_dis_all = '<span class="kul">\
		                  <h4><b>Kilowatt Usage: Life Time </b></h4>\
		                  From: <b class="kf_date">Unknown</b><br/>\
		                  Last Read: <b class="ku_date">'+meter.kilos.kilo_td+'</b><br/>\
		                  <span class="kwh">\
		                    <img src="static/img/kwh.png"/>\
		                    <i class="kilos">'+kilo_usage.toFixed(4)+'</i>\
		                  </span><br/>\
		                </span><br/><br/>';
		                // console.log(meter)

		   setTimeout(function(){
			    $("#kul_"+meter.meter).html(kilo_dis_all);
		   },1000);       
                // default kilo display
    
   }else if(type == "mtd"){
    	$.post("kilos",meter,function(data){
    		meter_ = JSON.parse(data);
    		kilos = meter_.meters;
		
		if(kilos  == "reload"){
	//		window.location.href = "/";
		}else{
			var kilo_usage = (parseFloat(kilos.kilo_now) - parseFloat(kilos.kilo_then));
    			var kilo_dis_mtd = '<span class="mtd">\
		                  <h4><b>Kilowatt Usage: Month to Date</b></h4>\
		                  From: <b class="kf_date">'+kilos.kilo_fd+'</b><br/>\
		                  Last Read: <b class="ku_date">'+kilos.kilo_td+'</b><br/>\
		                  <span class="kwh">\
		                    <img src="static/img/kwh.png"/>\
		                    <i class="kilos">'+kilo_usage.toFixed(4)+'</i>\
		                  </span><br/>\
		                </span><br/><br/><br/>';

		    $("#mtd_"+meter.meter).html(kilo_dis_mtd);
		}
    	});
    }else if(type == "cus"){
    	var kilo_dis_cus = '<span class="kus" >\
		                  <h4><b>Kilowatt Usage: Custom </b></h4>\
		                  From: <b class="kf_date"><input type="date" class="form-control" id="frm_date"  /></b><br/>\
		                  To: <b class="ku_date"><input meter="'+meter.meter+'" version="'+meter.protocol+'" type="date" class="form-control to_date" id="to_date"  /></b><br/><br/>\
		                  <span class="kwh">\
		                    <img src="static/img/kwh.png"/>\
		                    <i id="kilo_'+meter.meter+'" class="kilos">0.0000</i>\
		                  </span><br/>\
		                </span><br/><br/>';

		return kilo_dis_cus;
    }
   
}


function setUserField(){
	var field = $(this);
	var group = field.attr("group");
	var meter = field.attr("meter");
	var set = field.attr("set");
	var set_field = $("#set_field");

	var input_field = $("<span id='set_field'><input type='text' name='"+field.attr("set")+"' id='field_set'><span id='cls_' class='fa fa-times fa-2x'></span></span>");

	if(set_field.length > 0)
		set_field.remove();

	input_field.insertAfter(field);

	$("#cls_").click(function(){
		$("#set_field").remove();
	});
	$("#field_set").change(function(){
		var setter = $(this);
		$.post("meter/info/set",{"set":set,"group":group,"meter":meter,"val":$(this).val()},function(data){
			info = JSON.parse(data);
			detail = info.detail.info
			field.siblings(".setval_").html(setter.val());
			$("#set_field").remove();
		});
	});
}

function setMeterInactive(){
	
   var meter = $(this).attr("meter");
   if( $(this).is(":checked") ){
	val_ = 0;
    }else{
	val_ = 1;
    }
	
	$.post("meter/info/set",{"set":"active","meter":meter,"val": val_},function(data){
		// hide meter details on user making meter inactive

	});

}



function fetchKiloCustomDates(){
	meter = $(this).attr("meter");
	version = $(this).attr("version");
	to_date = $(this).val();
	frm_date = $(this).parent().siblings(".kf_date").children("input").val();
	
	frm_date_as_date_obj = new Date($(this).parent().siblings(".kf_date").children("input").val());
	to_date_as_date_obj = new Date($(this).val());


	if(frm_date_as_date_obj < to_date_as_date_obj){
		$("#kilo_"+meter+".kilos").html('....<i class="fa fa-spinner faa-spin animated"></i>....');
		$.post("kilos",{"meter":meter,"protocol":version,"cnt":res_cnt,"sd":frm_date,"ed":to_date},function(data){
	    	meter_ = JSON.parse(data);
    		kilos = meter_.meters;

		if(kilos == "reload"){
		//window.location.href = "/";
			$.post("kilos",{"meter":meter,"protocol":version,"cnt":res_cnt,"sd":frm_date,"ed":to_date},function(data){
	    			meter_ = JSON.parse(data);
	    			kilos = meter_.meters;
				var kilo_usage = (parseFloat(kilos.kilo_now) - parseFloat(kilos.kilo_then));
			
				setTimeout(function(){
					$("#kilo_"+meter+".kilos").html(kilo_usage.toFixed(4));
				},500);
	        	});
   		  }else{
			var kilo_usage = (parseFloat(kilos.kilo_now) - parseFloat(kilos.kilo_then));
			
			setTimeout(function(){
					$("#kilo_"+meter+".kilos").html(kilo_usage.toFixed(4));
			},500);
		  }	
		});
	}else{
		say("<span class='error'>There was an error in your input. Please ensure that the <u>From</u> date is before the <u>To</u> date.</span>");
	}
}

function doToolTip(){
	$("[data-toggle='tooltip']").tooltip();
}

