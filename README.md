# 🌍 EnviroSense AI - Intelligent Climate Action Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black)](https://nextjs.org/)
[![Storyblok](https://img.shields.io/badge/Storyblok-CMS-00b3b0)](https://www.storyblok.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)

## 🎯 **Project Overview**

EnviroSense AI is a comprehensive climate action platform that combines AI-powered tools with Storyblok CMS for multilingual, accessible environmental insights. Built for hackathons and real-world impact, featuring complete Storyblok integration, multilingual support, and accessibility-first design.

## 🏆 **Hackathon Features (Storyblok x Code & Coffee 2025)**

### ✅ **Complete Storyblok Integration**
- **19+ Stories** across multiple content types in Storyblok space
- **Dynamic Resource Management** for 5 climate features with full CMS control
- **Country-Specific Content** (USA/India) with seamless fallback system
- **Professional Community Hub** with events, news, and expert updates from Storyblok
- **Location-Based Theming** with custom backgrounds and content from Storyblok

### 🌍 **Multilingual Support**
- **8+ Languages**: Hindi, Spanish, French, German, Portuguese, Chinese, Japanese, Arabic
- **AI Translation Service** powered by Google Gemini for UI text
- **Real-time Language Switching** with no page reload
- **Storyblok-Ready**: API calls include language parameters for content translation

### ♿ **Accessibility Excellence**
- **Screen Reader Support** with proper ARIA labels and semantic HTML
- **Keyboard Navigation** for all interactive elements including language selector
- **Image Alt Text** from Storyblok content for all event images
- **High Contrast** and responsive design for all abilities
- **Voice Features** integration for enhanced accessibility

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 14, React Server Components, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **CMS**: Storyblok with @storyblok/react/rsc for seamless integration
- **AI Services**: Google Gemini for translation services
- **Authentication**: Supabase Auth
- **Deployment**: Vercel-ready with optimized performance

## 🚀 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/omkardongre/EnviroSense-AI.git
cd EnviroSense-AI

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Add your API keys:
# - STORYBLOK_ACCESS_TOKEN
# - GOOGLE_GEMINI_API_KEY
# - SUPABASE_URL & SUPABASE_ANON_KEY

# Run development server
npm run dev
```

## 🌟 **Core Features**

### 🌾 **Climate Resource Tools (Storyblok-Powered)**
- **Drought-Resistant Crops**: AI-powered recommendations from Storyblok CMS
- **Water Conservation**: Smart management strategies with CMS content
- **Solar Panel Optimizer**: ROI calculations with Storyblok data
- **Habitat Protection**: Biodiversity tools with expert updates
- **Farm Equipment**: Carbon footprint calculator with CMS resources

### 👥 **Community Hub (Storyblok Integration)**
- **Expert Updates**: Agricultural insights from Storyblok content
- **Environmental Events**: Calendar with images and alt text from CMS
- **Latest News**: Policy updates managed through Storyblok
- **Tabbed Interface**: Clean organization of community content

### 🤖 **AI-Powered Features**
- **Climate Mentor**: Conversational AI for climate advice
- **Vision Scanner**: Carbon footprint analysis from images
- **Goal Tracking**: Environmental impact measurement
- **Translation Service**: Context-aware multilingual support

## 📊 **Content Management with Storyblok**

### Storyblok Content Structure
```
📁 Storyblok Space (19+ Stories)
├── 🌍 Resources
│   ├── resources/usa/{feature} (5 features)
│   └── resources/india/{feature} (5 features)
├── 🎨 Themes
│   ├── themes/usa (homepage theming)
│   └── themes/india (homepage theming)
└── 👥 Community
    ├── community-hub/{country}/resource-updates
    ├── events-news/{country}/environmental-events/
    └── events-news/{country}/latest-news/
```

### Content Types
- **resource_section**: Feature-specific climate resources
- **country_theme**: Homepage localization and theming
- **community_update**: Expert insights and updates
- **event_item**: Environmental events with images
- **news_item**: Latest environmental news and policies

## 🌐 **Multilingual Implementation**

### Current Status
- ✅ **UI Translation**: Complete AI-powered translation
- ✅ **Language Selector**: 8+ languages with flags
- ✅ **API Integration**: Language parameters in all Storyblok calls
- 🔧 **Content Translation**: Requires Storyblok field configuration

### Setup Guide
See `/self-docs/storyblok/MULTILINGUAL_SETUP_GUIDE.md` for complete Storyblok internationalization setup.

## ♿ **Accessibility Features**

- **Image Alt Text**: All event images include descriptive alt text from Storyblok
- **Keyboard Navigation**: Full keyboard support throughout
- **Screen Reader**: ARIA labels and semantic HTML
- **Focus Management**: Proper focus indicators and tab order
- **Responsive Design**: Mobile-optimized with proper touch targets

### Testing Accessibility
See `/self-docs/accessibility/ACCESSIBILITY_TESTING_GUIDE.md` for comprehensive testing instructions.

## 📁 **Project Structure**

```
├── app/                    # Next.js app router
│   ├── community/         # Community Hub page
│   ├── api/              # API routes for features
│   └── [features]/       # Individual feature pages
├── components/
│   ├── ui/               # shadcn/ui components
│   └── storyblok/        # Storyblok-specific components
├── lib/
│   ├── storyblok-service.ts  # Storyblok API integration
│   ├── translation-service.ts # AI translation service
│   └── utils.ts          # Utility functions
├── hooks/                # Custom React hooks
├── self-docs/           # Comprehensive documentation
│   ├── storyblok/       # Storyblok integration guides
│   └── accessibility/   # Accessibility testing guides
└── public/              # Static assets
```

## 🔧 **Development**

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Environment Variables
```env
# Storyblok CMS
STORYBLOK_ACCESS_TOKEN=your_storyblok_token

# AI Translation
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Authentication
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Optional: External APIs
OPENWEATHER_API_KEY=your_weather_api_key
```

## 🚀 **Deployment**

This project is optimized for Vercel deployment:

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables**
4. **Deploy automatically**

## 📖 **Documentation**

- **Storyblok Integration**: `/self-docs/storyblok/`
- **Multilingual Setup**: `/self-docs/storyblok/MULTILINGUAL_SETUP_GUIDE.md`
- **Accessibility Testing**: `/self-docs/accessibility/ACCESSIBILITY_TESTING_GUIDE.md`
- **Algolia Integration**: `/self-docs/storyblok/ALGOLIA_INTEGRATION_PLAN.md`
- **Features Checklist**: `/self-docs/storyblok/COMPLETED_FEATURES_CHECKLIST.md`

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details.

## 🙏 **Acknowledgments**

- **Storyblok** for excellent CMS capabilities and hackathon sponsorship
- **Google Gemini** for AI translation services
- **shadcn/ui** for beautiful component library
- **Next.js** team for the amazing framework

---

**Built with ❤️ for climate action and accessibility**
