#!/bin/bash

# Latimore Life & Legacy Deployment Script
# This script sets up the complete LatimoreHub system

echo "🚀 Starting LatimoreHub Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the latimore-hub directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npm run db:generate

# Check if environment variables are set
echo "🔧 Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Warning: DATABASE_URL not set. Please configure your environment variables."
fi

if [ -z "$SUPABASE_URL" ]; then
    echo "⚠️  Warning: SUPABASE_URL not set. Please configure Supabase connection."
fi

# Build the application
echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "🎉 LatimoreHub deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Configure your environment variables in .env.local"
echo "2. Set up your Supabase database and run: npm run db:push"
echo "3. Configure your Fillout webhook endpoint"
echo "4. Set up Google Calendar appointment scheduling"
echo "5. Configure Google Analytics and other integrations"
echo ""
echo "🌐 Your application is ready to deploy to Vercel!"
echo "   Visit: https://vercel.com/new to deploy"
echo ""
echo "📚 Documentation: See README.md for detailed setup instructions"
echo ""
echo "Protecting Today. Securing Tomorrow. #TheBeatGoesOn"