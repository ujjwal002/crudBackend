const express = require('express');
const User = require('./models/user');
const sequelize = require('./config/database');
const PasswordResetToken = require('./models/passwordResetToken');
const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync({force:true});
      console.log('Connection to the database has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();

app.use(express.json());

  
const user = require('./routes/userRoutes');

app.use('/user',user)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
