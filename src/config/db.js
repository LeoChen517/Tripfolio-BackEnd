const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const schema = require('../models/schema');
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

module.exports = { db, pool };