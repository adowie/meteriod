from app import db

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(20), index=True, unique=True)
	fullname = db.Column(db.String(64))
	email = db.Column(db.String(120), index=True, unique=True)
	password = db.Column(db.String(220))
	created_date = db.Column(db.DateTime)
	image = db.Column(db.String(1024))
	
	sessions = db.relationship('Session',back_populates="user")

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

	def __repr__(self):
		return '<User %s,%s,%s,%s,%s>' % (self.username,self.fullname,self.email,self.password,self.created_date)

class Role(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(20), index=True, unique=True)
	created_date = db.Column(db.DateTime)
	active = db.Column(db.Boolean)
	level = db.Column(db.Integer)

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

	def __repr__(self):
		return '<Role %s,%s,%s,%s>' % (self.name,self.created_date,self.active,self.level)

class Session(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	session_ = db.Column(db.String(32),unique=True)
	created_date = db.Column(db.DateTime)
	active = db.Column(db.Boolean)

	user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	user = db.relationship('User',back_populates="sessions",foreign_keys=user_id)

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}
	
	def __repr__(self):
		return '<Session %s,%s,%s,%s,%s>' % (self.session_,self.created_date,self.active,self.user_id)

class Meteriod(db.Model):
	__tablename__ = 'Meteriod'

	id = db.Column(db.Integer, primary_key = True)
	meter = db.Column(db.String(50))
	active = db.Column(db.Boolean)
	updated_at = db.Column(db.DateTime)
	silent = db.Column(db.Boolean)
	
	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

	def __repr__(self):
		return '<Meteriod %s,%s,%s,%s>' % (self.meter,self.active,self.updated_at,self.silent)


class Notifier():
	__tablename__ = 'Notifier'

	id = db.Column(db.Integer, primary_key = True)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
	user = db.relationship('User')

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

	def __repr__(self):
		return '<Notifier %s,%s>' % (self.id,self.user_id)

class mAssociations(db.Model):
	__tablename__ = 'mAssociations'
	
	id = db.Column(db.Integer, primary_key = True)
	group_id = db.Column(db.Integer)
	meter = db.Column(db.Integer)
	name = db.Column(db.String(50))
	location = db.Column(db.String(254))
	active = db.Column(db.Boolean)

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class mMaster(db.Model):
	__tablename__ = 'mMaster'
	meter = db.Column(db.Integer, primary_key = True)
	m_group = db.Column(db.Integer)
	mac_addr = db.Column(db.String(50)) 
	m_interval = db.Column(db.String(10)) 
	protocol = db.Column(db.String(5)) 
	until = db.Column(db.String(100))
	since = db.Column(db.String(100))
	message = db.Column(db.String(255))
	bad_reads = db.Column(db.Integer)
	good_reads = db.Column(db.Integer)
	credits = db.Column(db.Integer)
	created_at = db.Column(db.DateTime) 
	updated_at = db.Column(db.DateTime) 

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class mDetailsv3(db.Model):
	__tablename__ = 'mDetailsv3'
	log_id = db.Column(db.Integer, primary_key = True)
	meter = db.Column(db.Integer,index=True,unique=True)
	good = db.Column(db.Integer)
	date = db.Column(db.DateTime)
	time = db.Column(db.DateTime)
	Time_Stamp_UTC_ms = db.Column(db.String(50)) 
	Firmware = db.Column(db.Integer)
	Model = db.Column(db.Integer)
	kWh_Tot = db.Column(db.Float)
	kWh_Tariff_1 = db.Column(db.Float)
	kWh_Tariff_2 = db.Column(db.Float)
	kWh_Tariff_3 = db.Column(db.Float)
	kWh_Tariff_4 = db.Column(db.Float)
	Rev_kWh_Tot = db.Column(db.Float)
	Rev_kWh_Tariff_1 = db.Column(db.Float)
	Rev_kWh_Tariff_2 = db.Column(db.Float)
	Rev_kWh_Tariff_3 = db.Column(db.Float)
	Rev_kWh_Tariff_4 = db.Column(db.Float)
	RMS_Volts_Ln_1 = db.Column(db.Float)
	RMS_Volts_Ln_2 = db.Column(db.Float)
	RMS_Volts_Ln_3 = db.Column(db.Float)
	Amps_Ln_1 = db.Column(db.Float)
	Amps_Ln_2 = db.Column(db.Float)
	Amps_Ln_3 = db.Column(db.Float)
	Power_Factor_Ln_1 = db.Column(db.Float)
	Power_Factor_Ln_2 = db.Column(db.Float)
	Power_Factor_Ln_3 = db.Column(db.Float)
	RMS_Watts_Ln_1 = db.Column(db.Float)
	RMS_Watts_Ln_2 = db.Column(db.Float)
	RMS_Watts_Ln_3 = db.Column(db.Float)
	RMS_Watts_Tot = db.Column(db.Float)
	RMS_Watts_Max_Demand = db.Column(db.Integer)
	Max_Demand_Period = db.Column(db.Integer)
	Meter_Status_Code = db.Column(db.Integer)
	CT_Ratio = db.Column(db.Integer)
	PERRNR = db.Column(db.Integer)
	created_at = db.Column(db.DateTime) 

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class mDetailsv4(db.Model):
	__tablename__ = "mDetailsv4"
	log_id = db.Column(db.Integer, primary_key = True)
	meter = db.Column(db.Integer)
	Good = db.Column(db.Integer)
	Date = db.Column(db.DateTime)
	Time = db.Column(db.DateTime)
	Time_Stamp_UTC_ms = db.Column(db.String(150))
	Firmware = db.Column(db.Integer)
	Model = db.Column(db.Integer)
	kWh_Tot = db.Column(db.Float)
	kWh_Tariff_1 = db.Column(db.Float)
	kWh_Tariff_2 = db.Column(db.Float)
	Rev_kWh_Tot = db.Column(db.Float)
	Rev_kWh_Tariff_1 = db.Column(db.Float)
	Rev_kWh_Tariff_2 = db.Column(db.Float)
	RMS_Volts_Ln_1 = db.Column(db.Float)
	RMS_Volts_Ln_2 = db.Column(db.Float)
	Amps_Ln_1 = db.Column(db.Float)
	Amps_Ln_2 = db.Column(db.Float)
	RMS_Watts_Ln_1 = db.Column(db.Float)
	RMS_Watts_Ln_2 = db.Column(db.Float)
	RMS_Watts_Tot = db.Column(db.Float)
	Power_Factor_Ln_1 = db.Column(db.Float)
	Power_Factor_Ln_2 = db.Column(db.Float)
	Power_Factor_Ln_3 = db.Column(db.Float)
	RMS_Watts_Max_Demand = db.Column(db.Float)
	Max_Demand_Period = db.Column(db.Float)
	CT_Ratio = db.Column(db.Float)
	Pulse_Ratio_1 = db.Column(db.Float)
	Pulse_Ratio_2 = db.Column(db.Float)
	Pulse_Ratio_3 = db.Column(db.Float)
	Reactive_Energy_Tot = db.Column(db.Float)
	kWh_Rst = db.Column(db.Float)
	Rev_kWh_Rst = db.Column(db.Float)
	Reactive_Pwr_Ln_1 = db.Column(db.Float)
	Reactive_Pwr_Ln_2 = db.Column(db.Float)
	Reactive_Pwr_Tot = db.Column(db.Float)
	Line_Freq = db.Column(db.Float)
	State_Watts_Dir = db.Column(db.Float)
	State_Out = db.Column(db.Float)
	kWh_Ln_1 = db.Column(db.Float)
	kWh_Ln_2 = db.Column(db.Integer)
	kWh_Ln_3 = db.Column(db.Integer)
	Rev_kWh_Ln_1 = db.Column(db.Integer)
	Rev_kWh_Ln_2 = db.Column(db.Integer)
	Rev_kWh_Ln_3 = db.Column(db.Integer)
	CF_Ratio = db.Column(db.Integer)
	Net_Calc_Watts_Ln_1 = db.Column(db.Integer)
	Net_Calc_Watts_Ln_2 = db.Column(db.Integer)
	Net_Calc_Watts_Tot = db.Column(db.Integer)
	PERRNR = db.Column(db.Integer)
	created_at = db.Column(db.DateTime) 
	updated_at = db.Column(db.DateTime) 

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class mGroups(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	group_id = db.Column(db.Integer)
	name = db.Column(db.String(50)) 

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class mMaxDemandPeriod(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	code = db.Column(db.Integer)
	meaning = db.Column(db.String(25)) 

	def as_dict(self):
		return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class mQueryTimes(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	query_timezone = db.Column(db.String(50)) 
	query_time = db.Column(db.DateTime)  
	created_at = db.Column(db.DateTime) 
	updated_at = db.Column(db.DateTime) 

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class system_defaults(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String(150))
	value = db.Column(db.String(100))

	def as_dict(self):
	   return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class system_version(db.Model):
	id = db.Column(db.Integer, primary_key = True)
	value = db.Column(db.String(5)) 
	active = db.Column(db.Integer) 

	def as_dict(self):
		return {c.name: getattr(self, c.name) for c in self.__table__.columns}
