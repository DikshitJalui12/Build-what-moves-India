# Parivahan Next 2.0 — Production Deployment & Operations Runbook

**Ministry of Road Transport & Highways (MoRTH) & National Informatics Centre (NIC)**

---

## 1. System Architecture at India Scale

```
               [ 1.4+ Billion Citizen / Mobile Access ]
                                   │
                                   ▼
         [ Cloudflare / NIC BharatCDN (Edge Caching & DDoS Shield) ]
                                   │
                                   ▼
              [ Geo-Distributed Anycast Load Balancers ]
              (Delhi NDC, Hyderabad NDC, Pune NDC, Bhubaneswar NDC)
                                   │
        ┌──────────────────────────┴──────────────────────────┐
        ▼                                                     ▼
 [ Kubernetes Cluster (EKS/GKE) ]               [ Redis Cluster (Valkey) ]
 (Auto-scaling 50 - 2,000 Pods)                 (Session & Draft Caching)
        │                                                     │
        ├──────────────────────────┬──────────────────────────┤
        ▼                          ▼                          ▼
 [ Citizen API Gateway ]    [ RTO Scrutiny Engine ]   [ Payment Webhooks ]
        │                          │                          │
        └──────────────────────────┴──────────────────────────┘
                                   │
                                   ▼
                [ Sharded PostgreSQL (Citus / CockroachDB) ]
                + [ Immutable Audit Ledger & DigiLocker Vault ]
```

---

## 2. Infrastructure Prerequisites

- **Compute**: Kubernetes Cluster (v1.30+) with Horizontal Pod Autoscaler (HPA) configured for CPU (>70%) and Request Rate (>5,000 req/sec).
- **Database**: Sharded PostgreSQL 16 with multi-region read replicas across National Data Centres (NDCs).
- **Cache**: Redis 7.2 Cluster with persistence (AOF + RDB snapshots every 15 minutes).
- **Blob Storage**: S3-compatible MeitY GI Cloud (MeghRaj) for encrypted document storage.
- **TLS / SSL**: TLS 1.3 only, HSTS preloaded, ECDSA 384-bit certificates.

---

## 3. Deployment Steps

### 3.1 Build & Containerization
```bash
# 1. Install dependencies
npm ci

# 2. Run TypeScript compilation and production bundle build
npm run build

# 3. Build Docker container image
docker build -t registry.gov.in/morth/parivahan-next:2.0.0 .

# 4. Sign container image with Cosign (Gov PKI)
cosign sign --key k8s://pki/morth-signer registry.gov.in/morth/parivahan-next:2.0.0
```

### 3.2 Helm Deployment
```bash
# Deploy to Production Cluster
helm upgrade --install parivahan-next ./helm/parivahan-next \
  --namespace morth-prod \
  --set image.tag=2.0.0 \
  --set replicaCount=60 \
  --set autoscaling.minReplicas=60 \
  --set autoscaling.maxReplicas=1200 \
  --values ./helm/values-prod.yaml
```

---

## 4. Performance Targets & SLA

- **Page Load Time**: `< 1.2s` over 3G cellular network; `< 400ms` over 4G/5G/Broadband.
- **System Availability**: `99.99%` uptime (Max permissible unplanned downtime: 4.38 minutes/month).
- **RTO Disposal SLA**: Submissions acknowledged within 30 seconds; scrutiny decisions within 48 hours.

---

## 5. Security, Compliance & Governance

1. **CERT-In Compliance**: All web endpoints undergo daily automated DAST vulnerability scans and quarterly manual VAPT audits.
2. **Digital Personal Data Protection (DPDP) Act 2023**:
   - Aadhaar numbers stored only as masked strings (`XXXX-XXXX-8924`) with UIDAI token vault mapping.
   - Zero plaintext storage of citizen biometrics or financial identifiers.
3. **Data Encryption**:
   - Transit: TLS 1.3 with Perfect Forward Secrecy (PFS).
   - Rest: AES-256-GCM encryption for all database tables and uploaded PDF documents.

---

## 6. Health Checks & Disaster Recovery

- **Liveness Probe**: `GET /healthz` (Returns HTTP 200 within 50ms).
- **Readiness Probe**: `GET /readyz` (Verifies DB connections, Redis cluster health, and UIDAI API ping).
- **Disaster Recovery (Active-Active)**: Primary NDC Delhi mirrors real-time transactions to Secondary NDC Pune with Recovery Point Objective (RPO) `< 1 second` and Recovery Time Objective (RTO) `< 30 seconds`.
