import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { ResponseType } from "../../sms/sms.service";

@Injectable()
export class InfoBipService {
  constructor(private readonly configService: ConfigService) {}

  // create application
  async createApplication() {}
  // create message template
  async createMessageTemplate() {}

  async sendOTPSMS(parameter, destinationNumber, message) {
    this.validateNotEmpty(destinationNumber, "destinationNumber");
    this.validateNotEmpty(message, "message");

    const url = await this.buildUrl(parameter);
    const requestBody = await this.buildRequestBody(destinationNumber, message);
    const axiosConfig = await this.buildAxiosConfig();

    return await axios
      .post(url, requestBody, axiosConfig as any)
      .then((res) => this.parseSuccessResponse(res))
      .catch((err) => this.parseFailedResponse(err));
  }

  private buildUrl(parameters: string) {
    return (
      `https://${this.configService.get<string>("INFOBIP_BASE_URL")}` +
      `${parameters}`
    );
  }

  private buildHeaders(apiKey) {
    return {
      "Content-Type": "application/json",
      Authorization: `App ${apiKey}`,
    };
  }

  private async buildRequestBody(destinationNumber, message) {
    return {
      applicationId: this.configService.get<string>("INFOBIP_APPLICATION_ID"),
      messageId: this.configService.get<string>("INFOBIP_MESSAGE_ID"),
      from: "Hello Tiger",
      to: destinationNumber,
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

  private validateNotEmpty(value, fieldName) {
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
