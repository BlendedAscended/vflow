<<<<<<< HEAD
# Verbaflow LLC Website

A modern, responsive website built with Next.js, TypeScript, and Tailwind CSS, replicating the Webflow design for Verbaflow LLC - a business growth and AI automation company.

## 🚀 Live Demo

Visit the live website at: [http://localhost:3000](http://localhost:3000) (when running locally)

## 📋 Features

- **Fully Responsive Design**: Mobile-first approach with responsive breakpoints
- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Component Architecture**: Modular, reusable React components
- **Interactive Elements**: Collapsible FAQ section, mobile navigation menu
- **Contact Forms**: Functional contact and newsletter signup forms
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Performance Optimized**: Fast loading times and smooth animations

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page assembling all components
└── components/
    ├── Navigation.tsx       # Header navigation with mobile menu
    ├── HeroSection.tsx      # Main hero section with CTA
    ├── ServicesSection.tsx  # Services grid with feature cards
    ├── BusinessInfoSection.tsx # Business info with email signup
    ├── AIToolsSection.tsx   # AI tools showcase section
    ├── PricingSection.tsx   # Three-tier pricing plans
    ├── TestimonialsSection.tsx # Customer testimonials
    ├── FAQSection.tsx       # Collapsible FAQ section
    ├── ContactSection.tsx   # Contact form
    └── Footer.tsx           # Footer with navigation and social links
```

## 🎨 Design System

### Color Palette
- **Primary Green**: `#C8E6C9` (Light green background)
- **Secondary Green**: `#A5D6A7` (Button primary)
- **Accent Green**: `#8BC34A` (Button hover)
- **Black**: `#000000` (Text and dark backgrounds)
- **White**: `#FFFFFF` (Light backgrounds)
- **Gray**: Various shades for text and backgrounds

### Typography
- **Font Family**: Geist Sans (primary), system fonts (fallback)
- **Headings**: Bold, large sizes (3xl to 6xl)
- **Body Text**: Regular weight, readable line heights
- **Buttons**: Medium weight, proper padding

### Layout
- **Max Width**: 7xl (1280px) for content containers
- **Grid System**: CSS Grid and Flexbox for layouts
- **Spacing**: Consistent padding and margins using Tailwind scale
- **Breakpoints**: Mobile-first responsive design

## 🛠️ Technologies Used

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: Custom SVG icons
- **Fonts**: [Geist](https://vercel.com/font) font family
- **Development**: ESLint for code quality

## 📱 Components Overview

### Navigation
- Responsive navigation bar with mobile hamburger menu
- Logo with gradient background
- Dropdown indicators for services and support
- Call-to-action button

### Hero Section
- Two-column layout with content and image placeholder
- Primary headline with AI emphasis
- Dual call-to-action buttons
- Responsive grid system

### Services Section
- Dark background with four service cards
- Icon-based service representation
- Grid layout (2x2 on desktop, 1 column on mobile)
- Hover effects on cards

### Business Info Section
- Two-column layout with image and content
- Embedded email signup form
- Green accent background for form area

### AI Tools Section
- Alternating layout (content left, image right)
- Showcases AI-powered features
- Dual button layout

### Pricing Section
- Three-tier pricing cards
- Feature lists with checkmarks
- Consistent button styling
- Badge system for plan features

### Testimonials Section
- Customer testimonial cards
- Profile placeholders with names and titles
- Grid layout for testimonials

### FAQ Section
- Collapsible accordion-style questions
- Smooth animations for expand/collapse
- Dark background for contrast

### Contact Section
- Contact form with validation
- Two-column layout with description
- Form fields for name, email, and message

### Footer
- Company logo and navigation links
- Social media icons
- Copyright information
- Dark background

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vflow1.0
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 📦 Deployment

This project is ready for deployment on Vercel:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Deploy with zero configuration

For other platforms, build the project and deploy the `.next` folder.

## 🎯 Performance Optimizations

- **Image Optimization**: Next.js Image component for optimized loading
- **Code Splitting**: Automatic code splitting by Next.js
- **CSS Optimization**: Tailwind CSS purges unused styles
- **Font Loading**: Optimized font loading with next/font
- **Responsive Images**: Proper aspect ratios and responsive sizing

## 🔧 Customization

### Updating Colors
Modify the color palette in `globals.css` and component files:
```css
:root {
  --primary-green: #C8E6C9;
  --secondary-green: #A5D6A7;
  --accent-green: #8BC34A;
}
```

### Adding New Sections
1. Create a new component in `src/components/`
2. Import and add it to `src/app/page.tsx`
3. Follow the existing component structure

### Modifying Content
Update text, images, and links directly in the component files. All content is currently using placeholder text and can be easily customized.

## 🐛 Known Issues

- Image placeholders are used instead of actual images
- Contact form submissions need backend integration
- Social media links are placeholder URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support, please contact the development team or create an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
=======
# vflow
Verbaflow Website
>>>>>>> 6b57d2946091b697c1e5edeb195ef1ff8f84d16c
