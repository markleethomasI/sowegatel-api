const { MongoMemoryReplSet } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const Company = require('../models/Company.model')

let replset;
let user;
let company;

beforeAll(async () => {
    // This will create an new instance of "MongoMemoryReplSet" and automatically start all Servers
    replset = await MongoMemoryReplSet.create({ replSet: { count: 4 } }); // This will create an ReplSet with 4 members

    const uri = replset.getUri();

    mongoose.connect(uri);

    company = await Company.create({
        companyName: 'sowegatel'
    })

    user = await User.create({
        firstName: 'Mark',
        lastName: 'Thomas',
        email: 'markleethomas.esq3@gmail.com',
        password: '1234',
        companyId: company.companyId
    })
});

afterAll(async () => {
    await replset.stop();
    await mongoose.connection.close();
});

const { token: tokenService } = require('./index')
const jwt = require('jsonwebtoken')
const User = require('../models/User.model');
const userService = require("./user.service");

describe('Test token service', () => {
    
    let token;

    test('Should generate token', async () => {
        token = await tokenService.generateToken(user._id)
        
        const tokenDecoded = await jwt.verify(token, process.env.TOKEN_SECRET)

        expect(JSON.stringify(tokenDecoded.sub)).toStrictEqual(JSON.stringify(user._id))
    })

    test('Should save token', async () => {
        await tokenService.saveToken(user._id, token)

        user = await User.findOne();

        expect(user.tokens[0].token).toBe(token)
    })

    test('verifyToken should return true after token creation', async () => {
        const isValidToken = await tokenService.verifyToken(token)

        expect(isValidToken).toBe(true)
    })

    test('invalidate token should return true on call', async () => {
        const invalidateTokenResponse = await tokenService.invalidateToken(user._id, token)

        expect(invalidateTokenResponse).toBe(true);
    })

    test('Database should be clear of all tokens after invalidate token is called', async () => {
        const user = await User.findOne();

        expect(user.tokens.length).toBe(0)
    })
})