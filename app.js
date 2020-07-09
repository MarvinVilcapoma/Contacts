const app = require('./server');
require('./db');


// Server is listening
app.listen(app.get('port'), () => {
  console.log('Server en el puerto', app.get('port'));
  console.log('Environment:', process.env.NODE_ENV);
});