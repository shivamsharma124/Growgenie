# 🌱 GrowGenie - AI-Powered Business Builder for SMEs

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

GrowGenie is a comprehensive web-based platform designed to empower Small and Medium Enterprises (SMEs) with **AI-driven tools** for business growth, product management, invoicing, and customer engagement. Powered by Groq's LLM capabilities, it offers enterprise-grade automation and intelligence features.

**[Live Demo](https://growgenie-ai-powered.vercel.app/)** | **[Project Report](./GROWGENIE_PROJECT_REPORT.md)** | **[API Documentation](#api-documentation)**

---

## ✨ Key Features

### 🤖 AI-Powered Modules
- **Business Roadmap Generator** - Automated strategic planning with AI insights
- **Marketing Content Creator** - AI-generated ad copy and product descriptions
- **Intelligent FAQ Bot** - Customer support automation trained on business knowledge
- **Invoice Management** - GST-compliant PDF generation with automation
- **Product Catalog Manager** - Full CRUD operations with AI enhancement
- **Admin Dashboard** - Comprehensive business analytics and control panel

### 🔐 Security & Compliance
- JWT-based authentication with HMAC-SHA256 encryption
- Spring Security integration for fine-grained authorization
- Enterprise-grade API security
- GST-compliant invoice generation

### 🌍 Global Reach
- Multi-language support (Hindi, Tamil, Bengali, Marathi)
- Responsive design for mobile and desktop
- Cloud-ready architecture

### 📊 Business Intelligence
- Real-time analytics and reporting
- User management and role-based access control
- Subscription management system
- Complete audit trail

---

## 🏗️ Technology Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Java | 17 |
| **Framework** | Spring Boot | 3.2.5 |
| **Database** | MongoDB | Latest |
| **Database ORM** | Spring Data JPA + Hibernate | 3.2.5 |
| **Authentication** | JWT (JJWT) | 0.11.5 |
| **API Documentation** | OpenAPI/Swagger | 2.5.0 |
| **Document Processing** | iText7 | 8.0.2 |
| **AI Integration** | Groq API (OpenAI compatible) | llama-3.3-70b-versatile |
| **Build Tool** | Maven | Latest |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| **UI Library** | React | 18.3.1 |
| **Build Tool** | Vite | 5.2.0 |
| **Routing** | React Router DOM | 6.23.1 |
| **HTTP Client** | Axios | 1.7.2 |
| **Styling** | Tailwind CSS | 3.4.4 |
| **Icons** | Lucide React | 0.383.0 |
| **Notifications** | React Hot Toast | 2.4.1 |

---

## 📋 Prerequisites

### Required Software
- **Java 17** or higher
- **Node.js 18+** and npm
- **MongoDB** (Local or Cloud - MongoDB Atlas)
- **Git**
- **Maven 3.8+**

### Required Accounts
- Groq API Key (for AI features) - [Get it here](https://console.groq.com)

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/GrowGenie.git
cd GrowGenie
```

### 2. Backend Setup

#### 2.1 Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
# Server Configuration
PORT=8080

# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/growgenie?retryWrites=true&w=majority




# Groq API Configuration
OPENAI_API_KEY=your_groq_api_key_here
OPENAI_API_URL=https://api.groq.com/openai/v1/chat/completions
OPENAI_MODEL=llama-3.3-70b-versatile

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Invoice Storage
INVOICE_STORAGE_PATH=invoices/
```

#### 2.2 Install and Run Backend
```bash
cd backend

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run

# Or package and run
mvn package
java -jar target/growgenie-backend-1.0.0.jar
```

Backend will be available at: `http://localhost:8080`

**API Documentation**: `http://localhost:8080/swagger-ui.html`

### 3. Frontend Setup

#### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

#### 3.2 Configure Environment Variables
Create a `.env.local` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:8080
```

#### 3.3 Run Development Server
```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

#### 3.4 Build for Production
```bash
npm run build
npm run preview
```

---

## 📚 Project Structure

```
GrowGenie/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/growgenie/
│   │   │   │   ├── GrowGenieApplication.java
│   │   │   │   ├── config/              # Spring configuration
│   │   │   │   ├── controller/          # REST API endpoints
│   │   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── entity/              # JPA entities
│   │   │   │   ├── exception/           # Custom exceptions
│   │   │   │   ├── filter/              # JWT filter
│   │   │   │   ├── repository/          # Data access layer
│   │   │   │   ├── security/            # JWT utilities
│   │   │   │   └── service/             # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml                           # Maven configuration
│   └── invoices/                         # Generated invoices storage
├── frontend/
│   ├── src/
│   │   ├── components/                   # Reusable UI components
│   │   │   ├── admin/                   # Admin panel components
│   │   │   ├── ai/                      # AI features components
│   │   │   ├── auth/                    # Auth components
│   │   │   ├── common/                  # Shared components
│   │   │   ├── dashboard/               # Dashboard components
│   │   │   ├── faq/                     # FAQ bot components
│   │   │   ├── invoices/                # Invoice components
│   │   │   ├── marketing/               # Marketing components
│   │   │   └── products/                # Product components
│   │   ├── pages/                        # Page components
│   │   ├── services/                     # API service layer
│   │   ├── context/                      # React context (auth)
│   │   ├── utils/                        # Utility functions
│   │   ├── hooks/                        # Custom React hooks
│   │   ├── App.jsx                       # Root component
│   │   └── main.jsx                      # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
├── README.md
└── GROWGENIE_PROJECT_REPORT.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/refresh` | Refresh JWT token |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Create new product |
| GET | `/api/products/{id}` | Get product by ID |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | Get all invoices |
| POST | `/api/invoices` | Create new invoice |
| GET | `/api/invoices/{id}` | Get invoice by ID |
| GET | `/api/invoices/{id}/pdf` | Download invoice as PDF |
| DELETE | `/api/invoices/{id}` | Delete invoice |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate` | Generate AI content |
| POST | `/api/ai/roadmap` | Generate business roadmap |
| POST | `/api/ai/marketing` | Generate marketing content |

### FAQ Bot
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/faq` | Get all FAQs |
| POST | `/api/faq` | Create FAQ |
| PUT | `/api/faq/{id}` | Update FAQ |
| DELETE | `/api/faq/{id}` | Delete FAQ |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/stats` | Get system statistics |
| PUT | `/api/admin/users/{id}` | Update user |
| DELETE | `/api/admin/users/{id}` | Delete user |

**Full API Documentation**: Visit `http://localhost:8080/swagger-ui.html` when backend is running.

---

## 🔑 Core Features Explained

### 1. JWT Authentication
- Stateless authentication using JWT tokens
- HMAC-SHA256 encryption for token signing
- Automatic token refresh mechanism
- Protected endpoints with `@Secured` annotations

### 2. AI Integration
- **Provider**: Groq API (OpenAI-compatible)
- **Model**: llama-3.3-70b-versatile
- **Features**:
  - Business roadmap generation
  - Marketing content creation
  - FAQ automation
  - Product description enhancement

### 3. Invoice Management
- **GST-Compliant**: Fully compliant with Indian GST standards
- **PDF Generation**: Using iText7 library
- **Storage**: Local file system storage with database tracking
- **Features**: Invoice numbering, tax calculations, payment tracking

### 4. Subscription Management
- Tiered subscription models
- Usage tracking per user
- Quota enforcement
- Subscription-based feature access

---

## 🧪 Testing

### Running Backend Tests
```bash
cd backend
mvn test
```

### Running Frontend Tests
```bash
cd frontend
npm run test
```

---

## 📦 Building for Production

### Backend
```bash
cd backend
mvn clean package -DskipTests
```

### Frontend
```bash
cd frontend
npm run build
```

Production-ready files will be in:
- Backend: `backend/target/growgenie-backend-1.0.0.jar`
- Frontend: `frontend/dist/`

---

## 🌐 Deployment

### Deploy Backend to Azure/AWS
1. Create Docker image from `backend/Dockerfile` (if available)
2. Push to container registry
3. Deploy to cloud platform with MongoDB connection string

### Deploy Frontend to Vercel
```bash
cd frontend
vercel deploy
```

---

## 🔐 Security Features

✅ JWT-based authentication  
✅ Spring Security integration  
✅ CORS configuration for controlled access  
✅ Input validation on all endpoints  
✅ SQL injection prevention (using JPA)  
✅ HTTPS recommended for production  
✅ Environment variables for sensitive data  
✅ Role-based access control (RBAC)  

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Environment Variables Reference

### Backend (.env)
```env
# Server
PORT=8080

# Database
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/growgenie

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=86400000

# AI API
OPENAI_API_KEY=your_groq_api_key
OPENAI_API_URL=https://api.groq.com/openai/v1/chat/completions
OPENAI_MODEL=llama-3.3-70b-versatile

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Storage
INVOICE_STORAGE_PATH=invoices/
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=GrowGenie
```

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/GrowGenie/issues)
- **Email**: support@growgenie.com
- **Documentation**: [Full Project Report](./GROWGENIE_PROJECT_REPORT.md)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Spring Boot](https://spring.io/projects/spring-boot)
- Frontend powered by [React](https://react.dev)
- AI capabilities by [Groq](https://groq.com)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- API documentation with [Swagger/OpenAPI](https://swagger.io)

---

## 📈 Project Status

- ✅ **Version 1.0.0** - Production Ready
- ✅ **Last Updated**: April 2026
- ✅ **Maintenance**: Active

---

<div align="center">

**[↑ back to top](#-growgenie---ai-powered-business-builder-for-smes)**

Made with ❤️ by the GrowGenie Team

</div>
