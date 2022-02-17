from flask import request, Response, Blueprint
from app import db, ldap_server_globalAD, app
from sqlalchemy import exc
from ldap3 import Connection, NTLM
import json, jwt
from jira.client import JIRA

from app.database.models import Order
from app.database.schemas import multi_order_id_schema 

# Create a blueprint for easier access across the application
bp = Blueprint("session", __name__)

# Loggs in User and creates a user session
@bp.route('/login', methods=['GET'])
def login_user():
    try:
        # Fetch the username and password which has been sent
        # with basic autentication from the client.
        auth = request.authorization

        username = auth['username']
        password = auth['password']

        # Connect to ldap server with user credentials
        connection = Connection(ldap_server_globalAD,
                                user=("Domain\\" + username),
                                password=password,
                                authentication=NTLM)
        bind_result = connection.bind()

        # if credentials are valid
        if bind_result is True:
            # Search for user attributes
            connection.search(
                search_base='DC=global,DC=scd,DC=scania,DC=com',
                search_filter='(CN=' + username + ')',
                search_scope='SUBTREE',
                attributes=['department', 'mail', 'sn', 'givenName']
            )

            # Extract user attributes
            surname = connection.response[0]['attributes']['sn']
            given_name = connection.response[0]['attributes']['givenName']
            mail = connection.response[0]['attributes']['mail']
            department = connection.response[0]['attributes']['department']

            orders = db.session.query(Order).filter(Order.creator == username).all()

            order_id_list = multi_order_id_schema.dumps(orders)

            # Store user attributes for session and serialization
            user_info = {'department': department, 'mail': mail,
                         'surname': surname, 'name': given_name,
                         'username': username, 'orders': order_id_list}

            if department == 'NESE':
                # Login to Jira API.
                options = {'server': 'https://jira.scania.com', 'verify': True}
                # Construct a Jira client instance.
                jira = JIRA(options=options, basic_auth=(username, password))
                # Save the session cookie.
                jira_session = jira._session.cookies.get_dict()
                user_info['jira_session'] = jira_session

            # Create a JWT (JSON Web Token) to send to client for access. This token
            # will be used by an authenticated client to access protected routes.
            # The token will be encrypted with help of secret key.
            token = jwt.encode({'token_info' : user_info}, app.config['SECRET_KEY'])

            # Convert token from bytes to string
            token_string = token.decode('ascii')

            user_info['access_token'] = token_string
        
            serialized_user_info = json.dumps(user_info)

            response = Response(serialized_user_info,
                                status=200,
                                mimetype='application/json')

            return response

        else:
            raise exc.NoResultFound(f"Failed to login")

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

@bp.route('/logout', methods=['GET'])
def logout_user():
    try:
        # May not be needed anymore

        resp = Response(json.dumps(True),
                        status=200,
                        mimetype='application/json')
        return resp

    except Exception as e:
        return Response(f'Session error: {e}', status=500)