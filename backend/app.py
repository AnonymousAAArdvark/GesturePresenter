from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from threading import Thread
import time
import random

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pairing_codes.db'
db = SQLAlchemy(app)


def cleanup_expired_codes():
    while True:
        with app.app_context():
            expired_time = datetime.utcnow() - timedelta(minutes=180)
            expired_codes = PairingCode.query.filter(PairingCode.timestamp < expired_time).all()
            for code in expired_codes:
                db.session.delete(code)
            db.session.commit()
        time.sleep(3600)


cleanup_thread = Thread(target=cleanup_expired_codes)
cleanup_thread.start()


class PairingCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(80), unique=True, nullable=False)
    session_id = db.Column(db.String(120), unique=True, nullable=True)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())


with app.app_context():
    db.create_all()


@app.route('/generate_code', methods=['GET'])
def generate_code():
    while True:
        code = str(random.randint(1000, 9999))
        existing_code = PairingCode.query.filter_by(code=code).first()
        if not existing_code:
            break

    new_code = PairingCode(code=code)
    db.session.add(new_code)
    db.session.commit()

    return jsonify({"code": code})


@socketio.on('pair')
def handle_pairing(json):
    code = json.get('code')
    pairing_code = PairingCode.query.filter_by(code=code).first()

    if pairing_code:
        pairing_code.session_id = request.sid
        db.session.commit()
        emit('paired', {'status': 'success'}, room=request.sid)
    else:
        emit('error', {'status': 'invalid_code'}, room=request.sid)


@app.route('/validate_code', methods=['POST'])
def validate_code():
    data = request.json
    code = data.get('code')

    pairing_code = PairingCode.query.filter_by(code=code).first()
    if pairing_code and datetime.utcnow() - pairing_code.timestamp < timedelta(minutes=180):
        return jsonify({'status': 'valid'})
    else:
        return jsonify({'status': 'invalid'}), 400


@app.route('/send_gesture', methods=['POST'])
def handle_gesture():
    data = request.json
    code = data.get('code')
    gesture_value = data.get('gesture')

    pairing_code = PairingCode.query.filter_by(code=code).first()

    if pairing_code and pairing_code.session_id:
        socketio.emit('gesture_event', {'gesture': gesture_value}, room=pairing_code.session_id)
        return jsonify({'status': 'success'})
    else:
        return jsonify({'status': 'code_not_paired'}), 400


if __name__ == '__main__':
    socketio.run(app, debug=True)
