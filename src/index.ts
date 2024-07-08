import axios, { AxiosInstance, AxiosError } from 'axios';

interface MailpitInfo {
  Database: string,
  DatabaseSize: number,
  LatestVersion: string,
  Messages: number,
  RuntimeStats: {
    Memory: number,
    MessagesDeleted: number,
    SMTPAccepted: number,
    SMTPAcceptedSize: number,
    SMTPIgnored: number,
    SMTPRejected: number,
    Uptime: number,
  },
  Tags: {
    [key: string]: number
  },
  Unread: number,
  Version: string
}

interface MailpitConfiguration {
  DuplicatesIgnored: boolean,
  Label: string,
  SpamAssassin: boolean
  MessageRelay: {
    AllowedRecipients: string,
    Enabled: boolean,
    ReturnPath: string,
    SMTPServer: string
  },
};

interface MailpitMessageSummary {
  Attachments: [
    {
      ContentID: string,
      ContentType: string,
      FileName: string,
      PartID: string,
      Size: number
    }
  ],
  Bcc: [
    {
      Address: string,
      Name: string
    }
  ],
  Cc: [
    {
      Address: string,
      Name: string
    }
  ],
  Date: string,
  From: {
    Address: string,
    Name: string
  },
  HTML: string,
  ID: string,
  Inline: [
    {
      ContentID: string,
      ContentType: string,
      FileName: string,
      PartID: string,
      Size: number
    }
  ],
  MessageID: string,
  ReplyTo: [
    {
      Address: string,
      Name: string
    }
  ],
  ReturnPath: string,
  Size: number,
  Subject: string,
  Tags: [
    string
  ],
  Text: string,
  To: [
    {
      Address: string,
      Name: string
    }
  ]
}

interface MailpitMessageHeaders {
  [key: string]: string;
}

class MailpitClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
    });
  }

  private handleError(error: AxiosError): string {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Error Response:', error.response.data);
      return `Mailpit API Error: ${error.response.status} ${error.response.statusText}`;
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Error Request:', error.request);
      return 'Mailpit API Error: No response received from server.';
    } else {
      // Something happened in setting up the request
      console.error('Error Message:', error.message);
      return `Mailpit API Error: ${error.message}`;
    }
  }

  public async getInfo(): Promise<MailpitInfo> {
    try {
      const response = await this.axiosInstance.get<MailpitInfo>('/api/v1/info');
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error as AxiosError));
    }
  }

  public async getConfiguration(): Promise<MailpitConfiguration> {
    try {
      const response = await this.axiosInstance.get<MailpitConfiguration>('/api/v1/webui');
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error as AxiosError));
    }
  }

  public async getMessageSummary(id: string): Promise<MailpitMessageSummary> {
    try {
      const response = await this.axiosInstance.get<MailpitMessageSummary>(`/api/v1/message/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error as AxiosError));
    }
  }

  public async getMessageHeaders(id: string): Promise<MailpitMessageHeaders> {
    try {
      const response = await this.axiosInstance.get<MailpitMessageHeaders>(`/api/v1/message/${id}/headers`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error as AxiosError));
    }
  }

  public async getMessageAttachment(id: string, partID: string): Promise<string> {
    try {
      const response = await this.axiosInstance.get<string>(`/api/v1/message/${id}/part/${partID}`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error as AxiosError));
    }
  }

  public async getAttachmentThumbnail(id: string, partID: string): Promise<string> {
    try {
      const response = await this.axiosInstance.get<string>(`/api/v1/message/${id}/part/${partID}/thumb`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error as AxiosError));
    }
  }

  public async releaseMessage(id: string, releaseRequest: {To: string[]}): Promise<void> {
    // TODO
    return;
  }

  public async sendMessage(): Promise<void> {
    // TODO
    return;
  }

  
}

export default MailpitClient;