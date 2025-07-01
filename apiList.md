# List of DevFinder API(s)

- Auth router//user onboarding and authentication
  POST /signup
  POST /login
  POST /logout

//Profile Router - View and Update
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

- Connection Router - //Sending Connections

POST /request/send/interested/:userID
POST /request/send/ignored/:userID

- Request Router - //Receiving connections

POST /request/review/accepted/:requestID
POST /request/review/rejected/:requestID

- Feed Router //Feed and Connections

GET /connections
GET /requests/received
GET /feed - gets profile of users on the platform

STATUS : INTERESTED/IGNORED/ACCEPTED/REJECTED
