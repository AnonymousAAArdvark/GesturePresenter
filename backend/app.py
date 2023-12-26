from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

active_codes = {}  # Stores code and corresponding session_id


@app.route('/generate_code', methods=['GET'])
def generate_code():
    code = str(random.randint(1000, 9999))
    active_codes[code] = None
    return jsonify({"code": code})


@socketio.on('pair')
def handle_pairing(json):
    code = json.get('code')
    if code in active_codes:
        active_codes[code] = request.sid
        emit('paired', {'status': 'success'}, room=request.sid)
    else:
        emit('error', {'status': 'invalid_code'}, room=request.sid)


@app.route('/validate_code', methods=['POST'])
def validate_code():
    data = request.json
    code = data.get('code')

    if code in active_codes and active_codes[code] is not None:
        return jsonify({'status': 'valid'})
    else:
        return jsonify({'status': 'invalid'}), 400


@app.route('/send_gesture', methods=['POST'])
def handle_gesture():
    data = request.json
    code = data.get('code')
    gesture_value = data.get('gesture')

    session_id = active_codes.get(code)
    if session_id:
        socketio.emit('gesture_event', {'gesture': gesture_value}, room=session_id)
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'code_not_paired'}), 400


if __name__ == '__main__':
    socketio.run(app, debug=True)
