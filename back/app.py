import flask
import data
import matplotlib.path as path
from collections import deque 

app=flask.Flask(__name__)

cache=deque()
max_cache_size=30

@app.route('/get_data/<numX>/<numY>')
def get_data(numX,numY):
    for emit_data in cache:
        box=path.Path(emit_data[0])
        if box.contains_point((float(numX),float(numY))):
            response = flask.jsonify(emit_data[1])
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
    
    emit_data=data.getEmitData((numX,numY))

    for key,value in emit_data.items():
        points=[]
        for point in value[0]['points']:
            points.append((point['Longitude'],point['Latitude']))
        cache.append((points,emit_data))
        if len(cache)>=max_cache_size:
            cache.pop()
        break

    response = flask.jsonify(emit_data)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__=='__main__':
    app.run(debug=True, host='0.0.0.0', port=80)