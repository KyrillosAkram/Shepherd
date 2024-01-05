#!C:\Program Files\Python311\python.exe
#!/usr/bin/env python
"""@file main.py {flaskServer} 
@brief the entry point to the server which send assets file, manage sessions and volantiers
@version V0.2.0

all function and methods are synchronus 
TODO more details to be defined later
"""
### pylint justifications
#pylint: disable=R0902:too-many-instance-attributes
## reason: design requirment
#pylint: disable=W0702:bare-except
## reason: design requirment

from time import time
# pylint: disable=W0611:unused-import
# reason=will beused later
from typing import Literal,Union,List,Dict,TypedDict,Any,Tuple
# pylint: enable=W0611:unused-import

from dataclasses import dataclass ,field
from flask import Flask,request,Response,jsonify
from flask.helpers import send_file#, send_from_directory
from cfg import *
import re
import json
from io import BytesIO

VolantierTaskId	=str
VolantierId		=str
Taskidtaskid	=str
"""Taskidtaskid is the task id"""
VolantierTask=TypedDict(
    'VolantierTask',
    {
        "type":Literal["facial_landmark@128","facial_landmarks@128"],
        "table":str,
        "payload":str,
        "state":Literal["Queue","Progress","Finished","Failed"],
        "volantier":VolantierId,
        "created":float,
        "started":float,
        "result":Any
    }
)

VolantierTasks:Dict[VolantierTaskId,VolantierTask]={}


class Volantier():
    """object for managing and communicating with Volantier

    Returns:
        obj_Volantier: encapsulate state and methods of single volatier"""
    CONNECTIVITY_MAX_SIZE:int=20
    def __init__(self,name:str,number_of_workers:int,available_tables:List[str]):
        self.status:Literal["busy","idle"]="idle"
        self.__name:str=name
        self.__workers:int=number_of_workers
        self.__tables:List[str]=available_tables
        self.emergency_q:List[VolantierTask]=[]
        self.normal_q:List[str]=[]
        self.in_progress_q:List[str]=[] #TODO refactor the type to be dict
        self.quit_request:bool=False
        self.connectivity_q:List[tuple[float]]=[]#List(maxsize=self.CONNECTIVITY_MAX_SIZE)
        self.last_connection:float=time()
    def __iter__(self):
        for key in self.__dict__:
            yield (key,self.__dict__[key])
        # return {
            # "name":self.__name,
            # "workers":self.__workers,
            # "tables":self.__tables,
            # "emergency_q":self.emergency_q,
            # "normal_q":self.normal_q,
            # "in_progress_q":self.in_progress_q,
            # "quit_request":self.quit_request,
            # "connectivity_q":self.connectivity_q,
            # "last_connection":self.last_connection
        # }
    def to_json(self):
            return json.dumps(self, default=lambda o: o.__dict__, 
                sort_keys=True, indent=4)
    def get_name(self)->str:
        return self.__name
 
    def get_number_of_workers(self)->int:
        return self.__workers
    
    def get_available_tables(self)->List[str]:
        return self.__tables
    
    def put_task(self,aTaskId:VolantierTaskId):
        try:
            if len(self.in_progress_q)>0 :
                self.in_progress_q.append(aTaskId)
            else:
                self.normal_q.append(aTaskId)
            return True
        except:
            return False

    def finish_task(self,id:str,aTaskId:VolantierTaskId,result:Any,quit_request:bool):
        """volantier method to finalize the task state and check the next task

        Args:
            aTaskId (VolantierTaskId): the task hash/dict key
            result (Any): a serialized json by default
            quit (bool): flage to stop allocation new task
            return (Literal(new_task_allocated,idial_task)) : integer of response code
        """
        if aTaskId in self.in_progress_q:
            VolantierTasks[aTaskId]["result"]=result
            VolantierTasks[aTaskId]["state" ]="Finished"
            self.in_progress_q.pop(0)
            self.quit_request=quit
            data=jsonify({})
            if not self.quit_request:
                if len(self.emergency_q)>0 :
                    self.in_progress_q.append(self.emergency_q.pop(0))
                elif len(self.normal_q)>0 :
                    self.in_progress_q.append(self.normal_q.pop(0))
                data = jsonify( 
                    {
                        "type":self.in_progress_q[0]["type"],
                        "files":1,
                        "task_id":id
                    }
                )
            else:
                volantiers_dict.pop(id)
            return data
                # else:
                    # currently do nothing# TODO : take task from other volantiers
            # else:
                # TODO handover volantier tasks
        return None


volantiers_id:List[VolantierId]=[]
"""this structure used to balance the load by rotate the turns of volantier """
volantiers_dict:Dict[VolantierId,Volantier]={}


def is_volantier_online(id:volantiers_id)->bool:
    """
    Args:
        id (volantiers_id): volantier key in the volantiers_dict
    """
    if (time() - volantiers_dict[id].last_connection ) < VOLANTIER_TIMEOUT :
        return True
    return False


#TODO design function for assgin task that detect most idle the assign him the task 
def volantiers_id_rotate()->None:
    """rotate the queue"""
    volantiers_id.append(volantiers_id.pop(volantiers_id[0]))



@dataclass(slots=True)
class Contributer:
    """Contains the date the contributer knows about the session
    Limitation:
        single session 
    """
    session_version:int = field(init=False,default=0,compare=True)
    independent:Literal[0,1]

@dataclass(slots=True)
class Session():
    """object for synchronizing the state of session among all contributers during life time

    @startuml
    [*] --> Session : creation_request
    Session : a centeralized maintainace object for synchronizing
    Session : the state of session among all contributers during life time
    state Session{
        [*] --> Live : valid_session_inputs
        Live : state of the session where session
        Live : is readable and modifiable
        Frozen: where session state is readonly
        Live --> Live : live_time_not_out
        Live --> Frozen : live_time_out
        Frozen --> [*] : kill_request
        
    }
        Session --> Session : life_time_not_out
        Session --> [*] : life_time_out
    @enduml
    """
    name:str
    admin_name:str
    admin:Contributer
    contributers:Dict[str,Contributer]=field(init=False)
    access_type:Literal["public","protected","private"]
    """
    public:session searchable by name or id
    protected:session searchable by id
    """
    live:bool=field(init=False,default=True)
    live_timeout:float=field(init=False)
    life_timeout:float=field(init=False)
    def __post_init__(self):
        """define the non-initializable attributes"""
        self.contributers[self.admin_name]=[self.admin]


sessions:Dict[str,Session]=dict()

app = Flask(__name__)
# api=Api(app)

@app.route("/Session/regist?session_name=<string:session_name>&\
           session_admin_name=<string:session_admin_name>&\
           access=<string:access>&\
           volantiering=<int:volantiering>",
           defaults={"access":"public"},
           methods=["POST"])
def regist_session(
    session_name:str,
    session_admin_name:str,
    access:Literal["public","protected","private"],
    volantiering:int) -> int:
    #TODO : add more option for access and contributers\
    """session creation request handler
    which check the requested configuration if it suitable 
    create session and reterns ok
    else return the rejection reasion
 
 
    Returns:
        int: request result code
    """
    if not re.match(SESSION_NAME_PATTERN,session_name):
        return  INVALED_SESSION_NAME
    if  volantiering==1 or ( len(volantiers_dict.keys())/(len(sessions.keys())+1) ) >=MAVPS :
        sessions[session_name]=Session(
                name=session_name,
                admin_name=session_admin_name,
                admin=Contributer(independent=volantiering),
                access_type=access
            )
        if volantiering==1:
            volantiers_dict[session_admin_name]=Volantier(session_admin_name,1,[])
    
    return LACK_OF_VOLANTIERS

@app.route("/volantiers/join/",methods=['GET'])
def regist_volantier()->Any:
    #TODO document this
    try:
        # result=request.get_json()
        # if result==POST_NOK_BAD_FORMATE :
        # 	raise ValueError( "POST_NOK_BAD_FORMATE")

        aVolantierId:VolantierId=str(time())
        volantiers_dict[aVolantierId]=Volantier(aVolantierId,1,list())
        volantiers_id.append(aVolantierId)
        return aVolantierId
    except ValueError:
        return POST_NOK_BAD_FORMATE

@app.route("/volantier/<string:volantier_id>/task_file/<int:file_index>",methods=['GET'])
def get_task_file(volantier_id:VolantierId,file_index:int):
    #TODO document this
    try:
        # return send_file(VolantierTasks[volantiers_dict[volantier_id].in_progress_q[file_index]])
        return send_file(
            BytesIO(  VolantierTasks[volantiers_dict[volantier_id].in_progress_q[0]]["payload"] ),
            mimetype="image/jpeg",
            as_attachment=False
            #,            download_name=

        )
    except Exception as err:
        print(err)
        return "internal error check server console"


@app.route("/volantier/<string:volantier_id>/task",methods=['GET'])
def get_task(volantier_id:VolantierId):
    #TODO document this
    try:
        # print("Executing branch with try")
        if len(volantiers_dict[volantier_id].emergency_q):
            # print("Executing branch with emergency_q")
            volantiers_dict[volantier_id].in_progress_q.append(volantiers_dict[volantier_id].emergency_q.pop(0))
            VolantierTasks[volantiers_dict[volantier_id].in_progress_q[0]]["state"] = "Progress"
            # print(VolantierTasks[volantiers_dict[volantier_id].in_progress_q[0]], GET_OK)
            data = jsonify( 
                {
                    "type":VolantierTasks[volantiers_dict[volantier_id].in_progress_q[0]]["type"],
                    "files":1,
                    "task_id":volantiers_dict[volantier_id].in_progress_q[0]
                }
                )
            return data
        elif len(volantiers_dict[volantier_id].normal_q):
            # print("Executing branch with normal_q")
            volantiers_dict[volantier_id].in_progress_q.append(volantiers_dict[volantier_id].normal_q.pop(0))
            # print("push into inprogress queue")
            VolantierTasks[volantiers_dict[volantier_id].in_progress_q[0]]["state"] = "Progress"
            # print("update task state to be Progress")
            # print(VolantierTasks[volantiers_dict[volantier_id].in_progress_q[0]], GET_OK)
            data = jsonify( 
                {
                    "type":VolantierTasks[volantiers_dict[volantier_id].in_progress_q[0]]["type"],
                    "files":1,
                    "task_id":volantiers_dict[volantier_id].in_progress_q[0]
                }
                )
            return data
        else:  # TODO : steal task from others
            # print("Executing branch with no tasks")
            # print(GET_OK)
            return jsonify({}),GET_OK
    except Exception as err :
        print("Executing exception branch")
        # print(None,GET_OK_NO_CONTENT)
        print(err)
        return "GET_OK_NO_CONTENT"

@app.route("/Volanteer/Task/result/Id_<string:id>/Task_Id_<string:task_id>/Quit_<int:quit>",methods=["POST"])
def volantier_post_task_result(
    id:str,
    task_id:str,
    quit:int):
    result=request.data
    _=volantiers_dict[id].finish_task(id=id,aTaskId=task_id,result=result,quit_request=bool(quit))
    return _

@app.route("/Task/state?Id=<string:id>",methods=["GET"])
def task_get_state(id:str)->Tuple[str,int]:#TODO document this
    #FIXME : improver this to handle time out cases
    is_volantier_connected:bool=is_volantier_online(id)
    if VolantierTasks[id]["state"]=="Queue":
        return "Queue"
    if VolantierTasks[id]["state"]=="Progress":
        return "Progress"
    if VolantierTasks[id]["state"]=="Finished":
        return "Finished"
    return "GET_OK_NO_CONTENT"


@app.route("/Task/result?Id=<string:id>",methods=["GET"])
def task_get_result(id:str)->Tuple[Any,int]:#TODO document this
    if VolantierTasks[id]["state"] == "Finished":
        return VolantierTasks[id]["result"],GET_OK
    return None,GET_OK_NO_CONTENT

@app.route("/Task/submit"#?type=<string:type>&table=<string:table>&payload=<string:payload>"
            ,methods=["POST"])
def task_submit(#type:str,table:str,payload:str
                ):
    """task submit handler creates task , assigne volantier for it and requeue volatiers
#TODO document this
    Args:
        type (str): _description_
        table (str): _description_
        payload (str): _description_

    Returns:
        _type_: response code of ( POST_OK or SERVICE_NOT_AVAILABLE )
    """
    print("task submit")
    type:str=request.args.get("type")
    payload=request.data
    table=""
    size_of_volantier:int=len(volantiers_id)
    print(size_of_volantier)
    if size_of_volantier:
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
        print(f"{taskid} assigned to {volantiers_id[0]}")
        if size_of_volantier>1:
            volantiers_id_rotate()
        return f"{taskid}"
    return "SERVICE_NOT_AVAILABLE"


if DEBUG:
    
    @app.route("/watch")
    def watch():
        """return json of all global variables work only if DEBUG is True
        @depricated since v0.2.0
        @return json
        """
        from pprint import pprint
        data=jsonify({
            "VolantierTasks":{ key:{**value,"payload":f'{len(value["payload"])} file'} for key,value in VolantierTasks.items()} ,
            "volantiers_dict":{key:dict(value) for key,value in volantiers_dict.items()}
        })
        print(data)
        # pprint(request.__dict__)
        # 	response = app.response_class(
        #     response=json.dumps(data),
        #     status=200,
        #     mimetype='application/json'
        # )
        # 	print(response)
        return data
    
# from os import chdir,getcwd
if USED_FORNTEND == "Vanila":
    # print(f"USED FORNTEND == Vanila opertate from {getcwd()}")
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
        except:
            print(f"this file \'{filename}\' not found")
            return None
elif USED_FORNTEND == "React":
    # chdir(r"shepherd_app_client_side\build")
    # pwd = getcwd()
    # print(f"USED FORNTEND == React opertate from {getcwd()}")
    @app.route("/")
    def home():
        """A handler of files GET request
        It returns the file 'Session.html' to the browser
        @depricated since v0.2.0
        @return the file Session.html
        """
        return send_file(React_Index_path)
    @app.route("/logo<string:size>.png",methods=['GET'])
    def getlego(size):
        """A handler of files GET request 
        @param filename {str} - the file path relative to server
        @return file
        """
        try:
            return send_file(React_Build_path + sep + f'icon-{size}x{size}'+'.png')
        except:
            print(f"this file logo icon for {size} not found")
            return None

    @app.route("/<path:filename>",methods=['GET'])
    def getfile(filename):
        """A handler of files GET request 
        @param filename {str} - the file path relative to server
        @return file
        """
        try:
            # print(filename)
            # print(React_Build_path + sep + filename)
            return send_file(React_Build_path +sep+ filename)
        except:
            print(f"this file \'{filename}\' not found")
            return None

    @app.route("/static/<string:dirname>/<string:filename>",methods=['GET'])
    def getfileNdir(dirname,filename):
        """A handler of files GET request 
        @param filename {str} - the file path relative to server
        @return file
        """
        try:
            # print( React_Build_path+sep+'static'+sep+dirname+sep+filename)
            return send_file( React_Build_path+sep+'static'+sep+dirname+sep+filename)
        except:
            print(f"this file \'{( React_Build_path+sep+'static'+sep+dirname+sep+filename)}\' not found")
            return None	

#TODO remove this when react is ready
# @app.route("/<path:filename>",methods=['GET'])
# def getfile(filename):
#     """A handler of files GET request 
#     @param filename {str} - the file path relative to server
#     @return file
#     """
#     try:
#         return send_file(filename)
#     except:
#         print(f"this file \'{filename}\' not found")
#         return None

#FIXME make use of flask argument path type https://hackersandslackers.com/flask-routes/
# @app.route("/<dirname>/<filename>",methods=['GET'])
# def getfileNdir(dirname,filename):
# 	try:
# 		print('./'+dirname+'/'+filename)
# 		return send_file('./'+dirname+'/'+filename)
# 	except:
# 		print(f"this file \'{filename}\' not found")


if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0",port=80)
    