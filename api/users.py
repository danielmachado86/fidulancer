# pylint: disable=no-member

"""User endpoints definition

"""

from typing import Dict

from flask import Blueprint, current_app, g, jsonify, request, url_for
from werkzeug.security import check_password_hash, generate_password_hash

from api.auth import requires_auth
from api.errors import AuthError, BadRequestError
from database.models import ChangeUserPasswordModel  # validate_model,
from database.models import UpdateUserModel, UserResponse
from database.users import add_object_to_user, get_user, insert_user, update_user

users = Blueprint("users", __name__)


def user_response(user: Dict):
    """_summary_

    Args:
        user (Dict): _description_

    Returns:
        _type_: _description_
    """
    if "password" in user:
        del user["password"]
    if "hashed_password" in user:
        del user["hashed_password"]
    return user


@users.route("/users/me", methods=["GET"])
@requires_auth
def get_user_response(username):
    """Get user

    Returns:
        json: response
        int: http status code
    """

    user = get_user(username)

    response = jsonify(user_response(user))
    response.status_code = 200
    return response


@users.route("/users/me", methods=["PUT"])
@requires_auth
def update_user_info(username):
    """Get user

    Returns:
        json: response
        int: http status code
    """

    if g.authenticated_user["username"] != username:
        raise AuthError(
            {
                "code": "unauthorized",
                "description": "the authenticated user is not authorized"
                " to view this resource",
            }
        )

    _ = get_user(username)

    body = request.get_json()

    # If not valid pydantic.ValidationError is raised
    UpdateUserModel(**body)

    rsp = update_user(username, body)

    response = jsonify(rsp.upserted_id)
    response.headers["Location"] = url_for(
        "users.update_user_response", username=body["username"]
    )
    response.status_code = 200
    return response


@users.route("/users/<username>/password", methods=["POST"])
@requires_auth
def update_user_password(username):
    """Update user password

    Returns:
        json: response
        int: http status code
    """

    if g.authenticated_user["username"] != username:
        raise AuthError(
            {
                "code": "unauthorized",
                "description": "the authenticated user is not authorized"
                " to view this resource",
            }
        )

    user = get_user(username)

    body = request.get_json()

    # If not valid pydantic.ValidationError is raised
    ChangeUserPasswordModel(**body)

    match = check_password_hash(user.get("hashed_password"), body["old"])
    if not match:
        raise AuthError(
            {"code": "unauthorized", "description": "old password doesn't match"}
        )

    password = {"hashed_password": generate_password_hash(body["new"])}

    rsp = update_user(username, password)

    response = jsonify(rsp.upserted_id)
    response.status_code = 200
    return response


@users.route("/users", methods=["POST"])
def new_user():
    """Creates new user

    Returns:
        json: response
        int: http status code
    """
    current_app.logger.info("Creating new item")

    body = request.get_json()
    if not isinstance(body, dict):
        raise BadRequestError(
            {"code": "empty-request", "message": "request body must be a valid json"}
        )

    user = insert_user(body)

    model_response = UserResponse(**user)
    user_resp = model_response.get_data()

    response = jsonify(user_resp)
    response.status_code = 201
    response.headers["Location"] = url_for(
        "users.get_user_response", username=user["username"]
    )
    return response


def add_payment_method(username, payment_method_data):
    """_summary_

    Args:
        username (_type_): _description_
        card_id (_type_): _description_

    Returns:
        _type_: _description_
    """
    rsp = add_object_to_user(
        username=username, data={"payment_methods": payment_method_data}
    )

    return rsp


def add_transaction(username, payment_method_data):
    """_summary_

    Args:
        username (_type_): _description_
        card_id (_type_): _description_

    Returns:
        _type_: _description_
    """
    rsp = add_object_to_user(
        username=username, data={"transactions": payment_method_data}
    )

    return rsp


def add_contract(username, id_contract):
    """_summary_

    Args:
        username (_type_): _description_
        card_id (_type_): _description_

    Returns:
        _type_: _description_
    """
    rsp = add_object_to_user(username=username, data={"contracts": id_contract})

    return rsp
