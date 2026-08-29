# Parivahan Next 2.0 — API & Architecture Specification

**Ministry of Road Transport & Highways (MoRTH) Digital Integration Standard**

---

## 1. Base URLs & Versioning
- Production Base URL: `https://api.parivahan.gov.in/v2`
- Staging / Sandbox Base URL: `https://staging-api.parivahan.gov.in/v2`
- Authentication Header: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- Tenant ID Header: `X-MORTH-RTO-CODE: <RTO_CODE>`

---

## 2. Authentication & Identity Endpoints

### 2.1 Send Aadhaar / Mobile OTP
`POST /auth/otp/send`

#### Request Payload:
```json
{
  "identifier": "987654328924",
  "identifierType": "AADHAAR", // "AADHAAR" | "MOBILE"
  "servicePurpose": "UNIFIED_CITIZEN_LOGIN"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "transactionRef": "OTP-TXN-2026-881920",
  "maskedMobile": "+91 98765-XXX10",
  "expiresInSeconds": 300,
  "message": "OTP dispatched to UIDAI registered mobile number."
}
```

### 2.2 Verify OTP & Issue Token
`POST /auth/otp/verify`

#### Request Payload:
```json
{
  "transactionRef": "OTP-TXN-2026-881920",
  "otp": "492810",
  "role": "CITIZEN" // "CITIZEN" | "RTO_OFFICER" | "ADMIN"
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "ref_992109848123...",
  "user": {
    "id": "usr-aadhaar-9021",
    "name": "Rajesh Kumar Sharma",
    "aadhaarMasked": "XXXX-XXXX-8924",
    "mobile": "+91 98765 43210",
    "role": "citizen",
    "digiLockerLinked": true,
    "rtoJurisdiction": "DL-01"
  }
}
```

---

## 3. Citizen Garage & Vehicle Endpoints

### 3.1 Get All Registered Vehicles
`GET /citizen/vehicles`

#### Response (200 OK):
```json
{
  "total": 3,
  "vehicles": [
    {
      "registrationNo": "DL01AB1234",
      "chassisNo": "MAT621345N2A98761",
      "engineNo": "REV12P8765432",
      "makerModel": "Tata Nexon EV Max",
      "fuelType": "ELECTRIC",
      "vehicleClass": "Motor Car / LMV",
      "registrationDate": "2022-04-15",
      "rcExpiryDate": "2037-04-14",
      "rcStatus": "VALID",
      "insurance": {
        "provider": "HDFC ERGO",
        "policyNo": "POL-EV-2022-998822",
        "validTill": "2026-10-15",
        "status": "VALID"
      },
      "puc": {
        "certificateNo": "PUC-DL-EV-EXEMPT",
        "validTill": "2030-12-31",
        "status": "VALID"
      },
      "hypothecation": {
        "isFinanced": true,
        "bankName": "State Bank of India",
        "status": "ACTIVE"
      }
    }
  ]
}
```

---

## 4. Vehicle Services & Applications Endpoints

### 4.1 Initiate Transfer of Ownership (Form 29/30)
`POST /services/vehicle/transfer-ownership`

#### Request Payload:
```json
{
  "vehicleRegistrationNo": "MH02CD5678",
  "buyerName": "Amitabh Roy",
  "buyerMobile": "9812345678",
  "buyerAadhaar": "778899001234",
  "buyerAddress": "Plot 12, Baner Road, Pune, MH 411045",
  "agreedSaleAmount": 650000,
  "buyerConsentOtp": "892101"
}
```

#### Response (201 Created):
```json
{
  "applicationNo": "MH02-TO-2026-00412",
  "currentStage": "SCRUTINY",
  "estimatedCompletionDate": "2026-09-08",
  "statutoryFee": {
    "total": 530,
    "receiptNo": "MORTH-REC-2026-9901"
  }
}
```

---

## 5. Driving Licence Services Endpoints

### 5.1 Submit Learner's Licence Online Test Results
`POST /services/dl/learner-test-submission`

#### Request Payload:
```json
{
  "applicantAadhaar": "XXXX-XXXX-8924",
  "selectedClasses": ["MCWG", "LMV"],
  "testScore": 14,
  "totalQuestions": 15,
  "testResult": "PASSED",
  "timeTakenSeconds": 340
}
```

#### Response (200 OK):
```json
{
  "success": true,
  "llNumber": "DL01-LL-2026-009812",
  "validFrom": "2026-08-29",
  "validTill": "2027-02-28",
  "provisionalPdfUrl": "https://vault.parivahan.gov.in/docs/LL-DL01-99812.pdf"
}
```

---

## 6. BharatKosh Payment & Webhook Specification

### 6.1 Initiate BharatKosh Gateway Session
`POST /payments/bharatkosh/checkout`

#### Request Payload:
```json
{
  "applicationNo": "MH02-TO-2026-00412",
  "serviceCode": "VEH_TRANSFER_OWNERSHIP",
  "amount": 530.00,
  "currency": "INR",
  "payerName": "Rajesh Kumar Sharma",
  "returnUrl": "https://parivahan.gov.in/payment-callback"
}
```

### 6.2 BharatKosh Webhook Notification
`POST /webhooks/bharatkosh/ipn`

#### Webhook Payload:
```json
{
  "event": "PAYMENT_SETTLED",
  "transactionId": "TXN-BK-2026-8829102",
  "receiptNo": "REC-MH02-2026-9901",
  "applicationNo": "MH02-TO-2026-00412",
  "amount": 530.00,
  "paymentMode": "UPI_INTENT",
  "timestamp": "2026-08-29T10:30:00Z",
  "signature": "sha256_hmac_hash_representation..."
}
```

---

## 7. RTO Officer Scrutiny Desk API

### 7.1 Officer Decision on Application
`POST /officer/applications/:id/decision`

#### Request Payload:
```json
{
  "officerId": "OFF-MH02-991",
  "decision": "APPROVE", // "APPROVE" | "REJECT" | "REQUEST_CLARIFICATION"
  "remarks": "All Form 29/30 and insurance documents verified.",
  "digitalSignatureCertificateId": "DSC-NIC-2026-882"
}
```

---

## 8. Standard Error Codes

| Code | HTTP Status | Meaning | Suggested User Action |
| :--- | :--- | :--- | :--- |
| `ERR_AADHAAR_INVALID` | 400 | Invalid 12-digit Aadhaar format | Check UIDAI number digits |
| `ERR_PENDING_CHALLAN` | 409 | Unpaid traffic fines on vehicle | Clear traffic fines on eChallan hub first |
| `ERR_LL_NOT_30_DAYS` | 422 | Learner licence is less than 30 days old | Permanent DL requires 30-day waiting period |
| `ERR_SLOT_UNAVAILABLE` | 409 | Selected RTO appointment slot full | Choose alternative date or counter time |
| `ERR_BANK_TIMEOUT` | 504 | Payment gateway upstream failure | Click Retry Payment or select UPI QR |
