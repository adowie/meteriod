function addKiloMeters(meters,init){
    var gmr_html = "";
    var bmr_html = "";
    var flr_html = "";
    var mtr_bdy_html = "";
    var mtr_bdy_fl_html = "";
    var mtr_bdy_b_html = "";

    if(init){
        $.each(meters,function(i,data){
	meter = "";
	bmr_meter = "";
	flr_meter = "";
	if(data.active)
            meter = '<div class="chart-wrapper live" id="'+data.meter+'"> <div class="chart-title"> Meter #'+data.meter+ ' Reading in Kilowatts  </div> <div class="chart-stage"> <i class="fa faa-spinner animated fa-4x"></i><canvas id="kilo_'+data.meter+'" width="100%" height="180vh"></canvas> </div> <div class="chart-notes"> Meter Readings in kilowatts for meter #'+data.meter+'</div> </div>'; 
            
	if(data.active)
            flr_meter = '<div class="chart-wrapper flat" id="'+data.meter+'"> <div class="chart-title"> Meter #'+data.meter+ ' is Flatlining [flag]</div> <div class="chart-stage"> <i class="fa faa-spinner animated fa-4x"></i><canvas id="kilo_'+data.meter+'" class="flat_line" width="100%" height="180vh"></canvas> </div> <div class="chart-notes">This meter is failing readMeterData test please investigate.</div> </div>'; 

	if(data.active)
            bmr_meter = '<div class="chart-wrapper off" id="'+data.meter+'"> <div class="chart-title"> Meter #'+data.meter+ ' is Offline [flag]</div> <div class="chart-stage"> No Meter Data to Plot <canvas id="kilo_'+data.meter+'" class="no_data" width="100%" height="180vh"></canvas> </div> <div class="chart-notes"> This Meter is offline </div> </div>';            

            mtr_info = chartLayout(1,data);

            if(data.ReadData.length > 0 && isGoodData(data.ReadData)){
                gmr_html += meter;
                mtr_bdy_html += mtr_info;
            }else if(data.ReadData.length > 0 && !isGoodData(data.ReadData)){
                flr_html += flr_meter;
                mtr_bdy_fl_html += mtr_info;
            }else{
                bmr_html += bmr_meter;
                mtr_bdy_b_html += mtr_info;
            }

        });
    

        if(gmr_html !== "")
            $("#kilos_col").html(gmr_html+flr_html+bmr_html);
            $("#meter_col").html(mtr_bdy_html+mtr_bdy_fl_html+mtr_bdy_b_html);


        $(".to_date").bind("change",fetchKiloCustomDates);
        $(".set_").bind("click",setUserField);
        $("#set_active").bind("click",setMeterInactive);

        $(".cd_").bind("mouseover",removeHighlight);
        $(".cd_").bind("mouseout",addHighlight);
        $(".cd_").bind("click",showMeterDetail);
        $(".detach_").bind("click",detachMeterInfo);

    }

    setTimeout(function(){
        $.each(meters,function(i,data){
	  if(data.active){
            elem = data.meter;
            at = data.mac_addr;
            meter_data = readMeterData(data.ReadData,elem);

            labels = meter_data[0];
            kilos = meter_data[1];
            apms1 = meter_data[2];
            apms2 = meter_data[3];
            apms3 = meter_data[4];


            pwr1 = meter_data[5];
            pwr2 = meter_data[6];
            pwr3 = meter_data[7];

            wts1 = meter_data[11];
            wts2 = meter_data[12];
            wts3 = meter_data[13];

            vls1 = meter_data[8];
            vls2 = meter_data[9];
            vls3 = meter_data[10];

            kilowattPlot(elem,kilos,labels,at);
            linesPlot(elem,apms1,apms2,apms3,labels,at,"Amps");
            linesPlot(elem,pwr1,pwr2,pwr3,labels,at,"Power");
            linesPlot(elem,wts1,wts2,wts3,labels,at,"Watts");
            linesPlot(elem,vls1,vls2,vls3,labels,at,"Volts");
	  }
        });
	
    //        hideFaultyMeterDetails();
            doToolTip();

    },1000);
    
}

function removeHighlight(){
    $(this).children("i").removeClass("animated");
}

function addHighlight(){
    $(this).children("i").addClass("animated");
}

function isGoodData(read){
    var br = [];
    var gr = [];
    if(read){
        $.each(read,function(i,data){
            if(data.good > 0 || data.Good)
                gr.push(1);
            else
                br.push(1)
        });
    }
    if(br.length == read.length)
        return false;
    else
        return true;
}

function readMeterData(meter,name){
    res = [];
    labels = [];
    kilos = [];
    apms_ln1 = [];
    apms_ln2 = [];
    apms_ln3 = [];

    pwr_ln1 = [];
    pwr_ln2 = [];
    pwr_ln3 = [];

    rms_vls_ln1 = [];
    rms_vls_ln2 = [];
    rms_vls_ln3 = [];

    rms_wts_ln1 = [];
    rms_wts_ln2 = [];
    rms_wts_ln3 = [];

    rms_wts_tot = [];
    rms_wts_mx_dmd = [];

    kwh_tarf1 = [];
    kwh_tarf2 = [];

    if(meter){
        $.each(meter,function(i,data){
            
            var time_ = data.time ? data.time : data.Time;
            
            labels.push(timeToTwelveHours(time_));
            kilos.push(data.kWh_Tot);
            
            apms_ln1.push(data.Amps_Ln_1);
            apms_ln2.push(data.Amps_Ln_2);
            apms_ln3.push(data.Amps_Ln_3);

            pwr_ln1.push(data.Power_Factor_Ln_1);
            pwr_ln2.push(data.Power_Factor_Ln_2);
            pwr_ln3.push(data.Power_Factor_Ln_3);

            rms_vls_ln1.push(data.RMS_Volts_Ln_1);
            rms_vls_ln2.push(data.RMS_Volts_Ln_2);
            rms_vls_ln3.push(data.RMS_Volts_Ln_3);

            rms_wts_ln1.push(data.RMS_Watts_Ln_1);
            rms_wts_ln2.push(data.RMS_Watts_Ln_2);
            rms_wts_ln3.push(data.RMS_Watts_Ln_3);
        })
    }

    if(labels !== [] && kilos !== [])
        res.push(labels,kilos,apms_ln1,apms_ln2,apms_ln3,pwr_ln1,pwr_ln2,pwr_ln3,rms_vls_ln1,rms_vls_ln2,rms_vls_ln3,rms_wts_ln1,rms_wts_ln2,rms_wts_ln3);
    
    
    return res;
}
