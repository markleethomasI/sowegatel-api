const router = require('express').Router()
const authRoute = require('./auth.route')
const usersRoute = require('./users.route')
const debitRoute = require('./debit.route')
const numbersRoute = require('./numbers.route')
const sipRoute = require('./sip.route')

const routes = [{
    path: '/auth',
    route: authRoute
}, {
    path: '/users',
    route: usersRoute
}, {
    path: '/debit',
    route: debitRoute
}, {
    path: '/numbers',
    route: numbersRoute
}, {
    path: '/sip',
    route: sipRoute
}]

routes.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router