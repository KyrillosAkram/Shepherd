"""constant and configuration module"""
from typing import Final
from typing import Literal
from os import sep
USED_FORNTEND:Literal["Vanila","React"]="React"
React_Index_path:str=r"""shepherd_app_client_side"""+sep+"""build"""+sep+"""index.html"""
React_Build_path:str=r"""shepherd_app_client_side"""+sep+"""build"""
Vanila_Index_path:str="""Session.html"""
DEBUG:bool=True
POST_OK:Final[int]=201
"""refer that post requist completed from server side successfully"""

SERVICE_NOT_AVAILABLE:Final[int]=1503
"""refer that post requist rejected from server side due to shortage not for invaled request"""

POST_NOK_BAD_FORMATE:Final[int]=1400
"""refer that post requist rejected from server side for invaled request"""

GET_OK:Final[int]=200
"""refer that get requist completed from server side successfully"""

GET_OK_NO_CONTENT:Final[int]=404
"""refer that get requist completed from server side successfully but no content"""

VOLANTIER_TIMEOUT:Final[float]=120.0
"""maximum allowed time for disconnection with volantier (in second) """

VOLANTIER_POST_RESULT_OK:Final[int]=1200
"""maximum allowed time for disconnection with volantier (in second) """

VOLANTIER_POST_RESULT_NOK:Final[int]=1503
"""maximum allowed time for disconnection with volantier (in second) """

VOLANTIER_TASK_ALOCATED:Final[int]=1020
"""maximum allowed time for disconnection with volantier (in second) """

VOLANTIER_NO_NEW_TASK:Final[int]=1010
"""maximum allowed time for disconnection with volantier (in second) """

MAVPS:float=0.5
"""minmum allowed volantier per session ratio"""

SESSION_NAME_PATTERN:str="^[0-9A-z]{4,}$"

INVALED_SESSION_NAME:Final[int]=1504

LACK_OF_VOLANTIERS:Final[int]=1505
