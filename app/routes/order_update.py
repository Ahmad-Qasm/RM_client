from flask import request, Response, Blueprint
from app import db, ADMIN_GROUP
from sqlalchemy import exc
from werkzeug.exceptions import BadRequest
import json
from app.database.models import Order
from app.database.schemas import order_schema
from app.routes.helpers import token_required

# Create a blueprint for easier access across the application
bp = Blueprint("update", __name__)

# Takes in new order values as a Json object and
# updates the order with the new values
@bp.route('/order/update', methods=['POST'])
@token_required
def update_order(user_info):
    try:
        jsondata = request.get_json()

        # Fetching information from JSON object
        id = jsondata['id']
        project = jsondata['project']
        sopSocop = jsondata['sopSocop']
        typeOfRelease = jsondata['typeOfRelease']
        status = jsondata['status']
        bswVersion = jsondata['bswVersion']
        relMeetingWeek = jsondata['relMeetingWeek']
        filesOnServerWeek = jsondata['filesOnServerWeek']
        projectMeco = jsondata['projectMeco']
        projectAccountNumber = jsondata['projectAccountNumber']
        delOrderADate = jsondata['delOrderADate']
        delOrderAComment = jsondata['delOrderAComment']
        delOrderBDate = jsondata['delOrderBDate']
        delOrderBComment = jsondata['delOrderBComment']
        delOrderCDate = jsondata['delOrderCDate']
        delOrderCComment = jsondata['delOrderCComment']
        delOrderDDate = jsondata['delOrderDDate']
        delOrderDComment = jsondata['delOrderDComment']
        delOrderEDate = jsondata['delOrderEDate']
        delOrderEComment = jsondata['delOrderEComment']
        delOrderFDate = jsondata['delOrderFDate']
        delOrderFComment = jsondata['delOrderFComment']
        enginesString = jsondata['engines']
        customer = jsondata['customer']

        enginesObj = json.loads(enginesString)
        engines = []
        for engine in enginesObj:
            engines.append({'name':engine['name'], 'power': engine['power'], 'emissionStandard': engine['emissionStandard']})

        # Invalid order id in Json body
        if id is None:
            raise BadRequest(f"Bad request. Invalid order id")

        # Fetches order from db based on id
        order = db.session.query(Order).filter(Order.id == id).first()

        # Only allow members of admin group OR the order creator to make this request
        if order.creator != user_info['token_info']['username'] and user_info['token_info']['department'] != ADMIN_GROUP:
            raise BadRequest(f"Unauthorized to make this request")

        # Update order fields with data from Json object
        order.project = project
        order.sopSocop = sopSocop
        order.typeOfRelease = typeOfRelease
        order.status = status
        order.bswVersion = bswVersion
        order.relMeetingWeek = relMeetingWeek
        order.filesOnServerWeek = filesOnServerWeek
        order.projectMeco = projectMeco
        order.projectAccountNumber = projectAccountNumber
        order.delOrderADate = delOrderADate
        order.delOrderAComment = delOrderAComment
        order.delOrderBDate = delOrderBDate
        order.delOrderBComment = delOrderBComment
        order.delOrderCDate = delOrderCDate
        order.delOrderCComment = delOrderCComment
        order.delOrderDDate = delOrderDDate
        order.delOrderDComment = delOrderDComment
        order.delOrderEDate = delOrderEDate
        order.delOrderEComment = delOrderEComment
        order.delOrderFDate = delOrderFDate
        order.delOrderFComment = delOrderFComment
        order.customer = customer
        order.engines = engines

        # Updates the database table
        db.session.commit()

        resp = Response(json.dumps(order_schema.dump(order)),
                        status=200,
                        mimetype='application/json')

        return resp

    except BadRequest as e:
        return Response(str(e), status=400)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

# Updates the order's storylink.
@bp.route('/order/update-storylink', methods=['POST'])
@token_required
def update_order_storylink(user_info):
    try:
        jsondata = request.get_json()
        # Fetching information from JSON object
        id = jsondata['id']
        storyLink = jsondata['storyLink']

        # Invalid order id in Json body
        if id is None:
            raise BadRequest(f"Bad request. Invalid order id")

        # Fetches order from db based on id
        order = db.session.query(Order).filter(Order.id == id).first()

        # Only allow members of admin group OR the order creator to make this request
        if order.creator != user_info['token_info']['username'] and user_info['token_info']['department'] != ADMIN_GROUP:
            raise BadRequest(f"Unauthorized to make this request")

        # Update order fields with data from Json object
        order.storyLink = storyLink

        # Updates the database table
        db.session.commit()

        resp = Response(json.dumps(order_schema.dump(order)),
                        status=200,
                        mimetype='application/json')
        return resp

    except BadRequest as e:
        return Response(str(e), status=400)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

# Takes in a order id as argument and deletes the order and its relationships
@bp.route('/order/delete', methods=['POST'])
@token_required
def delete_order(user_info):
    # Uses additional argument in the http request "Syntax: e.g. /orders/delete?orderId=1"
    order_id = request.args.get('orderId')

    if order_id is None:
        raise BadRequest(
            f"Bad request. Syntax: /orders/delete?orderId=<order id>")

    try:
        order = db.session.query(Order).filter(Order.id == order_id).first()

        if order is None:
            raise exc.NoResultFound(f"Order not found")

        # Only allow members of admin group OR the order creator to make this request
        if order.creator != user_info['token_info']['username'] and user_info['token_info']['department'] != ADMIN_GROUP:
            raise BadRequest(f"Unauthorized to make this request")

        db.session.delete(order)

        db.session.commit()

        resp = Response(json.dumps(True),
                        status=200,
                        mimetype='application/json')

        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except BadRequest as e:
        return Response(str(e), status=400)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)
