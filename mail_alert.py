#!/bin/python3
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
# from email.mime.base import MIMEBase
from email import encoders
from app import api
 
fromaddr = "alerts@cpj.com"
toaddr = "adowie@cpj.com"
 
msg = MIMEMultipart()
 
msg['From'] = fromaddr
msg['To'] = toaddr
msg['Subject'] = "Meteriod - Notifictaion"
 

has_inactive_meters,meters = api.checkInactiveMeters()

add_meter = ""
meter_location = ""

if has_inactive_meters:
	for meter in meters:
		if not meter["silent"]:
			add_meter += "* Meter # %s located at %s flagged inactive/offline at %s. <br/>"%(meter["meter"],meter["location"],meter["updated_at"])
	
body = "This is to alert you that the meters in the list below have been flagged as inactive.<br/>"
body += add_meter

if has_inactive_meters:
	body += "Please note that until you silence these meters in the Admin panel of the Meteriod program <br/>\
		these notifictaions will continue every ten(10) minutes <br/>. Go <a href='meters.cpj.com/meteriod/'>here</a> to login to Meteriod."


msg.attach(MIMEText(body, 'html'))
 
# filename = "NAME OF THE FILE WITH ITS EXTENSION"
# attachment = open("PATH OF THE FILE", "rb")
 
# part = MIMEBase('application', 'octet-stream')
# part.set_payload((attachment).read())
# encoders.encode_base64(part)
# part.add_header('Content-Disposition', "attachment; filename= %s" % filename)
 
# msg.attach(part)
 
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login(fromaddr, "Welcome20??")
text = msg.as_string()

#send mail based on criteria match
if has_inactive_meters:
    server.sendmail(fromaddr, toaddr, text)
    server.quit()


