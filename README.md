# GesturePresenter

GesturePresenter enables users to control slide presentations through hand gestures, utilizing any device with web access and a camera. This project leverages Google's MediaPipe Hands for gesture recognition and consists of a three-part system: a Remote website, a Chrome extension, and a backend server.
## Features 
- **Remote Website** : Built with ReactJS, utilizes the device camera for gesture recognition to control slides. 
- **Chrome Extension** : Allows for navigation of a Google Slides presentation via connecting to the remote website. 
- **Backend Server** : Pairs the remote website with the chrome extension, ensuring smooth communication between the components.
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
- **Node.js and npm** (for the frontend website): The project uses npm to manage dependencies. Download and install Node.js from [nodejs.org](https://nodejs.org/) , which includes npm.
- Python 3 and pip (for the backend server): You can download Python from [python.org]().
- Google Chrome (for the Chrome extension)
### Installing
#### Frontend Website
1. **Clone the Repository** : First, clone the GesturePresenter repository to your local machine using Git.

```bash
git clone [https://github.com/anonymousaaardvark/gesture-presenter.git](https://github.com/AnonymousAAArdvark/GesturePresenter.git)
cd /GesturePresenter/frontend
``` 
2. **Install Dependencies** : Inside the cloned directory, run the following command to install the necessary dependencies listed in the `package.json` file.

```bash
npm install
```

This command will install all dependencies needed for the project, including React and MediaPipe libraries for hand gesture recognition.
##### Available Scripts

In the project directory, you can run several commands defined in the `scripts` section of the `package.json` file: 
- **Start the Development Server** :

```bash
npm start
```



This runs the app in development mode. Open [http://localhost:3000]()  to view it in the browser. The page will reload if you make edits. 
- **Build the App for Production** :

```bash
npm run build
```



Builds the app for production to the `build` folder. It bundles React in production mode and optimizes the build for the best performance. 
- **Deploy to GitHub Pages**  (if you plan to host the frontend on GitHub Pages):

```bash
npm run deploy
```



This will build the project and push the build to the `gh-pages` branch of your repository. Ensure you've set up the `homepage` field in `package.json` with your project's URL.
##### Development Notes 
- The project uses TypeScript for type checking. You can find TypeScript configuration options in the `tsconfig.json` file. 
- For styling, the project includes Font Awesome icons. Refer to the [Font Awesome React component documentation]()  for usage instructions.
- Communication with the backend server and the Chrome extension is facilitated by Axios and socket.io-client, respectively. Ensure the backend server and the Chrome extension are properly configured to accept connections from the frontend.
##### Deployment

After running `npm run build`, you can deploy the `build` directory to any static hosting service you prefer (e.g., GitHub Pages, Netlify, Vercel).

Remember to check the `homepage` field in your `package.json` if you're deploying to a subpath on your domain.
#### Backend Server
1. **Navigate to backend folder**  : First, cd to the backend path.

```bash
cd /GesturePresenter/backend
```

 
2. **Install Dependencies**  : Inside the cloned directory, run the following command to install the necessary dependencies listed in the `requirements.txt` file.

```bash
pip install -r requirements.txt
```



This command will install all dependencies needed for the backend server, including Flask and Flask-SocketIO for real-time web communication.
##### Available Scripts

In the project directory, you can run the following command to start the server: 
- **Start the Server**  :

```bash
python app.py
```



This starts the Flask application along with the SocketIO server, making it ready to accept connections and manage gesture presentation control.
##### API Endpoints

The server provides several endpoints for managing sessions and gesture controls: 
- **Generate Code**  : `GET /generate_code` - Generates a unique session code. 
- **Validate Code**  : `POST /validate_code` - Validates a session code for activity. 
- **Send Gesture**  : `POST /send_gesture` - Sends a gesture command to the paired session.
##### WebSocket Events 
- **Pair**  : Handles the device pairing with a session code. 
- **Heartbeat**  : Maintains the session's connection status. 
- **Gesture Event**  : Communicates gesture commands to the paired device.
##### Development Notes
- The backend server uses Flask and Flask-SocketIO for handling HTTP and WebSocket connections, respectively.
- SQLAlchemy is used for database operations, specifically for managing pairing codes and session IDs.
- A background thread is utilized to clean up expired session codes periodically.
#### Chrome Extension 
1. Open Google Chrome and navigate to `chrome://extensions/`
2. Enable Developer Mode. 
3. Click "Load unpacked" and select the `GesturePresenter/chrome-extension` directory.
##### Usage 
1. **Starting the Backend Server** : Ensure the backend server is running as it handles pairing and communication between the AR website and the Chrome extension. 
2. **Using the AR Website** : Open the AR website on a device with a camera and allow camera access. Perform gestures to control the presentation slides. 
3. **Navigating Slides** : Use the Chrome extension to navigate through your PowerPoint presentation slides with gestures recognized by the AR website.
### Contributing

We welcome contributions to GesturePresenter! If you have suggestions for improvements or bug fixes, please follow these steps:
1. Fork the repository. 
2. Create your feature branch (`git checkout -b feature/AmazingFeature`). 
3. Commit your changes (`git commit -am 'Add some AmazingFeature'`). 
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.
### Screenshots

Include some screenshots of the project in action.





### License

This project is licensed under the MIT License - see the [LICENSE.md](https://chat.openai.com/c/LICENSE.md)  file for details.
### Acknowledgments
- Google's MediaPipe Hands for gesture recognition
- ReactJS, Flask, and other technologies that made this project possible---
