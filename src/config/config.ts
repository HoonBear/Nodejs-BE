import dotenv from "dotenv";

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST || "";
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || "";
const MYSQL_USER = process.env.MYSQL_USER || "";
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "";
const MYSQL_PORT = process.env.MYSQL_PORT || "";
const MYSQL_CONNECTIONLIMIT = process.env.MYSQL_CONNECTIONLIMIT || 10;

const MYSQL = {
  host: MYSQL_HOST,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  port: Number(MYSQL_PORT),
  connectionLimit: Number(MYSQL_CONNECTIONLIMIT),
};
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SERVER_DOMAIN_ASSETS = process.env.SERVER_DOMAIN_ASSETS || "";
const ASSETS_PORT = process.env.ASSETS_PORT || 3001

const LogConfig = {
  logDir: process.env.LOG_DIR || 'logs',
  logLevel: process.env.LOG_LEVEL || 'info',
}

const SERVER = {
  hostName: SERVER_HOSTNAME,
  port: SERVER_PORT,
  domainAssets: SERVER_DOMAIN_ASSETS,
  assestPort: ASSETS_PORT
};

const extenalServer = process.env.URL_CHECK_LOGIN;

const config = {
  mysql: MYSQL,
  server: SERVER,
  extenalServer,
  LogConfig,
  isProduction: process.env.NODE_ENV === "production",
};

export default config;
