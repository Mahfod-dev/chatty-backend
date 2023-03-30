import express from 'express'

const Router = express.Router()

Router.get('/', (req, res) => {
	res.send("Hello World Mahfod c'est un peu long!")
})

export default Router
