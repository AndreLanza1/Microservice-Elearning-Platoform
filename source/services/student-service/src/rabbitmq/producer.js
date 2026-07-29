const { randomUUID } = require('crypto');
const EventEmitter = require('events');
const config = require('../../config');

class Producer {
  constructor(channel, replyQueueName, eventEmitter) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
    this.eventEmitter = eventEmitter;
  }

  async produceMessages(data) {
    const uuid = randomUUID(); // Generate a random UUID
    console.log("/producer1",data);
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
          correlationId: uuid, // ID to correlate the request with the response
          expiration: 30, // Time in milliseconds after which the message will be deleted
          
          // headers: {
            // function: data.operation,
           //},
        }
        
      );
      
    }
    else if (target.toString() == "getCourses") {
      console.log("Target is getCourses");
      // Send the message to the RPC queue with the necessary properties
      this.channel.sendToQueue(
        config.rabbitMQ.queues.rpcQueueC,  // 2. Queue to send the message to
        Buffer.from(JSON.stringify(data)), // Data to be sent
        {
          // Queue in which the response will be sent by course-service
          replyTo: this.replyQueueName, 
          correlationId: uuid, // ID to correlate the request with the response
          expiration: 30, // Time in milliseconds after which the message will be deleted
          
          // headers: {
            // function: data.operation,
          //},
        }
        
      );
    }

    // Return a Promise that resolves when the response is received
    return new Promise((resolve, reject) => {
      console.log("We are in Promiseeeeeeeeeee");
      // Listen for the response with the specified UUID
      this.eventEmitter.once(uuid, async (data) => {
        try {
          // Analyze the response received from the consumer and resolve the Promise
          const reply = JSON.parse(data.content.toString());
          resolve(reply);
        } catch (error) {
          reject(error); // Reject the Promise if an error occurs
        }
      });
    });
  }
}

module.exports = Producer;
