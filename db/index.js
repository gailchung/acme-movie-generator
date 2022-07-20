
const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_movies_db');
const { STRING, INTEGER } = Sequelize;

const Movie = conn.define('movie', {
    name: {
      type: STRING 
    },
    rating: {
        type: INTEGER,
        defaultValue: 3,
        validate: {
            min: 1,
            max: 5
        }
        // get: function() {
        //     if (defaultValue > 5 || defaultValue < 1) {
        //         return 'stop'
            // }
        // }
    }
  });


  module.exports = {
    conn,
    Movie
 
  };