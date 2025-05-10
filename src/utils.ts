import { Connection } from "mysql2";

export async function databaseOperations(connection: Connection) {
    const DATABASE_NAME = process.env.DB_NAME || 'testdb';
    console.log("Database name: ----------", DATABASE_NAME);
    
    try {

        const connPromise = connection.promise();

        await connPromise.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE_NAME}\` 
          CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );

        await connPromise.query(`USE \`${DATABASE_NAME}\``);

        await connPromise.query(`
          CREATE TABLE IF NOT EXISTS users (
            ID INT NOT NULL AUTO_INCREMENT,
            email VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
            password VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
            type VARCHAR(255) CHARACTER SET 'utf8mb4' NOT NULL,
            active TINYINT DEFAULT 1,
            PRIMARY KEY (ID),
            UNIQUE KEY email_unique (email)
          );
        `);

        await connPromise.query(`
          DROP PROCEDURE IF EXISTS addUser;
        `);

        await connPromise.query(`
          CREATE PROCEDURE addUser(
            IN p_email VARCHAR(255),
            IN p_password VARCHAR(255),
            IN p_type VARCHAR(255),
            IN p_active TINYINT
          )
          BEGIN
            INSERT INTO users (email, password, type, active)
            VALUES (p_email, p_password, p_type, IFNULL(p_active, 1));
          END
        `);

        await connPromise.query(`
          CALL addUser('example@yahoo.com', 'veryEasy555', 'admin', 1);    
        `);

    } catch (error) {
        console.error("Error during database operations:", error);
        throw error;
    }
}