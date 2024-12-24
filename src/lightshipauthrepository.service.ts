import { Injectable } from "@nestjs/common";
import { AuthStoreService } from "./authstore.service";
import { LightshipAuthService } from "./lightshipauth.service";
import { LightshipAuthResopnse } from "./model/LightshipAuthResponse";


@Injectable()
export class LightshipAuthRepository {
    
    constructor(private readonly authStore: AuthStoreService, private readonly lighshipAuthService: LightshipAuthService){ }

    async getAuthToken(): Promise<string> {
        const currentToken = await this.authStore.getToken()
        if(currentToken){
            return currentToken
        }
        const responsePayload = await this.lighshipAuthService.login(process.env.LIGHTSHIP_USERNAME, process.env.LIGHTSHIP_PASSWORD)
        const authResponse: LightshipAuthResopnse = {
            ...responsePayload,
            expiresIn: Number(responsePayload.expiresIn), 
        };
        if(authResponse.idToken && authResponse.expiresIn > 0){
            this.authStore.storeToken(authResponse.idToken, authResponse.expiresIn)
            return authResponse.idToken
        }
        return ""
    }
}