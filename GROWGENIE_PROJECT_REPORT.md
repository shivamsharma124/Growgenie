# GrowGenie Project Report
## AI-Powered Business Builder for SMEs

---

## Executive Summary

**GrowGenie** is a comprehensive web-based platform designed to empower Small and Medium Enterprises (SMEs) with AI-driven tools for business growth, product management, invoicing, and customer engagement. The platform leverages OpenAI's GPT-4 capabilities through Groq API, offering a complete suite of automation and intelligence features.

### Key Highlights
- **6 AI Modules** for complete business automation
- **JWT-based Security** for enterprise-grade authentication
- **GST-Compliant Invoicing** with PDF generation
- **Multi-language Support** (Hindi, Tamil, Bengali, Marathi)
- **Cloud-Ready Architecture** with scalable microservices design

---

## 1. Project Overview

### 1.1 Vision & Objectives
GrowGenie aims to democratize AI access for SMEs by providing:
- **Automated Business Planning** via AI-powered roadmap generation
- **Marketing Optimization** with AI-generated ad copy and descriptions
- **Invoice Management** with compliance and automation
- **Product Catalog** with full CRUD operations
- **Intelligent FAQ Bot** trained on business knowledge
- **Multilingual Content** generation for global reach

### 1.2 Target Users
- SME Owners & Entrepreneurs
- Marketing Teams
- Business Administrators
- Product Managers

### 1.3 Project Status
- **Current Version**: 1.0.0
- **Development Stage**: Production-Ready
- **Last Updated**: April 2026

---

## 2. Technology Stack

### 2.1 Backend Architecture

#### Core Framework
| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Java | 17 |
| **Framework** | Spring Boot | 3.2.5 |
| **Build Tool** | Maven | Latest |
| **API Design** | REST + OpenAPI/Swagger | 2.5.0 |

#### Database & Storage
| Component | Technology |
|-----------|-----------|
| **Primary Database** | MySQL 8.0+ |
| **ORM** | Spring Data JPA + Hibernate |
| **File Storage** | Local File System (Invoices) |

#### Security & Authentication
| Component | Technology | Version |
|-----------|-----------|---------|
| **Authentication** | JWT (JJWT) | 0.11.5 |
| **Authorization** | Spring Security | 3.2.5 |
| **Encryption** | HMAC-SHA256 | Built-in |

#### API Integration
| Service | Purpose | Provider |
|---------|---------|----------|
| **AI Models** | Business Intelligence | Groq (OpenAI-compatible) |
| **Model** | LLM Processing | llama-3.3-70b-versatile |

#### Document Processing
| Component | Technology | Version |
|-----------|-----------|---------|
| **PDF Generation** | iText7 | 8.0.2 |
| **Invoice Format** | GST-Compliant PDF | Custom Implementation |

#### Additional Libraries
| Purpose | Library | Function |
|---------|---------|----------|
| **Annotation Processing** | Lombok | Code Generation |
| **Environment Config** | Spring DotEnv | .env File Support |
| **Validation** | Spring Boot Validation | Input Validation |
| **HTTP Client** | WebFlux + RestTemplate | API Calls |
| **Documentation** | Swagger UI | API Explorer |

---

### 2.2 Frontend Architecture

#### Core Framework
| Component | Technology | Version |
|-----------|-----------|---------|
| **UI Library** | React | 18.3.1 |
| **Bundle Tool** | Vite | 5.2.0 |
| **Routing** | React Router DOM | 6.23.1 |
| **Styling** | Tailwind CSS | 3.4.4 |

#### HTTP & State Management
| Component | Technology | Version |
|-----------|-----------|---------|
| **HTTP Client** | Axios | 1.7.2 |
| **State Management** | React Context API | Native |
| **Global Auth** | Custom AuthContext | In-house |

#### UI Components & Utilities
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Icons** | Lucide React | 0.383.0 |
| **Notifications** | React Hot Toast | 2.4.1 |
| **Styling Framework** | PostCSS | CSS Processing |
| **Fonts** | Google Fonts (Syne, DM Sans) | Typography |

---

## 3. Architecture & System Design

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer (React)                  │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │   Auth   │ Dashboard│ Products │ Invoices │   AI     │   │
│  │  Module  │ Module   │ Module   │ Module   │  Module  │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
│           ↓  Axios HTTP Requests  ↓                          │
├─────────────────────────────────────────────────────────────┤
│              API Gateway Layer (Spring Boot)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         JWT Filter + Security Configuration          │   │
│  └──────────────────────────────────────────────────────┘   │
│              ↓  REST Controllers  ↓                          │
├─────────────────────────────────────────────────────────────┤
│            Business Logic Layer (Services)                   │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │   Auth   │ Product  │ Invoice  │  FAQ     │   AI     │   │
│  │ Service  │ Service  │ Service  │ Service  │ Service  │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
├─────────────────────────────────────────────────────────────┤
│            Data Access Layer (Repositories)                  │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐   │
│  │   User   │ Product  │ Invoice  │  FAQ     │   AI     │   │
│  │ Repo     │ Repo     │ Repo     │ Repo     │ Repo     │   │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘   │
│              ↓  Hibernate ORM  ↓                             │
├─────────────────────────────────────────────────────────────┤
│               Database Layer (MySQL)                         │
│         ┌──────────────────────────────┐                    │
│         │   GrowGenie Database         │                    │
│         │  (Users, Products, etc.)     │                    │
│         └──────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘

External Services:
  ├─ Groq API (LLM - llama-3.3-70b)
  ├─ iText7 (PDF Generation)
  └─ File System (Invoice Storage)
```

### 3.2 Data Flow Architecture

#### Authentication Flow
```
1. User Login (Email + Password)
   ↓
2. Backend Validates Credentials
   ↓
3. JWT Token Generated (HMAC-SHA256)
   ↓
4. Token Returned to Frontend
   ↓
5. Frontend Stores Token (AuthContext)
   ↓
6. All Requests Include JWT in Headers
   ↓
7. JwtFilter Validates Token on Backend
   ↓
8. Request Authorized/Rejected
```

#### AI Processing Flow
```
1. User Initiates AI Request (Business Plan, Ad Copy, etc.)
   ↓
2. Request Sent to Backend Service
   ↓
3. Service Prepares Prompt with User Context
   ↓
4. Call Groq API (OpenAI-compatible endpoint)
   ↓
5. LLM Processes Request (llama-3.3-70b-versatile)
   ↓
6. Response Cached in AiGeneration Table
   ↓
7. Response Returned to Frontend
   ↓
8. User Receives AI-Generated Content
```

---

## 4. Database Schema

### 4.1 Core Entities

#### User Table
```sql
- user_id (PK)
- name
- email (UNIQUE)
- password (hashed)
- role (ADMIN / USER)
- subscription_plan (FREE_TRIAL / MONTHLY / YEARLY)
- subscription_expiry (DateTime)
- created_at
- updated_at
```

#### Product Table
```sql
- product_id (PK)
- user_id (FK → User)
- name
- description
- price
- category
- inventory_count
- created_at
- updated_at
```

#### Invoice Table
```sql
- invoice_id (PK)
- user_id (FK → User)
- invoice_number (UNIQUE)
- items_json (JSON Array)
- total_amount
- gst_amount
- status (DRAFT / SENT / PAID)
- pdf_path
- created_at
- due_date
```

#### AiGeneration Table
```sql
- generation_id (PK)
- user_id (FK → User)
- module_type (PLANNER / MARKETING / TRANSLATOR / etc.)
- input_prompt
- ai_response
- model_used (llama-3.3-70b-versatile)
- tokens_used
- created_at
```

#### FAQ Table
```sql
- faq_id (PK)
- user_id (FK → User)
- question
- answer (AI-generated or manual)
- category
- trained_in_ai_bot (boolean)
- created_at
```

---

## 5. Features & Modules

### 5.1 Core Modules

#### 🗺️ AI Business Planner
- **Purpose**: Generate startup roadmaps and market strategies
- **AI Model**: GPT-4 via Groq (llama-3.3-70b)
- **Outputs**: Strategic roadmap, market analysis, competitor analysis
- **Use Case**: New entrepreneurs validating business ideas

#### 📣 Marketing & Ads
- **Purpose**: Create compelling marketing copy, ad descriptions
- **Features**: 
  - Product description generation
  - Social media copy
  - Email campaign templates
- **Languages**: English, Hindi, Tamil, Bengali, Marathi

#### 🧾 Invoice Generator
- **Purpose**: Generate GST-compliant invoices in PDF format
- **Tech**: iText7 PDF Library
- **Features**:
  - Professional invoice templates
  - GST calculation
  - Invoice history tracking
  - PDF download

#### 📦 Product Catalog
- **Purpose**: Manage complete product inventory
- **Operations**: Create, Read, Update, Delete (Full CRUD)
- **Features**:
  - Product categorization
  - Price management
  - Inventory tracking
  - Bulk upload support (future)

#### 💬 FAQ Bot
- **Purpose**: Train AI-powered customer support bot
- **Features**:
  - FAQ entry management
  - AI response generation
  - Multi-language support
  - 24/7 automated responses

#### 🌐 Multilingual Translator
- **Purpose**: Generate content in multiple languages
- **Supported Languages**: 
  - Hindi (हिन्दी)
  - Tamil (தமிழ்)
  - Bengali (বাংলা)
  - Marathi (मराठी)
- **Use Case**: Global market expansion

### 5.2 Supporting Features

#### User Authentication & Authorization
- Email/Password login
- JWT-based sessions (24-hour expiration)
- Role-based access (ADMIN / USER)
- Secure password hashing (Spring Security)

#### Subscription Management
- 3-tier plans: FREE_TRIAL, MONTHLY (₹299), YEARLY (₹2,499)
- Plan upgrade/downgrade
- Expiry tracking & notifications
- Feature gating based on plan

#### Dashboard Analytics
- Real-time statistics (Products, AI Generations, Invoices, FAQs)
- Plan overview
- Module access cards
- Quick navigation

#### Error Handling & Security
- Custom exception handling (GlobalExceptionHandler)
- Resource not found (404)
- Duplicate resource prevention
- Authorization checks (SubscriptionRequiredException)
- Comprehensive logging (SLF4J)

---

## 6. API Endpoints Overview

### 6.1 Authentication Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login & get JWT token
PUT    /api/auth/subscription      - Update subscription plan
GET    /api/auth/profile           - Get current user profile
```

### 6.2 Product Endpoints
```
GET    /api/products               - List all user products
POST   /api/products               - Create new product
GET    /api/products/{id}          - Get product details
PUT    /api/products/{id}          - Update product
DELETE /api/products/{id}          - Delete product
```

### 6.3 Invoice Endpoints
```
GET    /api/invoices               - List all invoices
POST   /api/invoices               - Create new invoice
GET    /api/invoices/{id}          - Get invoice details
GET    /api/invoices/{id}/pdf      - Download invoice PDF
PUT    /api/invoices/{id}/status   - Update invoice status
DELETE /api/invoices/{id}          - Delete invoice
```

### 6.4 AI Module Endpoints
```
POST   /api/ai/planner             - Generate business plan
POST   /api/ai/marketing           - Generate marketing copy
POST   /api/ai/translate           - Translate content
GET    /api/ai/history             - Get generation history
```

### 6.5 FAQ Endpoints
```
GET    /api/faq                    - List all FAQs
POST   /api/faq                    - Create new FAQ
PUT    /api/faq/{id}               - Update FAQ
DELETE /api/faq/{id}               - Delete FAQ
POST   /api/faq/{id}/train         - Train AI bot with this FAQ
```

### 6.6 Admin Endpoints
```
GET    /api/admin/users            - List all users
GET    /api/admin/analytics        - Platform analytics
PUT    /api/admin/users/{id}/role  - Update user role
```

---

## 7. Security Architecture

### 7.1 Authentication & Authorization
- **Method**: JWT (JSON Web Tokens)
- **Algorithm**: HMAC-SHA256
- **Secret**: Environment variable (GROQ_API_KEY secured)
- **Expiration**: 24 hours (86400000ms)
- **Token Storage**: AuthContext (Frontend), HTTP Headers (Backend)

### 7.2 Security Layers

#### Layer 1: Request Filter
```
JwtFilter intercepts all requests
  ├─ Extract token from Authorization header
  ├─ Validate token signature
  ├─ Check token expiration
  ├─ Verify user exists
  └─ Set SecurityContext with user details
```

#### Layer 2: Controller Authorization
```
@PreAuthorize annotations on methods
  ├─ Role-based access (ADMIN vs USER)
  ├─ Resource ownership verification
  └─ Subscription plan checks
```

#### Layer 3: Service-Level Checks
```
Business logic validation
  ├─ User subscription status
  ├─ Feature access based on plan
  ├─ Resource ownership
  └─ Duplicate prevention
```

### 7.3 Data Protection
- **Password Storage**: Spring Security BCrypt hashing
- **Sensitive Data**: Environment variables (.env)
- **API Keys**: Groq API key in environment
- **Database**: MySQL with user-specific data isolation
- **CORS**: Configured for frontend origins
  - http://localhost:5173 (Vite Dev)
  - http://localhost:3000 (Alternative Dev)

---

## 8. Frontend Architecture

### 8.1 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin dashboard components
│   │   ├── ai/             # AI module components
│   │   ├── auth/           # Login/Register components
│   │   ├── common/         # Reusable UI components
│   │   ├── dashboard/      # Dashboard module
│   │   ├── faq/            # FAQ components
│   │   ├── invoices/       # Invoice components
│   │   ├── marketing/      # Marketing components
│   │   └── products/       # Product management
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── AiPlannerPage.jsx
│   │   ├── MarketingPage.jsx
│   │   ├── InvoicesPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── FaqPage.jsx
│   │   └── AdminPage.jsx
│   ├── context/
│   │   └── AuthContext.jsx # Global auth state
│   ├── hooks/              # Custom React hooks
│   ├── services/
│   │   ├── api.js          # Axios API client
│   │   └── index.js        # Service exports
│   ├── utils/              # Helper functions
│   ├── App.jsx             # Main component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── postcss.config.js       # PostCSS config
```

### 8.2 Component Design

#### Reusable UI Components (components/common/UI.jsx)
```javascript
- Button
- Input
- Card
- Modal
- Badge
- StatCard
- Layout
```

#### Page Structure
Each page follows a consistent pattern:
```javascript
1. Import dependencies (React, Context, Services)
2. Initialize state (useState, useEffect)
3. Fetch data on mount
4. Define handlers
5. Render UI with conditional loading states
6. Show toast notifications on success/error
```

### 8.3 State Management

#### AuthContext
- **Stores**: User data, authentication token
- **Provides**: login(), logout(), updateUser()
- **Usage**: Accessible throughout app via useAuth hook
- **Persistence**: localStorage for token

#### Local Component State
- Form inputs, loading states, modals
- Page-specific data fetching

---

## 9. Deployment Architecture

### 9.1 Backend Deployment

#### Requirements
- Java 17 Runtime
- MySQL 8.0+ Database
- Environment Variables (.env file):
  ```
  GROQ_API_KEY=your_groq_key
  JWT_SECRET=your_secret
  DATABASE_URL=mysql://host:3306/db
  DATABASE_USER=root
  DATABASE_PASSWORD=xxxx
  ```

#### Build & Run
```bash
# Build
mvn clean package

# Run
java -jar target/growgenie-backend-1.0.0.jar
```

#### Server Configuration
- **Port**: 8081
- **Context Path**: /api (for all endpoints)
- **CORS Enabled**: For frontend origins

### 9.2 Frontend Deployment

#### Build Process
```bash
# Development
npm run dev    # Runs on http://localhost:5173

# Production
npm run build  # Creates optimized build in dist/
```

#### Deployment Options
1. **Static Hosting** (Vercel, Netlify, AWS S3)
   - Upload contents of dist/ folder
   - Configure API endpoint to backend

2. **Docker Container**
   - Build image with node base
   - Serve static files via Nginx
   - Set environment variables for API URL

#### Environment Configuration
```javascript
// Frontend API endpoint
VITE_API_BASE_URL=https://api.growgenie.com
```

---

## 10. Performance & Scalability

### 10.1 Backend Optimization
- **Database Indexing**: User ID, Invoice Number
- **Connection Pooling**: HikariCP (Spring default)
- **Caching**: AiGeneration table for repeated queries
- **Pagination**: Available for large datasets

### 10.2 Frontend Optimization
- **Code Splitting**: Vite automatic optimization
- **Lazy Loading**: React Router lazy components
- **Bundle Size**: Minimal dependencies
- **Dark Mode**: Tailwind dark: utility classes

### 10.3 API Optimization
- **JWT Caching**: Token validation per request
- **Response Format**: Standardized JSON structure
- **Error Messages**: Descriptive for debugging

### 10.4 Scalability Roadmap
- **Load Balancing**: Kubernetes ready
- **Database Replication**: MySQL master-slave
- **Cache Layer**: Redis for session management
- **Microservices**: Separate AI service deployable

---

## 11. Testing & Quality Assurance

### 11.1 Test Coverage
- **Unit Tests**: Service layer logic
- **Integration Tests**: API endpoint testing
- **Manual Testing**: UI/UX validation

### 11.2 Code Quality
- **Logging**: SLF4J with debug logs
- **Exception Handling**: Centralized GlobalExceptionHandler
- **Input Validation**: Spring Validation annotations
- **API Documentation**: Swagger UI available at /swagger-ui.html

---

## 12. Monitoring & Logging

### 12.1 Application Logging
```
Logging Levels:
- DEBUG: com.growgenie.* (Development)
- INFO: Spring Security events
- WARN: Deprecated API usage
- ERROR: Exception tracking
```

### 12.2 Available Monitoring Endpoints
```
GET /swagger-ui.html     - API documentation
GET /api-docs            - OpenAPI specification
GET /actuator/health     - Health check (if enabled)
```

---

## 13. Cost Analysis

### 13.1 Monthly Costs Estimation

| Component | Cost | Notes |
|-----------|------|-------|
| **Groq API** | $0-50 | Based on token usage |
| **Database Hosting** | $15-50 | Cloud MySQL (AWS RDS, Digital Ocean) |
| **Frontend CDN** | $5-20 | Vercel, Netlify, or S3 + CloudFront |
| **Backend Server** | $10-30 | Cloud VM (AWS EC2, Digital Ocean) |
| **File Storage** | $5-10 | Invoice PDFs (S3, Azure Blob) |
| ****Total** | **$50-150** | **Scalable with usage** |

### 13.2 Revenue Model
- **Subscription Plans**:
  - MONTHLY: ₹299/month (~$3.60 USD)
  - YEARLY: ₹2,499/year (~$30 USD) - 30% discount

---

## 14. Future Roadmap

### Phase 2 (Q3 2026)
- ✅ Mobile app (React Native / Flutter)
- ✅ Advanced analytics dashboard
- ✅ Bulk product upload (CSV)
- ✅ Email integration (SMTP)
- ✅ WhatsApp/SMS notifications

### Phase 3 (Q4 2026)
- ✅ Multi-tenant architecture
- ✅ Advanced AI model selection
- ✅ API for third-party integrations
- ✅ Automated backup system
- ✅ Payment gateway integration (Razorpay)

### Phase 4 (2027)
- ✅ Marketplace for third-party plugins
- ✅ Advanced reporting & export
- ✅ Compliance with GST, TDS automation
- ✅ Supply chain management module
- ✅ Customer relationship management (CRM)

---

## 15. Getting Started Guide

### 15.1 Prerequisites
- Java 17+
- MySQL 8.0+
- Node.js 18+
- npm or yarn

### 15.2 Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 15.3 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 15.4 Environment Configuration
```bash
# Create .env file in backend/
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_secret_key

# MySQL
DATABASE_URL=jdbc:mysql://localhost:3306/growgenie_db
DATABASE_USER=root
DATABASE_PASSWORD=your_password
```

### 15.5 Database Initialization
```bash
# MySQL will auto-create tables (spring.jpa.hibernate.ddl-auto=update)
# Or use provided SQL scripts if available
```

---

## 16. Team & Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Backend Developer** | API development, database design, AI integration |
| **Frontend Developer** | UI/UX implementation, responsive design, component library |
| **DevOps Engineer** | Deployment, monitoring, scaling, security |
| **QA Engineer** | Testing, bug reporting, performance validation |
| **Product Manager** | Feature prioritization, roadmap planning |

---

## 17. Conclusion

GrowGenie represents a modern, scalable solution for SME business automation. With its AI-powered features, secure architecture, and user-friendly interface, it positions businesses to compete in the digital economy while maintaining ease of use.

### Key Strengths
✅ Comprehensive feature set covering business needs
✅ Secure, scalable architecture
✅ Modern tech stack with industry best practices
✅ User-centric design with dark mode support
✅ Flexible subscription model
✅ Extensible for future features

### Next Steps
1. Finalize Phase 2 development roadmap
2. Set up CI/CD pipeline
3. Plan mobile app development
4. Establish monitoring and alerting
5. Begin beta testing with select SMEs

---

**Document Version**: 1.0
**Last Updated**: April 2026
**Status**: Production Ready ✅
