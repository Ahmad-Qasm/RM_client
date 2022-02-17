import json
from flask import request, Response, Blueprint
from sqlalchemy import exc
from app.database.models import Task
from app.database.schemas import task_schema
from werkzeug.exceptions import BadRequest
from app import db, ADMIN_GROUP
from app.routes.helpers import token_required

# Create a blueprint for easier access across the application
taskbp = Blueprint("TaskUpdate", __name__)

# Uses HTTP POST method to delete a task from database
@taskbp.route('/task-delete', methods=['POST'])
@token_required
def delete_task(user_info):
    # Get the task id from the http request to get the task object from database
    id = request.args.get('id')
    if id is None:
        raise BadRequest(f"Bad request. Syntax: /task-delete?id=<id>")
    try:
        # Fetch the task object from database
        task = db.session.query(Task).filter(Task.id == id).first()
        if task is None:
            raise exc.NoResultFound(f"The task not found")
        
        if user_info['token_info']['department'] != ADMIN_GROUP:
            raise BadRequest(f"Unauthorized to make this request")
        db.session.delete(task)
        db.session.commit()
        response = Response(json.dumps(True),
                            status = 200,
                            mimetype='application/json')
        return response
    except exc.NoResultFound as e:
        return Response(str(e), status=404)
    except BadRequest as e:
        return Response(str(e), status=400)
    except Exception as e:
        return Response(f'Server error: {e}', status=500)
# Takes in new task values as a Json object and
# updates the task with the new values
@taskbp.route('/task-update', methods=['POST'])
@token_required
def update_task(user_info):
    try:
        jsondata = request.get_json()
        # Fetch the data from json Object
        id = jsondata['id']
        name = jsondata['name']
        originalEstimate = jsondata['originalEstimate']
        description = jsondata['description']
        # Fetch the task from database
        task = db.session.query(Task).filter(Task.id == id).first()
        # Update task field with data from json object
        task.name = name
        task.originalEstimate = originalEstimate
        task.description = description
        # Updates the database table
        db.session.commit()
        task_details = task_schema.dump(task)
        serialized_task_details = json.dumps(task_details) 
        response = Response(serialized_task_details,
                            status = 200,
                            mimetype='application/json')
                            
        return response
    
    except BadRequest as e:
        return Response(str(e), status=400)
    except Exception as e:
        return Response(f'Server error: {e}', status=500)
