
const express = require('express')
//const logger = require('morgan')

const app = express() 
const PORT = process.env.PORT || 3000
const ROOT_DIR = '/public' //root directory for our static pages


//app.use( logger('dev'))

app.use(express.static(__dirname + ROOT_DIR)) 



app.use((req,res)=>{
  res.status(404).send('404: OOPS YOU BROKE THE INTERNET')
})



app.listen(PORT, err => {
    if(err) console.log(err)
    else {
          console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
          console.log(`To Test:`)
          console.log('user: ldnel password: secret')
          console.log('http://localhost:3000/index.html')
          console.log('http://localhost:3000/users')
      }
  })