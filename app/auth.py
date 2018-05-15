from app import db,models

Adminuser = {"isAuthenticated":False}#{"username":"adowie","fullName":"Alex Dowie","isAuthenticated":False,"password":"xxxx51234","company":None}
user = {}

def authenticate(name,pass_):
	global Adminuser 
	global user

	if name and pass_:
		user = models.User
		auth_user = user.query.filter_by(email=name,password=pass_).first()

		if auth_user is not None:
			Adminuser =  {'email':auth_user.email, 'username':auth_user.username,'fullname':auth_user.fullname,"isAuthenticated":True,"password":pass_,"id":auth_user.id,"session":None}
		else:
			Adminuser = {'email':"","isAuthenticated":False ,"error":"Oops!. Email or Password is invalid.","password":"xxxx","id":None,"session":None}

		return Adminuser
