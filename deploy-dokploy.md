# Deployment using Dokploy

This guide explains how to deploy the News Photo Card Generator using Dokploy with Docker Compose and native dokploy routing.

## Prerequisites

1. **Dokploy Account**: Sign up at [dokploy.com](https://dokploy.com)
2. **Domain**: Have a custom domain ready
3. **Docker**: Docker installed on your local machine

## Quick Deployment

### 1. Connect Your Repository

```bash
# Add dokploy remote to git
git remote add dokploy https://your-dokploy-domain.com/git/repository.git

# Or use dokploy CLI
npm install -g @dokploy/cli
dokploy login
```

### 2. Deploy with Docker Compose

```bash
# Deploy using docker-compose
docker-compose up --build

# Or deploy to dokploy
docker-compose push dokploy/app
```

### 3. Alternative: Web Interface

1. Push your code to GitHub/GitLab
2. Connect your repository in Dokploy dashboard
3. Select "Docker Compose" deployment method
4. Add environment variables if needed
5. Click "Deploy"

## Configuration Files

### docker-compose.yml
- **Single service**: app service using Node.js 18 Alpine
- **Port mapping**: 3000:3000 (internal port)
- **Environment**: Production ready with NODE_ENV=production
- **Dokploy routing**: Uses dokploy's native load balancer and routing
- **Health checks**: Built-in container health monitoring
- **Optimized for**: Direct app serving with dokploy's proxy system

### Dockerfile
- **Base image**: `node:18-alpine` for development and production
- **Multi-stage build**: Optimizes final image size
- **Security**: Non-root user for container security
- **Health check**: Built-in application health monitoring
- **Production serving**: Direct app with Vite server

## Deployment Commands

### CLI Deployment
```bash
# Install dokploy CLI
npm install -g @dokploy/cli

# Login to dokploy
dokploy login

# Deploy
docker-compose up --build -d dokploy/app
```

### Git Remote Deployment
```bash
# Add remote
git remote add dokploy https://your-dokploy-domain.com/git/your-repo.git

# Push to deploy
git push dokploy main
```

## Environment Variables

```bash
NODE_ENV=production
```

## Production Considerations

### Performance
- **Direct serving**: App served directly without reverse proxy overhead
- **Dokploy CDN**: Automatic CDN integration through dokploy platform
- **Asset optimization**: Vite's built-in optimizations
- **Container optimization**: Multi-stage builds reduce image size

### Security
- **HTTPS**: Automatically handled by dokploy
- **Container isolation**: Docker container security with non-root user
- **Health monitoring**: Built-in health checks and dokploy monitoring
- **Environment security**: Production environment variables

### Monitoring
- **Logs**: `docker-compose logs app`
- **Status**: Check Dokploy dashboard
- **Health checks**: Automatic health monitoring in dokploy

## Troubleshooting

### Build Issues
```bash
# Clear build cache
docker-compose build --no-cache

# Rebuild specific service
docker-compose up --build app
```

### Common Issues
1. **Port conflicts**: dokploy handles port routing automatically
2. **Build failures**: Check .dockerignore file
3. **Permission issues**: Non-root user configuration in Dockerfile
4. **Memory issues**: Add resource limits to docker-compose.yml

## Support

For Dokploy-specific issues, visit [dokploy.com](https://dokploy.com) documentation.
For application issues, check the [GitHub repository](https://github.com/HridoyVaraby/Photo-Card).

## Next Steps

After deployment:
1. Configure custom domain in dokploy dashboard
2. Set up SSL (automatically handled by dokploy)
3. Configure custom domains if needed
4. Set up monitoring and analytics
## Production Ready Status

✅ **All configuration issues resolved**
- Fixed npm ci command for dependency installation
- Resolved vite global command availability with npx
- Simplified user creation to use existing node user
- Removed unnecessary volumes configuration
- Optimized Dockerfile for production deployment

✅ **Ready for dokploy deployment**
- Docker configuration tested and working
- All deployment files updated and documented
- Builds successfully complete without errors
- Production-optimized Docker image size