const express = require('express');
const dotenv = require('dotenv');
require('./Config/db.js')

const problemRoutes = require('./Routes/problems.js');

const cors = require('cors');
const authRoutes = require('./Routes/auth');
const userRoutes = require('./Routes/user.js');
const tagRoutes = require('./Routes/tags');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get('/', (req, res) => {
  res.send('API is running');
});


//routes 
app.use('/auth', authRoutes);
app.use('/problems', problemRoutes);
app.use('/user', userRoutes);
app.use('/tags', tagRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});