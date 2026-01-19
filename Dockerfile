FROM node:20-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package.json and pre-bundle.js
COPY ui/shop/package.json ./package.json
COPY ui/shop/pre-bundle.js ./pre-bundle.js

# Install dependencies
ENV HUSKY=0
RUN npm install --ignore-scripts --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pre-bundle.js ./pre-bundle.js

# Copy only the shop source code
COPY ui/shop ./

# Accept build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_REST_API_ENDPOINT
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_ADMIN_URL
ARG NEXT_PUBLIC_TENANT_ID
ARG NEXT_PUBLIC_DEFAULT_LANGUAGE
ARG NEXT_PUBLIC_ENABLE_MULTI_LANG
ARG NEXT_PUBLIC_AVAILABLE_LANGUAGES
ARG FRAMEWORK_PROVIDER
ARG APPLICATION_MODE

# Export them as environment variables for the build
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_REST_API_ENDPOINT=${NEXT_PUBLIC_REST_API_ENDPOINT}
ENV NEXT_PUBLIC_AUTH_URL=${NEXT_PUBLIC_AUTH_URL}
ENV NEXT_PUBLIC_ADMIN_URL=${NEXT_PUBLIC_ADMIN_URL}
ENV NEXT_PUBLIC_TENANT_ID=${NEXT_PUBLIC_TENANT_ID}
ENV NEXT_PUBLIC_DEFAULT_LANGUAGE=${NEXT_PUBLIC_DEFAULT_LANGUAGE}
ENV NEXT_PUBLIC_ENABLE_MULTI_LANG=${NEXT_PUBLIC_ENABLE_MULTI_LANG}
ENV NEXT_PUBLIC_AVAILABLE_LANGUAGES=${NEXT_PUBLIC_AVAILABLE_LANGUAGES}
ENV FRAMEWORK_PROVIDER=${FRAMEWORK_PROVIDER}
ENV APPLICATION_MODE=${APPLICATION_MODE}

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
