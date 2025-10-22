# EG Turkey Bowl

A retro Madden-themed static website for managing an annual Thanksgiving flag football event. Built with pure vanilla JavaScript - no frameworks, no build process, no server required.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://kpfister44.github.io/egturkeybowl)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## About This Project

The EG Turkey Bowl is an annual Thanksgiving morning tradition. This website serves as the digital hub for player registration, team rosters, game schedules, and historical records. The retro Madden (2003-2005) aesthetic pays homage to classic Xbox football games that inspired many turkey bowl players.

**Key Design Decision:** This is a purely client-side application to enable free hosting on GitHub Pages and eliminate server maintenance costs.

## Screenshots

> Coming soon - Screenshots of the homepage, roster page, teams section, and Hall of Fame

## Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling:** Custom CSS with Tailwind utilities for responsive typography
- **Data:** Client-side JSON with localStorage persistence
- **Routing:** Hash-based SPA navigation
- **Deployment:** GitHub Pages (static hosting)

## Features

### Public Website
- **Retro Madden Design** - Metallic effects, 3D buttons, nostalgic color scheme
- **Live Countdown Timer** - Real-time countdown to Thanksgiving game day
- **Player Roster** - Detailed player profiles with positions and stats
- **Team Management** - View team rosters, captains, and records
- **Hall of Fame** - Historical championships, awards, and records
- **Fully Responsive** - Mobile-first design with smooth animations

### Admin System
- **Secure Admin Mode** - Password-protected content management
- **Full CRUD Operations** - Manage players, teams, history, and settings
- **Inline Editing** - Click-to-edit functionality throughout
- **Data Persistence** - Changes saved to browser localStorage
- **Import/Export** - Backup and restore data via JSON files

## Quick Start

### View the Site
Visit the live demo: [https://kpfister44.github.io/egturkeybowl](https://kpfister44.github.io/egturkeybowl)

### Run Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/kpfister44/egturkeybowl.git
   cd egturkeybowl
   ```

2. Open `index.html` in your browser:
   ```bash
   # Option 1: Direct open
   open index.html  # macOS
   start index.html  # Windows

   # Option 2: Local server (recommended)
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

3. That's it! No npm install, no build process.

## Project Structure

```
egturkeybowl/
├── index.html          # Main application entry
├── styles.css          # Retro Madden theme
├── app.js              # Core navigation & rendering
├── admin.js            # Admin CRUD operations
├── data/
│   ├── players.js      # Player roster
│   ├── teams.js        # Team information
│   ├── history.js      # Championships & records
│   └── settings.js     # Event configuration
└── images/             # Player photos & logos
    ├── players/
    ├── teams/
    └── logos/
```

## Admin Access

For administrators managing the Turkey Bowl:
1. Type the admin username anywhere on the page
2. Enter the admin password when prompted
3. Admin toolbar will appear at the top
4. Click any content to edit inline, or use "Add" buttons

Contact the repository owner for admin credentials.

## Deployment

This site is designed for easy deployment to any static host:

### GitHub Pages
1. Push to GitHub
2. Go to Settings → Pages
3. Select branch and save
4. Site live at `username.github.io/repository-name`

### Other Options
- **Netlify:** Drag and drop the folder
- **Vercel:** Import the GitHub repository
- **Any web host:** Upload files via FTP

## Customization

### Update Event Details
Edit `data/settings.js` to change:
- Event date and location
- Site title and branding
- Registration deadlines

### Add Player Photos
1. Add images to `images/players/`
2. Update photo paths in admin mode or `data/players.js`

### Modify Theme
All styling is in `styles.css` with CSS variables at the top for easy customization:
```css
:root {
    --navy-blue: #1a2332;
    --bright-orange: #ff6600;
    --metallic-silver: #c0c0c0;
    --gold: #ffd700;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

No build tools required! Edit files and refresh:

```bash
# Run local development server
python -m http.server 8000

# Or use Node.js
npx http-server
```

### Data Management
- **Initial load:** Data from `.js` files in `/data`
- **Runtime changes:** Stored in `localStorage`
- **Export:** Download JSON backup via admin panel
- **Reset:** Restore original data from files

## Design Philosophy

This project follows research-backed visual design principles:
- Near-black/near-white instead of pure colors
- Mathematical 8px spacing scale
- 2:1 button padding ratios
- 2x blur:distance shadow ratios
- Minimum 16px body text for accessibility

See `DESIGN_SYSTEM.md` for complete styling guidelines.

## Contributing

This is a personal project for a private annual event. Issues and suggestions are welcome, but pull requests may not be accepted as this serves a specific use case.

## License

MIT License - See [LICENSE](LICENSE) file for details

## Acknowledgments

- Inspired by Xbox Madden 2003-2005 UI design
- Built for the annual EG Turkey Bowl flag football game
- Design principles from Anthony Hobday's visual design research

---

**Questions?** Open an issue or contact [@kpfister44](https://github.com/kpfister44)
