# Deployment Fixes

This document outlines the changes made to resolve issues encountered during the project deployment.

## 1. Removed `volumes` block from `docker-compose.yml`

**Issue:** The `docker-compose.yml` file contained a `volumes` block that was syntactically incorrect and not actively used by any service. This caused a `volumes must be a mapping` error during `docker-compose up -d`.

**Resolution:** The entire `volumes` block was removed from `docker-compose.yml` as it was unnecessary and preventing successful deployment.

## 2. Changed `npm ci --only=production` to `npm ci` in `Dockerfile`

**Issue:** The `Dockerfile` used `RUN npm ci --only=production` in the builder stage. However, the `vite` package, which is essential for building the application, was listed under `devDependencies` in `package.json`. This meant `vite` was not installed, leading to an `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vite'` during the `npx vite build` step.

**Resolution:** The command in the `Dockerfile` was changed to `RUN npm ci`. This ensures that all dependencies, including `devDependencies` required for the build process, are installed during the builder stage.

## 3. Simplified user creation in `Dockerfile`

**Issue:** The `Dockerfile` attempted to create a new `node` group and `node` user using `RUN addgroup -S node && adduser -S node -G node`. This command failed with `addgroup: group 'node' in use` because the `node` group and user already exist in the `node:18-alpine` base image.

**Resolution:** The user creation commands were replaced with a single `USER node` instruction. This leverages the existing `node` user provided by the base image, simplifying the Dockerfile and resolving the conflict.

With these changes, the project successfully built and deployed using `docker-compose up -d`. The application is accessible at `http://localhost:3000`.