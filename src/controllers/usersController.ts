import { authenticatedRequest } from "../middlewares/auth";
import {  Response } from "express"
import { userService } from "../services/userService";

export const usersController = {
  //GET /users/current
  show: async (req: authenticatedRequest, res: Response) =>{

    try {
      const currentUser = req.user!
      return res.json(currentUser)
    } catch (err) {
      if (err instanceof Error){
        return res.status(400).json({message: err.message})
      } 
    }
  },

  //PUT /users/current
  update: async (req: authenticatedRequest, res: Response) => {
    const { id } = req.user!
    const  { firstName, lastName, phone, email, birth} = req.body

    try {
      const updatedUser = await userService.update(id, {firstName, lastName, phone, email, birth})
      return res.json(updatedUser)
    } catch (err) {
      if (err instanceof Error){
        return res.status(400).json({message: err.message})
      } 
    }
  },

  //PUT /users/current/password
  updatePassword: async (req: authenticatedRequest, res: Response) => {
      const user = req.user!
      const {currentPassword, newPassword} = req.body

      user.checkPassword(currentPassword, async (err, isSame) => {
        try {
          if (err) return res.status(400).json({ message: err.message})
          if (!isSame) return res.status(400).json({ message: 'Senha incorreta'})
  
          await userService.updatePassword(user.id, newPassword)
          return res.json(204).send()
        } catch (err) {
          if (err instanceof Error){
            return res.status(400).json({message: err.message})
          } 
        }
      })
     
  },

  //GET /users/current/watching
  watching: async (req: authenticatedRequest, res: Response) => {
    const { id } = req.user!

    try {
      const watching = await userService.getKeepWatchingList(id)
      return res.json(watching)
    } catch (err) {
      if (err instanceof Error){
        return res.status(400).json({message: err.message})
      } 
    }
  }
}