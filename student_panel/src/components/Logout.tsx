
import { AuthenticationService } from '../Service/AuthencationService';
import { Api } from '../Service/ApiService';
import { ApiConfigs } from '../Configs/ApiConfigs';

export default async function Logout(userId:string) {

     if(await AuthenticationService.isAuthenticated()){
      console.log(userId)
         let response=await Api('student/logout',{userId})

         if(response.status=200){
             localStorage.removeItem(ApiConfigs.TOKEN_CREDENTIAL);
       window.location.href = "/login";
         }

          

      }
    
     
}
