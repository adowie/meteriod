import os

WTF_CSRF_ENABLED = True
SECRET_KEY = '6454564HGLKSNHGK'

basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = "mysql://adowie:NUKK7jKbcBNDMbem@192.168.0.92:3306/meter_system"
# SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
SQLALCHEMY_TRACK_MODIFICATIONS = True



