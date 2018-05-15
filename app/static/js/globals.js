var u_ = "";
var p_ = "";
var meters_ = [];
var kctu = []; //kilo charts to update
var actu = []; //amps charts to update
var pctu = []; //amps charts to update
var wctu = []; //amps charts to update
var vctu = []; //amps charts to update
var mflatline = [];
var moffline = [];
var noinfo = null;
var domain_ = document.location.href;
var locat_ = domain_.split("/");
var ROOT_DIR = "/"+locat_[3];

var res_cnt = 10;

function today(){
  date = new Date()
  return ""+ date.getFullYear() + "-" + (date.getMonth() + 1)+ "-" + date.getDate()+"";
}

function startOfMonth(ld){
  date = new Date();
  
  if(ld)
    date = new Date(ld);
  
  return ""+ date.getFullYear() + "-" + (date.getMonth() + 1)+ "-01";
}

function say(msg){
  $(".msg_alert .body").html(msg);
  $(".msg_alert").show();
  $(".msg_alert .cls").click(function(){
      $(".msg_alert").hide();
  });
}

function timeToTwelveHours(time_){
  var frtm12 = "";

  if(time_){
  	var ttime = time_.split(":");
  	var hour = parseInt(ttime[0]);

  	suffix = (hour >= 12) ? 'pm' : 'am';

  	hours = (hour > 12) ? (hour - 12): hour;
  	
  	hours = (hours == 0) ? 12 : hours;

  	frtm12 = hours +":"+ttime[1]+" "+suffix;
  }

	return frtm12;
}

function scollActiveTabIntoView(tab){
  var tabs = $(".meters_tab .tab");
  var tab_nav_width = (tabs.length * (tabs.outerWidth() * 1.2) );
  var tab_indx = tab ? tab : $(".tab.active").attr("index");
  var tab_width =  $(".tab.active").outerWidth();
  var tab_view =  - ( tab_indx * tab_width - ( 2 * tab_width ) );
  var scroller = $(".meters_tab");

  scroll_lim = $(window).width() - ($(window).width() * (30/100)) - ( 1 * tab_width );

  if(tab_nav_width >= scroll_lim ){
    if(tab_indx <= 3)
      scroller.animate({"left": 0 }, 100);
    else
      scroller.animate({"left": (tab_view + 100 )+"px" }, 500);
  }else{
      scroller.animate({"left": 0 }, 100);
  }
}

function setScroller(){
  var tabs = $(".meters_tab .tab");
  var tab_nav = $(".meters_tab");

  var tab_nav_width = (tabs.length * (tabs.outerWidth() * 1.1) );

  tab_nav.css({"width":tab_nav_width+"px","height":(tabs.outerHeight() + 30) + "px"});

  scollActiveTabIntoView();
}


function setActiveTab(){
  $(this).removeClass("inactive").addClass("active");  
  $(this).siblings("li").removeClass("active").addClass("inactive");
  setScroller();

}

function smoothScroll(){
 $('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
}

function layout1(data){
  //grided chart layout 
  var credits = data.credits ? data.credits : 0;
  var read_frequency = data.m_interval ? data.m_interval : 0;
  var good_reads = data.good_reads ? data.good_reads : 0;
  var bad_reads = data.bad_reads ? data.bad_reads : 0;
  var num_reads = good_reads + bad_reads;
  var group = data.m_group ? data.m_group : "None";
  var active = data.active ? "checked" : "";
  var name = data.name ? "<em class='setval_'>"+data.name +"</em><i class='set_' meter='"+data.meter+"' set='name'>[edit <i class='fa fa-pencil'></i>]</i>": "<em class='setval_'>Not Set</em> <i class='set_' group='"+group+"' meter='"+data.meter+"' set='name'>[set <i class='fa fa-pencil'></i>]</i>";
  var location = data.location ? "<em class='setval_'>"+data.location +"</em><i class='set_' meter='"+data.meter+"' set='location'>[edit <i class='fa fa-pencil'></i>]</i>": "<em class='setval_'>Not Set</em> <i class='set_' group='"+group+"' meter='"+data.meter+"' set='location'>[set <i class='fa fa-pencil'></i>]</i>";
  var version = data.protocol ? data.protocol : "Meter #"+data.meter+" has no version no. <i class='report_' msg='Meter #"+data.meter+" has no Version Number defined. Please investigate.'>[report]</i>";
 
  var kilo_usage_widget_1 = data.ReadData.length == 0 ? "":'<span id="kut_'+data.meter+'">loading Today\'s kilowatt usage........ <i class="fa fa-spinner fa-2x faa-spin animated"></i> </span>';
  var kilo_usage_widget_2 = data.ReadData.length == 0 ? "":'<span id="mtd_'+data.meter+'">loading Month to Date kilowatt usage........ <i class="fa fa-spinner fa-2x faa-spin animated"></i></span>';
  var kilo_usage_widget_3 = data.ReadData.length == 0 ? "":'<span id="kul_'+data.meter+'">loading Lifetime kilowatt usage........ <i class="fa fa-spinner fa-2x faa-spin animated"></i></span>';
  var kilo_usage_widget_4 = kiloWattUsageWidget(data,"cus");
  var layout = "";
if(active){

	layout = '<div class="row" id="cont_'+data.meter+'"> \
              <div class="col-sm-12">\
                      <div class="col-sm-3">';
  layout += kilo_usage_widget_1;
  layout += kilo_usage_widget_3;
  layout +='</div>\
                      <div class="col-sm-3">';
  layout += kilo_usage_widget_2;
  layout += kilo_usage_widget_4;
  layout += '</div>\
                  <div class="chart-wrapper details" id="'+data.meter+'"> \
                      <div class="col-sm-12">\
                            <div class="chart-title">\
                              Meter #'+data.meter+': Details \
                            </div> \
                            <div class="chart-stage"> \
                              <div class="meter_head" >\
                                  <div class="col-sm-12">\
                                  <span class="m_field">Name: <b class="val">'+name+'</b></span><br/> \
                                  <span class="m_field">Location: <b class="val">'+location+'</b></span><br/> \
                                  <span class="m_field">Number: <b class="val">'+data.meter+'</b></span><br/> \
                                  <span class="m_field">Version: <b class="val">'+version+'</b></span><br/> \
                                  <span class="m_field">Credits: <b class="val">'+credits+'</b></span><br/> \
                                  <span class="m_field">Update Frequency: <b class="val">'+read_frequency+'</b></span><br/>\
                                  <span class="m_field">Good Reads: <b class="val">'+good_reads+'</b></span><br/> \
                                  <span class="m_field">Bad Reads: <b class="val">'+bad_reads+'</b></span><br/> \
                                  <span class="m_field">Number of Reads: <b class="val">'+num_reads+'</b></span><br/>\
                                  <span class="m_field">Device Group: <b class="val">'+group+'</b></span><br/>\
                                  <span class="m_field">Hardware: <b class="val">'+data.mac_addr+'</b></span><br/>\
                                </div> \
                                  <span class="m_field">Active: <b class="val"><input type="checkbox" '+active+' id="set_active" meter="'+data.meter+'" /></b></span><br/>\
                              </div>\
                          </div>\
                          <div class="chart-notes">\
                                  Detailed Information for Meter #'+data.meter+' \
                          </div>\
                      </div>\
                </div>\
                  <div class="chart-wrapper"> \
                      <div class="chart-title">\
                          Amperage Data: Meter #'+data.meter+'<span class="cd_" meter="'+data.meter+'"><i class="fa fa-bullseye fa-2x faa-bounce animated"></i></span>\
                      </div> \
                      <div class="chart-stage"> \
                          <canvas id="amps_'+data.meter+'" height="50%" width="100%"></canvas>\
                      </div>\
                      <div class="chart-notes">\
                          Amperage by Line for Meter #'+data.meter+' \
                      </div>\
                  </div>\
              </div>\
              <div class="col-sm-4">\
                  <div class="chart-wrapper"> \
                      <div class="chart-title">\
                         Power Data: Meter #'+data.meter+':  \
                      </div> \
                      <div class="chart-stage"> \
                          <canvas id="power_'+data.meter+'" height="80%" width="100%"></canvas>\
                      </div>\
                      <div class="chart-notes">\
                          Power by Line for Meter #'+data.meter+' \
                      </div>\
                  </div>\
              </div>\
              <div class="col-sm-4">\
                  <div class="chart-wrapper"> \
                      <div class="chart-title">\
                         Wattage Data: Meter #'+data.meter+':  \
                      </div> \
                      <div class="chart-stage"> \
                          <canvas id="watts_'+data.meter+'" height="80%" width="100%"></canvas>\
                      </div>\
                      <div class="chart-notes">\
                          Wattage by Line for Meter #'+data.meter+' \
                      </div>\
                  </div>\
              </div>\
              <div class="col-sm-4">\
                  <div class="chart-wrapper"> \
                      <div class="chart-title">\
                         Voltage Data: Meter #'+data.meter+':  \
                      </div> \
                      <div class="chart-stage"> \
                          <canvas id="volts_'+data.meter+'" height="80%" width="100%"></canvas>\
                      </div>\
                      <div class="chart-notes">\
                          Voltage by Line for Meter #'+data.meter+' \
                      </div>\
                  </div>\
              </div>\
          </div>';

    if(data){
      kiloWattUsageWidget(data,"def");
      kiloWattUsageWidget(data,"all");
    }
    
    if(data.ReadData.length > 0)
        kiloWattUsageWidget({"meter":data.meter,"protocol":version,"cnt":res_cnt,"sd":startOfMonth(data.lastread),"ed":today()},"mtd");
}
    return layout;
}

function layout2(data){
  // Table layout 
  var credits = data.credits ? data.credits : 0;
  var read_frequency = data.m_interval ? data.m_interval : 0;
  var good_reads = data.good_reads ? data.good_reads : 0;
  var bad_reads = data.bad_reads ? data.bad_reads : 0;
  var num_reads = good_reads + bad_reads;
  var group = data.m_group ? data.m_group : "None";


  var name = data.name ? data.name +"<i class='set_' meter='"+data.meter+"' set='name'>[edit <i class='fa fa-pencil'></i>]</i>": "Not Set <i class='set_' group='"+group+"' meter='"+data.meter+"' set='name'>[set <i class='fa fa-pencil'></i>]</i>";
  var location = data.location ? data.location +"<i class='set_' meter='"+data.meter+"' set='location'>[edit <i class='fa fa-pencil'></i>]</i>": "Not Set <i class='set_' group='"+group+"' meter='"+data.meter+"' set='location'>[set <i class='fa fa-pencil'></i>]</i>";
  var version = data.protocol ? data.protocol : "Meter #"+data.meter+" has no version no. <i class='report_' msg='Meter #"+data.meter+" has no Version Number defined. Please investigate.'>[report]</i>";
 
  var i = 0;

  kilo_usage_widget_1 = '<span id="kut_'+data.meter+'">loading Todays kilowatt usage........ <i class="fa fa-spinner fa-2x faa-spin animated"></i> </span>';
  kilo_usage_widget_2 = '<span id="mtd_'+data.meter+'">loading Month to Date kilowatt usage........ <i class="fa fa-spinner fa-2x faa-spin animated"></i></span>';
  kilo_usage_widget_3 = '<span id="kul_'+data.meter+'">loading Lifetime kilowatt usage........ <i class="fa fa-spinner fa-2x faa-spin animated"></i></span>';
  kilo_usage_widget_4 = kiloWattUsageWidget(data,"cus");


  layout = ' <div class="chart-wrapper details_bt" id="cont_'+data.meter+'" > \
              <div class="chart-title">\
                Meter #'+data.meter+': Details &nbsp;&nbsp;&nbsp;<span class="detach_" meter="'+data.meter+'"><i class="fa fa-arrows-alt faa-shake animated" aria-hidden="true"></i></span>\
              </div> \
                <div class="meter_head" >\
                <div class="col-sm-12">\
                <div class="col-sm-4">\
                    <span class="m_field">Name: <b class="val">'+name+'</b></span><br/> \
                    <span class="m_field">Location: <b class="val">'+location+'</b></span><br/> \
                    <span class="m_field">Number: <b class="val">'+data.meter+'</b></span><br/>';
      layout += kilo_usage_widget_1;    
      layout += kilo_usage_widget_3;    
      layout += '</div>\
                    <div class="col-sm-4">\
                    <span class="m_field">Version: <b class="val">'+version+'</b></span><br/> \
                    <span class="m_field">Credits: <b class="val">'+credits+'</b></span><br/> \
                    <span class="m_field">Update Frequency: <b class="val">'+read_frequency+'</b></span><br/>\
                    <span class="m_field">Device Group: <b class="val">'+group+'</b></span><br/>\
                    <span class="m_field">Hardware: <b class="val">'+data.mac_addr+'</b></span><br/>\
                    </div>\
                    <div class="col-sm-4">\
                    <span class="m_field">Good Reads: <b class="val">'+good_reads+'</b></span><br/> \
                    <span class="m_field">Bad Reads: <b class="val">'+bad_reads+'</b></span><br/> \
                    <span class="m_field">Number of Reads: <b class="val">'+num_reads+'</b></span><br/>';
      layout += kilo_usage_widget_2;    
      layout += kilo_usage_widget_4;    
      layout += '</div>\
                </div>\
                <div class="col-sm-12">\
                <h3><center>Meter Information</center>&nbsp;&nbsp;<span class="mouse_dir" data-toggle="tooltip" data-placement="right" title="press and hold middle mouse button and drag right / left"><i class="fa fa-arrow-circle-left fa-2px"></i>&nbsp;&nbsp;<i class="fa fa-arrow-circle-right fa-2px"></i></span></h3>\
                <table class="table table-responsive">\
                <thead><tr>';
                 if(data.ReadData.length > 0){

                  $.each(data.ReadData[0],function(k,v){
                    if(i > 0){
                      layout += "<th>"+k+"</th>";
                    }

                    i += 1;
                  });
                }
  layout +=    '</tr> </thead>\
                <tbody>';

                if(data.ReadData.length > 0){

                  $.each(data.ReadData,function(k,v){
                    i = 0;
                      layout += "<tr>";

                    // console.log(v)
                      $.each(v,function(p,a){
                        // console.log(a)

                        if(i > 0){
                          layout += "<td nowrap>"+a+"</td>";
                        }

                        i += 1;

                      });
                      layout += "</tr>";

                  });
                }
  layout +=    '</tbody>\
                </table>\
                 </div>\
                 </div>\
            </div>';

    if(data){
      kiloWattUsageWidget(data,"def");
      kiloWattUsageWidget(data,"all");
    }

    if(data.ReadData.length > 0)
        kiloWattUsageWidget({"meter":data.meter,"protocol":version,"cnt":res_cnt,"sd":startOfMonth(data.lastread),"ed":today()},"mtd");
    
    return layout;
}

function loading(){
	$("body").append("<div class='loade_'><div id='loader'>Tandem is loading Meteriod -- <em id='change_'>Fetching Kilowatt data.....</em> <br/><span class='load_gif'><img src='static/img/loader_.gif' /> </span></div></div>");
	var c = 0;
	noinfo = setInterval(function(){
		checkForInfo(c);
	  c++;
	},1000);
}

function checkForInfo(r){
	info = $("#meter_col").text();
	var detail = ["Converting Metric Watts....","Scanning Power Lines....","Plotting Graphs....","Publishing Details....","Finalizing Scan...."];

	if($.trim(info) !== ""){
		clearInterval(noinfo)
		$(".loade_").remove();
	}else{
		$("#change_").html(detail[r]);

		if(r >= 10){
			clearInterval(noinfo)
			$(".loade_").remove();
		}
		//	window.location.href = "/";
	}

}
// 
var legend_ = {
                "Amps":{
                        "line1":{
                                  "border":'#DD1166'
                                },
                        "line2":{
                                "border":'#555'
                        },
                        "line3":{
                                "border":'#FC3'
                        },
                },
                "Watts":{
                        "line1":{
                                  "border":'#de1d76'
                                },
                        "line2":{
                                "border":'#DE1'
                        },
                        "line3":{
                                "border":'#5a73ec'
                        },
                },
                "Power":{
                        "line1":{
                                  "border":'#f70a2f'
                                },
                        "line2":{
                                "border":'#555'
                        },
                        "line3":{
                                "border":'#51ceea'
                        },
                },
                "Volts":{
                        "line1":{
                                  "border":'#60F'
                                },
                        "line2":{
                                "border":'#03c559'
                        },
                        "line3":{
                                "border":'#f7790d'
                        },
                },
              };
