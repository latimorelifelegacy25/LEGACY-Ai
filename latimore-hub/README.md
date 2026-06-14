# LatimoreHub - Comprehensive CRM & Website System

A complete Next.js application for Latimore Life & Legacy LLC featuring:

## 🚀 Features

### Website & Lead Generation
- **Modern Website**: Next.js 14 with App Router, optimized for performance
- **Lead Capture**: Fillout form integration with UTM tracking
- **Booking System**: Google Calendar appointment scheduling
- **Local SEO**: Optimized for Schuylkill, Luzerne, and Northumberland Counties

### CRM & Pipeline Management
- **Contact Management**: Complete contact and inquiry tracking
- **Drag & Drop Pipeline**: Kanban-style sales pipeline management
- **Analytics Dashboard**: Lead attribution and conversion tracking
- **Task Management**: Follow-up and workflow automation

### AI Social Content System
- **Content Generation**: AI-powered social media content creation
- **Brand Consistency**: Automated compliance and brand voice enforcement
- **Multi-Platform**: Facebook and LinkedIn optimized content
- **Content Calendar**: Structured content planning and scheduling

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Supabase PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth
- **Forms**: Fillout integration with webhook processing
- **Deployment**: Vercel with automatic deployments

## 📦 Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd latimore-hub
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

3. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Development**
   ```bash
   npm run dev
   ```

## 🌐 Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/latimore_hub"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Fillout Integration
FILLOUT_SECRET="your-fillout-webhook-secret"

# Authentication
NEXTAUTH_URL="https://latimorehub.vercel.app"
NEXTAUTH_SECRET="your-nextauth-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Analytics
GA4_ID="G-XXXXXXXXXX"

# Email
RESEND_API_KEY="your-resend-api-key"
NOTIFY_TO="leads@latimorelegacy.com"
THANKYOU_FROM="Latimore Life & Legacy <hello@latimorelegacy.com>"

# Google Calendar
GOOGLE_CALENDAR_APPOINTMENT_URL="https://calendar.google.com/calendar/appointments/..."
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Migration
```bash
npm run db:generate
npm run db:push
```

## 📊 Key Features

### Lead Capture Flow
1. **Landing Page** → Generate lead_session_id
2. **Fillout Form** → Capture lead with UTM parameters
3. **Webhook Processing** → Create contact and inquiry in database
4. **Thank You Page** → Offer booking option
5. **Google Calendar** → Schedule consultation

### CRM Pipeline
- **New Inquiry** → **Qualified** → **Booked** → **Closed Won/Lost**
- Drag and drop interface for status updates
- Automatic task creation and follow-up reminders
- Complete contact history and interaction tracking

### Social Content Workflow
- AI-powered content generation based on brand guidelines
- Compliance-aware content creation
- Multi-platform optimization (Facebook, LinkedIn)
- Content calendar and scheduling integration

## 🎯 Service Pathways

### Velocity Path (Living Benefits)
- Fast, digital term life insurance
- Living benefits for critical illness
- Competitive rates for healthy applicants

### Depth Path (Retirement Planning)
- IUL/FIA consultations
- Tax-advantaged wealth accumulation
- Principal protection strategies

### Group Path (Workshops)
- Educational workshops for organizations
- Employee benefits consulting
- Financial wellness programs

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interface elements
- Fast loading times (Core Web Vitals optimized)
- Progressive Web App capabilities

## 🔒 Security & Compliance

- HTTPS encryption throughout
- Secure webhook signature verification
- Row-level security with Supabase
- GDPR/CCPA compliant data handling
- Insurance industry compliance features

## 📈 Analytics & Tracking

- Google Analytics 4 integration
- UTM parameter tracking
- Lead attribution reporting
- Conversion funnel analysis
- Performance dashboards

## 🤝 Support

For technical support or questions about the LatimoreHub system:

- **Documentation**: See inline code comments and API documentation
- **Issues**: Create GitHub issues for bug reports
- **Features**: Submit feature requests through GitHub

## 📄 License

Proprietary software for Latimore Life & Legacy LLC. All rights reserved.

---

**Protecting Today. Securing Tomorrow. #TheBeatGoesOn**