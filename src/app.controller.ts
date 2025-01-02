import { Body, Controller, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LighshipService } from './lightship.service';
import { IntelResponse } from './model/IntelResponse';
import { LightshipAuthRepository } from './lightshipauthrepository.service';
import { IntelRequest } from './model/IntelRequest';
import { VpsLocalizability } from './model/lightship_response/LightshipResponse';
import { VpsDetails } from './VpsDetails';
import { ActivationDetailsRequest } from './model/ActivationDetailsRequest';
import { TrustMasterRepo } from './trustmasterrepo.service';

@Controller()
export class AppController {
  constructor(private readonly lightshipService: LighshipService, 
    private readonly lightshipAuthRepo: LightshipAuthRepository, private readonly trustMasterRepo: TrustMasterRepo) {}

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
  async getActivationDetails(@Body() body: ActivationDetailsRequest, @Headers("Authorization") header: string): Promise<VpsDetails> {
    const lightshipAuthToken = await this.lightshipAuthRepo.getAuthToken()
    if(!lightshipAuthToken){
      throw new HttpException('Unable to authenticate with Lightship Service!', HttpStatus.UNAUTHORIZED);
    }
    const authToken = header.replace("Bearer", "")
    const isValid = await this.trustMasterRepo.validateUserToken(authToken)
    if(isValid){
      const activationDetails = await this.lightshipService.getActivationDetails(lightshipAuthToken, body.poiIds)
      return activationDetails;  
    } else {
      throw new HttpException('Unable to authenticate with TrustMaster!', HttpStatus.UNAUTHORIZED);
    }
  }


  @Post("/api/v1/user")
  async getUserToken(@Body() body: any){
    const userCode = body.userCode
    const userToken = await this.trustMasterRepo.getTrustMasterUserToken(userCode)
    return userToken
  }
}