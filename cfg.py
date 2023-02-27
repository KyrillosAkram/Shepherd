from typing import Final

POST_OK:Final[int]=201
"""refer that post requist completed from server side successfully"""

SERVICE_NOT_AVAILABLE:Final[int]=503 #refer that post requist rejected from server side due to shortage not for invaled request
"""refer that post requist rejected from server side due to shortage not for invaled request"""

POST_NOK_BAD_FORMATE:Final[int]=400
"""refer that post requist rejected from server side for invaled request"""

GET_OK:Final[int]=200
"""refer that get requist completed from server side successfully"""

GET_OK_NO_CONTENT:Final[int]=200
"""refer that get requist completed from server side successfully but no content"""

VOLANTIER_TIMEOUT:Final[float]=120.0
"""maximum allowed time for disconnection with volantier (in second) """