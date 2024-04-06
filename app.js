const express = require('express')
const app = express()
const cors = require('cors');
const dotenv = require('dotenv')
const http = require('http');
const socketIo = require('socket.io');
const chatSocket = require('./sockets/chatSocket');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json())
dotenv.config()
app.use(cors())

const server = http.createServer(app);
const io = socketIo(server);

const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const roomRoutes = require('./routes/roomRoutes');
const authorizeToken = require('./middlewares/authorizeToken');
const connection = require('./utils/database');

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/messages',authorizeToken, messageRoutes);
app.use('/api/rooms',authorizeToken, roomRoutes);

// Socket connection
io.on('connection', chatSocket);


// Establish database connection
connection()
    .then(() => {
        const port = process.env.PORT || 3000;
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the process if unable to connect to the database
    });
