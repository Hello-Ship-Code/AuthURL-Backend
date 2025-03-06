import { Router, type Express, type Response } from 'express'

import { postUrlController } from '../controllers/urls/api/postUrlController'
import { urlAnalysis } from '../controllers/urls/api/urlAnalysis'
import { loginController } from '../controllers/users/api/login.controller'
import { signupController } from '../controllers/users/api/signup.controller'
import { uploadController } from '../controllers/users/api/upload.controller'
import { upload } from '../controllers/users/services/uploadMulterService'
import { homeViewController } from '../controllers/users/views/home-view.controller'
import { loginViewController } from '../controllers/users/views/login-view.controller'
import { profileViewController } from '../controllers/users/views/profile-view.controller'
import { signupViewController } from '../controllers/users/views/signup-view.controller'
import { uploadViewController } from '../controllers/users/views/upload-view.controller'
import { authMiddleware } from '../middlewares/authMiddleware'

import { errorHandler } from '../utils/error-handlers/error.handler'

const protectedRoutes = Router()

protectedRoutes.get('/:shortId', urlAnalysis)
protectedRoutes.get('/', profileViewController)
protectedRoutes.post('/', postUrlController)
protectedRoutes.post('/upload', upload.single('profilePicture'), uploadController)

const apiRouter = Router()

apiRouter.post('/login', loginController)
apiRouter.post('/signup', signupController)

const htmlRouter = Router()

htmlRouter.get('/login', loginViewController)
htmlRouter.get('/signup', signupViewController)
htmlRouter.get('/upload', uploadViewController)
htmlRouter.get('/', homeViewController)

const appRouter = (app: Express) => {
  app.use('/user', authMiddleware, protectedRoutes)
  app.use('/api', apiRouter)
  app.use('/', htmlRouter)
  app.use(errorHandler)
  app.use((_, response: Response) => {
    response.redirect('/')
  })
}

export { appRouter }