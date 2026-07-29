
const { CourseRepo } = require('../course_repo');
const {Channel, consumeMessage} = require("amqplib");
const {Course} = require("../course");
const MessageHandler = require('../../messageHandler');
const e = require('express');
const Producer = require("./producer");

let isConsuming = false;

class Consumer {
    // channel is the channel to listen to messages
    // rpcQueueC is the queue to consume messages from
    // eventEmitter is the event emitter to handle the communication between the producer and consumer

  constructor(channel, rpcQueueC) {
    this.channel = channel;
    this.rpcQueueC = rpcQueueC;
    //this.eventEmitter = eventEmitter;
    
  }

  async consumeMessages() {
    if (isConsuming) {
      console.log("Already consuming messages on this queue.");
      return;
    }
    isConsuming = true;
    console.log("Course Ready to consume messages...");

    // Ensures that the consumer remains continuously active,
    // listening for incoming messages on the rpcQueueC.
    this.channel.consume(
        this.rpcQueueC,
        async (message) => {
          
          console.log("Course Message received:", message.content.toString());
          const { correlationId, replyTo } = message.properties;
  
          if (!correlationId ) {
            console.log("Missing some properties...");
            return;
          }
          else if( !replyTo){
            console.log("Username in consumer", message.content.toString())
            await MessageHandler.handle(
              "returnUsername",
              JSON.parse(message.content.toString())
            );
          }
          else{
            // To understand which function to call (query) to reterieve the data that the client needs
          //const operation = message.properties.headers.function;

          let response = {};

          const { id } = JSON.parse(message.content.toString()); 

          console.log("id: ", id);
  
          const courseRepo = new CourseRepo(Course);

          const courses = await courseRepo.getCoursesByStudentId(id);

          console.log("Courses are:", courses);
      
          
          if (!courses) {
            console.log("courses not found");
            response = {
              target: "returnCourses",
              content: "courses not found",
            }  ;
          }
          else {
            response = {
              target: "returnCourses",
              content: courses,
            }  ;
          }
          
   
           
          // Produce the response back to the client
            const RabbitMQCourse = require("./course-s");
            //await RabbitMQCourse.initPromise;  // Wait for RabbitMQCourse to be initialized
            
            await RabbitMQCourse.produce(response, correlationId, replyTo);    
          }
          
        },
        {
        noAck: true, 
      }
    );
  }
}

module.exports = Consumer;