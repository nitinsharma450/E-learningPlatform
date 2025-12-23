
import { useNavigate } from 'react-router'
import type { ReactNode } from 'react'
import { ApiConfigs } from '../configs/ApiConfigs'

type PrivateRouteProps = {
    children: ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps){
    const navigate = useNavigate();

    let token = localStorage.getItem(ApiConfigs.TOKEN_CREDENTIAL)
    if(!token){
       navigate('/')
    }
    return children
}
