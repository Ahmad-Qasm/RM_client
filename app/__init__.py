from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from ldap3 import Server
import os
# Global variables:
ADMIN_GROUP = 'NESE'
# init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
# create server object from ldap3 library.
# is used for client authentication and authorization in routes.py
GLOBAL_AD_DOMAIN = "global.scd.scania.com"  
ldap_server_globalAD = Server(GLOBAL_AD_DOMAIN, use_ssl=True)
# config db
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.secret_key = os.urandom(64)
app.config['DEBUG'] = True
# init db
db = SQLAlchemy(app)
# init ma
ma = Marshmallow(app)
# register app with CORS
CORS(app)
# register blueprints
from .routes.user_session import bp as session
from .routes.order_create import bp as create
from .routes.order_state import bp as state
from .routes.order_update import bp as update
from .routes.Group import groupbp as GroupCreate
from .routes.group_update import groupbp as GroupUpdate
from .routes.project_create import projectbp as ProjectCreate
from .routes.project_update import projectbp as ProjectUpdate
from .routes.system_get import systembp as SystemGet
from .routes.task_create import taskbp as TaskCreate
from .routes.task_update import taskbp as TaskUpdate
from .routes.taskdate_create import taskdatebp as TaskDateCreate
from .routes.jira_create import jirabp as JiraCreate

app.register_blueprint(session)
app.register_blueprint(create)
app.register_blueprint(state)
app.register_blueprint(update)
app.register_blueprint(GroupCreate)
app.register_blueprint(GroupUpdate)
app.register_blueprint(ProjectCreate)
app.register_blueprint(ProjectUpdate)
app.register_blueprint(SystemGet)
app.register_blueprint(TaskCreate)
app.register_blueprint(TaskUpdate)
app.register_blueprint(TaskDateCreate)
app.register_blueprint(JiraCreate)

db.create_all()
db.session.commit()