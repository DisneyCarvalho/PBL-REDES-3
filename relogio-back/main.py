from threading import Thread
from flask import Flask, Response, app, jsonify, request
from flask_cors import CORS
import requests
import time

from relogio import relogio

urls = [
    'http://192.168.1.6:5010',
    'http://192.168.1.6:5020',
    'http://192.168.1.6:5030'
]
relogios =[0,0,0

]

app = Flask(__name__)
COR = CORS(app)


id = input('id: ')
relo = relogio(43200, id)




import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)



def obter_contador(rel,url):
    while True:
        try:
            resposta_contador = requests.get(f'{url}/contador')
            resposta_contador.raise_for_status()
            contador = resposta_contador.json().get('contador', 0)
            
            relogios[rel] = contador
            print(relogios)
            time.sleep(2)

        except Exception as e:
             relogios[rel] = 0
    

@app.route('/contador', methods=['GET'])
def contador():
    return jsonify({'contador': relo.hora})



@app.route('/horario', methods=['GET'])
def horario():
    return jsonify({'hora':str(relo.hora), 'silver':relo.silverblack, 'relogios': relogios})

@app.route('/sethora', methods= ['POST'])
def sethora():
    nvhora = request.get_json()

    relo.sethora(int(nvhora['horad']))
    return jsonify({'status': 'received'})



@app.route('/setdrift', methods= ['POST'])
def setdrift():
    nvhora = request.get_json()
    print(nvhora['drift'])
    relo.setdrift(float(nvhora['drift']))

    return jsonify({'status': 'received'})


def sincroniza():
    if relo.silverblack:
        for url in range(len(urls)):
            if url == int(relo.id)-1:
                continue
            try:
                requests.post(f'{urls[url]}/sinc')
            except:
                pass
    return 'ok'

@app.route('/sinc', methods= ['POST'])
def sinc():
    indice = aux = 0 
    for i in range(len(relogios)):
        if relogios[i] > aux:
            aux = relogios[i]
            indice = i
    lider = (aux,indice)
    if relo.hora < aux:
        relo.hora = aux
    return jsonify({'status': 'received'})


def eleicao(lider):
    for url in urls:
        try:
            requests.post(f'{url}/elege', json={'lider': lider})
        except:
            pass
    return 'ok'

@app.route('/elege', methods= ['POST'])
def elege():
    data = request.json
    lider = data['lider']
    if str(lider[1]+1) == str(relo.id):
        relo.silverblack = True
    else:
        relo.silverblack = False

    return jsonify({'status': 'received'})






def eleger_líder():
    indice = aux = 0 
    for i in range(len(relogios)):
        if relogios[i] > aux:
            print(i)
            aux = relogios[i]
            indice = i
    lider = (aux,indice)
    return(lider)

def monitorar_e_eleger():
    for j in range(len(urls)):
        Thread(target=obter_contador,args=(j,urls[j],), daemon=True).start()
    while True:
        lider = eleger_líder()
        eleicao(lider)
        print(lider)
        print(f'O líder eleito é: {lider}')
        if str(lider[1]+1) == str(relo.id):
            relo.silverblack = True
        else:
            relo.silverblack = False
        time.sleep(10)
        sincroniza()

if __name__ == '__main__':
    Thread(target=monitorar_e_eleger, daemon=True).start()
    hoste = '192.168.1.6'
    app.run(host=hoste,port= input('porta: '), debug=True)
