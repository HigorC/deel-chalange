import express from 'express';
import bodyParser from 'body-parser';

import { sequelize } from './models/model.js'
import { getProfile } from './middlewares/getProfile.js'
import routes from "./routes/index.js"

const app = express();

app.use(bodyParser.json());
app.use(getProfile)

app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use("/api/v1", routes)

export default app;

