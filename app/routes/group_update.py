import json
from flask import request, Response, Blueprint
from sqlalchemy import exc
from app.database.models import Group
from app.database.schemas import group_schema
from werkzeug.exceptions import BadRequest
from app import db, ADMIN_GROUP
from app.routes.helpers import token_required

# Create a blueprint for easier access across the application
groupbp = Blueprint("GroupUpdate", __name__)

# Uses HTTP POST method to delete a group from database
@groupbp.route('/group-delete', methods=['POST'])
@token_required
def delete_group(user_info):
    # Get the group name from the http request to get the group object from database
    group_name = request.args.get('groupName')

    if group_name is None:
        raise BadRequest(f"Bad request. Syntax: /group-delete?groupName=<groupName>")

    try:
        # Fetch the group object from database
        group = db.session.query(Group).filter(Group.name == group_name).first()

        if group is None:
            raise exc.NoResultFound(f"The group not found")
        
        if user_info['token_info']['department'] != ADMIN_GROUP:
            raise BadRequest(f"Unauthorized to make this request")

        db.session.delete(group)
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

# Takes in new group values as a Json object and
# updates the group with the new values
@groupbp.route('/group-update', methods=['POST'])
@token_required
def update_group(user_info):
    try:
        jsondata = request.get_json()
        # Fetch the data from json Object
        id = jsondata['id']
        name = jsondata['name']
        reviewer = jsondata['reviewer']
        approver = jsondata['approver']

        # Fetch the group from database
        group = db.session.query(Group).filter(
            Group.id == id).first()

        # Update group field with data from json object
        group.name = name
        group.reviewer = reviewer
        group.approver = approver

        # Updates the database table
        db.session.commit()

        group_details = group_schema.dump(group)
        serialized_group_details = json.dumps(group_details) 
        response = Response(serialized_group_details,
                            status = 200,
                            mimetype='application/json')                      
        return response
    
    except BadRequest as e:
        return Response(str(e), status=400)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)
        