import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { ProviderServiceType, ResponseType } from "../../sms/sms.service";
import { PinDto } from "../../otp/otp.dto";

@Injectable()
export class InfoBipService {
  constructor(private readonly configService: ConfigService) {}

  // create application
  async createApplication() {}
  // create message template
  async createMessageTemplate() {}

  async sendOTPSMS(urlParameter: string, destinationNumber: string, message: string) {
    this.validateNotEmpty(destinationNumber, "destinationNumber");
    this.validateNotEmpty(message, "message");

    const url = await this.buildUrl(urlParameter);
    const requestBody = await this.buildSendOTPRequestBody(
      destinationNumber,
      message
    );
    const axiosConfig = await this.buildAxiosConfig();

    return await axios
      .post(url, requestBody, axiosConfig)
      .then((res) => this.parseSuccessResponse(res))
      .catch((err) => this.parseFailedResponse(err));
  }

  async verifyOTP(pinDto: PinDto, urlParameter: string) {
    this.validateNotEmpty(pinDto?.pinId, "pinId");
    this.validateNotEmpty(pinDto?.pin, "pin");

    const url = await this.buildUrl(
      urlParameter,
      ProviderServiceType.verifyOTP,
      pinDto.pinId
    );
    const requestBody = await this.buildVerifyRequestBody(pinDto.pin);
    const axiosConfig = await this.buildAxiosConfig();

    return await axios
      .post(url, requestBody, axiosConfig)
      .then((res) => this.parseSuccessResponse(res))
      .catch((err) => this.parseFailedResponse(err));
  }

  private buildUrl(
    urlParameter: string,
    typeOfService?: string,
    pinId?: string
  ) {
    let url =
      `https://${this.configService.get<string>("INFOBIP_BASE_URL")}` +
      `${urlParameter}`;

    if (typeOfService === ProviderServiceType.verifyOTP && pinId) {
      url += `${pinId}`;
    }

    return url;
  }

  private buildHeaders(apiKey) {
    return {
      "Content-Type": "application/json",
      Authorization: `App ${apiKey}`,
    };
  }

  private async buildSendOTPRequestBody(destinationNumber: string, message:string) {
    return {
      applicationId: this.configService.get<string>("INFOBIP_APPLICATION_ID"),
      messageId: this.configService.get<string>("INFOBIP_MESSAGE_ID"),
      from: "Hello Tiger",
      to: destinationNumber,
    };
  }

  private async buildVerifyRequestBody(pin: string) {
    return {
      pin: pin,
    };
  }

  async parseSuccessResponse(axiosResponse): Promise<ResponseType> {
    const responseBody = axiosResponse.data;

    return {
      success: true,
      messageId: responseBody.pinId,
      status: responseBody.ncStatus,
      smsStatus: responseBody.smsStatus,
    } as ResponseType;
  }

  async parseFailedResponse(axiosError): Promise<ResponseType> {
    if (axiosError.response) {
      const responseBody = axiosError.response.data;
      return {
        success: false,
        errorMessage: responseBody.requestError.serviceException.text,
        errorDetails: responseBody,
      } as ResponseType;
    }
    return {
      success: false,
      errorMessage: axiosError.message,
    };
  }

  private validateNotEmpty(value: string, fieldName: string) {
    if (!value) {
      throw `${fieldName} parameter is mandatory`;
    }
  }

  private async buildAxiosConfig() {
    const apiKey = this.configService.get<string>("INFOBIP_API_KEY");
    return {
      headers: await this.buildHeaders(apiKey),
    };
  }
}
