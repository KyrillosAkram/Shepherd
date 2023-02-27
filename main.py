"""@file main.py {flaskServer} 
@brief this file is the entry point to the server which send assets file and manage communication and synchronization
@version V0.2.0

all function and methods are synchronus 
TODO more details to be defined later
"""
from cfg  import *
# from threading import t
from queue import List
from flask import Flask,Request
from flask.helpers import send_file, send_from_directory
from flask.signals import template_rendered
# from flask_restful import Api,Resource
from time import time
from typing import Literal,Union,List,Dict,TypedDict,Any,Tuple
# from cachetools import LRUCache

VolantierTaskId=str
VolantierId=str
Taskidtaskid=str
"""Taskidtaskid is the task id"""
VolantierTask=TypedDict(
	'VolantierTask',
	{
		"type":Literal["facial_landmark@128","facial_landmarks@128"],
		"table":str,
		"payload":str,
		"state":Literal["Queue","Progress","Finished"],
		"volantier":VolantierId,
		"created":float,
		"started":float,
		"result":Any
	}
) # the type of task

VolantierTasks:Dict[VolantierTaskId,VolantierTask]={}

class Volantier():
	"""object for managing and communicating with Volantier

	Returns:
		obj_Volantier: encapsulate state and methods of single volatier
	"""
	CONNECTIVITY_MAX_SIZE:int=20
	def __init__(self,name:str,number_of_workers:int,available_tables:List[str]):
		self.status:Literal["busy","idle"]="idle"
		self.__name:str=name
		self.__workers:int=number_of_workers
		self.__tables:List[str]=available_tables
		self.emergencyQ:List[VolantierTask]=[]
		self.normalQ:List[str]=[]
		self.inProgressQ:List[str]=[]
		self.quit_request:bool=False
		self.connectivityQ:List[tuple[float]]=List(maxsize=self.CONNECTIVITY_MAX_SIZE)
		self.last_connection:float=time()
		pass

	def get_name(self)->str:
		return self.__name

	def get_number_of_workers(self)->int:
		return self.__workers
	
	def get_available_tables(self)->List[str]:
		return self.__tables
	
	def put_task(self,aTaskId:VolantierTaskId):
		try:
			if(len(self.inProgressQ)>0):
				self.inProgressQ.append(aTaskId)
				return True
			else:
				self.normalQ.append(aTaskId)
				return True
		except:
			return False
		pass
	
	

	pass


volantiers_id:List[VolantierId]=[]
"""this structure used to balance the load by rotate the turns of volantier """
volantiers_dict:Dict[VolantierId,Volantier]={}


#TODO design function for assgin task that detect most idle the assign him the task 
def volantiers_id_rotate()->None:
	"""rotate the queue"""
	volantiers_id.append(volantiers_id.pop(volantiers_id[0]))



class Contributer():
	__name:str
	def __init__(self,name:str):
		__name=name
		pass
	def get_name(self)->str:
		return self.__name
	pass


class Session():
	__name:str
	__session_admin_name:str
	__contributers:List[Contributer]
	__active:bool=True
	def __init__(self,creator:Contributer,name):
		"""
		It creates a new class called Project.
		@param {Contributer} creator - The person who created the project.
		@param name - The name of the project
		"""
		self.__name=name
		self.__session_admin_name=creator.get_name()
		self.__contributers=[creator]
		pass
	pass


sessions:List[Session]=[]

app = Flask(__name__)
# api=Api(app)

@app.route("/Session/regist?session_name=<string:session_name>&session_admin_name=<string:session_admin_name>&access=<string:access>",defaults={"access":"public"},methods=["POST"])
def regist_session(session_name:str,session_admin_name:str,access:Literal["public"]) -> int:#TODO : add more option for access and contributers\
	sessions.append(
			Session(
				Contributer(session_admin_name),
				session_name
			)
		)
	return POST_OK
	pass

@app.route("/volantiers/join/",methods=['POST'])
def regist_volantier()->Any:
	#TODO document this
	try:
		result=Request.get_json()
		if(result==POST_NOK_BAD_FORMATE):raise POST_NOK_BAD_FORMATE;pass

		aVolantierId:VolantierId=str(time)
		volantiers_dict[aVolantierId]
		volantiers_id.append(aVolantierId)
		return aVolantierId,POST_OK
		pass
	except:
		return POST_NOK_BAD_FORMATE
		
	pass

@app.route("/volantier/<string:volantier_id>/task",method=['GET'])
def get_task(volantier_id:VolantierId):#TODO document this
	try:
		if(len(volantiers_dict[volantier_id].emergencyQ)):
			volantiers_dict[volantier_id].inPrgressQ.append(volantiers_dict[volantier_id].emergencyQ.pop(0))
			VolantierTasks[volantiers_dict[volantier_id].inPrgressQ[0]]["state"]="Progress"
			return VolantierTasks[volantiers_dict[volantier_id].inPrgressQ[0]],GET_OK
		elif(len(volantiers_dict[volantier_id].normalQ)):
			volantiers_dict[volantier_id].inPrgressQ.append(volantiers_dict[volantier_id].normalQ.pop(0))
			VolantierTasks[volantiers_dict[volantier_id].inPrgressQ[0]]["state"]="Progress"
			return VolantierTasks[volantiers_dict[volantier_id].inPrgressQ[0]],GET_OK
		else:#TODO : steal task from others
			return None,GET_OK
		pass
	except:
		return None,GET_OK_NO_CONTENT


def is_volantier_online(id:volantiers_id)->bool:#TODO document this
	return True if time()- volantiers_dict[id].last_connection < VOLANTIER_TIMEOUT else False

@app.route("/Task/state?Id=<string:id>",method=["GET"])
def task_get_state(id:str)->Tuple[str,int]:#TODO document this
	#FIXME : improver this to handle time out cases
	is_volantier_connected:bool=is_volantier_online()
	match VolantierTasks[id]["state"]:
		case "Queue":
			return "Queue",GET_OK
		case "Progress":
			return "Progress",GET_OK
		case "Finished":
			return "Finished",GET_OK
	pass


@app.route("/Task/result?Id=<string:id>",method=["GET"])
def task_get_result(id:str)->Tuple[Any,int]:#TODO document this
	if VolantierTasks[id]["state"] == "Finished":
		return VolantierTasks[id]["result"],GET_OK
	else:
		return None,GET_OK_NO_CONTENT
	

@app.route("/Task/submit?type=<string:type>&table=<string:table>&payload=<string:payload>")
def task_submit(type:str,table:str,payload:str):
	"""task submit handler creates task , assigne volantier for it and requeue volatiers
#TODO document this
	Args:
		type (str): _description_
		table (str): _description_
		payload (str): _description_

	Returns:
		_type_: response code of ( POST_OK or SERVICE_NOT_AVAILABLE )
	"""
	size_of_volantier:int=len(volantiers_id)
	if(size_of_volantier):
		taskid:str=str(time())
		VolantierTasks[taskid]=VolantierTask({
			"type":type,
			"table":table,
			"payload":payload,
			"state":"Queue",
			"volantier":volantiers_id[0],
			"created":time(),
			"started":0.0,
			"result":None
		})
		volantiers_dict[volantiers_id[0]].put_task(taskid)
		if(size_of_volantier>1):volantiers_id_rotate();
		return POST_OK
		pass
	else:
		return SERVICE_NOT_AVAILABLE
	pass

@app.route("/")
def home():
	"""A handler of files GET request
	It returns the file 'Session.html' to the browser
	@depricated since v0.2.0
	@return the file Session.html
	"""
	return send_file('Session.html')

@app.route("/<path:filename>",methods=['GET'])
def getfile(filename):
	"""A handler of files GET request 
	@param filename {str} - the file path relative to server
	@return file
	"""
	try:
		return send_file(filename)
		pass
	except:
		print(f"this file \'{filename}\' not found")

"""
#FIXME make use of flask argument path type https://hackersandslackers.com/flask-routes/
@app.route("/<dirname>/<filename>",methods=['GET'])
def getfileNdir(dirname,filename):
	try:
		return send_file('./'+dirname+'/'+filename)
		pass
	except:
		print(f"this file \'{filename}\' not found")
"""

if __name__ == '__main__':
	app.run(debug=True,host="0.0.0.0",port=80)