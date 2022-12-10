from flask import Flask
from flask.helpers import send_file, send_from_directory
from flask.signals import template_rendered

app = Flask(__name__)

@app.route("/")
def home():
    return send_file('index.html')

@app.route("/<filename>",methods=['GET'])
def getfile(filename):
    #print(filename)
    return send_file(filename)

@app.route("/<dirname>/<filename>",methods=['GET'])
def getfileNdir(dirname,filename):
    #print(dirname ,filename)
    return send_file('./'+dirname+'/'+filename)


if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0",port=80)