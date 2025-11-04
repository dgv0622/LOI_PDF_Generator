from fastapi import FastAPI, APIRouter
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from io import BytesIO
from pdf_generator import generate_loi_pdf


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class LOIFormData(BaseModel):
    date: str
    sellerName: str
    sellerCompany: Optional[str] = ""
    sellerAddress: str = ""
    buyerName: str
    buyerAddress: str = ""
    propertyName: Optional[str] = ""
    propertyAddress: str
    propertyDescription: str = ""
    propertyType: str = ""
    purchasePrice: str
    acquisitionType: str = ""
    depositAmount: str = ""
    escrowAgent: str = ""
    depositDays: str = ""
    dueDiligenceDays: str = ""
    closingDays: str = ""
    financingContingent: str = ""
    financingType: str = ""
    contingencies: str = ""
    buyerBroker: str = ""
    buyerBrokerFirm: str = ""
    buyerBrokerLicense: str = ""
    sellerBroker: str = ""
    sellerBrokerFirm: str = ""
    sellerBrokerLicense: str = ""
    expirationDate: str = ""
    buyerAuthorizedSigner: str = ""
    buyerTitle: str = ""
    sellerAuthorizedSigner: str = ""
    sellerTitle: str = ""

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

@api_router.post("/generate-pdf")
async def generate_pdf(form_data: LOIFormData):
    """
    Generate PDF from Letter of Intent form data
    """
    try:
        # Convert pydantic model to dict
        data_dict = form_data.model_dump()
        
        # Generate PDF
        pdf_bytes = generate_loi_pdf(data_dict)
        
        # Create a filename based on date
        date_str = form_data.date.replace('-', '_') if form_data.date else 'document'
        filename = f"Letter_of_Intent_{date_str}.pdf"
        
        # Return PDF as streaming response
        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        return {"error": f"Failed to generate PDF: {str(e)}"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()