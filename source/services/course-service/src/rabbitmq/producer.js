const { randomUUID } = require('crypto');
const config = require('../../config');
const MessageHandler = require('../../messageHandler');

class Producer {
  constructor(channel, replyQueueName, eventEmitter) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
    this.eventEmitter = eventEmitter;
  }

  async produceMessages(data, correlationId, replyToQueue) {
    console.log("Responding with..", data);
    //const uuid = randomUUID(); // Generate a random UUID
    console.log("/producer1"+correlationId);
    console.log("Type of data:", typeof data);

    const target = data.target; // Extract the target from the data
    console.log("Target:", target);

    if (target.toString() == "getUsername") {
      console.log("Target is getUsername");
      this.channel.sendToQueue(
        config.rabbitMQ.queues.rpcQueue,  // 2. Queue to send the message to
        Buffer.from(JSON.stringify(data)), // Data to be sent
        {
          // Queue in which the response will be sent by user-service
          replyTo: this.replyQueueName, 
          correlationId: correlationId, // ID to correlate the request with the response
          expiration: 5000, // Time in milliseconds after which the message will be deleted
          
          // headers: {
            // function: data.operation,
           //},
        }
        
      );
  
    }
    else if(target.toString() == "returnCourses"){
      this.channel.sendToQueue(
        replyToQueue, // Queue to send the message to
        Buffer.from(JSON.stringify(data.content)), 
      {
        correlationId: correlationId, // ID to correlate the request with the response
      }
    );
   
    }
    else if(target.toString() == "getUsernames"){
      console.log("Target is getUsernames");
      this.channel.sendToQueue(
        config.rabbitMQ.queues.rpcQueue,  // 2. Queue to send the message to
        Buffer.from(JSON.stringify(data)), // Data to be sent
        {
          // Queue in which the response will be sent by user-service
          replyTo: this.replyQueueName, 
          correlationId: correlationId, // ID to correlate the request with the response
          expiration: 5000, // Time in milliseconds after which the message will be deleted
          
          // headers: {
            // function: data.operation,
           //},
        }
      );
      
    }
     let res= await MessageHandler.response();
     return res;
     //else return JSON.parse(res);

    
    
    
    //return response(username);

   /*  // Return a Promise that resolves when the response is received
    return new Promise((resolve, reject) => {
      console.log("Listening for correlationId:", correlationId);
      console.log("Listening type:", typeof correlationId);
      this.eventEmitter.once(correlationId,  (data) => {
        console.log("Matched :", typeof correlationId);
        console.log("Received response in producer:", data.content.toString());
        try {
          const reply = JSON.parse(data.content.toString());
          resolve(reply);
        } catch (error) {
          reject(error);
        }
      });
     */
      /* setTimeout(() => {
        reject(new Error("Response timeout exceeded"));
      }, 5000); */
    
    //});
  }
}

module.exports = Producer;
