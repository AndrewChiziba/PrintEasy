Visit any PrintEasy location, scan the QR code, and upload your documents directly for printing. No WhatsApp or Telegram needed!

![image](https://github.com/user-attachments/assets/f2ff4e2c-bf2c-44a6-8d94-bbbf36c4b258)

![image](https://github.com/user-attachments/assets/dec63fa4-5ccf-4b9f-bef5-12045bdaa6ef)

![image](https://github.com/user-attachments/assets/ed9aae72-12a4-4b80-91ca-6fa76eed183e)

![image](https://github.com/user-attachments/assets/5f6962d2-5b85-4408-9a60-5b958a1a7673)

# Project Name

## Overview

This project consists of a Node.js backend with a MongoDB database and a React TypeScript frontend. This README provides instructions for setting up and running the project locally.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Yarn](https://yarnpkg.com/) or npm (Node Package Manager)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (or use MongoDB Atlas for a cloud-based solution)

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/your-repository.git
cd your-repository
```

### 2. Set Up the Backend

1. Navigate to the backend folder:
   ```sh
   cd project-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```
3. Create a `.env` file in the `backend` directory and add necessary environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```
   or
   ```sh
   yarn dev
   ```
   The backend should now be running on `http://localhost:5000`.

### 3. Set Up the Frontend

1. Navigate to the frontend folder:
   ```sh
   cd ../project
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```
3. Create a `.env` file in the `frontend` directory and add necessary environment variables:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```sh
   npm run dev
   ```
   or
   ```sh
   yarn dev
   ```
   The frontend should now be running on `http://localhost:5173` (or as indicated in the terminal output).

## Additional Notes

- Ensure the backend is running before launching the frontend.
- Make sure MongoDB is properly set up and running.
- Adjust CORS settings in the backend if necessary to allow frontend requests.

## License

This project is licensed under [Your License].

