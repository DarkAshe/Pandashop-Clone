const express = require('express');
const app = express()

const cors = require("cors");
app.use(cors());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require("./module/graphqlSchema.js")
const graphqlRoot = require("./rootValue/index.js");

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlRoot,
        graphiql: true,
    })
);


app.use('/dashboard', express.static('./resources/views/admin'));
app.use('/dashboard/css', express.static('./resources/css/admin'));
app.use('/dashboard/js', express.static('./resources/js/admin'));

app.use('/', express.static('./resources/views/frontend'));
app.use('/img', express.static('./resources/img'));
app.use('/js', express.static('./resources/js/frontend'));
app.use('/css', express.static('./resources/css/frontend'));

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running at localhost/${PORT}/graphql`);
});