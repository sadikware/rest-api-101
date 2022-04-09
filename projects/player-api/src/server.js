const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const shortid = require('shortid');
const fs = require('fs/promises');
const path = require('path');
const dblocation = path.resolve('src', 'data.json')

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/:id', async(req, res)=> {
    const id = req.params.id;
    
    const data =  await fs.readFile(dblocation)
    const players = JSON.parse(data)

    const player = players.find((item)=> item.id == id)

    if(!player) {
        res.status(404).json({message: "Player Not Found"})
    }

    res.status(201).json(player);

})

app.post('/', async (req,res)=> {
    const player = {
        ...req.body,
        id: shortid.generate(),
    }
    const data =  await fs.readFile(dblocation);
    const players = JSON.parse(data);
    players.push(player);
    await fs.writeFile(dblocation, JSON.stringify(players))
    res.status(201).json(player)
});

app.get('/', async(req, res)=> {
    const data =  await fs.readFile(dblocation)
    const players = JSON.parse(data)
    res.status(201).json(players);
})


app.get('/health', (_req, res)=> {
    res.status(200).json({Status: 'OK'})
})

const port = process.env.PORT || 4000;
app.listen(port, ()=> {
    console.log(`Server is listening on PORT ${port}`);
    console.log(`localhost: ${port}`);
})