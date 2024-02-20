<h1 align="center">
  GesturePresenter
  <img src="https://github.com/AnonymousAAArdvark/GesturePresenter/blob/main/frontend/src/assets/logo.png" width="40" height="40" alt="GesturePresenter Logo"/>
</h1>

![Build Passing](https://img.shields.io/badge/build-passing-brightgreen)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fgesturepresenter.com)
![Chrome Web Store Stars](https://img.shields.io/chrome-web-store/stars/pdfpddkehgjilojkjcekjbfkoleclkkb)

**Control Slides with just hand gestures!**

GesturePresenter enables users to control slide presentations through hand gestures, utilizing any device with web access and a camera. This project leverages Google's MediaPipe Hands for gesture recognition and consists of a three-part system: a Remote website, a Chrome extension, and a backend server.

## Key Components 
- **Remote Website** : Developed with ReactJS, this website uses your device's camera to recognize hand gestures for slide control. 
- **Chrome Extension** : Facilitates navigation through a Google Slides presentation by communicating with the Remote Website via WebSockets. 
- **Backend Server** : A Python3 Flask server that connects the Remote Website with the Chrome Extension, ensuring seamless interaction between the two.
## Quick Links 
- **Chrome Webstore** : https://chromewebstore.google.com/detail/gesture-presenter-remote/pdfpddkehgjilojkjcekjbfkoleclkkb
- **Gesture Remote Website** : https://gesturepresenter.com/
- **Backend Server on Heroku** : https://www.heroku.com
## Screenshots
<table>
  <tr>
    <td><img src="https://lh3.googleusercontent.com/o8aGS4zceshid4rtJhn4aU5qhKl5S4hkjMqN2HtFyYTzEXFmCAbAZcXKm0BjU16CAQiqUkE_uIO52Q2s5xQOenKEqQ=s1600-w1600-h1000" alt="Extension Screenshot" style="width: 100%; max-width: 600px;"/></td>
    <td><img src="https://lh3.googleusercontent.com/tvibZs0AAzKvE0B5t39gGUcsOga47C-Fnx2nnLiaERxSFPCQX-ZdPKBR1cKI8xSgaKqrwTCwE2guPvWZT1lvbWJJEA=s1280-w1280-h800" alt="Pairing Screen Screenshot" style="width: 100%; max-width: 600px;"/></td>
  </tr>
  <tr>
    <td><img src="https://lh3.googleusercontent.com/w4GUV-f_twURLcmYQqrENRvZ59GXFGGiW8wWsalwWW1Por54TbpX-o3Fwg8b1z6IJlwn8x20wTTsOkGTbCqsxlr0kw=s1600-w1600-h1000" alt="Demo Gesture Right" style="width: 100%; max-width: 600px;"/></td>
    <td><img src="https://lh3.googleusercontent.com/I6-zaEHLxCnGiUH7n6kwBQIZCJK7ZJdxBOJ7OVX1X7XAUGQGtNGDWVJMIUlS6-Z-hppxa5P0kVaQQ3EIH5_kBVOXPw=s1600-w1600-h1000" alt="Demo Gesture Right" style="width: 100%; max-width: 600px;"/></td>
  </tr>
</table>

## Getting Started
### Prerequisites 
- **Node.js and npm**: Required for setting up the frontend website. Download from [nodejs.org](https://nodejs.org/) , which includes npm. 
- **Python 3 and pip**: Needed for the backend server. Available for download at [python.org](https://python.org/) . 
- **Chromium Browser**: Necessary for installing and using the Chrome Extension.
### Installation Guide
#### Setting Up the Frontend Website 
1. **Clone the Repository** : Obtain the GesturePresenter codebase.

```bash
git clone https://github.com/anonymousaaardvark/gesture-presenter.git
cd GesturePresenter/frontend
``` 
2. **Install Dependencies** : Get all required libraries.

```bash
npm install
```
##### Development and Deployment 
- **Development Server** : `npm start` launches the app in development mode. 
- **Production Build** : `npm run build` compiles the app for production. 
- **GitHub Pages Deployment** : `npm run deploy` pushes the build to the `gh-pages` branch.
#### Setting Up the Backend Server 
1. **Navigate and Install** : Move to the backend directory and set up.

```bash
cd GesturePresenter/backend
pip install -r requirements.txt
``` 
2. **Launch the Server** : Start the Flask application with `python app.py`.
#### Installing the Chrome Extension 
1. **Prepare the Extension** : Switch to the chrome-extension directory and install dependencies.

```bash
cd GesturePresenter/chrome-extension
npm install
``` 
2. **Build and Load** : Compile the extension and add it to Chrome. 
- Build: `npm run build`
- Develop: `npm run watch` 
- Load in Chrome: Enable Developer Mode in `chrome://extensions/`, choose "Load unpacked", and select the build directory.
### Using GesturePresenter

After installation, navigate to a Google Slides presentation in Chrome, use the GesturePresenter website on another device for gesture recognition, and control your presentation seamlessly.
## Contributing

Contributions are welcome! To contribute:
1. Fork the repository. 
2. Create your feature branch: `git checkout -b feature/AmazingFeature`. 
3. Commit your changes: `git commit -am 'Add some AmazingFeature'`. 
4. Push to the branch: `git push origin feature/AmazingFeature`.
5. Open a Pull Request.
## License

GesturePresenter is licensed under the MIT License. For more details, see the [LICENSE.md](https://github.com/AnonymousAAArdvark/GesturePresenter/blob/main/LICENSE)  file.
