const bcryptjs = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

 


class UserService{
    constructor(userRepo){
        this.userRepo = userRepo;
    }

    // Function to add a user to the database
    async addUser(req){
        const {username, role,email, password} = req.body;
        const id = uuid.v4();

        const response = {};

        if(!username || !role || !password || !id || !email){
            response.status = 400;
            //console.log(req.body);
            response.message = 'Invalid request';
            return response;
        }
        try {
            // Salt and hash the password
            const saltRounds = 10;
            const hashedPassword = bcryptjs.hashSync(password, saltRounds);

            const user = await this.userRepo.addUser(id, username,role,  email, hashedPassword);
            console.log("Verifico",username,role, email, hashedPassword);
            if(!user){
                response.status = 500;
                response.message = 'Internal server error';
                return response;
            }

            response.status = 200;
            response.message = 'User added successfully';
            return response;
        } catch (error) {
            console.error('Error adding user:', error); // Log the error
            response.status = 500;
            response.message = 'Internal server error';
            return response;
        }
    }

    async login(req, res) {
        const { email, password, role } = req.body;
        console.log("AAAA",email,"BBBB",password,"CCCC",role);

        if (!email || !password) {
            return res.status(400).json({ message: 'Invalid request' });
        }
    
        try {
            const user = await this.userRepo.getUserByUsername(email, role);

            if(user){
                // Check if the password is correct
                if(!bcryptjs.compareSync(password, user.password)) {
                    console.log("Password is not correct");
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
                console.log("Password is correct");

                const payload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                };
                console.log("Payload",payload);
                console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);


                // Generate a JWT token with a secret key stored in .env
                const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { 
                    expiresIn: '365d',
                });

                // Set the cookie with the JWT token
                res.cookie("access_token",token, {
                    httpOnly: true,  // Set to true to prevent client-side access
                    secure: true, 
                    sameSite: 'None', 
                    maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
                });

                res.cookie("user_Id", user.id, {
                    httpOnly: false, 
                    secure: true,
                    sameSite: "None",
                    maxAge: 365 * 24 * 60 * 60 * 1000,
                });
                
                return res.status(200).json({
                    message: 'Login successful',
                    token: token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    },
                });

 

            }
            else if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async logout(req, res) {
        
        const cookies = req.cookies;
        for (const cookieName in cookies) {
            res.cookie(cookieName, '', { 
                httpOnly: true,
                secure: true, 
                sameSite: 'None', 
                expires: new Date(0), 
            });
        }

         // Redirect to the login page
        res.redirect('/index'); 
    }

    async logout(req, res) {
        // Loop through all cookies and delete them by setting them to expire
        const cookies = req.cookies || {};
        
        // Svuotiamo i cookie
        for (const cookieName in cookies) {
            res.cookie(cookieName, '', { 
                httpOnly: true,
                secure: true, 
                sameSite: 'None', 
                expires: new Date(0), 
            });
        }

        // Mandiamo il codice 200 invece di fare redirect!
        res.status(200).json({ message: "Logout effettuato con successo" }); 
    }

    async getUserData(req, res) {
        const userId = req.headers.user_id;
        console.log("User ID from headers:", userId);
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
    
        try {
            const user = await this.userRepo.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            const userData = {
                username: user.username,
                email: user.email,
                role: user.role,
            };
    
            return res.status(200).json(userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


}

module.exports = {UserService};
