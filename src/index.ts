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

interface MailpitMessagesSummary {
  messages: [MailpitMessageSummary];
}

interface MailpitMessageHeaders {
  [key: string]: string;
}

interface MailpitSendRequest {
  Attachments: [{
    Content: string,
    Filename: string
  }],
  Bcc: [string],
  Cc: [{
    Email: string, 
    Name: string
  }],
  From: {
    Email: string,
    Name: string
  },
  HTML: string,
  Headers: {
    [key: string]: string
  },
  ReplyTo: [{
    Email: string,
    Name: string,
  }],
  Subject: string,
  Tags: [string],
  Text: string,
  To: [{
    Email: string,
    Name: string
  }]
};

interface MailpitSendMessageConfirmation {
  ID: string
}

interface MailpitHTMLCheckResponse {
  Platforms: { 
    [key: string]: [string]
  },
  Total: { 
    Nodes: number,
    Partial: number,
    Supported: number,
    Tests: number,
    Unsupported: number,
  },
  Warnings: [{
    Category: "css" | "html",
    Description: string,
    Keywords: string,
  NotesByNumber: { 
    [key: string]: string,
  },
  Results: [{  
    Family: string,    
    Name: string,
    NoteNumber: string,
    Platform: string,
    Support: "yes" | "no" | "partial",
    Version: string,
  }],
  Score: {
    Found: number,
    Partial: number,
    Supported: number,
    Unsupported: number,
  },
    Slug: string,
    Tags: [string],
    Title: string,
    URL: string,
  }]
};

interface MailpitLinkCheckResponse {
  Errors: number,
  Links: [{
    Status: string,
    StatusCode: number,
    URL: string,
  }]
};

interface MailpitSpamAssassinResponse {
  Errors: number,
  IsSpam: boolean,
  Rules: [{ 
    Description: string,
    Name: string,
    Score: number
  }],
  Score: number,
};

interface MailpitReadStatusRequest {
    IDs: [string],
    Read: boolean
};

interface MailpitDeleteRequest {
  IDs: [string]
};

interface MailpitSearch {
  query: string,
  start: number,
  limit: number,
  tz: string,
};

interface MailpitSearchDelete {
  query: string,
  tz: string,
};

interface MailpitSetTagsRequest {
  IDs: [string],
  Tags: [string]
};

class MailpitClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
    });
  }

  private handleAxiosError(error: AxiosError): string {
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

  // Message
  public async getInfo(): Promise<MailpitInfo> {
    try {
      const response = await this.axiosInstance.get<MailpitInfo>('/api/v1/info');
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async getConfiguration(): Promise<MailpitConfiguration> {
    try {
      const response = await this.axiosInstance.get<MailpitConfiguration>('/api/v1/webui');
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async getMessageSummary(id: string): Promise<MailpitMessageSummary> {
    try {
      const response = await this.axiosInstance.get<MailpitMessageSummary>(`/api/v1/message/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async getMessageHeaders(id: string): Promise<MailpitMessageHeaders> {
    try {
      const response = await this.axiosInstance.get<MailpitMessageHeaders>(`/api/v1/message/${id}/headers`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async getMessageAttachment(id: string, partID: string): Promise<string> {
    try {
      const response = await this.axiosInstance.get<string>(`/api/v1/message/${id}/part/${partID}`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async getMessageSource(id: string): Promise<string> {
    try {
      const response = await this.axiosInstance.get<string>(`/api/v1/message/${id}/raw`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async getAttachmentThumbnail(id: string, partID: string): Promise<string> {
    try {
      const response = await this.axiosInstance.get<string>(`/api/v1/message/${id}/part/${partID}/thumb`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async releaseMessage(id: string, releaseRequest: {To: string[]}): Promise<string> {
    try {
      const response = await this.axiosInstance.post<string>(`/api/v1/message/${id}/release`, releaseRequest);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async sendMessage(sendReqest: MailpitSendRequest): Promise<MailpitSendMessageConfirmation> {
    try {
      const response = await this.axiosInstance.post<MailpitSendMessageConfirmation>(`/api/v1/send`, sendReqest);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  // Other
  public async htmlCheck(id: string): Promise<MailpitHTMLCheckResponse> {
    try {
      const response = await this.axiosInstance.get<MailpitHTMLCheckResponse>(`/api/v1/message/${id}/html-check`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async linkCheck(id: string): Promise<MailpitLinkCheckResponse> {
    try {
      const response = await this.axiosInstance.get<MailpitLinkCheckResponse>(`/api/v1/message/${id}/link-check`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async spamAssassinCheck(id: string): Promise<MailpitSpamAssassinResponse> {
    try {
      const response = await this.axiosInstance.get<MailpitSpamAssassinResponse>(`/api/v1/message/${id}/sa-check`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  // Messages
  public async listMessages(): Promise<MailpitMessagesSummary> {
    try {
      const response = await this.axiosInstance.get<MailpitMessagesSummary>(`/api/v1/messages`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async setReadStatus(readStatus: MailpitReadStatusRequest): Promise<string> {
    try {
      const response = await this.axiosInstance.put<string>(`/api/v1/messages`, readStatus);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async deleteMessages(deleteRequest: MailpitDeleteRequest): Promise<string> {
    try {
      const response = await this.axiosInstance.delete<string>(`/api/v1/messages`, {data: deleteRequest});
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  // See https://mailpit.axllent.org/docs/usage/search-filters/
  public async searchMessages(search: MailpitSearch): Promise<MailpitMessagesSummary> {
    try {
      const response = await this.axiosInstance.put<MailpitMessagesSummary>(`/api/v1/search`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  // See https://mailpit.axllent.org/docs/usage/search-filters/
  public async deleteMessagesBySearch(search: MailpitSearchDelete): Promise<string> {
    try {
      const response = await this.axiosInstance.delete<string>(`/api/v1/search`, {data: search});
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  // Tags
  public async getTags(): Promise<[string]> {
    try {
      const response = await this.axiosInstance.get<[string]>(`/api/v1/tags`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async setTags(request: MailpitSetTagsRequest): Promise<string> {
    try {
      const response = await this.axiosInstance.put<string>(`/api/v1/tags`, request);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async renameTag(tag: string, newTagName: string): Promise<string> {
    const encodedTag = encodeURI(tag);
    try {
      const response = await this.axiosInstance.put<string>(`/api/v1/tags/${encodedTag}`, {Name: newTagName});
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async deleteTag(tag: string): Promise<string> {
    const encodedTag = encodeURI(tag);
    try {
      const response = await this.axiosInstance.delete<string>(`/api/v1/tags/${encodedTag}`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  // Testing
  public async renderMessageHTML(id: string): Promise<string> {
    try {
      const response = await this.axiosInstance.get<string>(`/view/${id}.html`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }

  public async renderMessageText(id: string): Promise<string> {
    try {
      const response = await this.axiosInstance.get<string>(`/view/${id}.txt`);
      return response.data;
    } catch (error) {
      throw new Error(this.handleAxiosError(error as AxiosError));
    }
  }
  
}

export default MailpitClient;