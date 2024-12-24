import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { LightshipResponse } from './model/lightship_response/LightshipResponse';

@Injectable()
export class LighshipService {
    
    readonly LIGHTSHIP_URL = "https://lightship.dev/v1/vps/getPoisInRadius"
    readonly APPLICATION_ID = "1a1405cf-4481-4fec-8bc0-ffe38ec30613"

    constructor(private readonly httpService: HttpService) {}

    async getPoisInRadius(apiToken: string, lat: number, lon: number): Promise<LightshipResponse> {
        const url = `${this.LIGHTSHIP_URL}/${this.APPLICATION_ID}/${lat}/${lon}/500`;
        const headers = {
          'accept': '*/*',
          'authorization': apiToken,
          'content-type': 'application/json',
        };
        try {
          const response = await firstValueFrom(
            this.httpService.get(url, { headers }),
          );
          return response.data;
        } catch (error) {
          console.error('Error getting POI from Lightship:', error.message);
          return {
            pois: []
          }
        }
      }

  
}
