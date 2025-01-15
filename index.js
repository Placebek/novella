const app = require('./app');
const PORT = 8080;
const HOST =  '172.20.10.4';

// const PORT = process.env.PORT || 3000;

app.listen(PORT,HOST, () => {
    console.log(`Server is running on port http://${HOST}:${PORT}`);
});
