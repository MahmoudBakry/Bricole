import * as admin from 'firebase-admin';
import User from "../models/user.model";

const serviceAccount = require("../service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bricole-54415.firebaseio.com"
});

//push manual notification
// admin.messaging().sendToDevice(['06WxbUmLV8:APA91bHe16K975o1RxFZjxxPOxl0y96fnnQYBqbkXWF1JvC3qSUbZdPfTAU2XEfiP3OLHptgfc82k0F9TORnwT2UKXGYy88EPoMKvnolSTUkwT2lwTIFS3jTmUaW1CCw7aXps2fzpMFK'],
//     {
//         notification: {
//             title: "dsdsd",
//             body: "hello form bakry",
//             icon:"https://image.flaticon.com/icons/png/128/148/148921.png"
//         },
//         data: {
//             subject: "bla b",

//         }
//     }).then(response => {
//         console.log("Successfully sent message:", response.results[0]);
//     })
//     .catch(error => {
//         console.log("Error sending message:", error);
//     });

export async function send(userId, title, body) {
    console.log(userId)
    let user = await User.findById(userId);
    let tokens = user.pushTokens;

    const payload = {
        notification: {
            title, body,
            icon: "https://image.flaticon.com/icons/png/128/148/148921.png"
        },
        // data: {
        //     subject
        // }
    }


    if (tokens.length) {
        admin.messaging().sendToDevice(tokens, payload)
            .then(response => {
                console.log("Successfully sent message:", response);
            })
            .catch(error => {
                console.log("Error sending message:", error);
            });
    }

}