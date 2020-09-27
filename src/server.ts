import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as cors from "cors";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import mongoose = require("mongoose"); 
import chalk = require('chalk');
import env from './environment/env';
import axios from 'axios';

//routes
import { UserRoute } from "./routes/user.route";
import FundWalletRoute from "./routes/fund-wallet.route";
import CunRateRoute from "./routes/currency-rate.route";
import TransRoute from './routes/transaction.route';
import UserBankRoute from './routes/user-bank.route';


const apiUrl = 'https://bureaudchange.herokuapp.com'
/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;
  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();
    //configure application
    this.config();
    //add routes
    this.routes();
    // this.keepAlive();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  
  public config() {
    //add static paths
    this.app.use(express.static(path.join(__dirname, "public")));
    //mount logger
    this.app.use(logger("dev"));
    //mount json form parser
    this.app.use(bodyParser.json());
    //mount query string parser
    this.app.use(bodyParser.urlencoded({extended: true}));
    //mount cookie parser
    this.app.use(cookieParser('secretKey'));
    //mount override
    this.app.use(methodOverride());
    //cors error allow
    this.app.options("*", cors());
    this.app.use(cors());

    const mongoLocalUrl = ' mongodb://localhost:27017/bureaudchange'

    // Mongose => fix all deprecation warnings
    mongoose.set('useCreateIndex', true);
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useFindAndModify', false);

    // Connect to MongoDB
    mongoose.connect(env.MONGODB_URI)
    .then(() => {
      console.log('✌🏾 Successfully connected to MongoDB');
    })
    .catch(err => {
      console.log(chalk.default.red.bgBlack.bold('An error occured while conencting to MongoDB'));
    });

 
    // mongoose.set('useFindAndModify', false);
    // mongoose.set('useUnifiedTopology', true);
    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        err.status = 404;
        next(err);
    });
    //error handling
    this.app.use(errorHandler());
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('../swagger.json');

    console.log(chalk.default.yellow.bgBlack.bold("Loading user controller routes"));
    new UserRoute().loadRoutes('/user', router);
    console.log(chalk.default.yellow.bgBlack.bold("Loading fund wallet routes"));
    FundWalletRoute.loadRoutes('/fund-wallet', router)
    console.log(chalk.default.yellow.bgBlack.bold("Loading currency rates routes"));
    CunRateRoute.loadRoutes('/cun-rate', router)
    console.log(chalk.default.yellow.bgBlack.bold("Loading transaction routes"));
    TransRoute.loadRoutes('/trans', router)
    console.log(chalk.default.yellow.bgBlack.bold("Loading user bank routes"));
    UserBankRoute.loadRoutes('/user-bank', router)

    //use router middleware
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.app.use('/',router);
    this.app.get('/', (req, res) => {
      return res.send('Welcome to Xchange Api');
    })
    this.app.all('*', (req, res)=> {
      return res.status(404).json({ status: 404, error: 'route not found' });
    });
  }
  
  private async keepAlive() {
    setInterval(async () => {
      try {
        const res = await axios.get(apiUrl);
        console.log(res.data);
      } catch (error) {
        const err = error.response && error.response.data ? error.response.data : error.response
        console.log(err);
      }
    }, 60000*20);
  }
}