import "babel-polyfill";
import app from './app';

let Port = process.env.PORT || 3000;

app.listen(Port, () => {
    console.log('server is running now in port... ' + Port)
});
