from flask import request, Response, Blueprint
from sqlalchemy import exc
from app import db
import json
from werkzeug.exceptions import BadRequest
from app.database.models import Project
from app.database.schemas import project_schema
from app.routes.helpers import token_required

# Create a blueprint for easier access across the application
projectbp = Blueprint("ProjectCreate", __name__)

# Uses HTTP POST to create a new Project
# Stores the project in the database
@projectbp.route('/new-project', methods=['POST'])
@token_required
def add_project(user_info):
    try:
        jsondata = request.get_json()
        # Load project name and system into local variables.
        project_name = jsondata['project']
        system_name = jsondata['system']
        
        # Checks if the project exists in the database. If so, no new project is created. 
        project = db.session.query(Project).filter(Project.name == project_name).first()
        if project is not None:
            response = Response("project already exists",
                                status=200,
                                mimetype='application/json')
            return response

        # Create a new project object representing a row in the Project-table (in
        # the database)
        new_project = Project(name=project_name, system=system_name)

        # Store the project in database
        db.session.add(new_project)
        db.session.commit()

        response = Response(project_schema.dumps(new_project),
                            status=200,
                            mimetype='application/json')
        return response

    # Catch and return error
    except BadRequest as e:
        return Response(str(e), status=400)

    except ValueError as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)