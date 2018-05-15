from flask import render_template,request,redirect,url_for
from app import app,auth,gf,api
# import simplejson as json
from bson import json_util
import json

# This function accesses the apiRequest URL and converts
# the contents to a usable Python object and returns it
@app.context_processor
def utility_processor():
	def encript_(enc_str):
		enc_pass = gf.encrypt_decrypt("e",enc_str)
		return enc_pass
	return dict(encript_=encript_)


@app.route('/logout')
def logout():
	auth.Adminuser["isAuthenticated"] = False
	return redirect(url_for("login"))


@app.route('/index')
@app.route('/', methods=['GET','POST'])
def login():	

    form = gf.Map(request.form.to_dict())
    user_ = auth.authenticate(form.username,form.password)

    if user_ and user_["isAuthenticated"]:
	
        if auth.Adminuser["session"] is None: 
            auth.Adminuser["session"] = api.createSession(user_)
            return render_template("index.html",title="Meteriod",year=gf.year(),user=user_)
        return render_template("login.html",title="Meteriod | Login",form=[1],user=user_) 
			
    return render_template("login.html",title="Meteriod | Login",form=[1],user=user_) 


@app.route("/meters",methods=["POST"])
def getMeters():
	user_ = auth.Adminuser
	if user_ and user_["isAuthenticated"]:
		form = gf.Map(request.form.to_dict())
	
		meters_ = api.fetchMeters(form)#fetching info from db


		# Call the callApi function to create a usable
		# object named apiObject from the API request URL.
		# Put the API request URL in the call

		# cnt_offset = f.cnt

		# meters_v3 = api.callApi("http://io.ekmpush.com/readMeter?ver=v3&key=Mzg3MzcyOjg2NDM5MQ&fmt=json&cnt="+cnt_offset+"&tz=America~Jamaica")
		# meters_v4 = api.callApi("http://io.ekmpush.com/readMeter?ver=v4&key=Mzg3MzcyOjg2NDM5MQ&fmt=json&cnt="+cnt_offset+"&tz=America~Jamaica")

		# meters = meters_v3
		# v4_data = meters_v4["readMeter"]["ReadSet"] 


		# for om in v4_data:
		# 	meters["readMeter"]["ReadSet"].append(om)

		return json.dumps({"meters":meters_},default=str)
	else:
 		return json.dumps({"meters":"reload"})

@app.route("/admin",methods=["POST"])
def admin():
    form = gf.Map(request.form.to_dict())
    meters = api.fetchActiveMeters()
    users = api.getMeterUsers()
    return render_template("admin.html",meters=meters,users=users)


@app.route("/admin/action",methods=["POST"])
def adminAction():
    form = gf.Map(request.form.to_dict())
    meters = api.meteriodAction(form)
    users = api.getMeterUsers() #to implement user registration from admin action...
    #deffered implemention - unecessary
    return render_template("admin.html",meters=meters,users=users)


@app.route("/kilos",methods=["POST"])
def getKilos():
	user_ = auth.Adminuser
	if user_ and user_["isAuthenticated"]:
		form = gf.Map(request.form.to_dict())

		kilos_ = api.fetchMeterKilos(form)#fetching info from db

		return json.dumps({"meters":kilos_},default=str)
	else:
  
 		return json.dumps({"meters":"reload"})


@app.route("/meter/lastread",methods=["POST"])
def getMeterLastReadData():
	user_ = auth.Adminuser
	if user_ and user_["isAuthenticated"]:
		form = gf.Map(request.form.to_dict())
	
		data_ = api.fetchMeterLastReadData(form)#fetching info from db

		return json.dumps({"meters":data_},default=str)
	else:
 		return json.dumps({"meters":"reload"})



@app.route("/meter/info/set",methods=["POST"])
def addMeterInfo():
	user_ = auth.Adminuser
	if user_ and user_["isAuthenticated"]:
		form = gf.Map(request.form.to_dict())
			
		info_ = api.setMeterInfo(form)#fetching info from db

		return json.dumps({"detail":info_})
	else:
 		return json.dumps({"meters":"reload"})



@app.route("/meter/silence/",methods=["POST"])
def silentMeters():
	form = gf.Map(request.form.to_dict())
	
	meter = api.silenceMeter(form.meter)#fetching info from db

	return render_template("meter_silenced.html",meter=form.meter) 
	

@app.route("/meter/flag",methods=["POST"])
def flagMeter():
	form = gf.Map(request.form.to_dict())

	
	
# Call the callApi function to create a usable
# object named apiObject from the API request URL.
# Put the API request URL in the call



# meters_v3 = api.callApi("http://io.ekmpush.com/readMeter?ver=v3&key=Mzg3MzcyOjg2NDM5MQ&fmt=json&cnt="+cnt_offset+"&tz=America~Jamaica")
# meters_v4 = api.callApi("http://io.ekmpush.com/readMeter?ver=v4&key=Mzg3MzcyOjg2NDM5MQ&fmt=json&cnt="+cnt_offset+"&tz=America~Jamaica")

# meters = meters_v3
# v4_data = meters_v4["readMeter"]["ReadSet"] 


# for om in v4_data:
# 	meters["readMeter"]["ReadSet"].append(om)
