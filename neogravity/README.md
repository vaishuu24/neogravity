# NeoGravity ⚡

![NeoGravity Badge](https://img.shields.io/badge/Status-Production%20Ready-00f5ff?style=for-the-badge)

NeoGravity is a futuristic, anti-gravity themed interactive platform built as a college final-year project. It features dynamic 3D simulations, interactive web games, AI-generated sci-fi concepts, and a sleek cyberpunk/dark space visual aesthetic.

## Features

- **Interactive 3D Simulator**: Built with React Three Fiber, manipulate physics, gravity, and object repulsion.
- **Zero-G Web Game**: A fully playable canvas game involving inertia-based movement in a zero-gravity environment.
- **AI Gravity Lab**: Generate theoretical sci-fi inventions using a mock AI engine, and save them locally.
- **Physics Engine**: Educational pages explaining gravitational concepts with interactive formula calculators.
- **Stunning Aesthetics**: Seamless page transitions, glowing neons, glassmorphism, and a star-particle background.

## Tech Stack

- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS (Utility-first with dark space sci-fi theme)
- **Animations**: Framer Motion
- **3D Graphics**: Three.js & React Three Fiber (@react-three/drei)
- **State Storage**: LocalStorage hooks

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/neogravity.git
   cd neogravity
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env.local` file in the root if utilizing an external AI API later:
```env
VITE_OPENAI_API_KEY=your_api_key_here
```

## Deployment on Vercel

1. Push your code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com/) and click "Add New Project".
3. Import your GitHub repository.
4. Vercel will automatically detect Vite. Keep default settings.
5. Add any environment variables in the setup dashboard.
6. Click **Deploy**.

## Command Crew (Team)

- **Alex Vance** - Lead Architect
- **Sarah Jin** - Physics Engine
- **Dr. R. Cole** - AI Integrations
- **Max Thorne** - UI/UX Design

## License

This project is licensed under the MIT License.
