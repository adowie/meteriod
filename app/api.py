from app import app,db,models,gf
from flask import jsonify,request
from sqlalchemy import *
import sqlalchemy.exc 
import simplejson as json
#from urllib.request import *

def createSession(auth_user):
    now = gf.now()
    user = gf.Map(auth_user)
	
    session_ = gf.randomString(16)
	
    user_id = user.id

    session_exist,old_session = sessionExist(user,session_)

    error = ""
    
    if session_exist:
        result = old_session.session_ #prepare visual data
    else:
        session = models.Session(session_=str(session_),created_date=now,active=1,user_id=user.id)   

        db_sess = db.session #open database session
        try:
            db_sess.add(session) #add prepared statment to opened session
            db_sess.commit() #commit changes
        except sqlalchemy.exc.SQLAlchemyError as e:
            db_sess.rollback()
            db_sess.flush() # for resetting non-commited .add()
            error = { "error":e,"session":session_}
        finally:
            db_sess.close()
            db_sess.flush() # for resetting non-commited .add()
        
        if error:
            result = error #[data] #prepare visual data
        else:
            new_session = models.Session.query.filter_by(id=session.id).first()
            result = new_session.session_ #prepare visual data
    return result

def sessionExist(user,id_):
	session = models.Session.query.filter_by(session_=id_).first()
	
	if session is not None:
		return True,session
	else:
		istf,session = getUserActiveSession(user)
		return istf,session

def getMeterUsers():
    users = []
    data = models.User.query.all()

    if data is not None:
        for user in data:
            users.append(user)

    return users

def getUserActiveSession(user):
	user_ = models.User.query.filter_by(id=user.id).first()
	
	if len(user_.sessions) > 0:
		for session in user_.sessions:
			if str(gf.datetimeToDate(session.created_date)) == str(gf.today()):
				# print(session)
				return True,session
			

	return False,None

def callApi ( apiRequest ):
	error = ""
	jsonObject = []

	try:
		response = urlopen(apiRequest)        
	except Exception as e:
		error = {"Error":e}
		jsonObject = error


	if error:
		print(error)
	else:
		response_ = response.read()
		jsonObject = json.loads(response_)

	return jsonObject 


def fetchMeters(f):
    query = models.mMaster.query.all()
    meters = []
    details = {}
    dm = []
    res = []
    if query is not None:
        for meter in query:
            info = models.mAssociations.query.filter_by(meter=meter.as_dict()["meter"]).first()
            if info is not None and info.as_dict()["active"]:
                meters.append(meter.as_dict())
    
    if len(meters) > 0:
        for meter in meters:
            m = meter
            info = models.mAssociations.query.filter_by(meter=m["meter"]).first()
                
            m["active"] = int(bool(gf.Map(info.as_dict()).active)) if info is not None else 0
            m["name"] = gf.Map(info.as_dict()).name if info is not None else ""
            m["location"] = gf.Map(info.as_dict()).location if info is not None else ""
            m["ReadData"],m["kilos"],m["lastread"] = getMeterDetails(m,f)    
        
            dm.append(m)
    return dm


def getMeterDetails(m,qry):
    details = []
    data = None
    meter = gf.Map(m)
    m_ = meter
    res = []
    lastread = 0
    kilos = {"kilo_then":0,"kilo_now":0,"kilo_fd":0,"kilo_td":0} #store kilo_total time period
    
    db_sess = db.session
    if meter.protocol == "v3":
        ld = db_sess.query(func.max(models.mDetailsv3.date)).scalar()
        lastread = ld
        data = models.mDetailsv3.query.filter(models.mDetailsv3.date == ld).order_by(models.mDetailsv3.time.desc()).filter_by(meter=m_.meter).all()
    elif meter.protocol == "v4":
        ld = db_sess.query(func.max(models.mDetailsv4.Date)).scalar()
        lastread = ld
        data = models.mDetailsv4.query.filter(models.mDetailsv4.Date == ld).order_by(models.mDetailsv4.Time.desc()).filter_by(meter=m_.meter).all()

    if data is not None:
        for detail in data:
            details.append( detail.as_dict() )

    res = details

    if len(res) > 0:  
        db_sess.close()

    if len(res) > 0:
        fdd = str(res[-1:][0]["date"]) if "date" in res[-1:][0] else str(res[-1:][0]["Date"]) 
        fdt = str(res[-1:][0]["time"]) if "date" in res[-1:][0] else str(res[-1:][0]["Time"]) 
        fd_ = fdd +" "+ fdt#from date
        tdd = str(res[0:1][0]["date"]) if "date" in res[0:1][0] else str(res[0:1][0]["Date"]) 
        tdt = str(res[0:1][0]["time"]) if "date" in res[0:1][0] else str(res[0:1][0]["Time"]) 
        td_ = tdd +" "+tdt#to date
        kilos["kilo_then"] = res[-1:][0]["kWh_Tot"] if res[-1:][0]["kWh_Tot"] is not None else 0
        kilos["kilo_fd"] = gf.parseStrDate(fd_)

        kilos["kilo_now"] = res[0:1][0]["kWh_Tot"] if res[0:1][0]["kWh_Tot"] is not None else 0
        kilos["kilo_td"] = gf.parseStrDate(td_)
        lastread = td_
        
    return [res[0:int(qry.cnt)],kilos,lastread]



def fetchmeterlastreaddata(meter):
        details = []
        detail = none
        m_ = gf.map(meter)
        res = 0
        kilos = {"kilo_then":0,"kilo_now":0,"kilo_fd":0,"kilo_td":0} #store kilo_total time period
        data_ = {}
        detail = []
        data = []

        m = models.mmaster.query.filter_by(meter=m_.meter).first()

        data_ = m.as_dict()

        db_sess = db.session

        if m.protocol == "v3":
                ld = db_sess.query(func.max(models.mdetailsv3.date)).scalar()
                data_["lastread"] = ld
                data = models.mdetailsv3.query.filter(models.mdetailsv3.date == ld).order_by(models.mdetailsv3.time.desc()).filter_by(meter=m_.meter).all()
        elif m.protocol == "v4":
                ld = db_sess.query(func.max(models.mdetailsv4.date)).scalar()
                data_["lastread"] = ld
                data = models.mdetailsv4.query.filter(models.mdetailsv4.date == ld).order_by(models.mdetailsv4.time.desc()).filter_by(meter=m_.meter).all()

        if data is not none:
            for detail in data:

                details.append( detail.as_dict() )

        res = details

        if res:	
            db_sess.close()

        if len(res) > 0:
            fdd = str(res[-1:][0]["date"]) if "date" in res[-1:][0] else str(res[-1:][0]["date"]) 
            fdt = str(res[-1:][0]["time"]) if "date" in res[-1:][0] else str(res[-1:][0]["time"]) 
            fd_ = fdd +" "+ fdt
            tdd = str(res[0:1][0]["date"]) if "date" in res[0:1][0] else str(res[0:1][0]["date"]) 
            tdt = str(res[0:1][0]["time"]) if "date" in res[0:1][0] else str(res[0:1][0]["time"]) 
            td_ = tdd +" "+tdt
            kilos["kilo_then"] = res[-1:][0]["kwh_tot"] if res[-1:][0]["kwh_tot"] is not none else 0
            kilos["kilo_fd"] = gf.parsestrdate(fd_)

            kilos["kilo_now"] = res[0:1][0]["kwh_tot"] if res[0:1][0]["kwh_tot"] is not none else 0
            kilos["kilo_td"] = gf.parsestrdate(td_)

            data_["readdata"] = res[0:int(meter.cnt)]
            data_["kilos"] = kilos

        return data_


def fetchMeterKilos(m):
	details = []
	fdates = [] #store data for the first date in the month that has with data
	data = None
	meter = gf.Map(m)
	res = 0
	end_of_ld = 1#used to seek detail (kwh_tot) for end of day for last date in res

	# print(meter)
	kilos = {"kilo_then":0,"kilo_now":0,"kilo_fd":0,"kilo_td":0} #store kilo_total time period

	if meter.protocol == "v3":
		data = models.mDetailsv3.query.filter(models.mDetailsv3.date.between(meter.sd,meter.ed),models.mDetailsv3.kWh_Tot.isnot(None)).order_by(models.mDetailsv3.date.desc(),models.mDetailsv3.time.desc()).filter_by(meter=meter.meter).all()
	elif meter.protocol == "v4":
		data = models.mDetailsv4.query.filter(models.mDetailsv4.Date.between(meter.sd,meter.ed),models.mDetailsv4.kWh_Tot.isnot(None)).order_by(models.mDetailsv4.Date.desc(),models.mDetailsv4.Time.desc()).filter_by(meter=meter.meter).all()
		
	if data is not None:
		for detail in data:
			details.append( detail.as_dict() )

	res = details

	if len(res) > 0:
		fdd = str(res[-1:][0]["date"]) if "date" in res[-1:][0] else str(res[-1:][0]["Date"]) #seek last date with kilowatt data which would be the first good read of that day.
		ftr = str(res[-1:][0]["time"]) if "date" in res[-1:][0] else str(res[-1:][0]["Time"]) 
		fdr_ = fdd +" "+ ftr

		for detail in res:
			fdate = detail["date"] if "date" in detail else detail["Date"]
			ftime = detail["time"] if "time" in detail else detail["Time"]
			
			if str(fdate) == str(fdd) and detail["kWh_Tot"] != 0:
				fdates.append(fdate)#push all times read good for that day to get last good read for that day
	
		if len(fdates) > 0:
			end_of_ld = len(fdates)
			
		fdt = str(res[-end_of_ld:][0]["time"]) if "date" in res[-end_of_ld:][0] else str(res[-end_of_ld:][0]["Time"]) 
		fd_ = fdd +" "+ fdt

		tdd = str(res[0:1][0]["date"]) if "date" in res[0:1][0] else str(res[0:1][0]["Date"]) 
		tdt = str(res[0:1][0]["time"]) if "time" in res[0:1][0] else str(res[0:1][0]["Time"]) 
		td_ = tdd +" "+tdt



		kilos["firstread"] = fdr_
		kilos["kilo_then"] = res[-end_of_ld:][0]["kWh_Tot"] if res[-end_of_ld:][0]["kWh_Tot"] is not None else 0
		kilos["kilo_fd"] = gf.parseStrDate(fd_)
		
		if str(fdd) == str(tdd):#if last date and first date are the same then pull data from earliest datetime to last
			kilos["kilo_then"] = res[-1:][0]["kWh_Tot"] if res[-1:][0]["kWh_Tot"] is not None else 0
			kilos["kilo_fd"] = gf.parseStrDate(fdr_)


		kilos["kilo_now"] = res[0:1][0]["kWh_Tot"] if res[0:1][0]["kWh_Tot"] is not None else 0
		kilos["kilo_td"] = gf.parseStrDate(td_)

	return kilos

def fetchActiveMeters():
    meteriod = models.Meteriod.query.all()
    active_meters = []
    m = {}
    if meteriod is not None:
        for meter in meteriod:
            m = meter.as_dict()
            m["location"],m["name"] = getMeterInfo(m["meter"])
            active_meters.append(m)

    if len(active_meters) > 0:
        return active_meters
    return None

def meteriodAction(f):
    meter_ = models.Meteriod.query.filter_by(meter=f.meter).first()
    error = None
    if meter_ is not None:
        if str(f.action) == 'silent':
            meter_.silent = int(f.do)
        elif str(f.action) == 'active':    
            meter_.active = int(f.do)

        db_sess = db.session
        
        meter_.updated_at = gf.now()
        
        try:
            db_sess.commit() #commit changes
        except sqlalchemy.exc.SQLAlchemyError as e:
            db_sess.rollback()
            db_sess.flush() # for resetting non-commited .add()
            error = e
        finally:
            db_sess.close()

        if error:
            print(error)
        else:
            return fetchActiveMeters()


def checkInactiveMeters():
    meteriod = models.Meteriod.query.all()
    inactive_meters = []
    m = {}
    if meteriod is not None:
        for meter in meteriod:
            if not meter.active:
                m = meter.as_dict()
                m["location"],m["name"] = getMeterInfo(m["meter"])
                inactive_meters.append(m)
    
    if len(inactive_meters) > 0:
        return True,inactive_meters
    return False,None

def getMeterInfo(mid):
	info = models.mAssociations.query.filter_by(meter=mid).first()

	if info is not None:
		return info.location,info.name

	return "",""

def silenceMeter(mid):
        meter = models.Meteriod.query.filter_by(meter=mid).first()

        meter.silent = 1

        db_sess = db.session

        try:
            db_sess.commit() #commit changes
        except sqlalchemy.exc.SQLAlchemyError as e:
            db_sess.rollback()
            db_sess.flush() # for resetting non-commited .add()
        finally:
            db_sess.close()


def updateMeteriod(m):
        meter = models.Meteriod.query.filter_by(meter=m.meter).first()

        meter.active = m.active
        meter.updated_at = gf.now()
        meter.silent = 0

        db_sess = db.session

        try:
            db_sess.commit() #commit changes
        except sqlalchemy.exc.SQLAlchemyError as e:
            db_sess.rollback()
            db_sess.flush() # for resetting non-commited .add()
   
        finally:
            db_sess.close()

def setMeterInfo(info):

        meter = models.mAssociations.query.filter_by(meter=info.meter).first()
        result = None
        error = ""

        if meter is not None:
            result = updateMeterInfo(info)
        else:
            if str(info.set) == "name":
                meter = models.mAssociations(group_id=info.group,meter=info.meter,name=info.val,location=None)
            elif str(info.set) == "location":
                meter = models.mAssociations(group_id=info.group,meter=info.meter,name=None,location=info.val)

                db_sess = db.session

                try:
                    db_sess.add(meter) #add prepared statment to opened session
                    db_sess.commit() #commit changes
                except sqlalchemy.exc.SQLAlchemyError as e:
                    print(e)
                    db_sess.rollback()
                    db_sess.flush() # for resetting non-commited .add()

                finally:
                    db_sess.close()

                if error:
                    result = None #[data] #prepare visual data
                else:
                    assoc = models.mAssociations.query.filter_by(meter=info.meter).first()
                    result = {"info":assoc.as_dict()}

        return result

def updateMeterInfo(info):
        meter = models.mAssociations.query.filter_by(meter=info.meter).first()	
        error = ""
        result = None

        if str(info.set) == "name":
            meter.name = info.val
        elif str(info.set) == "location":
            meter.location = info.val
        elif str(info.set) == "active":
            meter.active = info.val
            updateMeteriod(gf.Map({"active":info.val,"meter":info.meter}))

        db_sess = db.session #open database session
        try:
            db_sess.commit() #commit changes
        except sqlalchemy.exc.SQLAlchemyError as e:
            db_sess.rollback()
            db_sess.flush() # for resetting non-commited .add()
    

        finally:
            db_sess.close()

        if error:
            result = None #[data] #prepare visual data
        else:
            assoc = models.mAssociations.query.filter_by(meter=info.meter).first()
            result = {"info":assoc.as_dict()}


        return result
# end product crud
