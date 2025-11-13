# Cloudflare Deployment Guide

This project has been configured for deployment to **Cloudflare Pages** with **Cloudflare Functions** for the backend API.

## Architecture

- **Frontend**: React application deployed to Cloudflare Pages (static hosting)
- **Backend**: Cloudflare Functions (serverless) for PDF generation API
- **PDF Generation**: Uses `pdf-lib` JavaScript library (replaced Python ReportLab)

## Prerequisites

1. **Node.js** (v16 or later) and npm installed
2. **Cloudflare account** (free tier works)
3. **Wrangler CLI** (included as dev dependency)

## Project Structure

```
LOI_PDF_Generator/
├── frontend/                 # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── functions/                # Cloudflare Functions (Backend API)
│   ├── api/
│   │   └── generate-pdf.js  # PDF generation endpoint
│   └── package.json
├── package.json             # Root package.json with deploy scripts
└── wrangler.toml           # Cloudflare configuration
```

## Local Development

### 1. Install Dependencies

```bash
npm install
```

This will install wrangler and other root dependencies.

### 2. Build the Frontend

```bash
npm run build
```

This command:
- Installs frontend dependencies
- Builds the React app to `frontend/build`
- Installs functions dependencies

### 3. Run Local Development Server

```bash
npm run dev
```

This starts Wrangler's local development server with:
- Static files served from `frontend/build`
- Functions available at `/api/*` endpoints
- Accessible at `http://localhost:8788`

## Deployment

### First-Time Setup

1. **Login to Cloudflare**:
   ```bash
   npx wrangler login
   ```
   This opens a browser to authenticate with Cloudflare.

2. **Create the Pages Project**:
   The first time you deploy, Wrangler will create the project for you.

### Deploy to Cloudflare

Run the deployment command:

```bash
npm run deploy
```

This command:
1. Builds the frontend
2. Installs all dependencies
3. Deploys to Cloudflare Pages

### What Happens During Deployment

- **Frontend**: All files from `frontend/build` are uploaded to Cloudflare Pages
- **Functions**: All JavaScript files in `/functions/api/` become API endpoints
  - `/functions/api/generate-pdf.js` → Available at `https://your-site.pages.dev/api/generate-pdf`

## Environment Variables

If you need to add environment variables (for database connections, API keys, etc.):

1. **Via Cloudflare Dashboard**:
   - Go to Pages → Your Project → Settings → Environment Variables
   - Add variables for Production and/or Preview

2. **Via Wrangler CLI**:
   ```bash
   npx wrangler pages secret put SECRET_NAME
   ```

3. **For Local Development**:
   - Create `.dev.vars` file in the root directory (already gitignored)
   - Add your variables:
     ```
     SECRET_NAME=value
     ```

## Accessing Your Application

After deployment, your app will be available at:
- Production: `https://loi-pdf-generator.pages.dev` (or your custom domain)
- Every git push creates a preview deployment

## API Endpoints

### POST `/api/generate-pdf`

Generates a Letter of Intent PDF.

**Request Body** (JSON):
```json
{
  "date": "2025-01-15",
  "sellerName": "John Smith",
  "buyerName": "Jane Doe",
  "propertyAddress": "123 Main St",
  "purchasePrice": "1500000",
  ... (other form fields)
}
```

**Response**: PDF file (application/pdf)

## Monitoring and Logs

View logs and analytics:

```bash
npx wrangler pages deployment tail
```

Or visit the Cloudflare Dashboard:
- Pages → Your Project → Analytics
- Pages → Your Project → Functions → Logs

## Custom Domain

To use a custom domain:

1. Go to Pages → Your Project → Custom Domains
2. Add your domain
3. Update DNS records as instructed by Cloudflare

## Troubleshooting

### Build Fails

```bash
# Clear caches and rebuild
rm -rf node_modules frontend/node_modules functions/node_modules
npm install
npm run build
```

### Functions Not Working

- Check that `functions/package.json` has `"type": "module"`
- Verify `pdf-lib` is installed in functions directory
- Check Cloudflare Functions logs in the dashboard

### PDF Generation Issues

The JavaScript PDF generator uses `pdf-lib` and creates PDFs differently than the Python version. If you notice formatting differences:

1. Check `functions/api/generate-pdf.js`
2. Adjust font sizes, spacing, or line heights as needed
3. Test locally with `npm run dev` before deploying

## Migration from Python Backend

The original Python FastAPI backend has been converted to JavaScript:

- ✅ PDF generation using `pdf-lib` instead of ReportLab
- ✅ API endpoint at `/api/generate-pdf`
- ⚠️ MongoDB status endpoints not implemented (not needed for core functionality)

If you need the status check endpoints:
- Consider using Cloudflare D1 (SQLite) or KV storage
- Or connect to MongoDB Atlas via Data API

## Cost

Cloudflare Pages Free Tier includes:
- Unlimited requests
- Unlimited bandwidth
- 500 builds per month
- 100,000 Functions requests/day

This is more than sufficient for most use cases.

## Additional Commands

```bash
# Type generation for TypeScript/IDE support
npm run cf-typegen

# View all wrangler commands
npx wrangler --help

# View Pages-specific commands
npx wrangler pages --help
```

## Support

For issues specific to:
- **Cloudflare Pages/Functions**: See [Cloudflare Docs](https://developers.cloudflare.com/pages/)
- **Wrangler CLI**: See [Wrangler Docs](https://developers.cloudflare.com/workers/wrangler/)
- **pdf-lib**: See [pdf-lib GitHub](https://github.com/Hopding/pdf-lib)
