from flask import Flask, Response, jsonify
from datetime import datetime
from flask_cors import CORS
import requests
from relogio import relogio

app = Flask(__name__)
COR = CORS(app)


@app.route('/sethora', methods= ['POST'])
def sethora(request):
    nvhora = request.form['sethora']
    rel.sethora(nvhora)
    

def hora():
    return

@app.route('/horario', methods=['GET'])
def horario():
    
    return Response(str(rel.hora), mimetype='text/plain')
        




if __name__ == '__main__':
    rel = relogio(43200)
    app.run(debug=True)