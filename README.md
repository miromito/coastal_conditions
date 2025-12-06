# 🐟 Spearfishing Conditions App

A modern web application that displays real-time ocean and weather conditions optimized for spearfishing. Shows wave heights, wind conditions, visibility, and provides an intelligent rating system to help you decide if it's a good day to dive.

![Spearfishing App](https://img.shields.io/badge/React-18.x-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 🌊 **Real-time Marine Data** - Wave height, swell, period, and direction
- 🌤️ **Weather Information** - Temperature, humidity, cloud cover, and visibility
- 💨 **Wind Analysis** - Speed and direction with safety indicators
- 🎯 **Spearfishing Rating** - Smart scoring system (0-100) based on conditions
- 📊 **3-Day Forecast** - Plan your diving trips ahead
- 🔄 **Automatic Fallback** - Demo data if API is unavailable
- 📱 **Responsive Design** - Works on desktop and mobile

## Tech Stack

- React 18
- Lucide React Icons
- Tailwind CSS
- Open-Meteo APIs (Marine & Weather)

## Prerequisites

- Docker
- Docker Compose
- Git

## Quick Start with Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/spearfishing-conditions.git
cd spearfishing-conditions
```

### 2. Start the Application

```bash
docker-compose up -d
```

The application will be available at: **http://localhost:3000**

### 3. Stop the Application

```bash
docker-compose down
```

## Local Development (Ubuntu)

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/spearfishing-conditions.git
cd spearfishing-conditions

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at http://localhost:3000

### Build for Production

```bash
npm run build
```

The optimized build will be in the `build/` directory.

## Project Structure

```
spearfishing-conditions/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js              # Main React component
│   ├── index.js            # Entry point
│   └── index.css           # Tailwind styles
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile             # Docker build instructions
├── package.json           # Dependencies
└── README.md             # This file
```

## API Information

This app uses the free [Open-Meteo API](https://open-meteo.com/):
- **Marine API** - Wave heights, swell, and ocean conditions
- **Weather API** - Temperature, wind, cloud cover

No API key required! However, if the API is blocked by your network, the app automatically falls back to demo data for Alanya, Turkey.

## Configuration

### Changing Default Location

Edit `src/App.js` and modify the `MOCK_DATA` object or change the default location:

```javascript
const [location, setLocation] = useState('YourCity');
```

### Customizing Spearfishing Rating

Modify the `getSpearfishingConditions()` function in `src/App.js` to adjust scoring weights:

```javascript
if (waveHeight > 2.0) {
  score -= 40;  // Adjust penalty for high waves
}
```

## Docker Details

### Dockerfile Breakdown

- Uses Node 18 Alpine for minimal image size
- Multi-stage build for production optimization
- Nginx serves the static files
- Final image ~50MB

### Docker Compose Services

- **app**: Main React application
- **Port**: 3000 (configurable in docker-compose.yml)
- **Auto-restart**: enabled

## Troubleshooting

### API Not Loading

If you see "Failed to fetch" errors:

1. **Check Internet Connection** - APIs require internet access
2. **CORS Issues** - The app will automatically fall back to demo data
3. **Firewall/Network** - Your network may block the Open-Meteo APIs
4. **Use Demo Mode** - Search for "Alanya" to see sample data

### Docker Issues

```bash
# Check if Docker is running
sudo systemctl status docker

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Remove all containers and start fresh
docker-compose down -v
docker-compose up -d
```

### Port Already in Use

If port 3000 is taken, edit `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 8080 to any available port
```

## Popular Locations to Try

- Alanya, Turkey
- Bodrum, Turkey
- Antalya, Turkey
- Cyprus
- Marmaris, Turkey
- Malta
- Crete, Greece
- Sicily, Italy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for providing free weather and marine APIs
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Support

If you find this project helpful, please give it a ⭐️ on GitHub!

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/spearfishing-conditions](https://github.com/yourusername/spearfishing-conditions)

---

**Happy Spearfishing! 🎯🌊**