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

app.get('/student', (req, res) => {
    res.send(students);
})

app.get('/student/:id', (req, res) => {
    var id = req.params.id;
    var student = students.find(function (st) {
        return st.id === id;
    });
    res.send(student);
})

app.post('/student', (req, res) => {
    students.push(req.body);
    res.send('OK');
})

app.put('/student/:id', (req, res) => {
    var id = req.params.id;
    var idx = students.findIndex(function (st) {
        return st.id === id;
    });
    students.splice(idx, 1, req.body);
    res.send('OK');
})

app.delete('/student/:id', (req, res) => {
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