process.loadEnvFile()
import express, {Request, Response} from 'express';


const PORT = process.env.PORT || 3001
const app = express()

app.post("/signup", async (req: Request, res: Response)=>{
    const accountId = crypto.randomUUID()
    res.json({
        accountId
    })
})

app.listen(PORT)

console.log(`Server started at port: ${PORT}`)
