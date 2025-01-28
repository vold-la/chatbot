# Artisan Chatbot

A modern chat interface built with Next.js and FastAPI, featuring message updates, authentication, and a sleek UI.

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.10+
- Docker (optional)

clone the repository
```bash
git clone https://github.com/vold-la/chatbot.git
```

### Using Docker

Run the entire stack using Docker Compose:
```bash
docker-compose up --build
```

 OR

### Running Locally

1. change directory
```bash
cd artisan
```

2. Start the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

3. Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

## Development

- Frontend runs on `http://localhost:3000`
- Backend API runs on `http://localhost:8000`

## Testing

### Frontend Tests
```bash
cd frontend
npm run cypress:open
```

### Backend Tests
```bash
cd backend
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
python -m pytest tests/test_main.py -v
```

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS

### Backend
- FastAPI
- SQLite
- JWT Authentication


## Show your support

Give a star if you like this project!
Contributions & feedbacks are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
