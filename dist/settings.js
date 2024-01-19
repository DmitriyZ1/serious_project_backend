const PORT = 3300;
const URLdb = "mongodb://localhost:27017/bicycles";
const CORS = "http://localhost:3000";
//const CORS = "http://45.12.239.38:3000"
const optionsMongo = {
    authSource: "admin",
    user: "mongo-user",
    pass: "222user"
};
export { PORT, URLdb, CORS, optionsMongo };
