const mongoose = require('mongoose')

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connect( process.env.MONGODB_URL, {
    dbName: 'hw2',
    // useNewUrlParser: true,
  }).then(() => {
    console.log('Connected To MongoDB');
  }).catch(()=>{
    console.error('Failed To Connect MongoDB');
  })
}

mongoose.connection.on('error', (error) => {
  console.error('Failed To Connect MongoDB', error);
});

mongoose.connection.on('disconnected', (error) => {
  console.error('Failed To Connect MongoDB', error);
  connect();
})

module.exports = connect;