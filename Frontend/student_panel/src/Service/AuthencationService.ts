
import { ApiConfigs } from "../Configs/ApiConfigs";

export class AuthenticationService{

    static async isAuthenticated(){
    var token=await this.getToken()
    return !!token;
    }

    static async getToken(){
         let token=localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL)
       
         return token;
    }
}