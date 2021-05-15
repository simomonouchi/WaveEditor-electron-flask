from geventwebsocket.handler import WebSocketHandler
from flask import Flask, render_template, make_response, request, jsonify
from gevent import pywsgi
import wave
import numpy as np

app = Flask(__name__)

@app.route("/", methods=["GET"])
def hello():
    return render_template("./index.html")

@app.route('/update_graph', methods=["POST"])
def update_graph():
  path = request.json['path']

  with wave.open(path, "rb") as wr:
    data = wr.readframes(wr.getnframes())

  data = np.frombuffer(data, np.int16)
  data = data / 2**(16-1) # normalize
  
  return jsonify({"figure": data.tolist()})

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r


if __name__ == "__main__":
    app.debug = True
    server = pywsgi.WSGIServer(('localhost', 8000), app, handler_class=WebSocketHandler)
    server.serve_forever()
