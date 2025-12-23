
import { ApiConfigs } from "../Configs/ApiConfigs";
import { Api } from "../services/ApiService";
import { AuthenticationService } from "../services/AuthencationService";

 
 export async function logout(navigate: any, teacherId: string | null,){
  

   try {
      if(await AuthenticationService.isAuthenticated()){
         Api('teacher/logout',{teacherId})
      }
   } catch (error) {
      console.log(error)
   }
     
    let response=localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL)
    if(response){
        localStorage.removeItem(ApiConfigs.TOKEN_CREDENTIAL)
          navigate('/')
    }

 }

