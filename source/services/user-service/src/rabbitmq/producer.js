
const {Channel} = require("amqplib");

class Producer {
  constructor(channel) {
    this.channel = channel;
  }

  async produceMessages(data, correlationId, replyToQueue) {
    console.log("Responding with..", data);

    // Send the message to the RPC queue with the necessary properties
    this.channel.sendToQueue(
        replyToQueue, // Queue to send the message to
        Buffer.from(JSON.stringify(data)), 
      {
        correlationId: correlationId, // ID to correlate the request with the response
      }
    );
  }
}

module.exports = Producer;