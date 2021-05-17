import 'reflect-metadata'
import mysql from 'mysql';
import config from './config';
import { singleton } from 'tsyringe';

@singleton()
class DBService {
    private connection: mysql.Pool;
    private params: mysql.PoolConfig = {
        host: config.mysql.host,
        database: config.mysql.database,
        user: config.mysql.user,
        password: config.mysql.password,
        port: config.mysql.port,
        connectionLimit: config.mysql.connectionLimit,
    }

    constructor() {
        this.connection = this.initConnection();
    }

    private initConnection = (): mysql.Pool => {
        const connection = mysql.createPool(this.params);
        // connection.on('connection', (err) => {
        //     if (err) {
        //         console.log('Connect Database Error: ', err);
        //     } else {
        //         console.log('Database connected!!!');
        //     }
        // })
        return connection;
    }

    getConnection = () => {
        return this.connection;
    }
}

export default DBService;
