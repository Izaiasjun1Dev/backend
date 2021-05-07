const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// ==> IMPORT CONFIG DB = "db.config.js"
const database = require('./config/db.config') // ==> connect my db

// ==> config connect my db
mongoose.Promise = global.Promise;

mongoose.connect(database.local.localDatabaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log('Connection successfully established!');
}, (err) => {
  console.log(`Error: ${err}`);
  process.exit();
})

// ==> routes
const index = require('./routes/index')

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.json(
  { type: 'application/vnd.api+json' }
));
app.use(morgan('dev'))
app.use(cors())

app.use(index)

module.exports = app