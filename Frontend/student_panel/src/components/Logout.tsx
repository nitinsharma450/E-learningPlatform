
import { AuthenticationService } from '../Service/AuthencationService';
import { Api } from '../Service/ApiService';
import { ApiConfigs } from '../Configs/ApiConfigs';
import { io, Socket } from 'socket.io-client';
import { socket } from '../socket';


export default async function Logout(userId:string) {


     if(await AuthenticationService.isAuthenticated()){
      console.log(userId)
         let response=await Api('student/logout',{userId})

         if(response.status=200){
             localStorage.removeItem(ApiConfigs.TOKEN_CREDENTIAL);
            socket.emit("userStatusChange", { userId, isActive: false });

       window.location.href = "/login";
         }

          

      }
    
     
}
