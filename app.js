const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topic.controllers");
const { badRoute, handleCustomErrors, handlePSQL400s, handle500Statuses } = require("./controllers/error_controllers");
const { getFrequency } = require("./controllers/frequency.controllers");
const { postHabits, patchDaysforHabits, getHabitsById, getHabitsByOwner, getHabits, deleteComments, deleteHabits, patchPercentageforHabits } = require("./controllers/habits.controllers");
const cors =require("cors")
const { endpoints } = require("./controllers/api-controller");
const { getUsers, postUsers, getUserByUser } = require("./controllers/users.controllers");




app.use(cors());
app.use(express.json());


app.get('/api', endpoints);

app.get('/api/topics', getTopics);
app.get('/api/frequency', getFrequency);
app.post('/api/:owner/habits',postHabits )
app.patch('/api/habits/:habit_id', patchDaysforHabits)
app.get('/api/habits', getHabits)
app.get('/api/owner/habits/:owner', getHabitsByOwner)
app.delete('/api/habits/:habit_id', deleteHabits)
app.get('/api/habit/:habit_id', getHabitsById);
app.get('/api/users', getUsers);
app.post('/api/user', postUsers);
app.get('/api/users/:username', getUserByUser)
app.patch('/api/habit/:habit_id', patchPercentageforHabits)

app.use(badRoute);
app.use(handleCustomErrors);
app.use(handlePSQL400s);
app.use(handle500Statuses);

module.exports = app;
