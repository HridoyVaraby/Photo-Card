# Deployment using Dokploy

This guide explains how to deploy the News Photo Card Generator using Dokploy with Docker Compose.

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
- **Multi-stage build**: Node.js builder + nginx production
- **Optimized for**: Static SPA serving with gzip compression
- **Security headers**: XSS protection, content type options
- **Dokploy network**: External network for proper isolation
- **Port mapping**: 80:80 for web access

### Dockerfile
- **Base image**: `node:18-alpine` for building
- **Production image**: `nginx:alpine` for serving
- **Multi-stage**: Reduces final image size
- **Static assets**: Served from `/usr/share/nginx/html`

### nginx.conf
- **SPA routing**: Fallback to index.html for client-side routing
- **Asset caching**: 1-year cache for static assets
- **Compression**: Gzip enabled for text-based assets
- **Security**: Modern security headers

## Environment Variables

```bash
NODE_ENV=production
```

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

## Production Considerations

### Performance
- **Static hosting**: All assets served via nginx with gzip compression
- **CDN ready**: Can be easily integrated with CDN services
- **Caching**: Browser caching headers for static assets

### Security
- **HTTPS**: Redirect HTTP to HTTPS (handled by dokploy)
- **Headers**: XSS protection, content type security
- **Isolation**: Docker container isolation

### Monitoring
- **Logs**: `docker-compose logs app`
- **Status**: Check Dokploy dashboard
- **Health checks**: Add to docker-compose if needed

## Troubleshooting

### Build Issues
```bash
# Clear build cache
docker-compose build --no-cache

# Rebuild specific service
docker-compose up --build app
```

### Network Issues
```bash
# Check dokploy network
docker network ls

# Recreate network
docker network create dokploy-network
```

### Common Issues
1. **Port conflicts**: Ensure port 80 is available
2. **Build failures**: Check .dockerignore file
3. **Permission issues**: Verify file permissions in nginx.conf
4. **Memory issues**: Add resource limits to docker-compose.yml

## Support

For Dokploy-specific issues, visit [dokploy.com](https://dokploy.com) documentation.
For application issues, check the [GitHub repository](https://github.com/HridoyVaraby/Photo-Card).

## Next Steps

After deployment:
1. Configure custom domain
2. Set up SSL (automatically handled by dokploy)
3. Configure CDN if needed
4. Set up monitoring and analytics