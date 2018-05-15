function kilowattPlot(elem,kilos,labels_,at){

    var ctx = document.getElementById("kilo_"+elem);
    var kilo_meters = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels_,
            datasets: [{
                label: "MAC:"+at,
                data: kilos,
                backgroundColor: [
                    'rgba(105, 220, 220,0.4)'
                    
                 ],
                borderColor: [
                    '#000'
                ],
                borderWidth: 2
                
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:false
                    }
                }]
            }
        }
    });


   chartsToUpdate("kilos",kilo_meters);
}


function linesPlot(elem,line1,line2,line3,labels_,at,line){

    var ctx = document.getElementById(line.toLowerCase()+"_"+elem);

    if(ctx){
        var meter_lines = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels_,
                datasets: [{
                    label: line+" Line 1",
                    data: line1,
                    
                    borderColor: [
                        legend_[line]["line1"]["border"]
                    ],
                    borderWidth: 1
                    
                },{
                    label: line+" Line 2",
                    data: line2,
                    borderColor: [
                        legend_[line]["line2"]["border"]
                    ],
                    borderWidth: 2
                },{
                    label: line+" Line 3",
                    data: line3,
                    borderColor: [
                        legend_[line]["line3"]["border"]
                    ],
                    borderWidth: 3
                }

                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:false
                        }
                    }]
                },
                    legend:{
                        labels:{
                            boxWidth:10 //Width legend colorbox
                        }
                    }
            }
        });


        chartsToUpdate(line,meter_lines);
    }
}

function chartsToUpdate(type,chart){
    type = type.toLowerCase()
    if(type=="kilos")
        kctu.push(chart);
    else if(type=="amps")
        actu.push(chart);
    else if(type=="power")
        pctu.push(chart);
    else if(type=="watts")
        wctu.push(chart);
    else if(type=="volts")
        vctu.push(chart);

}


function updateKilowattPlots(charts){
     $.post("meters",{"meters":"all","cnt":10,"sd":today(),"ed":today()},function(data){
        meters = JSON.parse(data);
        meters_ = meters.meters;
        
       $.each(meters_,function(i,data){
            elem = data.meter;
            at = data.MAC_Addr;
            meter_data = readMeterData(data.ReadData,elem);
            var version = data.protocol ? data.protocol : "v4";
  
            if(data.ReadData.length > 0)
                kiloWattUsageWidget(data,"def");
                

            // console.log(data);


            if(data.ReadData.length > 0)
                kiloWattUsageWidget({"meter":elem,"protocol":version,"cnt":res_cnt,"sd":startOfMonth(data.lastread),"ed":today()},"cus");


            labels = meter_data[0];
            kilos = meter_data[1];
            // kilowattPlot(elem,kilos,labels,at);
            charts[i].data.datasets[0].data = kilos;
            charts[i].data.labels = labels;
            charts[i].update();  
       });
    });
    
}


function updatelinesPlots(charts1,charts2,charts3,charts4){
    
    $.post("meters",{"meters":"all","cnt":res_cnt,"sd":today(),"ed":today()},function(data){
        meters = JSON.parse(data);
        meters_ = meters.meters;
        
	//meters_ == "reload"){
	//	window.location.href = "/";
	
         $.each(meters_,function(i,data){
            elem = data.meter;
            at = data.MAC_Addr;
            meter_data = readMeterData(data.ReadData,elem);

            labels = meter_data[0];
            
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
            // kilowattPlot(elem,kilos,labels,at);
            charts1[i].data.datasets[0].data = apms1;
            charts1[i].data.datasets[1].data = apms2;
            charts1[i].data.datasets[2].data = apms3;
            charts1[i].data.labels = labels;
            charts1[i].update();  

            charts2[i].data.datasets[0].data = pwr1;
            charts2[i].data.datasets[1].data = pwr2;
            charts2[i].data.datasets[2].data = pwr3;
            charts2[i].data.labels = labels;
            charts2[i].update();  

            charts3[i].data.datasets[0].data = wts1;
            charts3[i].data.datasets[1].data = wts2;
            charts3[i].data.datasets[2].data = wts3;
            charts3[i].data.labels = labels;
            charts3[i].update();  

            charts4[i].data.datasets[0].data = vls1;
            charts4[i].data.datasets[1].data = vls2;
            charts4[i].data.datasets[2].data = vls3;
            charts4[i].data.labels = labels;
            charts4[i].update();  

       });
	//
    });
    
}

var uk = setInterval(function(){
    if(kctu.length > 0){
        updateKilowattPlots(kctu);
    }	
},( 5 * 60 * 1000 ));

var ul = setInterval(function(){
    if(actu.length > 0){
        updatelinesPlots(actu,pctu,wctu,vctu);
    }
},( 5 * 60 * 1000 ));


