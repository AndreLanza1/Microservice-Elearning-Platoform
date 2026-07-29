module.exports = {
    rabbitMQ: {
      url: "amqp://rabbitmq",
      queues: {
        rpcQueue: "rpc_queue", // Queue for RPC communication (other services that need data from this service can use this queue)
      },
    },
  };
  