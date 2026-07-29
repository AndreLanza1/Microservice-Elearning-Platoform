
const { Channel, Connection,connect } = require("amqplib");
const config = require("../../config");
const Consumer = require("./consumer");
const Producer = require("./producer");


class RabbitMQUser {
    constructor() {
      this.isInitialized = false;
      this.producer = null;
      this.consumer = null;
      this.connection = null;
      this.producerChannel = null;
      this.consumerChannel = null;
      this.initPromise = this.initialize();  // Store the promise to ensure it's awaited everywhere
    }

  
    async initialize() {
      if (this.isInitialized) {
        return;
      }
      try {
        // Connect to RabbitMQ
        this.connection = await connect(config.rabbitMQ.url);

        // Create the producer and consumer channels
        this.producerChannel = await this.connection.createChannel();
        this.consumerChannel = await this.connection.createChannel();

        // Create the reply queue
        const { queue: rpcQueue } = await this.consumerChannel.assertQueue(
            config.rabbitMQ.queues.rpcQueue,
          { exclusive: true }
        );

        // Initialize the producer and consumer
        this.producer = new Producer(this.producerChannel);
        this.consumer = new Consumer(
          this.consumerChannel,
          rpcQueue
        );

        // Start consuming messages
        this.consumer.consumeMessages();

        this.isInitialized = true;

      } catch (error) {
        console.error("RabbitMQ error:", error);
      }
    }

    // Function to make the producer send messages
    async produce(data, correlationId, replyToQueue) {
      if (!this.isInitialized) {
        await this.initialize();
      }

      return await this.producer.produceMessages(
        data,
        correlationId,
        replyToQueue
    );
    }
  }
  
  const rabbitMQUser = new RabbitMQUser();
  module.exports = rabbitMQUser;