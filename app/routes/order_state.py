from flask import request, Response, Blueprint
from app import db, ADMIN_GROUP
from sqlalchemy import exc
from werkzeug.exceptions import BadRequest
import json
from app.database.models import Order
from app.database.schemas import order_schema, multi_order_schema
from app.routes.helpers import token_required

# Create a blueprint for easier access across the application
bp = Blueprint("state", __name__)

@bp.route('/orders/<order_type>')
@token_required
def fetch_orders(user_info, order_type):

    state = None
    if order_type == 'pending':
        state = 0
    elif order_type == 'approved':
        state = 1
    elif order_type == 'started':
        state = 2
    else:
        raise BadRequest(
            f"Bad request. Syntax: /orders/[pending, approved or started]")

    try:
        # Uses additional argument in the http request "Syntax: e.g. /orders/<order_type>?orderId=1"
        order_id = request.args.get('orderId')

        if order_id is None:
            orders = db.session.query(Order).filter(Order.state == state).all()
            order_dict = {}

            for order in orders:
                order_dict[order.id] = [order.project, len(order.engines)]

            resp = Response(json.dumps(order_dict),
                            status=200,
                            mimetype='application/json')

        else:
            order = db.session.query(Order).filter(
                Order.id == order_id).first()

            if order is None:
                raise exc.NoResultFound(f"Order not found")

            resp = Response(json.dumps(order_schema.dump(order)),
                            status=200,
                            mimetype='application/json')

        return resp

    except BadRequest as e:
        return Response(str(e), status=400)

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

# Takes in a order id as argument and update its state to approved
@bp.route('/order/approve', methods=['POST'])
@token_required
def approve_order(user_info):

    # Only allow members of Admin group to make this request.
    if user_info['token_info']['department'] != ADMIN_GROUP:
        raise BadRequest(f"Unauthorized to make this request")

    # Uses additional argument in the http request "Syntax: e.g. /orders/approve?orderId=1"
    order_id = request.args.get('orderId')

    if order_id is None:
        raise BadRequest(
            f"Bad request. Syntax: /orders/approve?orderId=<order id>")

    try:
        order = db.session.query(Order).filter(Order.id == order_id).first()

        if order is None:
            raise exc.NoResultFound(f"Order not found")

        # Set order state to approved
        order.state = 1

        db.session.commit()

        resp = Response(json.dumps(order_schema.dump(order)),
                        status=200,
                        mimetype='application/json')

        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except BadRequest as e:
        return Response(str(e), status=400)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

# Takes in a order id as argument and update its state to unapproved
@bp.route('/order/unapprove', methods=['POST'])
@token_required
def unapprove_order(user_info):

    # Only allow members of Admin group to make this request.
    if user_info['token_info']['department'] != ADMIN_GROUP:
        raise BadRequest(f"Unauthorized to make this request")

    # Uses additional argument in the http request "Syntax: e.g. /orders/unapprove?orderId=1"
    order_id = request.args.get('orderId')

    if order_id is None:
        raise BadRequest(
            f"Bad request. Syntax: /orders/unapprove?orderId=<order id>")

    try:
        order = db.session.query(Order).filter(Order.id == order_id).first()

        if order is None:
            raise exc.NoResultFound(f"Order not found")

        # Set order state to unapproved
        order.state = 0

        db.session.commit()

        resp = Response(json.dumps(order_schema.dump(order)),
                        status=200,
                        mimetype='application/json')

        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except BadRequest as e:
        return Response(str(e), status=400)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)

# Takes in a order id as argument and update its state to start
@bp.route('/order/start', methods=['POST'])
@token_required
def start_order(user_info):

    # Only allow members of Admin group to make this request.
    if user_info['token_info']['department'] != ADMIN_GROUP:
        raise BadRequest(f"Unauthorized to make this request")

    # Uses additional argument in the http request "Syntax: e.g. /orders/approve?orderId=1"
    order_id = request.args.get('orderId')

    if order_id is None:
        raise BadRequest(
            f"Bad request. Syntax: /orders/start?orderId=<order id>")

    try:
        order = db.session.query(Order).filter(Order.id == order_id).first()

        if order is None:
            raise exc.NoResultFound(f"Order not found")

        # TODO: Replace digits with the actual state name e.g. pending, approved... 
        order.state = 2

        db.session.commit()

        resp = Response(json.dumps(order_schema.dump(order)),
                        status=200,
                        mimetype='application/json')

        return resp

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except BadRequest as e:
        return Response(str(e), status=400)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)
  
@bp.route('/orders')
@token_required
def fetch_all_orders(user_info):
    try:
        orders = db.session.query(Order).all()

        resp = Response(json.dumps(multi_order_schema.dump(orders)),
                        status=200,
                        mimetype='application/json')
        return resp

    except BadRequest as e:
        return Response(str(e), status=400)

    except exc.NoResultFound as e:
        return Response(str(e), status=404)

    except Exception as e:
        return Response(f'Server error: {e}', status=500)