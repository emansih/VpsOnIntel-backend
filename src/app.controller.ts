import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LighshipService } from './lightship.service';
import { IntelResponse } from './model/IntelResponse';
import { LightshipAuthRepository } from './lightshipauthrepository.service';
import { IntelRequest } from './model/IntelRequest';
import { VpsLocalizability } from './model/lightship_response/LightshipResponse';
import { VpsDetails } from './VpsDetails';

@Controller()
export class AppController {
  constructor(private readonly lightshipService: LighshipService, private readonly lightshipAuthRepo: LightshipAuthRepository) {}

  @Post("/api/v1/getPoiInRadius")
  async getPoiInRadius(@Body() body: IntelRequest): Promise<IntelResponse[]> {
    const lat = body.lat
    const lng = body.lng
    if(!lat && !lng){
      throw new HttpException('Please include coordinates in the request body', HttpStatus.BAD_REQUEST);
    }
    const lightshipAuthToken = await this.lightshipAuthRepo.getAuthToken()
    if(!lightshipAuthToken){
      throw new HttpException('Unable to authenticate with Lightship Service!', HttpStatus.UNAUTHORIZED);
    }
    const poiResponse = await this.lightshipService.getPoisInRadius(lightshipAuthToken, lat, lng)
    const filteredPoi = poiResponse.pois.filter(poi => poi.vpsActivated && poi.vpsLocalizability === VpsLocalizability.Production)
    const intelResponse: IntelResponse[] = []
    filteredPoi.map(pois => {
      const poiId = pois.id
      const poiTitle = pois.title
      const poiLat = pois.lat
      const poiLon = pois.lng
      intelResponse.push({
        id: poiId,
        title: poiTitle,
        lat: poiLat,
        lng: poiLon
      })
    })
    return intelResponse;
  }
  
  
  @Post("/api/v1/activation")
  async getActivationDetails(@Body() body: any): Promise<VpsDetails> {
    console.log(body.poiIds)
    const lightshipAuthToken = await this.lightshipAuthRepo.getAuthToken()
    if(!lightshipAuthToken){
      throw new HttpException('Unable to authenticate with Lightship Service!', HttpStatus.UNAUTHORIZED);
    }
    const activationDetails = await this.lightshipService.getActivationDetails(lightshipAuthToken, body.poiIds)
    
    return activationDetails;
  }

}