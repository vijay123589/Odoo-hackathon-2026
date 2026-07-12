import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

# Set up logging format
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("EcoSphereAPI")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Log basic request details
        logger.info(f"-> Request: {request.method} {request.url.path} from client {request.client.host if request.client else 'unknown'}")
        
        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            # Attach process time header to the response
            response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
            
            logger.info(
                f"<- Response: {request.method} {request.url.path} | Status: {response.status_code} | Duration: {process_time:.2f}ms"
            )
            return response
        except Exception as exc:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"xx Request Failed: {request.method} {request.url.path} | Error: {str(exc)} | Duration: {process_time:.2f}ms"
            )
            raise exc
