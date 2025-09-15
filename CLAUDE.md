# TurkeyBowl Static Site - Claude Code Assistant Guide

## Project Overview
TurkeyBowl Static is a lightweight, client-side web application for managing an annual flag football event. This version replaces the PHP/SQLite backend with static HTML/CSS/JavaScript and hardcoded data files for easy hosting and deployment.

## Architecture
- **Static site**: Pure HTML, CSS, and JavaScript (no server required)
- **Data storage**: JavaScript files with hardcoded arrays and objects
- **Admin mode**: Client-side password-protected editing with localStorage persistence
- **Design**: Clean, minimalist, mobile-responsive inspired by retro Madden Football Video Games (Madden 2003-2005 on the Xbox)

### **File Organization**
1. **`index.html`** - Main application entry point and structure
   - Single-page application with section-based navigation
   - Includes all CSS and JavaScript references
   - Contains HTML structure for all pages

2. **`styles.css`** - Complete retro Madden theme styling
   - Metallic effects, shadows, and gradients
   - Mobile-responsive design
   - Admin interface styling
   - Navigation and card components

3. **`app.js`** - Main application logic and navigation
   - Page routing and section management
   - Admin mode toggle and authentication
   - Form handling and data manipulation
   - Event listeners and UI interactions

4. **`data/`** - Directory containing all hardcoded data files
   - `players.js` - Player roster data
   - `teams.js` - Team information and rosters
   - `history.js` - Championships, awards, and records
   - `settings.js` - Event settings and configuration

5. **`admin.js`** - Admin functionality and data editing
   - CRUD operations for all data types
   - Form generation and validation
   - Data persistence to localStorage
   - Admin interface management

## Data Structure

### **data/players.js**
```javascript
const playersData = [
    {
        id: 1,
        name: "John Smith",
        nickname: "Johnny",
        position: "QB",
        bio: "Veteran quarterback with 5 years experience",
        photoPath: "images/players/john-smith.jpg",
        yearsPlayed: 5,
        currentYear: true
    },
    // ... more players
];
```

### **data/teams.js**
```javascript
const teamsData = [
    {
        id: 1,
        name: "The Turkeys",
        captainId: 1,
        logoPath: "images/teams/turkeys-logo.png",
        year: 2025,
        players: [1, 3, 5, 7] // Player IDs
    },
    // ... more teams
];
```

### **data/history.js**
```javascript
const historyData = {
    championships: [
        {
            id: 1,
            year: 2024,
            teamName: "The Gobblers",
            winner: true
        }
    ],
    awards: [
        {
            id: 1,
            year: 2024,
            awardName: "MVP",
            playerName: "John Smith"
        }
    ],
    records: [
        {
            id: 1,
            year: 2024,
            recordName: "Most Touchdowns",
            recordValue: "12",
            playerName: "Mike Johnson"
        }
    ]
};
```

### **data/settings.js**
```javascript
const eventSettings = {
    eventDate: "2025-11-27T10:00",
    eventLocation: "TBD - Thanksgiving Morning Field",
    registrationDeadline: "2025-11-20T23:59",
    currentYear: 2025,
    siteName: "EG TURKEY BOWL",
    title: "Turkey Bowl 2025",
    adminUsername: "kpfister44",
    adminPassword: "KeP@01241992computer"
};
```

## Key Features
1. **Public pages**: Homepage with countdown, Hall of Fame/History, Roster, Teams
2. **Admin mode**: Client-side editing with password protection
3. **Data persistence**: Changes saved to localStorage and can export/import
4. **Responsive design**: Mobile-first with retro Madden styling
5. **No server required**: Can be hosted on any static file server

## Development Guidelines

### **File Structure**
```
turkeybowl-static/
├── index.html
├── styles.css
├── app.js
├── admin.js
├── data/
│   ├── players.js
│   ├── teams.js
│   ├── history.js
│   └── settings.js
├── images/
│   ├── players/
│   ├── teams/
│   └── logos/
└── README.md
```

### **Admin Mode Implementation**
- **Activation**: Type "kpfister44" anywhere on the page to enter admin mode
- **Password protection**: "KeP@01241992computer" - Simple client-side authentication
- **Visual indicator**: Admin bar appears at top when active
- **Inline editing**: Click to edit functionality for all data
- **Data persistence**: Changes saved to localStorage
- **Export/Import**: JSON download/upload for data backup

### **Data Management**
- **Initial load**: Data loaded from .js files
- **Runtime changes**: Stored in localStorage
- **Persistence**: Admin can export modified data as JSON
- **Reset function**: Admin can restore original hardcoded data

### **Navigation System**
- **Single-page app**: All content in sections, JavaScript handles routing
- **Hash routing**: Use URL fragments (#home, #history, #roster, #teams)
- **Smooth transitions**: CSS transitions between sections
- **Mobile navigation**: Hamburger menu for mobile devices

## Admin Interface Features

### **Data Management**
- **Players**: Add, edit, delete players with all fields
- **Teams**: Create teams, assign captains, manage rosters
- **History**: Manage championships, awards, and records
- **Settings**: Update event details and site configuration

### **Admin Functions**
```javascript
// Example admin functions to implement
function addPlayer(playerData) { /* Add to playersData array */ }
function editPlayer(id, updatedData) { /* Update player in array */ }
function deletePlayer(id) { /* Remove from array and teams */ }
function createTeam(teamData) { /* Add new team */ }
function addPlayerToTeam(teamId, playerId) { /* Update team roster */ }
function exportData() { /* Download JSON of all data */ }
function importData(jsonFile) { /* Upload and restore data */ }
```

### **Admin UI Components**
- **Admin bar**: Fixed top bar when in admin mode
- **Inline editors**: Click-to-edit for text fields
- **Modal forms**: For complex additions (players, teams)
- **Drag-and-drop**: For team management (optional enhancement)
- **Confirmation dialogs**: For delete operations

## Styling Guidelines

### **Retro Madden Theme (2003-2005)**
- **Colors**: Navy blue (#1a2332), bright orange (#ff6600), metallic silver (#c0c0c0), gold (#ffd700)
- **Effects**: Metallic gradients, drop shadows, 3D button effects
- **Typography**: Bold headers with text shadows, clean sans-serif body text
- **Navigation**: 3D metallic buttons with hover effects
- **Cards**: Enhanced shadows and metallic borders

### **CSS Architecture**
```css
/* Base styles and variables */
:root {
    --navy-blue: #1a2332;
    --bright-orange: #ff6600;
    --metallic-silver: #c0c0c0;
    --gold: #ffd700;
}

/* Component styles */
.nav-button { /* 3D metallic navigation */ }
.card { /* Content cards with shadows */ }
.admin-bar { /* Admin mode indicator */ }
.modal { /* Admin edit modals */ }
```

## JavaScript Architecture

### **Main App Structure**
```javascript
// App initialization
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupNavigation();
    setupAdminMode();
    renderCurrentPage();
});

// Core functions
function loadData() { /* Load from data files and localStorage */ }
function renderPage(pageName) { /* Display specific section */ }
function setupAdminMode() { /* Admin keystroke listener */ }
```

### **Data Persistence**
```javascript
// Save to localStorage
function saveToLocalStorage(dataType, data) {
    localStorage.setItem(`turkeybowl_${dataType}`, JSON.stringify(data));
}

// Load from localStorage with fallback
function loadFromStorage(dataType, defaultData) {
    const stored = localStorage.getItem(`turkeybowl_${dataType}`);
    return stored ? JSON.parse(stored) : defaultData;
}
```

## Testing Checklist

### **Core Functionality**
- [x] All pages load and display correctly
- [x] Navigation works between all sections
- [x] Mobile responsive design functions properly
- [x] Data displays correctly from hardcoded files

### **Admin Mode**
- [x] Admin activation (typing "kpfister44") works
- [x] Admin bar appears and functions correctly
- [x] All CRUD operations work for each data type
- [x] Changes persist after page refresh
- [x] Export/import functionality works
- [x] Reset to default data works

### **Data Management**
- [x] Player CRUD operations
- [x] Team creation and roster management
- [x] History/awards management
- [x] Settings updates
- [x] localStorage persistence

### **UI/UX**
- [x] Retro Madden styling consistent across all pages
- [x] Admin interface styling matches theme
- [x] Mobile navigation works properly
- [x] Form validation and error handling
- [x] Loading states and transitions

## Deployment
- **Static hosting**: Can be deployed to GitHub Pages, Netlify, Vercel, or any web server
- **No build process**: Direct deployment of files
- **CDN friendly**: All assets are static files
- **Domain ready**: Easy to configure custom domain

## Development Commands
- **Local server**: `python -m http.server 8000` or any static file server
- **No dependencies**: Pure HTML/CSS/JavaScript
- **No build process**: Edit and refresh to see changes

## Migration from PHP Version
- **Data export**: Extract data from SQLite database to JSON
- **Image assets**: Copy player photos and team logos
- **Styling**: Port retro Madden CSS from PHP version
- **Functionality**: Recreate admin features in client-side JavaScript

## Security Considerations
- **Client-side only**: No server-side vulnerabilities
- **Admin password**: Simple protection (can be enhanced)
- **Data exposure**: All data visible in source (acceptable for public event)
- **XSS prevention**: Sanitize any user inputs in admin mode

## Future Enhancements
- **Progressive Web App**: Add service worker for offline functionality
- **Enhanced admin**: More sophisticated authentication
- **Data sync**: Optional cloud storage integration
- **Analytics**: Track page views and engagement
- **Social sharing**: Share team rosters and results

## Implementation Status

### **✅ Fully Implemented Features**

**Public Website:**
- Retro Madden-themed design with metallic effects and 3D buttons
- Responsive navigation with mobile hamburger menu
- Homepage with live countdown timer to Thanksgiving 2025
- Player roster with 12 sample players (Player 1-12)
- Teams section with 2 sample teams (The Turkeys, The Gobblers)
- Hall of Fame with championships, awards, and records history
- Hash-based routing (#home, #roster, #teams, #history)

**Admin System:**
- Type "kpfister44" anywhere → Enter password → Admin mode activated
- Orange admin bar appears at top when active
- Add buttons for players, teams, championships, awards, records
- Inline editing for all content (click to edit)
- Position dropdown selector for players
- Team roster management with player selection
- Delete functionality for all content types
- Export/Import all data as JSON files
- Reset to default data functionality
- All changes persist in localStorage

**Technical Features:**
- Pure client-side JavaScript (no server required)
- Mobile-responsive design
- localStorage data persistence
- Modal forms for complex data entry
- Form validation and error handling
- Smooth page transitions

### **🎯 Ready for Use**
- Drag `index.html` into Chrome browser to run
- Add your photos to `images/` directories
- All admin functionality is fully operational
- Data survives page refreshes and browser sessions

## Important Notes
- Keep admin password simple but configurable
- Maintain compatibility with original PHP version's data structure
- Ensure all original functionality is preserved
- Focus on ease of deployment and maintenance
- Document any breaking changes from PHP version