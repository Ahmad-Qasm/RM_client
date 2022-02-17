import json
from flask import request, Response, Blueprint
from sqlalchemy import exc
from werkzeug.exceptions import BadRequest
from app.database.models import Task
from app.database.schemas import multi_task_schema, task_schema
from app import db
from app.routes.helpers import token_required

# Create a blueprint for easier access across the application
taskbp = Blueprint("TaskCreate", __name__)

# Use HTTP POST to create tasks
# Store the created tasks in database
@taskbp.route('/new-task', methods=['POST'])
@token_required
def add_task(user_info):
    try:
        task_details = request.get_json()

        # Load task details into local variables
        name = task_details['name']
        originalEstimate = task_details['originalEstimate']

        # Create new task
        new_task = Task(
            name= name,
            originalEstimate= originalEstimate
        )

        # store the created task in database 
        db.session.add(new_task)
        db.session.commit()

        # Return response
        response = Response(task_schema.dumps(new_task),
                        status= 200,
                        mimetype='application/json')
        
        return response

    # Catch and return error

    except BadRequest as e:
        return Response(str(e), status=400)

    except ValueError as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)
    
# Uses HTTP to fetch all the tasks from the database 
@taskbp.route('/tasks', methods=['GET'])
@token_required
def get_tasks(user_info):
    try:
        name = request.args.get('name')

        # Fetch the tasks from the database 
        tasks = db.session.query(Task).all()
        
        if tasks is None:
            raise exc.NoResultFound(f"tasks not found.")
        
        task_details = multi_task_schema.dump(tasks)
        serialized_tasks_details = json.dumps(task_details)
        response = Response(serialized_tasks_details,
                            status = 200,
                            mimetype='application/json')

        return response

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

# Query database for task with id that match the passed parameter; <id>
# API endpoint syntax: /task?id=<id>
@taskbp.route('/task', methods=['GET'])
@token_required
def get_task(user_info):
    try:
        id = request.args.get('id')

        # Fetch tasks that match with <id>
        task_detail = db.session.query(Task).filter(Task.id == id).first()

        if task_detail is None:
            raise exc.NoResultFound(f"Task not found.")

        task_details = task_schema.dump(task_detail) 
        serialized_task_details = json.dumps(task_details)

        resp = Response(serialized_task_details,
                        status=200,
                        mimetype='application/json')
        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)
