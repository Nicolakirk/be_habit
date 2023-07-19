const db = require("../db/connection");

exports.fetchUsers = () =>{
   
   let selectUsersQueryString = `SELECT * FROM users`;
  
   return db.query(selectUsersQueryString).then((result) => {
   
    return result.rows;
  });
};



exports.insertUsers = (ownerInput) => {
   
    const { username, name } = ownerInput
 console.log(username)
   
    if (username=== undefined || username.length === 0 ) {
        return Promise.reject({ status: 400, msg: "Please enter a name" });
    }
    
    
   
   const psqlQuery = `
    INSERT INTO users
    (username, name)
    VALUES
    ($1, $2)
    RETURNING *;`
   
  
  return db.query(psqlQuery,[ username, name]).then((result)=>{
   console.log(result.rows)
                return result.rows[0];
              })
    
      };