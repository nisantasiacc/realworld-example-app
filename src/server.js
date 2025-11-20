import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(err) {
    if (err) {
        console.log(`Error: ${err.message}`);
        // deneme
    }
    
    console.log("Server is listening on Port", PORT);
});