module.exports = {
    rabbitMQ: {
      url: "amqp://rabbitmq",
      queues: {
        rpcQueue: "rpc_queue", // Queue to send the message to user-service
        rpcQueueC: "rpc_queue_c", // Queue to send the message to course-service
      },
    },
  };
   