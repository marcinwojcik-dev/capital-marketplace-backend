# 🐳 Docker Deployment Guide

> **Complete guide for deploying Capital Marketplace Backend with Docker - from development to production**

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Docker%20Comose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- ✅ Docker installed ([Download](https://docs.docker.com/get-docker/))
- ✅ Docker Compose installed
- ✅ Git repository cloned

### One-Command Deployment
```bash
# 1. Clone and setup
git clone https://github.com/marcinwojcik-dev/capital-marketplace-backend.git
cd capital-marketplace-backend

# 2. Configure environment
cp docker.env.example .env
# Edit .env with your JWT_SECRET and API keys

# 3. Deploy everything
docker-compose up -d --build

# 4. Initialize database
docker-compose exec api npx prisma migrate deploy
docker-compose exec api npx prisma db seed

# 5. Verify deployment
curl http://localhost:4000/health
```

**🎉 Your API is now running at `http://localhost:4000`**

---

## 📋 Deployment Methods

### Method 1: 🎯 Automated Scripts (Recommended)

**Linux/macOS:**
```bash
# Full deployment in one command
./deploy.sh deploy

# Individual operations
./deploy.sh build     # Build Docker image
./deploy.sh start      # Start services
./deploy.sh migrate    # Run database migrations
./deploy.sh seed       # Seed database with sample data
./deploy.sh logs       # View real-time logs
./deploy.sh status     # Check service status
./deploy.sh stop       # Stop all services
./deploy.sh backup     # Backup database
./deploy.sh cleanup    # Clean up unused resources
```

**Windows:**
```cmd
# Full deployment in one command
deploy.bat deploy

# Individual operations
deploy.bat build
deploy.bat start
deploy.bat migrate
deploy.bat seed
deploy.bat logs
deploy.bat status
deploy.bat stop
deploy.bat backup
deploy.bat cleanup
```

### Method 2: 🐳 Manual Docker Compose

```bash
# Build and start services
docker-compose up -d --build

# Run database setup
docker-compose exec api npx prisma migrate deploy
docker-compose exec api npx prisma db seed

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Method 3: 🔧 Individual Docker Commands

```bash
# Build the image
docker build -t capital-marketplace-api .

# Run the container
docker run -d --name api \
  -e DATABASE_URL=file:./data/prod.db \
  -e JWT_SECRET=your-super-secret-key \
  -p 4000:4000 \
  -v uploads_data:/app/uploads \
  -v database_data:/app/data \
  capital-marketplace-api
```

---

## ⚙️ Configuration

### Environment Variables

**Required Settings:**
```env
# API Configuration
API_PORT=4000
NODE_ENV=production
JWT_SECRET=your_super_secret_jwt_key_change_me_in_production
MAX_UPLOAD_SIZE_BYTES=8000000

# Database (SQLite)
DATABASE_URL=file:./data/prod.db
```

**Optional External Services:**
```env
# Notification Service
KNOCK_API_KEY=your_knock_api_key
KNOCK_WORKFLOW_ID=your_knock_workflow_id

```

### Docker Services Overview

| Service | Port | Description | Health Check |
|---------|------|-------------|--------------|
| **api** | 4000 | Main Fastify API with SQLite | ✅ `/health` |

### Architecture Diagram
```
┌─────────────────────────────────────┐
│           Docker Host                │
│  ┌─────────────────────────────────┐ │
│  │     API Container               │ │
│  │  ┌─────────────┐ ┌─────────────┐│ │
│  │  │   Fastify   │ │   SQLite    ││ │
│  │  │   Server    │ │  Database   ││ │
│  │  │  (Port 4000)│ │             ││ │
│  │  └─────────────┘ └─────────────┘│ │
│  │  ┌─────────────┐ ┌─────────────┐│ │
│  │  │   Uploads   │ │   Logs      ││ │
│  │  │   Volume    │ │   Volume    ││ │
│  │  └─────────────┘ └─────────────┘│ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🔍 Monitoring & Health Checks

### Health Check Endpoint
```bash
# Check API health
curl http://localhost:4000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "database": "connected",
  "services": {
    "notifications": "active",
    "fileUpload": "active",
    "rateLimit": "active"
  }
}
```

### Service Monitoring Commands
```bash
# Check service status
docker-compose ps

# View real-time logs
docker-compose logs -f api

# Check resource usage
docker stats capital-marketplace-api

# Check disk usage
docker system df

# View container details
docker inspect capital-marketplace-api
```

### Log Management
```bash
# View last 100 lines
docker-compose logs --tail=100 api

# Follow logs in real-time
docker-compose logs -f api

# View logs with timestamps
docker-compose logs -t api

# Export logs to file
docker-compose logs api > api-logs.txt
```

---

## 🔒 Security Best Practices

### 1. Environment Security
- ✅ **Never commit `.env` files** to version control
- ✅ **Use strong, unique JWT secrets** (minimum 32 characters)
- ✅ **Rotate secrets regularly** in production
- ✅ **Use environment-specific configurations**

### 2. Container Security
- ✅ **Non-root user execution** in containers
- ✅ **Minimal base images** (Alpine Linux)
- ✅ **Regular security updates** for base images
- ✅ **Resource limits** to prevent resource exhaustion

### 3. Network Security
- ✅ **Configure firewall rules** for production
- ✅ **Use HTTPS** with reverse proxy (Nginx/Traefik)
- ✅ **Rate limiting** already implemented
- ✅ **CORS protection** with configurable origins

### 4. Data Security
- ✅ **Encrypted volumes** for sensitive data
- ✅ **Regular backups** of database and uploads
- ✅ **Access logging** for audit trails
- ✅ **File upload validation** and virus scanning

---

## 📊 Data Management

### Database Backup
```bash
# Automated backup
./deploy.sh backup

# Manual backup
docker-compose exec api cp /app/data/prod.db /app/uploads/backup-$(date +%Y%m%d).db
docker cp $(docker-compose ps -q api):/app/uploads/backup-$(date +%Y%m%d).db ./
```

### Database Restore
```bash
# Copy backup to container
docker cp backup.db $(docker-compose ps -q api):/app/data/prod.db

# Restart service
docker-compose restart api

# Verify restore
docker-compose exec api npx prisma studio
```

### File Upload Management
```bash
# Check uploads directory
docker-compose exec api ls -la /app/uploads/

# Clean old uploads (older than 30 days)
docker-compose exec api find /app/uploads -type f -mtime +30 -delete

# Check upload volume size
docker volume inspect capital-marketplace-backend_uploads_data
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflows

**1. Continuous Integration (`.github/workflows/ci.yml`):**
```yaml
name: CI Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: |
          npm install
          npm run lint
          npm run typecheck
          npm run test:run
      - name: Build Docker image
        run: docker build -t capital-marketplace-api .
      - name: Test Docker Compose
        run: docker-compose up -d --build
```

**2. Deployment Pipeline (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Render
        run: |
          # Deploy to your hosting platform
          ./deploy.sh deploy
```

---

## 🛠️ Troubleshooting

### Common Issues & Solutions

**1. 🚫 Database Connection Failed**
```bash
# Check database file permissions
docker-compose exec api ls -la /app/data/

# Check database URL
docker-compose exec api env | grep DATABASE_URL

# Recreate database
docker-compose exec api npx prisma migrate reset
```

**2. 🚫 API Not Starting**
```bash
# Check logs for errors
docker-compose logs api

# Check environment variables
docker-compose exec api env

# Check port availability
netstat -tulpn | grep :4000
```

**3. 🚫 File Upload Issues**
```bash
# Check uploads directory
docker-compose exec api ls -la /app/uploads/

# Check volume mounts
docker volume ls
docker volume inspect capital-marketplace-backend_uploads_data

# Check file permissions
docker-compose exec api ls -la /app/uploads/
```

**4. 🚫 Memory Issues**
```bash
# Check memory usage
docker stats

# Increase memory limits in docker-compose.yml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 1G
```

### Debugging Commands
```bash
# Enter API container for debugging
docker-compose exec api sh

# Check database with Prisma Studio
docker-compose exec api npx prisma studio

# View all container logs
docker-compose logs --tail=100 -f

# Check container health
docker inspect capital-marketplace-api | grep -A 10 Health
```

---

## 📈 Scaling & Performance

### Current Setup (Single Container)
**Perfect for:**
- ✅ Development environments
- ✅ Small to medium production deployments
- ✅ Applications with moderate traffic (< 1000 concurrent users)
- ✅ MVP and prototype deployments

### High Traffic Considerations
**For scaling beyond single container:**

1. **Add Reverse Proxy**
   ```yaml
   # docker-compose.yml
   services:
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
   ```

2. **Implement Load Balancing**
   ```yaml
   services:
     api1:
       build: .
     api2:
       build: .
     nginx:
       # Load balancer configuration
   ```

3. **Upgrade to PostgreSQL**
   ```yaml
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: capital_marketplace
         POSTGRES_USER: user
         POSTGRES_PASSWORD: password
   ```

4. **Add Redis for Caching**
   ```yaml
   services:
     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
   ```

---

## 🔧 Maintenance

### Regular Maintenance Tasks

**Daily:**
```bash
# Check service health
curl http://localhost:4000/health

# Monitor logs
docker-compose logs --tail=50 api
```

**Weekly:**
```bash
# Update dependencies
docker-compose exec api npm update

# Clean up old logs
docker system prune -f

# Check disk usage
docker system df
```

**Monthly:**
```bash
# Backup database
./deploy.sh backup

# Update base images
docker-compose pull
docker-compose up -d --build

# Security audit
docker scan capital-marketplace-api
```

### Updates and Upgrades
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
./deploy.sh deploy

# Or manually
docker-compose down
docker-compose up -d --build
```

### Cleanup Commands
```bash
# Remove unused containers and images
docker system prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Complete cleanup
./deploy.sh cleanup
```

---

## 📞 Support & Resources

### Getting Help
1. **Check logs first:** `./deploy.sh logs`
2. **Verify configuration:** `./deploy.sh status`
3. **Review this documentation**
4. **Check GitHub Issues:** [Issues](https://github.com/marcinwojcik-dev/capital-marketplace-backend/issues)
5. **Join Discussions:** [Discussions](https://github.com/marcinwojcik-dev/capital-marketplace-backend/discussions)

### Useful Resources
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] **Environment Variables:** All secrets configured and secure
- [ ] **JWT Secret:** Strong, unique secret (32+ characters)
- [ ] **Database:** Proper backup strategy in place
- [ ] **Monitoring:** Health checks and logging configured
- [ ] **Security:** Firewall rules and HTTPS configured
- [ ] **Backup:** Automated backup system tested
- [ ] **Updates:** Plan for regular security updates
- [ ] **Scaling:** Plan for traffic growth
- [ ] **Documentation:** Team trained on deployment process

---

<div align="center">

**🚀 Ready to deploy? Start with the Quick Start guide above!**

[![Deploy](https://img.shields.io/badge/Deploy%20Now-Docker%20Compose-blue?style=for-the-badge)](https://github.com/marcinwojcik-dev/capital-marketplace-backend)

</div>
