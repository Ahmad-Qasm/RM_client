from flask import request, Response, Blueprint
from app import db, ADMIN_GROUP
from sqlalchemy import exc
from werkzeug.exceptions import BadRequest
import json
from app.database.models import  Project
from app.database.schemas import project_schema, multi_project_schema
from app.routes.helpers import token_required

# Create a blueprint for easier access across the application
projectbp = Blueprint("ProjectUpdate", __name__)

# Query database for all projects.
@projectbp.route('/projects', methods=['GET'])
@token_required
def get_projects(user_info):
    try:
        projects = db.session.query(Project).all()
        project_details = multi_project_schema.dump(projects) 
        serialized_project_details = json.dumps(project_details)
        resp = Response(serialized_project_details,
                        status=200,
                        mimetype='application/json')
        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

# Query database for project with name that match the passed parameter; <name>
# API endpoint syntax: /project?name=<name>
@projectbp.route('/project', methods=['GET'])
@token_required
def get_project(user_info):
    try:
        name = request.args.get('name')
        
        # Fetch projects that match with <name>
        project_detail = db.session.query(Project).filter(
            Project.name == name).first()

        if project_detail is None:
            resp = Response(json.dumps(""),
                            status=200,
                            mimetype='application/json')
            return resp

        project_details = project_schema.dump(project_detail) 
        serialized_project_details = json.dumps(project_details)
        resp = Response(serialized_project_details,
                        status=200,
                        mimetype='application/json')
        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

# Update a project from BackOffice
@projectbp.route('/project/update', methods=['POST'])
@token_required
def update_project(user_info):
    try:
        jsondata = request.get_json()
        id = jsondata['id']
        name = jsondata['name']
        system = jsondata['system']
        project_responsible = jsondata['project_responsible']

        # To avoid errors when saving a project where project responsible is not defined.
        if project_responsible is None:
            project_responsible = ""
        
        project = db.session.query(Project).filter(Project.id == id).first()

        project.name = name
        project.project_responsible = project_responsible
        project.system = system

        db.session.commit()
        
        resp = Response(json.dumps(project_schema.dump(project)),
                        status=200,
                        mimetype='application/json')

        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except BadRequest as e:
        return Response(str(e), status=400)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

# Uses HTTP POST method to delete a project from database
@projectbp.route('/project-delete', methods=['POST'])
@token_required
def delete_project(user_info):
    # Get the project name from the http request to get the group object from database
    project_name = request.args.get('projectName')

    if project_name is None:
        raise BadRequest(f"Bad request. Syntax: /project-delete?projectName=<projectName>")

    try:
        # Fetch the group object from database
        project = db.session.query(Project).filter(Project.name == project_name).first()

        if project is None:
            raise exc.NoResultFound(f"The project not found")
        
        if user_info['token_info']['department'] != ADMIN_GROUP:
            raise BadRequest(f"Unauthorized to make this request")

        db.session.delete(project)
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
