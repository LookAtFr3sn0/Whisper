# Whisper Backend

This is the backend for my personal project, **Whisper**. I decided to publish the source code to showcase my work.

## Getting Started

To run this project locally:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/LookAtFr3sn0/WhisperBackend.git
   cd whisper-backend
   ```

2. **Create the `.env` file:**
   In the `api` directory, create a file named `.env` with the following environment variables:
   
   ```env
   # OPAQUE Server Setup
   OPAQUE_SERVER_SETUP=your-opaque-server-setup-string

   # JWT Secret
   JWT_SECRET=your-jwt-secret
   ```
   - Replace `your-opaque-server-setup-string` with your OPAQUE server setup string.
   - Replace `your-jwt-secret` with a secure secret for JWT authentication.

3. **HTTPS Certificate (Optional):**
   By default, the backend supports HTTPS using your own certificate and key files. Place your certificate (`cert.crt`) and key (`cert.key`) in the `certs` directory if you want to enable HTTPS. If these files are not present, the backend will run without HTTPS (using HTTP only).

   - You can configure whether to use HTTPS or HTTP by providing or omitting the certificate files.

4. **Add the Frontend Code:**
   The code for the frontend can either be built or downloaded from the respective repository, place the resulting files in the `public` folder. This allows Nginx to serve the frontend along with the backend API.

5. **Start the services:**
   Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed. Then run:
   ```sh
   docker-compose up --build
   ```

   This will start the PostgreSQL database, API server, and Nginx reverse proxy.

## Notes
- This project is for portfolio purposes and may not be production-ready.
- Feel free to explore, fork, or contribute!

If you have any questions, feel free to reach out via GitHub.
