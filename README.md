# Tournament Draw & Championship Management System

This project consists of two applications sharing a common database:

1. **Next.js Web App** - Tournament draw application for creating groups
2. **React Native Mobile App** - Championship management for match results and standings

## Features

### Web Application (Next.js)

- Interactive tournament draw interface with Arabic RTL support
- Visual team assignment with animations
- Automatic database saving of draw results
- Group creation and team assignments

### Mobile Application (React Native)

- View tournament groups
- Input match results manually
- Automatic ranking calculations
- Real-time standings updates
- Next match generation

## Database Schema

The system uses a shared SQLite database with the following entities:

- **Tournaments** - Tournament information and status
- **Teams** - Team data with pot assignments
- **Groups** - Group configurations
- **Matches** - Match scheduling and results

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (for React Native development)

### 1. Setup the Next.js Web Application

```bash
# Navigate to the main project directory
cd tournament-draw

# Install dependencies
npm install

# Set up the database
npx prisma migrate dev --name init
npx prisma generate

# Start the development server
npm run dev
```

The web application will be available at `http://localhost:3000`

### 2. Setup the React Native Mobile Application

```bash
# Navigate to the mobile app directory
cd championship-app

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

### 3. Database Configuration

The database is automatically created using SQLite. The file `dev.db` will be created in the `prisma` directory.

For production with MySQL, update the `.env` file:

```env
DATABASE_URL="mysql://username:password@localhost:3306/tournament_db"
```

Then update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

## Usage Workflow

1. **Create Tournament Draw** (Web App):

   - Open the web application
   - Click "ابدأ القرعة" (Start Draw)
   - Use "سحب فريق" (Draw Team) to assign teams to groups
   - The draw is automatically saved to the database

2. **Manage Championship** (Mobile App):
   - Open the mobile application
   - View groups in the "المجموعات" (Groups) tab
   - Check scheduled matches in "المباريات" (Matches) tab
   - Tap on matches to input results
   - View updated standings in "الترتيب" (Standings) tab

## API Endpoints

### Tournaments

- `GET /api/tournaments` - Get all tournaments
- `POST /api/tournaments` - Create new tournament
- `GET /api/tournaments/[id]` - Get specific tournament
- `POST /api/tournaments/[id]/complete-draw` - Save draw results

### Matches

- `GET /api/matches` - Get all matches
- `PUT /api/matches/[id]` - Update match result

### Groups

- `GET /api/groups/[id]/standings` - Get group standings

## Key Features

### Automatic Ranking System

The system automatically calculates:

- Points (3 for win, 1 for draw, 0 for loss)
- Goal difference
- Goals for and against
- Match statistics

### Real-time Updates

- Match results update group standings immediately
- Rankings are recalculated after each match
- Next matches are generated based on tournament format

### Arabic RTL Support

Both applications support:

- Right-to-left layout
- Arabic text rendering
- Culturally appropriate UI patterns

## Project Structure

```
tournament-draw/
├── src/                          # Next.js web app
│   ├── app/api/                  # API routes
│   ├── components/               # React components
│   ├── lib/                      # Utilities and database client
├── championship-app/             # React Native mobile app
│   ├── src/
│   │   ├── navigation/           # Navigation setup
│   │   ├── screens/              # App screens
│   │   └── services/             # API services
├── prisma/                       # Database schema and migrations
├── .env                          # Environment variables
└── README.md                     # This file
```

## Development Notes

- The mobile app connects to the web app's API at `http://localhost:3000`
- For production, update the API base URL in `championship-app/src/services/api.ts`
- Database migrations are handled automatically by Prisma
- Both apps use TypeScript for type safety

## Troubleshooting

### Database Issues

- Ensure the database file has proper permissions
- Run `npx prisma migrate reset` to reset the database
- Check that the DATABASE_URL is correctly configured

### Mobile App Connection

- Ensure the Next.js server is running on port 3000
- Update the API base URL if using a different port
- Check network connectivity between mobile device and development server

### Arabic Text Display

- Ensure proper font support for Arabic text
- Verify RTL layout is working correctly
- Check that text direction is set properly in styles
