import HttpServer, {HttpMethods} from '../http/HttpServer';
import Login from '../../application/usecase/Login';
import Signup from '../../application/usecase/Signup';
import { Middleware } from '../http/HttpServer';

export default class AccountController {
  static config(httpServer: HttpServer, signup: Signup, login: Login, auth?: Middleware) {

	httpServer.route(HttpMethods.post, '/signup', async ({ body }: any) => {
      return await signup.execute(body);
    });

    httpServer.route(HttpMethods.post, '/login', async ({ body }: any) => {
      return await login.execute(body); 
    });
  }
}
