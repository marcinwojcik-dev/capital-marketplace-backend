# 🏗️ Backend Architecture Decisions

> **Key technical decisions for Capital Marketplace Backend API**

## 🎯 **Core Backend Stack**

### **1. Runtime: Node.js + Fastify**
- **Decision:** Fastify over Express.js for API server
- **Rationale:** 2-3x performance improvement, built-in JSON schema validation, TypeScript-first
- **Tradeoff:** Smaller ecosystem vs. superior performance and developer experience
- **Future:** Leverage Fastify plugins for microservices architecture

### **2. Database: SQLite → PostgreSQL Path**
- **Decision:** SQLite for MVP, PostgreSQL for production
- **Rationale:** Zero-configuration development, Prisma ORM enables seamless migration
- **Tradeoff:** Limited concurrent writes vs. rapid development and testing
- **Future:** PostgreSQL with connection pooling for production scale

### **3. ORM: Prisma for Type Safety**
- **Decision:** Prisma over raw SQL or other ORMs
- **Rationale:** Type-safe queries, migration management, multi-database support
- **Tradeoff:** Learning curve vs. developer productivity and type safety
- **Future:** Advanced query optimization and database introspection

## 🔧 **API Design & Security**

### **4. Validation: Zod Schemas**
- **Decision:** Zod for runtime validation on all endpoints
- **Rationale:** TypeScript integration, shared client/server schemas, detailed error messages
- **Tradeoff:** Additional bundle size vs. type safety and API reliability
- **Future:** Generate OpenAPI documentation from Zod schemas

### **5. Authentication: JWT + HTTP-Only Cookies**
- **Decision:** JWT tokens with secure cookie storage
- **Rationale:** Stateless authentication, CSRF protection, horizontal scaling ready
- **Tradeoff:** Token revocation complexity vs. stateless benefits
- **Future:** Redis-based token blacklisting for enhanced security

### **6. File Storage: Local Filesystem with UUID**
- **Decision:** Local `/uploads` directory with UUID-based naming
- **Rationale:** Simple implementation, collision prevention, easy backup strategy
- **Tradeoff:** Single-point-of-failure vs. simplicity and cost-effectiveness
- **Future:** Cloud storage migration (AWS S3, Google Cloud Storage)

## 🚀 **Business Logic & Performance**

### **7. Scoring Algorithm: Weighted System**
- **Decision:** Simple weighted scoring: KYC (+30), Financials (+20), Docs (+25), Revenue (+25)
- **Rationale:** Clear business logic, easy to understand and modify, transparent scoring
- **Tradeoff:** Oversimplified vs. rapid implementation and clarity
- **Future:** ML-based scoring with additional factors and dynamic weights

### **8. Security: Layered Approach**
- **Decision:** Helmet.js + CORS + Rate Limiting + File Validation
- **Rationale:** Defense in depth, essential security without over-engineering
- **Tradeoff:** Additional middleware vs. comprehensive protection
- **Future:** Advanced security policies and monitoring integration

## 📊 **MVP Constraints & Future Roadmap**

| Component | MVP Implementation | Production Gap | Future Action |
|-----------|-------------------|----------------|---------------|
| **Database** | SQLite | Limited scale | PostgreSQL migration |
| **File Storage** | Local filesystem | Single server | Cloud storage |
| **Authentication** | Basic JWT | Limited features | OAuth2 + MFA |
| **Scoring** | Simple algorithm | Oversimplified | ML-based scoring |

---

**📝 These 8 decisions prioritize MVP delivery while maintaining a clear path to production-ready, scalable architecture.**