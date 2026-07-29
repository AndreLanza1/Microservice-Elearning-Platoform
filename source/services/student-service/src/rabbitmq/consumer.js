

class Consumer {
  // channel is the channel to listen to messages
  // replyQueueName is the queue to send the reply to
  // eventEmitter is the event emitter to handle the communication between the producer and consumer

  constructor(channel, replyQueueName, eventEmitter) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
    this.eventEmitter = eventEmitter;
  }

  async consumeMessages() {
    console.log("Ready to consume messages...");

    // Ensures that the consumer remains continuously active,
    // listening for incoming messages on the replyQueueName.
    this.channel.consume(
      this.replyQueueName,
      (message) => {
        if (!message) return; 
        
        console.log("The reply is:", JSON.parse(message.content.toString()));
        // emit the message so that all listeners can receive it
        this.eventEmitter.emit(
          message.properties.correlationId.toString(),
          message
        );
      },
      {
        noAck: true, 
      }
    );
  }
}
module.exports = Consumer;