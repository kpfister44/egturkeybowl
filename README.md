# 🦃 Turkey Bowl Static Website

A retro Madden-themed static website for managing an annual flag football event. Built with pure HTML, CSS, and JavaScript - no server required!

## 🎮 Features

### Public Website
- **Retro Madden Design** - Inspired by Xbox Madden 2003-2005 with metallic effects and 3D buttons
- **Live Countdown** - Real-time countdown timer to Thanksgiving game day
- **Player Roster** - Detailed player cards with positions, bios, and stats
- **Team Management** - View team rosters and captains
- **Hall of Fame** - Championships, awards, and records history
- **Mobile Responsive** - Works perfectly on phones, tablets, and desktop

### Admin System
- **Secure Admin Mode** - Type `kpfister44` anywhere to activate
- **Full CRUD Operations** - Add, edit, and delete players, teams, and history
- **Inline Editing** - Click any text to edit it directly
- **Data Export/Import** - Backup and restore all data as JSON
- **Persistent Storage** - Changes saved to browser localStorage

## 🚀 Quick Start

1. **Download** or clone this repository
2. **Open** `index.html` in any web browser
3. **Navigate** using the metallic navigation buttons
4. **Admin Access**: Type `kpfister44` → Enter password when prompted

That's it! No installation, no server setup, no dependencies.

## 📁 Project Structure

```
TurkeyBowlStatic/
├── index.html          # Main application entry point
├── styles.css          # Retro Madden theme styling
├── app.js              # Core navigation and functionality
├── admin.js            # Admin CRUD operations
├── data/
│   ├── players.js      # Player roster data
│   ├── teams.js        # Team information
│   ├── history.js      # Championships & records
│   └── settings.js     # Event configuration
├── images/             # Player photos & team logos
│   ├── players/        # Drop player photos here
│   ├── teams/          # Drop team logos here
│   └── logos/          # Site logos
├── CLAUDE.md           # Detailed technical documentation
└── README.md           # This file
```

## 🔧 Admin Features

**Activation**: Type `kpfister44` anywhere on the page

**What You Can Do**:
- ✅ Add new players with positions, bios, and stats
- ✅ Create teams and manage rosters
- ✅ Edit any content by clicking on it
- ✅ Add championships, awards, and records
- ✅ Export all data as JSON backup
- ✅ Import data from JSON files
- ✅ Reset to default sample data

## 🎨 Customization

### Adding Photos
1. Drop player photos in `images/players/`
2. Drop team logos in `images/teams/`
3. Reference them in admin mode or data files

### Changing Event Details
- Edit dates, location, and settings in admin mode
- Or modify `data/settings.js` directly

### Styling
- All retro Madden styling is in `styles.css`
- CSS variables at the top for easy color changes
- Mobile-responsive breakpoints included

## 🌐 Deployment

**GitHub Pages**:
1. Push to GitHub repository
2. Go to Settings → Pages
3. Select main branch
4. Your site will be live at `username.github.io/TurkeyBowlStatic`

**Other Options**:
- Netlify: Drag & drop the folder
- Vercel: Connect GitHub repo
- Any web hosting: Upload all files

## 🛠️ Technical Details

- **Pure Static**: No server, database, or build process required
- **Client-Side**: All functionality runs in the browser
- **localStorage**: Data persists between sessions
- **Responsive**: Mobile-first design with hamburger menu
- **Hash Routing**: Clean URLs with `#home`, `#roster`, etc.

## 📋 Sample Data Included

- **12 Players** (Player 1-12) with various positions
- **2 Teams** (The Turkeys, The Gobblers)
- **Sample History** with championships, awards, and records
- **Thanksgiving 2025** event settings

## 🔒 Security Note

This is designed for hobby/personal use with public sports data. Admin credentials are stored client-side for convenience. Not suitable for sensitive data without additional security measures.

## 📚 Documentation

See `CLAUDE.md` for detailed technical documentation, data structures, and development guidelines.

## 🎯 Perfect For

- Annual turkey bowl events
- Fantasy football leagues
- Local sports tournaments
- Family game day organization
- Any event needing simple roster management

---

**Built with ❤️ and retro gaming nostalgia**

*Generated with [Claude Code](https://claude.ai/code)*