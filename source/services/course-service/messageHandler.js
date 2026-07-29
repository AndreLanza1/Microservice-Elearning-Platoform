const RabbitMQCourse = require('./src/rabbitmq/course-s');
const e = require('express');

let res = ""; // Shared variable
let resolvePromise; // Resolver for the Promise

class MessageHandler {
    static async handle(operation, data) {
        const username = data;

        console.log("The operation is", operation);
        console.log("username idd: ", username);
        if(Array.isArray(username)) {
            res={
                content: username,
                target: "array",
            }
            console.log("Username is 3:", res);
        }
        // Produce the response back to the client
        else {
            res = res={
                content: JSON.stringify(username),
                target: "string",
            }
            
            console.log("Username is 3:", res);
        }

        // Resolve the Promise when res is updated
        if (resolvePromise) {
            resolvePromise(res);
            resolvePromise = null; // Reset the resolver
            res="";
        }
    }

    static async response() {
        // Return a Promise that resolves when res is updated
        if (res !== "") {
            console.log("Username is 2:", res);
            return res;
        }

        return new Promise((resolve) => {
            resolvePromise = resolve; // Save the resolver
        });
    }
}

module.exports = MessageHandler;