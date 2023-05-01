const express = require('express')


const port = 3000
const app = require("./app");
const server = app.listen(port, () => {});
app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log('nice')
})

