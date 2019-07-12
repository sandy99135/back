var express = require('express')
var app = express.Router();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var Controller= require('../Controller/Controller')
app.post('/mail',Controller.send)
app.get('/',Controller.getProfil)
app.post('/register',Controller.postProfil)
app.post('/crm',Controller.crm)
app.get('/crm',Controller.crmget)
app.post('/login',Controller.login)
app.delete('/register',Controller.deleteProfil)
app.put('/',Controller.put)

module.exports = app;