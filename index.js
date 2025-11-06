import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/users', (req, res) => {
    console.log('Handler activated');
    res.status(200).json({data: req.body});
});

app.listen(PORT, function(err) {
    if (err) {
        console.log(`Error: ${err.message}`);
    }
    console.log("Server is listening on Port", PORT);
});