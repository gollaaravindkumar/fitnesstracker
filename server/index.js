const express = require('express');
const mysql2 = require('mysql2')
const app = express()




app.get("https://ngage.nexalink.co/health/users/signup", (req, res) => {
  res.send("its Fine")
  
});

const port = process.env.PORT || 3000;
app.listen(port, () => `https://ngage.nexalink.co`);