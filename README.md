# The Krant - News Website

A modern, responsive news website that dynamically loads content from Google Docs.

## Features

- **Dynamic Content Loading**: Fetches news content from Google Docs
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Pagination**: Organized content display with page navigation
- **Expandable Articles**: Click to read full articles in a popup modal
- **Smooth Navigation**: Smooth scrolling between sections
- **Firebase Ready**: Configured for Firebase hosting

## Technologies Used

- HTML5
- CSS3 (with modern flexbox and grid layouts)
- Vanilla JavaScript (ES6+)
- Google Docs API integration
- Firebase hosting configuration

## Project Structure

```
krant/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   ├── index.html
│   ├── 404.html
│   ├── favicon.ico
│   ├── icon.png
│   ├── icon.svg
│   ├── robots.txt
│   └── site.webmanifest
├── firebase.json
├── .firebaserc
└── .gitignore
```

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd krant
   ```

2. Open `index.html` in your browser or serve it using a local server.

3. To deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Configuration

To use your own Google Doc as a content source:

1. Open `public/js/app.js`
2. Replace the `googleDocId` in the NewsApp constructor with your document ID
3. Ensure your Google Doc is publicly accessible

## How It Works

The application fetches content from a Google Doc, parses it into sections, and displays them as news articles with pagination. Each section in the Google Doc becomes a separate news article on the website.

## License

This project is open source and available under the [MIT License](LICENSE).