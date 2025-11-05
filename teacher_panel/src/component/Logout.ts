
import { ApiConfigs } from "../Configs/ApiConfigs";

 
 export async function logout(navigate:any){
  
     
    let response=localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL)
    if(response){
        localStorage.removeItem(ApiConfigs.TOKEN_CREDENTIAL)
          navigate('/')
    }

 }

