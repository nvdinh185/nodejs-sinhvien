const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname + '/client'));

const students = [
    {
        id: '1',
        name: "Dinh",
        address: "Hue"
    },
    {
        id: '2',
        name: "Nam",
        address: "quang nam"
    },
    {
        id: '3',
        name: "Tan",
        address: "da nang"
    },
    {
        id: '4',
        name: "Hung",
        address: "hue"
    },
    {
        id: '5',
        name: "Tri",
        address: "quang tri"
    },
    {
        id: '6',
        name: "Anh",
        address: "hue"
    },
    {
        id: '7',
        name: "Binh",
        address: "da nang"
    }
]

app.get('/students', (req, res) => {
    res.send(students);
})

app.post('/students', (req, res) => {
    students.push(req.body);
    res.send('OK');
})

app.put('/students/:id', (req, res) => {
    var id = req.params.id;
    var idx = students.findIndex(function (st) {
        return st.id === id;
    });
    students.splice(idx, 1, req.body);
    res.send('OK');
})

app.delete('/students/:id', (req, res) => {
    var id = req.params.id;
    var idx = students.findIndex(function (st) {
        return st.id === id;
    });
    students.splice(idx, 1);
    res.send('OK');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})