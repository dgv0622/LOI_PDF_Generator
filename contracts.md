# Letter of Intent PDF Generator - Implementation Contracts

## API Contracts

### POST /api/generate-pdf
**Purpose**: Generate PDF from LOI form data

**Request Body**:
```json
{
  "date": "2025-01-15",
  "sellerName": "John Smith",
  "sellerCompany": "ABC Properties LLC",
  "sellerAddress": "123 Main St, City, State ZIP",
  "buyerName": "Jane Smith",
  "buyerAddress": "456 Oak Ave, City, State ZIP",
  "propertyName": "Sunset Apartments",
  "propertyAddress": "789 Property Ln, City, State ZIP",
  "propertyDescription": "24 units",
  "propertyType": "Multifamily",
  "purchasePrice": "1500000",
  "acquisitionType": "all cash",
  "depositAmount": "50000",
  "escrowAgent": "First American Title",
  "depositDays": "5",
  "dueDiligenceDays": "30",
  "closingDays": "45",
  "financingContingent": "is not",
  "financingType": "",
  "contingencies": "",
  "buyerBroker": "",
  "buyerBrokerFirm": "",
  "buyerBrokerLicense": "",
  "sellerBroker": "",
  "sellerBrokerFirm": "",
  "sellerBrokerLicense": "",
  "expirationDate": "2025-02-01",
  "buyerAuthorizedSigner": "Jane Smith",
  "buyerTitle": "CEO",
  "sellerAuthorizedSigner": "John Smith",
  "sellerTitle": "Owner"
}
```

**Response**: PDF file (application/pdf)

## Backend Implementation

### 1. PDF Generation Library
- Use **ReportLab** for Python-based PDF generation
- Library provides precise control over PDF layout and styling
- Professional legal document formatting

### 2. PDF Generation Service
- File: `/app/backend/pdf_generator.py`
- Function: `generate_loi_pdf(form_data: dict) -> bytes`
- Returns: PDF as bytes for streaming to frontend

### 3. API Endpoint
- File: `/app/backend/server.py`
- Route: POST `/api/generate-pdf`
- Returns: StreamingResponse with PDF content

## Frontend Integration

### Changes Required
1. **LOIForm.jsx** - `handleDownloadPDF` function:
   - Send form data to `/api/generate-pdf`
   - Receive PDF blob response
   - Trigger browser download with filename: `Letter_of_Intent_{date}.pdf`

### Mock Data Removal
- Remove: Placeholder toast message in `handleDownloadPDF`
- Replace with: Actual API call to backend

## Implementation Flow
1. User fills form
2. User clicks "Download PDF"
3. Frontend validates required fields
4. Frontend sends POST request with form data
5. Backend generates formatted PDF
6. Backend streams PDF back to frontend
7. Frontend triggers browser download
8. User receives professional PDF document
