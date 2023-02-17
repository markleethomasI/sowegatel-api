const userService = require("./user.service");

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { Company } = require("../models");

let mongoServer;

const dbConnect = async () => {
    mongoServer = await MongoMemoryServer.create();

    const uri = await mongoServer.getUri();

    const mongooseOpts = {
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useUnifiedTopology: true,
        // useFindAndModify: false
    };

    await mongoose.connect(uri, mongooseOpts);
};

const dbDisconnect = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

beforeAll(async () => {
    await dbConnect();
});

afterAll(() => {
    dbDisconnect();
});

describe("Create New Company", () => {
    let userId;
    let companyId;

    test('Should create company', async() => {
        const payload = {
            companyName: 'Sowegatel'
        }

        const response = await Company.create(payload)

        // Assign company id
        companyId = response._id;

    })

    test("Should not create with password less than 7 characters", async () => {
        const payload = {
            first_name: "Mark",
            last_name: "Thomas",
            company_name: "SowegaTel",
            phone: "+18134156944",
            email: "markleethomas.esq3@gmail.com",
            password: "123456",
            role: "globalAdmin",
            companyId
        };

        const response = await userService.createUser(payload);

        // Assign user Id 
        userId = response._id;
    });

    test('Should be visible in database', async () => {
        const user = await userService.findUserById(userId)

        console.log(user)
    })
});
