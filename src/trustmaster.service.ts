import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TrustMasterProfile } from "./model/TrustMasterTrustProfile";
import { TrustMasterOAuth } from "./model/TrustMasterOAuth";
import { TrustMasterUserProfile } from "./model/TrustMasterUserProfile";


@Injectable()
export class TrustMaster {

    readonly TRUSTMASTER_URL = "https://trust.reswue.net"

    constructor(private readonly httpService: HttpService) {}

    async getTrustMasterToken(clientId: string, clientSecret: string): Promise<TrustMasterOAuth>{
        const url = `${this.TRUSTMASTER_URL}/oauth/token`;
        const headers = {
            'Accept': '*/*',
            'content-type': 'application/x-www-form-urlencoded',
            'User-Agent': "Contact Info: https://res.blue/agent/hisname; Application: https://github.com/emansih/VpsOnIntel-backend;"
          };
          try {
            const response = await firstValueFrom(
              this.httpService.post(url, { "grant_type": "client_credentials", 
                "client_id": clientId, "client_secret": clientSecret, "scope": "tos-20190301" }, { headers }),
            )
            return response.data
          } catch(error){
            console.error('Error getting generic TrustMaster token:', error.message);
            return {
                access_token: "",
                expires_in: 0, 
                token_type: ""
            }  
        }
    }


    async getTrustMasterUserToken(clientId: string, clientSecret: string, 
      redirectUrl: string, code: string): Promise<TrustMasterOAuth>{
      const url = `${this.TRUSTMASTER_URL}/oauth/token`;
      const headers = {
          'Accept': '*/*',
          'content-type': 'application/x-www-form-urlencoded',
          'User-Agent': "Contact Info: https://res.blue/agent/hisname; Application: https://github.com/emansih/VpsOnIntel-backend;"
        };
        try {
          
          const response = await firstValueFrom(
            this.httpService.post(url, { "grant_type": "authorization_code", 
              "client_id": clientId, "client_secret": clientSecret, "redirect_uri": redirectUrl, "code": code}, { headers }),
          )
          return response.data
        } catch(error){
          console.error('Error getting generic TrustMaster token:', error.message);
          return {
              access_token: "",
              expires_in: 0, 
              token_type: ""
          }  
      }
    }

    async getUserTrustById(apiToken: string, userId: string): Promise<TrustMasterProfile>{
        const url = `${this.TRUSTMASTER_URL}/api/v4/user/${userId}/trust`;
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiToken}`,
            'content-type': 'application/json',
            'User-Agent': "Contact Info: https://res.blue/agent/hisname; Application: https://github.com/emansih/VpsOnIntel-backend;"
          };
        try {
          const response = await firstValueFrom(
            this.httpService.get(url, { headers }),
          );
          return response.data;
        } catch (error) {
          console.error(`Error getting user ${userId} profiile. Error: `, error.message);
          return null
        }
    }

    async getUserProfileById(userToken: string): Promise<TrustMasterUserProfile>{
      const url = `${this.TRUSTMASTER_URL}/api/v4/me`
      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${userToken}`,
        'content-type': 'application/json',
        'User-Agent': "Contact Info: https://res.blue/agent/hisname; Application: https://github.com/emansih/VpsOnIntel-backend;"
      };
      try {
        const response = await firstValueFrom(
          this.httpService.get(url, { headers }),
        );
        return response.data;
      } catch (error) {
        console.error(`Error getting user profiile. Error: `, error.message);
        return null
      }
    }

}