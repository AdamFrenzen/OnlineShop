const express = require('express');
const path = require('path');

const csrf = require('csurf')
const expressSession = require('express-session');

const createSessionConfig = require('./sessions/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const baseRoutes = require('./routes/base.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));
app.use(csrf());
app.use(addCsrfTokenMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
.then(function() {
    app.listen(3000)
})
.catch(function(errror) {console.log('Failed to connect to database!');console.log(error)});