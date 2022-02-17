from flask import Response, Blueprint
from sqlalchemy import exc
import json
from app.routes.helpers import token_required
import requests

# Create a blueprint for easier access across the application
systembp = Blueprint("SystemGet", __name__)

# Query Comptrans for all systems
@systembp.route('/systems', methods=['GET'])
@token_required
def get_systems(user_info):
    try:
        systems = requests.get('http://sesog0165/ReportService/api/repo').json()
        serialized_systems = json.dumps(systems)
        resp = Response(serialized_systems,
                        status=200,
                        mimetype='application/json')
        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)