const db = require("../db/connection");


exports.insertHabits = (ownerInput, habitBody) => {
    const { owner } = ownerInput
    const { name, body, frequency, motivational_message } = habitBody
   
    if (name === undefined || name.length === 0 ) {
        return Promise.reject({ status: 400, msg: "Please enter a name" });
    }
    
    
   
   const psqlQuery = `
    INSERT INTO habits
    (owner, name, body, frequency, motivational_message)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;`
   
  
  return db.query(psqlQuery,[ owner, name, body, frequency, motivational_message]).then((result)=>{
   
                return result.rows[0];
              })
    
      };

      exports.addDaysbyHabit = (id, days_changed) => {
       
        const { habit_id } = id
        const { amount_days} = days_changed
     
        const psqlQuery = `
        UPDATE habits
        SET amount_days = amount_days + $2 
        WHERE habit_id = $1
        RETURNING *;`
        const firstPsqlQuery = `SELECT * from habits WHERE habit_id =$1;`

        if ( Object.keys(amount_days)=== 0){
          return Promise.reject ({status:400, msg:"Bad Request"});
        }
        return db.query(firstPsqlQuery, [habit_id])
        .then((results)=>{
          if (results.rows.length === 0){
            return Promise.reject({
              status :404, msg: "Not found"
            });
          }else {return db.query(psqlQuery,[ habit_id, amount_days] )}
        }).then((results)=>{
         
          return results.rows[0]
        
        })
      }

      exports.fetchHabits = () =>{
   
        let selectHabitsQueryString = `SELECT * FROM habits`;
       
        return db.query(selectHabitsQueryString).then((result) => {
        
         return result.rows;
       });
     };

     exports.fetchHabitsByOwner = (ownerOfHabit) =>{
     
 const { owner } = ownerOfHabit;


      let selectHabitsByOwnerQueryString = `SELECT * FROM habits WHERE owner = $1`;
     
      return db.query(selectHabitsByOwnerQueryString,[owner]).then((result) => {
      
       return result.rows;
     });
   };
  
   exports.removeHabitById = (id) =>{
      
    const psqlDeleteQuery = ` 
    DELETE FROM habits
    WHERE habit_id = $1; `
   
    const firstPsqlQuery = `SELECT * FROM habits WHERE habit_id = $1 ;`
    
    return db.query(firstPsqlQuery,[id] )
    .then((results) => {
       
        if (results.rows.length === 0){
            return Promise.reject({ status: 404, msg: "Not found" });
        } else { return db.query(psqlDeleteQuery, [id])
            
        
        }}).then((results) =>{

            return results
        })
        } 


     exports.fetchHabitsById = (id) =>{
     
      const { habit_id } = id;
     
   
           let selectHabitsByIdQueryString = `SELECT * FROM habits WHERE habit_id = $1`;
          
           return db.query(selectHabitsByIdQueryString,[habit_id]).then((result) => {
          
            return result.rows;
          });
        };


        exports.addPercentagebyHabit = (id, new_percentage) => {
     
          const  habit_id  = id
          const  percentage = new_percentage
       
          const psqlQuery = `
          UPDATE habits
          SET percentage = $2 
          WHERE habit_id = $1
          RETURNING *;`
          const firstPsqlQuery = `SELECT * from habits WHERE habit_id =$1;`
  
          if ( Object.keys(percentage)=== 0){
            return Promise.reject ({status:400, msg:"Bad Request"});
          }
          return db.query(firstPsqlQuery, [habit_id])
          .then((results)=>{
            if (results.rows.length === 0){
              return Promise.reject({
                status :404, msg: "Not found"
              });
            }else {return db.query(psqlQuery,[ habit_id, percentage] )}
          }).then((results)=>{
           
            return results.rows[0]
          
          })
        }