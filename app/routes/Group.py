import json
from flask import request, Response, Blueprint
from sqlalchemy import exc
from werkzeug.exceptions import BadRequest
from app.database.models import Group
from app.database.schemas import multi_group_schema, group_schema
from app import db
import requests
from app.routes.helpers import token_required

# Create a blueprint for easier access across the application
groupbp = Blueprint("GroupCreate", __name__)

comptrans_base_url = 'http://sesog0165/ReportService/api/'

# Use HTTP POST to create groups
# Store the created groups in database
@groupbp.route('/new-group', methods=['POST'])
@token_required
def add_group(user_info):
    try:
        group_details = request.get_json()

        # Load group details into local variables
        name = group_details['name']
        reviewer = group_details['reviewer']
        approver = group_details['approver']

        # Create new group
        new_group = Group(
            name= name,
            reviewer=reviewer,
            approver=approver
        )

        # store the created group in database 
        db.session.add(new_group)
        db.session.commit()

        # Return response
        response = Response(group_schema.dumps(new_group),
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
        
# Uses HTTP to fetch all the groups from the database.
@groupbp.route('/groups', methods=['GET'])
@token_required
def get_groups(user_info):
    try:
        name = request.args.get('name')

        # Fetch the groups from the database 
        groups = db.session.query(Group).filter(
            Group.name.like(f'%{name}%')).all()
        
        if groups is None:
            raise exc.NoResultFound(f"groups not found.")
        
        group_details = multi_group_schema.dump(groups)
        serialized_groups_details = json.dumps(group_details)
        response = Response(serialized_groups_details,
                            status = 200,
                            mimetype='application/json')
        return response

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)   

# Uses HTTP to fetch all the groups from Comptrans.
@groupbp.route('/comptrans-groups', methods=['GET'])
def get_comptrans_groups():
    try:
        url = comptrans_base_url + 'groups'
        groups = requests.get(url)
        if groups is None:
            raise exc.NoResultFound(f"groups not found.")

        data = groups.json()
        return data

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)   

# Uses HTTP to fetch all the groups related to a certain system, version and engine from Comptrans.
# API endpoint syntax: /engine-groups?system=<system>&version=<version>&engine=<engine>
@groupbp.route('/engine-groups', methods=['GET'])
@token_required
def get_engine_groups(user_info):
    try:
        system = request.args.get('system')
        version = request.args.get('version')
        engine = request.args.get('engine')

        url = comptrans_base_url + 'groups?system=' + system + '&version=' + version + '&enginesetups=' + engine
        groups = requests.get(url)
        if groups is None:
            raise exc.NoResultFound(f"groups not found.")

        data = groups.json()
        resp = Response(json.dumps(data),
                        status=200,
                        mimetype='application/json')
        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)   

# Uses HTTP to fetch all the groups related to several certain engines from Comptrans.
# API endpoint syntax: /multiple-engine-groups?system=<system>&version=<version> + engines in
# the request body, in form of a serialized array of strings.
@groupbp.route('/multiple-engine-groups', methods=['GET', 'POST'])
@token_required
def get_multiple_engine_groups(user_info):
    try:
        system = request.args.get('system')
        version = request.args.get('version')
        jsondata = request.get_json()
        enginestring = ''
        for engine in jsondata:
            enginestring += ('&enginesetups=' + engine)

        url = comptrans_base_url + 'groups?system=' + system + '&version=' + version + enginestring
        # TODO: The fetch times for engines should be streamlined in Comptrans API to decrease the fetch times.
        groups = requests.get(url)
        if groups is None:
            raise exc.NoResultFound(f"groups not found.")

        data = groups.json()
        resp = Response(json.dumps(data),
                        status=200,
                        mimetype='application/json')
        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)   

# Adds the groups from Comptrans to the database.
def add_groups():
    db.create_all()
    groups = get_comptrans_groups()
    for group in groups:
        group = Group(name=group, approver='', reviewer='')
        db.session.add(group)