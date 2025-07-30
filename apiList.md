# APIs

authRouter
- POST /signUp
- POST /login
- POST /logout

profileRouter
- GET /profile/viewßß
- PATCH /profile/password
- PATCH /profile/edit

connectionRequestRouter
- POST /connection/send/interested/:userId
- POST /connection/send/ignored/:userId
- POST /connection/review/accepted/:requestId
- POST /connection/review/rejected/:requestId

userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed