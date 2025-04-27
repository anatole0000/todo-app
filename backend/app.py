from datetime import datetime
from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId
from flask import session
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app, origins="http://localhost:5173", supports_credentials=True)

app.secret_key = 'supersecretkey'  # Secret key for sessions (use a better one in production)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client.todo_db
todos = db.todos
users = db.users  # New users collection

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if users.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)
    users.insert_one({"username": username, "password": hashed_password})
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = users.find_one({"username": username})
    if user and check_password_hash(user['password'], password):
        session['user_id'] = str(user['_id'])
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"})


# Helper function to convert ObjectId to string
def convert_objectid(obj):
    """Recursively converts ObjectId to string in a dictionary or list"""
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {key: convert_objectid(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    return obj

@app.route('/todos', methods=['GET'])
def get_todos():
    # Convert all ObjectId fields to strings
    todos_list = [convert_objectid(todo) for todo in todos.find()]
    return jsonify(todos_list)

@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    todo = {
        "task": data["task"],
        "completed": data.get("completed", False),  # Default to False if not provided
        "dueDate": data.get("dueDate"),  # Optional due date
    }
    todos.insert_one(todo)
    return jsonify(convert_objectid(todo)), 201

@app.route('/todos/<id>', methods=['PUT'])
def update_todo(id):
    data = request.get_json()
    
    update_data = {}
    if "completed" in data:
        update_data["completed"] = data["completed"]
    if "dueDate" in data:
        update_data["dueDate"] = data["dueDate"]

    todos.update_one({"_id": ObjectId(id)}, {"$set": update_data})
    return jsonify({"status": "updated"})

@app.route('/todos/<id>', methods=['DELETE'])
def delete_todo(id):
    todos.delete_one({"_id": ObjectId(id)})
    return jsonify({"status": "deleted"})

@app.route('/todos/stats', methods=['GET'])
def get_todo_stats():
    today = datetime.today()
    
    # Query for stats
    total_todos = todos.count_documents({})
    completed_todos = todos.count_documents({"completed": True})
    pending_todos = todos.count_documents({"completed": False})
    overdue_todos = todos.count_documents({"completed": False, "dueDate": {"$lt": today}})
    
    # Prepare the response
    stats = {
        "total": total_todos,
        "completed": completed_todos,
        "pending": pending_todos,
        "overdue": overdue_todos
    }
    
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True)
