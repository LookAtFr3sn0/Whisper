# Whisper Frontend

This is the frontend for my personal project, **Whisper**.

## Getting Started

To run or build the frontend locally, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/LookAtFr3sn0/WhisperFrontend.git
   cd whisper
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Development server:**
   To start the development server with hot reload:
   ```sh
   npm run dev
   ```
   The app will be available at the local address shown in the terminal (usually http://localhost:5173).

4. **Build for production:**
   To build the frontend for production:
   ```sh
   npm run build
   ```
   The build output will be in the `dist/` folder.

5. **Deploy with Backend:**
   Copy the contents of the `dist/` folder into the `Backend/public/` directory. This allows the Nginx server in the backend to serve the frontend files.

## Notes
- This project is for portfolio purposes and may not be production-ready.
- Feel free to explore, fork, or contribute!

If you have any questions, feel free to reach out via GitHub.
