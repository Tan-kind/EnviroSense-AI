# 🌍 EnviroSense AI - Intelligent Climate Action Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black)](https://nextjs.org/)
[![Storyblok](https://img.shields.io/badge/Storyblok-CMS-00b3b0)](https://www.storyblok.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)](https://tailwindcss.com/)

## 🌐 **Advanced Multilingual Support**

### Complete Translation Infrastructure
- ✅ **AI Translation Service**: Google Gemini-powered context-aware translations
- ✅ **8+ Language Support**: Hindi, Spanish, French, German, Portuguese, Chinese, Japanese, Arabic, Russian, Korean
- ✅ **Real-time Language Switching**: No page reload required
- ✅ **Custom Language Selector**: Built with Tailwind CSS and proper accessibility
- ✅ **Storyblok Integration**: All API calls include language parameters
- ✅ **Environmental Context**: Translations optimized for climate/agricultural terminology

### Translation Features
- **Smart UI Translation**: Bulk page translation with caching
- **Language Persistence**: Browser memory integration
- **Fallback System**: Graceful degradation to English
- **Professional Interface**: Flag indicators and native language names
- **Accessibility**: Screen reader support and keyboard navigation

### Storyblok Multilingual Ready
Complete API integration with language parameters - ready for Storyblok internationalization configuration.

## 🏆 **Hackathon Features**

### ✅ **Complete Storyblok Integration**
- **19+ Stories** across multiple content types
- **Dynamic Resource Management** for 5 climate features
- **Country-Specific Content** (USA/India with fallback system)
- **Professional Community Hub** with events, news, and expert updates
- **Location-Based Theming** with custom backgrounds

### 🌍 **Multilingual Support**
- **8+ Languages**: Hindi, Spanish, French, German, Portuguese, Chinese, Japanese, Arabic
- **AI Translation Service** powered by Google Gemini
- **Real-time Language Switching** with no page reload
- **Storyblok-Ready**: API calls include language parameters

### ♿ **Comprehensive Accessibility**

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: All interactive elements properly labeled
- **Image Alt Text**: Descriptive alt text from Storyblok content
- **Screen Reader Testing**: Compatible with NVDA, VoiceOver, and JAWS

### Keyboard Navigation
- **Full Keyboard Support**: All features accessible without mouse
- **Focus Management**: Proper focus indicators and tab order
- **Dropdown Navigation**: Arrow key support for language selector
- **Skip Links**: Quick navigation to main content

### Visual Accessibility
- **High Contrast**: Optimized text visibility across all themes
- **Responsive Design**: Mobile-optimized with proper touch targets (44px minimum)
- **Color Indicators**: Visual and text-based content source indicators
- **Loading States**: Accessible skeleton animations during data loading

### Voice Features Integration
- **Voice Recording**: Simple voice recording hooks available
- **Speech Synthesis**: Browser-based text-to-speech support
- **Voice Commands**: Framework ready for voice navigation

### Accessibility Testing
Comprehensive testing guide available at `/self-docs/accessibility/ACCESSIBILITY_TESTING_GUIDE.md`

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 14, React Server Components, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **CMS**: Storyblok with @storyblok/react/rsc
- **AI Services**: Google Gemini for translation
- **Authentication**: Supabase Auth
- **Deployment**: Vercel-ready

## 🚀 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/Tan-kind/EnviroSense-AI.git
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
- **Drought-Resistant Crops**: Dynamic content from Storyblok CMS with regional recommendations
- **Water Conservation**: Smart strategies managed through Storyblok content management
- **Solar Panel Optimizer**: ROI calculations with CMS-driven regional data
- **Habitat Protection**: Biodiversity tools with Storyblok content structure
- **Farm Equipment**: Carbon calculator with dynamic resource sections

### 👥 **Community Hub (Full Storyblok Integration)**
- **Expert Updates**: Agricultural insights managed via Storyblok `community_update` content type
- **Environmental Events**: Dynamic calendar with images from Storyblok `event_item` stories
- **Latest News**: Policy updates through Storyblok `news_item` content management
- **Country-Specific Content**: USA/India content with automatic fallback system
- **Professional Tabbed Interface**: Modern UI with Storyblok-powered content

### 🤖 **AI-Powered Features**
- **Climate Mentor**: Conversational AI for personalized climate advice
- **Vision Scanner**: Real-time carbon footprint analysis from product images
- **Goal Tracking**: Environmental impact measurement and progress tracking
- **AI Translation Service**: Google Gemini-powered multilingual support for 8+ languages
- **Smart Content Delivery**: AI-enhanced content recommendations based on location

## 🏆 **Project Highlights**

### Innovation Achievements
- **Complete CMS Integration**: 19+ Storyblok stories across 5 content types
- **Multilingual Excellence**: 8+ languages with AI-powered translation
- **Accessibility First**: Comprehensive screen reader and keyboard support
- **Professional UI**: Modern design with shadcn/ui components
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Next.js 14 with React Server Components

### Technical Excellence
- **Scalable Architecture**: Easy to add new countries and features
- **Error Handling**: Graceful fallbacks and user feedback
- **Content Management**: Dynamic resource loading from Storyblok
- **Real-time Features**: Live language switching and content updates
- **Mobile Optimized**: Responsive design with proper touch targets

## 🙏 **Acknowledgments**

- **Storyblok** for powerful headless CMS capabilities
- **Google Gemini** for intelligent AI translation services
- **shadcn/ui** for beautiful, accessible component library
- **Next.js** team for the exceptional React framework
- **Tailwind CSS** for utility-first styling approach

---

**Built with ❤️ for climate action, accessibility, and global impact**

## 🚀 **Production Ready**

### Deployment Options
**Vercel (Recommended)**
1. Push to GitHub repository
2. Connect to Vercel dashboard
3. Add environment variables
4. Automatic deployments on push

**Other Platforms**
- **Netlify**: Full Next.js support
- **Railway**: Container-based deployment
- **AWS Amplify**: Serverless deployment
- **Self-hosted**: Docker support available

### Production Features
- **Error Boundaries**: Graceful error handling
- **Loading States**: Professional loading animations
- **SEO Optimized**: Meta tags and structured data
- **Performance Monitoring**: Built-in analytics ready
- **Security**: Environment variable protection

## 🔧 **Development & Architecture**

### Available Scripts
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production (optimized)
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Performance Optimizations
- **Next.js 14**: React Server Components for optimal performance
- **Static Generation**: Pre-rendered pages where possible
- **Image Optimization**: Next.js Image component with proper loading
- **Code Splitting**: Automatic route-based code splitting
- **Caching Strategy**: Efficient Storyblok content caching

### Type Safety
- **Full TypeScript**: Complete type coverage across the application
- **Storyblok Types**: Custom interfaces for all content types
- **API Type Safety**: Typed responses from all external services
- **Component Props**: Strict typing for all React components

## 📊 **Storyblok CMS Integration**

### Complete Content Management System
```
📁 Storyblok Space (19+ Stories)
├── 🌍 Dynamic Resources (10 endpoints)
│   ├── resources/usa/drought-crops
│   ├── resources/usa/water-conservation
│   ├── resources/usa/solar-optimizer
│   ├── resources/usa/habitat-protection
│   ├── resources/usa/farm-equipment
│   ├── resources/india/drought-crops
│   ├── resources/india/water-conservation
│   ├── resources/india/solar-optimizer
│   ├── resources/india/habitat-protection
│   └── resources/india/farm-equipment
├── 🎨 Location-Based Theming (2 endpoints)
│   ├── themes/usa (custom backgrounds & content)
│   └── themes/india (localized homepage themes)
└── 👥 Community Management (6 endpoints)
    ├── community-hub/usa/resource-updates
    ├── community-hub/india/resource-updates
    ├── events-news/usa/environmental-events/
    ├── events-news/usa/latest-news/
    ├── events-news/india/environmental-events/
    └── events-news/india/latest-news/
```

### Advanced Content Types
- **resource_section**: Structured climate resource data with categories and items
- **country_theme**: Dynamic homepage theming with custom backgrounds and CTAs
- **community_update**: Expert agricultural insights with author attribution
- **event_item**: Environmental events with image support and location data
- **news_item**: Policy updates and environmental news with categorization

### Content Management Features
- **Dynamic Resource Loading**: All 5 climate features load from Storyblok
- **Country-Specific Content**: Automatic content switching based on location
- **Fallback System**: Seamless experience for unsupported regions
- **Image Management**: Event images with proper alt text for accessibility
- **Collection-Based API**: Efficient content fetching with proper error handling
