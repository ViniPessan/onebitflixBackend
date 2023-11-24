import { Request, Response } from "express"
import { userService } from "../services/userService"
import { jwtService } from "../services/jwtService"

 //POST /auth/register
export const authController = {
  register: async (req: Request, res: Response) =>{
    const {firstName, lastName, email, password, birth, phone} = req.body

    try {
      const userAlreadyExist = await userService.findByEmail(email)

      if(userAlreadyExist){
        throw new Error ('Este email já foi cadastrado!')
      }

      const user = await userService.create({
        firstName,
        lastName,
        password,
        birth,
        phone,
        email,
        role: "user"
      })

      return res.status(201).json(user)

    } catch (err) {
      if (err instanceof Error){
        return res.status(400).json({message: err.message})
      }
    }
  },

  //POST /auth/login
  login: async (req: Request, res: Response) =>{
    const {email, password} = req.body
    try {
      const user = await userService.findByEmail(email)

      if (!user) return res.status(404).json({ message: 'Email não registrado.'})

      user.checkPassword(password, (err, isSame) => {
        if (err) return res.status(400).json({ message: err.message})
        if (!isSame) return res.status(401).json({ message: 'Senha incorreta!'})

        const payload = {
          id: user.id,
          firstname: user.firstName,
          email: user.email
        }
        const token = jwtService.signToken(payload, '7d')

        return res.json({authenticated: true, ...payload, token   })
      })
      

    

    } catch (err) {
      if (err instanceof Error){
        return res.status(400).json({message: err.message})
      }
    }
  }
}