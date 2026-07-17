import jwt from 'jsonwebtoken'

// user authentication middleware

const authUser = async (req,res,next) =>{
    try {
        const headerToken = req.headers.token;
        const bearer = req.headers.authorization;
        const token = headerToken || (bearer && bearer.startsWith('Bearer ') ? bearer.split(' ')[1] : undefined);

        if(!token){
            return res.json({success:false , message:"Not Unauthorized Login Again"})
        }

        const token_decode = jwt.verify(token , process.env.JWT_SECRET)

        // Ensure body exists for GET requests too
        req.body = req.body || {}
        req.body.userId = token_decode.id

        // Also attach directly on req for convenience
        req.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        res.json({success:false , message:error.message})
        
    }
}

export default authUser 