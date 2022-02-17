import json
from flask import request, Response, Blueprint
from sqlalchemy import exc
from werkzeug.exceptions import BadRequest
from app.database.models import Taskdate, Order
from app.database.schemas import taskdate_schema
from app import db
from app.routes.helpers import token_required
import datetime
# Create a blueprint for easier access across the application
taskdatebp = Blueprint("TaskDateCreate", __name__)
# Use HTTP POST to create taskdates
# Store the created taskdates in database
@taskdatebp.route('/new-taskdate', methods=['POST'])
@token_required
def add_taskdate(user_info):
    try:
        taskdate_details = request.get_json()
        # Load taskdate details into local variables
        task = taskdate_details['task']
        date = taskdate_details['date']
        order_id = taskdate_details['orderId']
        time_estimate= taskdate_details['timeEstimate']

        # Converting the date of the task to the right format for the db.
        converted_date = datetime.datetime.strptime(date,  
            "%a, %d %b %Y %H:%M:%S %Z")

        # Invalid order id in Json body
        if order_id is None:
            raise BadRequest(f"Bad request. Invalid order id")
        # Create new task
        new_taskdate = Taskdate(
            task= task,
            timeEstimate= time_estimate,
            date= converted_date
        )
        order_list = []
        order = db.session.query(Order).filter(Order.id == order_id).first()
            
        if order is None:
            raise exc.NoResultFound(f"Order not found.")
        else:
            order_list.append(order)
        new_taskdate.orders.extend(order_list)
        # store the created taskdate in database 
        db.session.add(new_taskdate)
        db.session.commit()
        # Return response
        response = Response(taskdate_schema.dumps(new_taskdate),
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