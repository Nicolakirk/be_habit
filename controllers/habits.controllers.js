const { insertHabits, addDaysbyHabit, selectHabitById, selectHabitByOwner, fetchHabits, fetchHabitsByOwner, removeHabitById, fetchHabitsById, addPercentagebyHabit } = require("../models/habits.model");

exports.postHabits = (req, res, next)=>{
    const  owner = req.params;
    const habitBody =  req.body;
    

const habitsPromises = [insertHabits(  owner, habitBody)];
Promise.all(habitsPromises)
.then (([habit])=>{
   
    res.status(201).send({ habit })
})
.catch((err)=>{
    next( err);
  });


}

exports.patchDaysforHabits = (req, res, next) =>{
          
    const  habit_id= req.params;
    const amount_days = req.body
  addDaysbyHabit(habit_id, amount_days)
.then((habit)=>{

res.status(201).send({ habit })
})
.catch((err)=>{
next( err);
});
  }


  exports.getHabits = (req, res) =>{
    fetchHabits().then((output)=>{
        res.status(200).send({ habits: output });
    })
    .catch((err)=>{
        next( err);
    })
};
  

exports.getHabitsByOwner = (req, res) =>{
 
  const owner = req.params;

  fetchHabitsByOwner(owner).then((output)=>{
      res.status(200).send({ habits: output });
  })
  .catch((err)=>{
      next( err);
  })
};

exports.getHabitsById = (req, res) =>{
 
  const habit_id = req.params;
 
  fetchHabitsById(habit_id).then((output)=>{
      res.status(200).send({ habits:output });
  })
  .catch((err)=>{
      next( err);
  })
};


exports.deleteHabits = (req, res, next) =>{
  const { habit_id }= req.params;

removeHabitById(habit_id).then((habits)=>{
  res.status(204).send({ habits });
})
.catch((err)=>{
  next(err);
})
};

exports.patchPercentageforHabits = (req, res, next) =>{
         
  const { habit_id }= req.params;
  const { percentage } = req.body
 
addPercentagebyHabit(habit_id, percentage)
.then((habit)=>{

res.status(201).send({ habit })
})
.catch((err)=>{
next( err);
});
}