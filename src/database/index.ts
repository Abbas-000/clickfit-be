import { config } from '../config';
import mysql from 'mysql2';

export const connection = mysql.createConnection({
  host     : config.DB_HOST,
  port     : Number(config.DB_PORT),
  user     : config.DB_USER,
  password : config.DB_PASSWORD,
});
