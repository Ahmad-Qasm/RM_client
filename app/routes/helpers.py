from flask import request
from app import app
from functools import wraps
import json, jwt

# Function decorator which decorates a function, meaning that this function will run whenever its annotation is used on top of another function call. 
# This decorated function checks the x-access-token retrieved from a client and decode it using secret key. If the token is valid, 
# the function which has called the decorated function will have access to the user information extracted from the token.
def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token_bytes = None

        # Checks the x-access-token in the request header sent from the client
        if 'x-access-token' in request.headers:
            token_string = request.headers['x-access-token']
            token_bytes = token_string.encode('ascii')

        if not token_bytes:
            return json.dumps({'message' : 'Token is missing!'}), 401

        try:
            user_info = jwt.decode(token_bytes, app.config['SECRET_KEY'])
        except:
            return json.dumps({'message' : 'Token is invalid!'}), 401

        # Return user_info and the posibility to have positional arguments and keyword arguments
        return func(user_info, *args, **kwargs)
    
    return decorated