import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { LightshipAuthResopnse } from "./model/LightshipAuthResponse";

@Injectable()
export class LightshipAuthService {

    private readonly LOGIN_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBp_fkYcJSbI3qyk5mPa6K53ZIi6UEjWdA"

    constructor(private readonly httpService: HttpService) {}

    async login(email: string, password: string): Promise<LightshipAuthResopnse>{
        const url = `${this.LOGIN_URL}`;
        const headers = {
            "accept-language": "en-US,en;q=0.9,zh-TW;q=0.8,zh;q=0.7,la;q=0.6",
            "content-type": "application/json",
            "referer": "https://lightship.dev/"
        };

        const body = {
            "returnSecureToken": true,
            "email": email, 
            "password": password,
            "clientType": "CLIENT_TYPE_WEB"
        }

        try {
          const response = await firstValueFrom(
            this.httpService.post(url, body, { headers }),
          );
          return response.data
        } catch (error) {
            console.error('Error trying to login to Lightship:', error.message);
            throw error;
        }
    }
}