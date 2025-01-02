import { Injectable } from "@nestjs/common";
import { TrustMaster } from "./trustmaster.service";
import { AuthStoreService } from "./authstore.service";


@Injectable()
export class TrustMasterRepo {
    
    constructor(private readonly authStore: AuthStoreService, private readonly trustMasterService: TrustMaster){ }


    private async getGenericToken(): Promise<string>{
        const clientSecret = process.env.TRUSTMASTER_CLIENT_SECRET
        const clientId = process.env.TRUSTMASTER_CLIENT_ID

        if(!clientId || !clientSecret){
            return ""
        }
        const cachedToken = await this.authStore.getTrustMasterAdminToken()
        if(cachedToken){
            return cachedToken
        }
        const trustMasterTokenService = await this.trustMasterService.getTrustMasterToken(clientId, clientSecret)
        const token = trustMasterTokenService.access_token
        const expiresIn = trustMasterTokenService.expires_in
        if(token && expiresIn > 0){
            this.authStore.storeTrustMasterAdminToken(token, expiresIn)
            return token
        }
        return ""
    }

    private async isUserTrusted(userId: string): Promise<Boolean>{
        const apiToken = await this.getGenericToken()
        if(!apiToken){
            return false
        }
        const trustMasterUserService = await this.trustMasterService.getUserTrustById(apiToken, userId)
        const trust = trustMasterUserService.trust
        const approvedTrust = ["fully", "approver", "admin"]
        if(trust && approvedTrust.includes(trust.decision)){
            return true
        }
        return false
    }

    async validateUserToken(userToken: string){
        const userProfile = await this.trustMasterService.getUserProfileById(userToken)
        const isUserTrustworthy = await this.isUserTrusted(userProfile.trustmaster_id)
        if(isUserTrustworthy){
            return true
        } else {
            return false
        }
    }

    async getTrustMasterUserToken(code: string){
        const clientSecret = process.env.TRUSTMASTER_CLIENT_SECRET
        const clientId = process.env.TRUSTMASTER_CLIENT_ID
        const url = process.env.TRUSTMASTER_REDIRECT_URL
        const userOAuth = await this.trustMasterService.getTrustMasterUserToken(clientId, clientSecret, url, code)
        return userOAuth
    }
}