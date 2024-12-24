import { Injectable } from "@nestjs/common";
import { Redis } from "@upstash/redis";


@Injectable()
export class AuthStoreService {

    private readonly redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    })      
    
    async storeToken(lightshipAuthToken: string, expireTime: number){
        await this.redis.set('LIGHTSHIP_AUTH_TOKEN', lightshipAuthToken, { ex: expireTime });
    }

    async getToken(): Promise<string>{
        return this.redis.get('LIGHTSHIP_AUTH_TOKEN')
    }

    async removeToken(){
        await this.redis.del('LIGHTSHIP_AUTH_TOKEN')
    }
}