# Rumbly (Run Assembly) NASM Assembly Execution Web Platform

![Rumbly Banner](https://rumbly.codenik.in/logo.png)

[![Build Status](https://img.shields.io/travis/com/IamShaDoW666/rumbly.svg?style=for-the-badge)](https://travis-ci.com/IamShaDoW666/rumbly)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/IamShaDoW666/rumbly.svg?style=for-the-badge&logo=github)](https://github.com/IamShaDoW666/rumbly/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/IamShaDoW666/rumbly.svg?style=for-the-badge&logo=github)](https://github.com/IamShaDoW666/rumbly/network)

**Rumbly** is a powerful and intuitive web-based platform for writing, executing, and testing **NASM (Netwide Assembler) assembly code** right from your browser. It leverages a robust backend built with **Express.js** and isolates code execution within secure **Docker containers**, providing a safe and reliable environment for running assembly programs. The frontend is a modern and responsive application built with **React** and **Vite**.

---

## Features

* **Online NASM Editor**: A feature-rich code editor with syntax highlighting for assembly language.
* **Real-time Execution**: Instantly execute your NASM code and see the output.
* **Secure Environment**: Code execution is sandboxed in Docker containers to prevent any harm to the host system.
* **User-friendly Interface**: A clean, intuitive, and responsive UI built with React and Vite.
* **API-driven**: A well-defined Express.js API to manage code compilation and execution.
* **Easy to Set Up**: Get the entire platform running locally with just a few commands.

---

## Tech Stack

* **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/)
* **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/)
* **Containerization**: [Docker](https://www.docker.com/)
* **Assembler**: [NASM](https://www.nasm.us/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* **Node.js** (v14 or later)
* **npm** or **yarn**
* **Docker** and **Docker Compose**

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/IamShaDoW666/rumbly.git](https://github.com/IamShaDoW666/rumbly.git)
    cd rumbly
    ```

2.  **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    cd ../api
    npm install
    ```

4.  **Set up environment variables:**

    Create a `.env` file in the `api` directory and add the following variables:
    ```env
    PORT=3000
    ```

---

## Usage

1.  **Start the Docker containers:**

    Make sure Docker is running on your machine. Then, from the root of the project, run:
    ```bash
    docker-compose up --build
    ```

2.  **Start the frontend development server:**
    ```bash
    cd frontend
    npm run dev
    ```

3.  **Start the backend server:**
    ```bash
    cd api
    npm start
    ```

4.  **Open your browser** and navigate to `http://localhost:5173` (or the port Vite assigns).

Now you can write your NASM code in the editor and click the "Run" button to see the output.

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---
