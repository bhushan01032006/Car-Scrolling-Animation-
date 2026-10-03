# 🏎️ Scroll-Driven Hero Section Animation — McLaren 720S Experience

A high-performance, scroll-driven interactive hero section animation inspired by the [Car Scroll Animation](https://paraschaturvedi.github.io/car-scroll-animation) reference. Built with **Next.js**, **React**, **Tailwind CSS**, and **GSAP ScrollTrigger**, alongside a **Standalone Vanilla HTML/CSS/JS** version.

---

## ✨ Features & Functional Requirements Mapping

### 1. Hero Section Layout (Above the Fold)
- **First Screen Experience**: The initial viewport occupies a full `100vh` presentation prior to track scroll.
- **Letter-Spaced Headline**: Prominently displays:
  ```
  W  E  L  C  O  M  E     I  T  Z  F  I  Z  Z
  ```
  with dynamic character spacing, hover micro-interactions, and cinematic typography.
- **Impact Metrics & Statistics**: Directly beneath the headline, four high-impact statistical cards are displayed:
  - **58%** — Pick-Up Point Adoption (*Surge in automated locker & hub routing*)
  - **23%** — Inbound Call Reduction (*Decrease in manual support resolution calls*)
  - **27%** — Route Velocity Gain (*Faster localized dispatch throughput*)
  - **40%** — Operational Efficiency (*Overall SLA and delivery gain*)

### 2. Initial Load Animation
- **Staggered Headline Reveal**: On initial page load, a custom GSAP timeline animates each letter of the headline with smooth 3D translation (`rotateX`, `y`, `opacity`, `scale`).
- **Smooth Number Counter Count-Up**: Metrics animate smoothly from `0%` to their target percentages with custom ease curves (`power2.out`).
- **Non-Abrupt, Premium Flow**: Subtitles, badges, and callout prompts cascade into view with coordinated delays.

### 3. Scroll-Based Animation (Core Feature)
- **Pinned Kinetic Runway**: As the user scrolls into the track, the section pins seamlessly (`pin: true`) across a `320vh` distance, offering a buttery-smooth scrub distance.
- **Fluid Car Motion**: The McLaren 720S visual element glides from the left edge of the road across to the right edge, strictly tied to scroll progress with `scrub: 1.1` inertia.
- **Dynamic Luminous Tire Trail**: A vibrant neon green tire trail (`#45db7d` to `#def54f`) dynamically expands directly behind the McLaren's rear wheels, tracking the car's exact coordinate.
- **Interactive Letter Lighting**: As the McLaren passes each letter of `W E L C O M E   I T Z F I Z Z` on the road, the letter dynamically illuminates from subtle charcoal into brilliant white with an electric lime glow.
- **Staggered Floating Impact Cards**: Four glassmorphism cards float in above and below the runway at distinct scroll milestones (15%, 35%, 55%, 75%), entering with subtle 3D scale and backdrop blur.
- **Checkered Finish Line & Confetti**: Crossing the finish line at 100% scroll triggers a burst of celebratory particle confetti.

### 4. Interactive Innovations
- **Live Telemetry HUD**: A fixed bottom-right cockpit HUD displays:
  - **Velocity**: Real-time speedometer scaling from `0` to `341 km/h` (McLaren 720S top speed).
  - **Transmission**: Dynamic gear calculation (`P`, `1` through `7`).
  - **Tachometer**: Live RPM gauge (`900` to `8200 RPM`) with colored gradient meter.
  - **Scroll Progress**: Percentage indicator.
- **Synthetic V8 Engine Sound (Web Audio API)**: Toggleable audio that generates a throaty twin-turbo V8 purr in realtime without external audio files. The engine revs up in pitch and volume with scroll velocity.
- **Xenon Headlight Beams**: Dual projection light cones extending forward from the supercar onto the asphalt.
- **Auto-Cruise Test Drive**: One-click automated cruise that executes a smooth, cinematic scroll through the entire experience.

### 5. Motion & Performance Guidelines
- **Compositor-Only Transforms**: All animations leverage GPU-accelerated `translate3d`, `scale`, and `opacity`.
- **Zero Layout Reflows**: Avoids dimension recalculations (`width`, `height`, `top`, `left`) during scroll events.
- **SSR & Memory Safety**: Includes proper GSAP context cleanup (`ctx.revert()`) to prevent memory leaks and duplicate triggers.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 14 (App Router)** | Framework & Server-Side Rendering |
| **React 18** | Component Architecture & State Management |
| **GSAP 3.12** | Timeline sequencing & ScrollTrigger scrub engine |
| **Tailwind CSS** | Styling, Glassmorphism, Responsive Grid |
| **Web Audio API** | Real-time synthetic V8 engine sound synthesis |
| **Lucide React** | Sleek telemetry & UI icons |
| **HTML5 / Vanilla JS** | Standalone alternative (`index.html`) |

---

## 🚀 How to Run the Project

### Option A: Next.js Development Server (Recommended)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in any modern browser.

3. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

### Option B: Standalone Zero-Build Vanilla HTML/CSS/JS

For instant evaluation without Node.js or build tools:
- Simply double-click [`index.html`](./index.html) or open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari!
- All scripts (Tailwind CDN, GSAP, Lucide, Canvas Confetti) load from secure CDNs.

---

## 📂 Project Structure

```
├── public/
│   └── car.png                         # McLaren 720S top view asset
├── src/
│   ├── app/
│   │   ├── globals.css                 # Custom CSS tokens & road styling
│   │   ├── layout.tsx                  # Root layout & Google Fonts
│   │   └── page.tsx                    # Page controller & telemetry state
│   ├── components/
│   │   ├── CarHero.tsx                 # Core hero & scroll-driven runway
│   │   ├── ScrollHUD.tsx               # Fixed telemetry & speedometer HUD
│   │   ├── SpecsSection.tsx            # Supercar specs & engineering review
│   │   └── Footer.tsx                  # Footer & tech stack overview
│   └── utils/
│       └── engineAudio.ts              # Web Audio API V8 synthesizer
├── index.html                          # Complete standalone Vanilla version
├── package.json                        # Dependencies & build scripts
├── tailwind.config.js                  # Custom theme & neon accents
├── tsconfig.json                       # TypeScript compiler settings
└── README.md                           # Documentation
```

---

*Designed & developed for the Scroll-Driven Hero Section Animation Assignment.*
