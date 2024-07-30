import axios, { AxiosInstance } from "axios";

export interface MailpitInfo {
  Database: string;
  DatabaseSize: number;
  LatestVersion: string;
  Messages: number;
  RuntimeStats: {
    Memory: number;
    MessagesDeleted: number;
    SMTPAccepted: number;
    SMTPAcceptedSize: number;
    SMTPIgnored: number;
    SMTPRejected: number;
    Uptime: number;
  };
  Tags: {
    [key: string]: number;
  };
  Unread: number;
  Version: string;
}

export interface MailpitConfiguration {
  DuplicatesIgnored: boolean;
  Label: string;
  SpamAssassin: boolean;
  MessageRelay: {
    AllowedRecipients: string;
    Enabled: boolean;
    ReturnPath: string;
    SMTPServer: string;
  };
}

export interface MailpitMessageSummary {
  Attachments: [
    {
      ContentID: string;
      ContentType: string;
      FileName: string;
      PartID: string;
      Size: number;
    },
  ];
  Bcc: [
    {
      Address: string;
      Name: string;
    },
  ];
  Cc: [
    {
      Address: string;
      Name: string;
    },
  ];
  Date: string;
  From: {
    Address: string;
    Name: string;
  };
  HTML: string;
  ID: string;
  Inline: [
    {
      ContentID: string;
      ContentType: string;
      FileName: string;
      PartID: string;
      Size: number;
    },
  ];
  MessageID: string;
  ReplyTo: [
    {
      Address: string;
      Name: string;
    },
  ];
  ReturnPath: string;
  Size: number;
  Subject: string;
  Tags: [string];
  Text: string;
  To: [
    {
      Address: string;
      Name: string;
    },
  ];
}

export interface MailpitMessagesSummary {
  messages: [MailpitMessageSummary];
}

export interface MailpitMessageHeaders {
  [key: string]: string;
}

export interface MailpitSendRequest {
  Attachments: [
    {
      Content: string;
      Filename: string;
    },
  ];
  Bcc: [string];
  Cc: [
    {
      Email: string;
      Name: string;
    },
  ];
  From: {
    Email: string;
    Name: string;
  };
  HTML: string;
  Headers: {
    [key: string]: string;
  };
  ReplyTo: [
    {
      Email: string;
      Name: string;
    },
  ];
  Subject: string;
  Tags: [string];
  Text: string;
  To: [
    {
      Email: string;
      Name: string;
    },
  ];
}

export interface MailpitSendMessageConfirmation {
  ID: string;
}

export interface MailpitHTMLCheckResponse {
  Platforms: {
    [key: string]: [string];
  };
  Total: {
    Nodes: number;
    Partial: number;
    Supported: number;
    Tests: number;
    Unsupported: number;
  };
  Warnings: [
    {
      Category: "css" | "html";
      Description: string;
      Keywords: string;
      NotesByNumber: {
        [key: string]: string;
      };
      Results: [
        {
          Family: string;
          Name: string;
          NoteNumber: string;
          Platform: string;
          Support: "yes" | "no" | "partial";
          Version: string;
        },
      ];
      Score: {
        Found: number;
        Partial: number;
        Supported: number;
        Unsupported: number;
      };
      Slug: string;
      Tags: [string];
      Title: string;
      URL: string;
    },
  ];
}

export interface MailpitLinkCheckResponse {
  Errors: number;
  Links: [
    {
      Status: string;
      StatusCode: number;
      URL: string;
    },
  ];
}

export interface MailpitSpamAssassinResponse {
  Errors: number;
  IsSpam: boolean;
  Rules: [
    {
      Description: string;
      Name: string;
      Score: number;
    },
  ];
  Score: number;
}

export interface MailpitReadStatusRequest {
  IDs: [string];
  Read: boolean;
}

export interface MailpitDeleteRequest {
  IDs: [string];
}

export interface MailpitSearch {
  query: string;
  start: number;
  limit: number;
  tz: string;
}

export interface MailpitSearchDelete {
  query: string;
  tz: string;
}

export interface MailpitSetTagsRequest {
  IDs: [string];
  Tags: [string];
}

export class MailpitClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      validateStatus: function (status) {
        return status === 200;
      },
    });
  }

  private async handleRequest<T>(
    request: () => Promise<{ data: T }>,
  ): Promise<T> {
    try {
      const response = await request();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with a status other than 2xx
          throw new Error(
            `Mailpit API Error: ${error.response.status} ${error.response.statusText}: ${JSON.stringify(error.response.data)}`,
          );
        } else if (error.request) {
          // Request was made but no response was received
          throw new Error(
            "Mailpit API Error: No response received from server.",
          );
        } else {
          // Something happened in setting up the request
          throw new Error(`Mailpit API Error: ${error.message}`);
        }
      } else {
        throw new Error("Unexpected Error: " + error);
      }
    }
  }

  // Message
  public async getInfo(): Promise<MailpitInfo> {
    return this.handleRequest(() =>
      this.axiosInstance.get<MailpitInfo>("/api/v1/info"),
    );
  }

  public async getConfiguration(): Promise<MailpitConfiguration> {
    return this.handleRequest(() =>
      this.axiosInstance.get<MailpitConfiguration>("/api/v1/webui"),
    );
  }

  public async getMessageSummary(id: string): Promise<MailpitMessageSummary> {
    return this.handleRequest(() =>
      this.axiosInstance.get<MailpitMessageSummary>(`/api/v1/message/${id}`),
    );
  }

  public async getMessageHeaders(id: string): Promise<MailpitMessageHeaders> {
    return this.handleRequest(() =>
      this.axiosInstance.get<MailpitMessageHeaders>(
        `/api/v1/message/${id}/headers`,
      ),
    );
  }

  public async getMessageAttachment(
    id: string,
    partID: string,
  ): Promise<string> {
    return this.handleRequest(() =>
      this.axiosInstance.get<string>(`/api/v1/message/${id}/part/${partID}`),
    );
  }

  public async getMessageSource(id: string): Promise<string> {
    return this.handleRequest(() =>
      this.axiosInstance.get<string>(`/api/v1/message/${id}/raw`),
    );
  }

  public async getAttachmentThumbnail(
    id: string,
    partID: string,
  ): Promise<string> {
    return this.handleRequest(() =>
      this.axiosInstance.get<string>(
        `/api/v1/message/${id}/part/${partID}/thumb`,
      ),
    );
  }

  public async releaseMessage(
    id: string,
    releaseRequest: { To: string[] },
  ): Promise<string> {
    return this.handleRequest(() =>
      this.axiosInstance.post<string>(
        `/api/v1/message/${id}/release`,
        releaseRequest,
      ),
    );
  }

  public async sendMessage(
    sendReqest: MailpitSendRequest,
  ): Promise<MailpitSendMessageConfirmation> {
    return this.handleRequest(() =>
      this.axiosInstance.post<MailpitSendMessageConfirmation>(
        `/api/v1/send`,
        sendReqest,
      ),
    );
  }

  // Other
  public async htmlCheck(id: string): Promise<MailpitHTMLCheckResponse> {
    return this.handleRequest(() =>
      this.axiosInstance.get<MailpitHTMLCheckResponse>(
        `/api/v1/message/${id}/html-check`,
      ),
    );
  }

  public async linkCheck(id: string): Promise<MailpitLinkCheckResponse> {
    return this.handleRequest(() =>
      this.axiosInstance.get<MailpitLinkCheckResponse>(
        `/api/v1/message/${id}/link-check`,
      ),
    );
  }

  public async spamAssassinCheck(
    id: string,
  ): Promise<MailpitSpamAssassinResponse> {
    return this.handleRequest(() =>
      this.axiosInstance.get<MailpitSpamAssassinResponse>(
        `/api/v1/message/${id}/sa-check`,
      ),
    );
  }

  // Messages
  public async listMessages(): Promise<MailpitMessagesSummary> {
    return this.handleRequest(() =>
      this.axiosInstance.get<MailpitMessagesSummary>(`/api/v1/messages`),
    );
  }

  public async setReadStatus(
    readStatus: MailpitReadStatusRequest,
  ): Promise<string> {
    return this.handleRequest(() =>
      this.axiosInstance.put<string>(`/api/v1/messages`, readStatus),
    );
  }

  public async deleteMessages(
    deleteRequest: MailpitDeleteRequest,
  ): Promise<string> {
    return this.handleRequest(() =>
      this.axiosInstance.delete<string>(`/api/v1/messages`, {
        data: deleteRequest,
      }),
    );
  }

  // See https://mailpit.axllent.org/docs/usage/search-filters/
  public async searchMessages(
    search: MailpitSearch,
  ): Promise<MailpitMessagesSummary> {
    return this.handleRequest(() =>
      this.axiosInstance.put<MailpitMessagesSummary>(`/api/v1/search`, search),
    );
  }

  // See https://mailpit.axllent.org/docs/usage/search-filters/
  public async deleteMessagesBySearch(
    search: MailpitSearchDelete,
  ): Promise<string> {
    return this.handleRequest(() =>
      this.axiosInstance.delete<string>(`/api/v1/search`, { data: search }),
    );
  }

  // Tags
  public async getTags(): Promise<[string]> {
    return this.handleRequest(() =>
      this.axiosInstance.get<[string]>(`/api/v1/tags`),
    );
  }

  public async setTags(request: MailpitSetTagsRequest): Promise<string> {
    return this.handleRequest(() =>
      this.axiosInstance.put<string>(`/api/v1/tags`, request),
    );
  }

  public async renameTag(tag: string, newTagName: string): Promise<string> {
    const encodedTag = encodeURI(tag);
    return this.handleRequest(() =>
      this.axiosInstance.put<string>(`/api/v1/tags/${encodedTag}`, {
        Name: newTagName,
      }),
    );
  }

  public async deleteTag(tag: string): Promise<string> {
    const encodedTag = encodeURI(tag);
    return this.handleRequest(() =>
      this.axiosInstance.delete<string>(`/api/v1/tags/${encodedTag}`),
    );
  }

  // Testing
  public async renderMessageHTML(id: string): Promise<string> {
    return this.handleRequest(() =>
      this.axiosInstance.get<string>(`/view/${id}.html`),
    );
  }

  public async renderMessageText(id: string): Promise<string> {
    return this.handleRequest(() =>
      this.axiosInstance.get<string>(`/view/${id}.txt`),
    );
  }
}

export default MailpitClient;
