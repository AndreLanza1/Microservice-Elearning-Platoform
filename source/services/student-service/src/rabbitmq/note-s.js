
const { Channel, Connection,connect } = require("amqplib");
const config = require("../../config");
const Consumer = require("./consumer");
const Producer = require("./producer");
const { EventEmitter } = require("events");

class RabbitMQNote {
    constructor() {
        this.isInitialized = false;
        this.producer = null;
        this.consumer = null;
        this.connection = null;
        this.producerChannel = null;
        this.consumerChannel = null;
        this.eventEmitter = null;
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
        const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
          "",
          { exclusive: true }
        );

        // Initialize the EventEmitter to handle the communication between the producer and consumer
        this.eventEmitter = new EventEmitter();

        // Initialize the producer and consumer
        this.producer = new Producer(
          this.producerChannel,
          replyQueueName,
          this.eventEmitter
        );
        this.consumer = new Consumer(
          this.consumerChannel,
          replyQueueName,
          this.eventEmitter
        );

        // Start consuming messages
        this.consumer.consumeMessages();

        this.isInitialized = true;
      } catch (error) {
        console.error("RabbitMQ error:", error);
      }
    }

    // Function to make the producer send messages
    async produce(data) {
      if (!this.isInitialized) {
        await this.initialize();
      }
      return await this.producer.produceMessages(data);
    }
  }
  
  const rabbitMQNote = new RabbitMQNote();
  module.exports = rabbitMQNote;