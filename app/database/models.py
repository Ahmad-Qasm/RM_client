from app import db
from datetime import datetime

# Table for creating a many-to-many relationship between Orders and Taskdates
order_taskdates = db.Table('order_taskdates', db.Model.metadata,
    db.Column('order_id', db.Integer, db.ForeignKey('order.id'),primary_key=True),
    db.Column('Taskdate_id', db.Integer, db.ForeignKey('taskdate.id'),primary_key=True)
)

# Create Order Model
# Includes relationship with User and TaskDate table
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator = db.Column(db.String(50))
    project = db.Column(db.String(50))
    system = db.Column(db.String(50))
    sopSocop = db.Column(db.String(50))
    typeOfRelease = db.Column(db.String(50))
    status = db.Column(db.String(50))
    bswVersion = db.Column(db.String(50))
    relMeetingWeek = db.Column(db.Integer)
    filesOnServerWeek = db.Column(db.Integer)
    projectMeco = db.Column(db.Integer)
    projectAccountNumber = db.Column(db.String(50)) 
    delOrderADate = db.Column(db.Integer)
    delOrderAComment = db.Column(db.Text)
    delOrderBDate = db.Column(db.String(50))
    delOrderBComment = db.Column(db.Text)
    delOrderCDate = db.Column(db.String(50))
    delOrderCComment = db.Column(db.Text)
    delOrderDDate = db.Column(db.String(50))
    delOrderDComment = db.Column(db.Text)
    delOrderEDate = db.Column(db.String(50))
    delOrderEComment = db.Column(db.Text)
    delOrderFDate = db.Column(db.String(50))
    delOrderFComment = db.Column(db.Text)
    state = db.Column(db.Integer, default = 0)
    customer = db.Column(db.Text)
    engines = db.Column(db.PickleType)
    storyLink = db.Column(db.Text)
    taskdates = db.relationship(
        'Taskdate',
        secondary=order_taskdates,
        back_populates='orders'
    )
    date_created = db.Column(db.DateTime, default=datetime.now)

# Create Project Model
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text(), unique=True)
    project_responsible = db.Column(db.Text())
    system = db.Column(db.Text())

# Create Group Model
class Group(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.Text(),unique=True)
    reviewer = db.Column(db.Text())
    approver = db.Column(db.Text())

# Create Task Model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.Text(), unique=True)
    originalEstimate = db.Column(db.Text())
    description = db.Column(db.Text())
    taskid = db.Column(db.Text(), unique=True)

# Create Taskdate Model
class Taskdate(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    date = db.Column(db.DateTime)
    task = db.Column(db.Text())
    timeEstimate = db.Column(db.Text())
    orders = db.relationship(
        'Order',
        secondary=order_taskdates,
        back_populates='taskdates'
    )