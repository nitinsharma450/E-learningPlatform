
import { ApiConfigs } from '../configs/ApiConfigs';
export default function Logout(navigate:any) {

  try {
    localStorage.removeItem(ApiConfigs.TOKEN_CREDENTIAL);
    navigate('/');
  } catch (error) {
    console.error("Logout failed:", error);
  }
}
