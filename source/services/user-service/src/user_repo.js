const { use } = require("./user_route");
const { Op, Sequelize} = require("sequelize");


class UserRepo{

    constructor(userModel){
        this.userModel = userModel;
    }

    async addUser(uuidV4, username, role,email, password) {
      console.log("ZZZZ",username,role,email,password);
        try {
          const newUser = await this.userModel.create({
            id: uuidV4,       // Set the generated UUID
            username,         // Insert the username
            role,             // Insert the role
            password,          // Insert the password
            email              // Insert the email
          });
          return newUser;     // Return the created user object
        } catch (error) {
          console.error("Error inserting user:", error);
          return null;        // Return null in case of an error
        }
      }

      async getUserByUsername(email, role) {
        const user = await this.userModel.findOne({ where: { email, role } });
        if (user) {
            console.log("User is: ", user.dataValues);  // Access the raw data in dataValues
            return user.dataValues;  // Return the raw data
        }
        else{
            console.log("User not found");
            return null;
        }
    }

  // Functions for RabbitMQ
    async getUserById(id) {
      const user = await this.userModel.findOne({ where: { id } });
      if (user) {
          console.log("User is: ", user.dataValues);  // Access the raw data in dataValues
          return user.dataValues;  // Return the raw data
      } else {
          console.log("User not found");
          return null;
      }

    }

    async getUsersById(ids) {
      console.log("IDs received:", ids);
    
      try {
        const users = await this.userModel.findAll({
          where: { id: { [Op.in]: ids } }
        });
    
        if (users && users.length > 0) {
          const userData = users.map(user => user.dataValues); // Extract dataValues from each user
          console.log("Users are: ", userData);
          return userData; // Return the array of raw data
        } else {
          console.log("Users not found");
          return null;
        }
      } catch (error) {
        console.error("Error fetching users by IDs:", error);
        return null;
      }
    }
    


} 

module.exports = {UserRepo};