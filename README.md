# Dhruv Rana - Cybersecurity Portfolio

Professional portfolio website for SOC L1 Analyst and VAPT Fresher positions with advanced animations and interactions.

## 🚀 Live Demo
Open `index.html` directly in a browser, or serve locally:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 📁 Project Structure
```
portfolio/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling (dark/light theme, responsive, animations)
├── script.js       # Advanced interactions & animations
└── README.md       # This file
```

## ✨ Features

### Sections
- **Hero** - Particle system background, animated terminal demo, stats, social links
- **About** - Background, highlights, quick info cards with hover effects
- **Skills** - Categorized tags + animated proficiency bars with shimmer effect
- **Projects** - Filterable grid with 3D tilt hover, magnetic buttons
- **Education** - Timeline with animated markers
- **Certifications** - Current certs + pursuing with hover animations
- **Experience** - Academic labs, personal projects, CTF practice
- **Contact** - Form with validation + direct links

### Advanced Animations & Effects
| Feature | Description |
|---------|-------------|
| **Particle System** | Interactive background particles that react to mouse |
| **3D Card Tilt** | Project/skill cards tilt in 3D following cursor |
| **Magnetic Buttons** | Buttons attract cursor with physics-based movement |
| **Cursor Trail** | Glowing trail follows mouse (desktop only) |
| **Text Scramble** | Section titles scramble on hover |
| **Scroll Progress** | Top progress bar shows scroll position |
| **Terminal Typing** | Hero terminal types commands character-by-character |
| **Proficiency Bars** | Animated fill with shimmer gradient |
| **Intersection Observer** | Staggered scroll-reveal animations |
| **Theme Toggle** | Dark/Light mode with smooth transition |
| **Konami Code** | Secret easter egg (↑↑↓↓←→←→BA) |

### Technical Highlights
- **Zero dependencies** - Vanilla HTML/CSS/JS only (FontAwesome via CDN)
- **Dark/Light theme** - CSS custom properties, auto-detects system preference
- **Fully responsive** - Mobile-first, works on all screen sizes
- **Accessible** - Semantic HTML, ARIA labels, focus states, reduced motion support
- **Performant** - Throttled scroll handlers, RAF animations, cleanup on unload
- **SEO ready** - Meta tags, Open Graph, semantic structure

## 🛠️ Customization

### Update Personal Info
Edit `index.html`:
- Name, title, location in hero section
- About section content
- Education timeline
- Certifications
- Experience cards
- Contact details

### Add/Modify Projects
Edit `script.js` - `projectsData` array:
```javascript
{
    id: 13,
    title: "New Project",
    description: "Project description...",
    type: "security", // security | development | academic
    tech: ["Python", "Tool"],
    icon: "fa-icon-name",
    github: "https://github.com/...",
    live: "https://demo.com", // optional
    featured: true
}
```

### Colors & Theme
Edit CSS custom properties in `styles.css`:
```css
:root {
    --accent-primary: #00ffc8;    // Main brand color (teal)
    --accent-secondary: #00d4ff;  // Secondary (cyan)
    --accent-tertiary: #7c5cff;   // Tertiary (purple)
    // ... more variables
}
```

### Disable Specific Animations
In `script.js`, set flags at top:
```javascript
const reducedMotion = true; // Disables all motion
// Or individual features:
const enableParticles = false;
const enableCursorTrail = false;
const enable3DTilt = false;
```

## 📱 Browser Support
- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

## ⌨️ Keyboard Shortcuts
- `Tab` / `Shift+Tab` - Navigate focusable elements
- `Escape` - Close mobile menu
- `↑↑↓↓←→←→BA` - Activate Hacker Mode (Konami code)

## 📄 License
MIT License - Feel free to use as template for your own portfolio.

## 🤝 Connect
- **GitHub**: [@Dhruvranax](https://github.com/Dhruvranax)
- **LinkedIn**: [dhruv-rana-1b35782a1](https://www.linkedin.com/in/dhruv-rana-1b35782a1)
- **Email**: dhruvrana@example.com