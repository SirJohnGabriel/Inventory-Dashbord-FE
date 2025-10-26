# Environment Configuration

This folder contains all environment-specific configuration files for the application.

## File Structure

```
environments/
├── .env.example          # Template file with all available environment variables
├── .env.local           # Personal local overrides (gitignored, highest priority)
├── .env.development     # Development environment settings
├── .env.staging         # Staging environment settings
└── .env.production      # Production environment settings
```

## Environment File Priority (Vite/Node.js standard)

Files are loaded in this priority order (higher number = higher priority):

1. `.env` (root level - shared defaults for all environments)
2. `.env.local` (root level - personal overrides, gitignored)
3. `.env.[mode]` (e.g., `.env.development` - environment-specific)
4. `.env.[mode].local` (e.g., `.env.development.local` - personal env overrides, gitignored)

## Usage

**For Local Development:**

- Use the root `.env` file for shared default values
- Use `environments/.env.local` for your personal secrets/overrides (API keys, local DB URLs, etc.)
- The `.env.local` file should contain sensitive data and personal preferences

**For Different Environments:**

```bash
# Development
npm run dev                    # Uses .env + .env.local (if exists)
npm run dev:development        # Uses .env + environments/.env.development + .env.local

# Staging
npm run dev:staging           # Uses .env + environments/.env.staging
npm run build:staging         # Builds with .env + environments/.env.staging

# Production
npm run dev:production        # Uses .env + environments/.env.production
npm run build:production      # Builds with .env + environments/.env.production
```

## Example Setup

**Root `.env` (shared defaults):**

```
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Headway ERP
```

**`environments/.env.local` (your personal overrides):**

```
VITE_API_BASE_URL=http://localhost:8080
VITE_DEBUG=true
VITE_API_KEY=your-secret-api-key
```

**`environments/.env.production`:**

```
VITE_API_BASE_URL=https://api.production.com
VITE_DEBUG=false
```

## Environment Variables

All environment variables that should be available in the client-side code must be prefixed with `VITE_`.

## Security Notes

- **Never commit `.env.local` files** - they contain personal/sensitive data
- Use `.env.local` for API keys, database URLs, and other secrets
- Environment-specific files (`.env.development`, `.env.production`) can be committed as they contain non-sensitive configuration
- Use proper environment variable management in production deployments
