interface MailpitInfo {
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
interface MailpitConfiguration {
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
interface MailpitMessageSummary {
    Attachments: [
        {
            ContentID: string;
            ContentType: string;
            FileName: string;
            PartID: string;
            Size: number;
        }
    ];
    Bcc: [
        {
            Address: string;
            Name: string;
        }
    ];
    Cc: [
        {
            Address: string;
            Name: string;
        }
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
        }
    ];
    MessageID: string;
    ReplyTo: [
        {
            Address: string;
            Name: string;
        }
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
        }
    ];
}
interface MailpitMessagesSummary {
    messages: [MailpitMessageSummary];
}
interface MailpitMessageHeaders {
    [key: string]: string;
}
interface MailpitSendRequest {
    Attachments: [
        {
            Content: string;
            Filename: string;
        }
    ];
    Bcc: [string];
    Cc: [
        {
            Email: string;
            Name: string;
        }
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
        }
    ];
    Subject: string;
    Tags: [string];
    Text: string;
    To: [
        {
            Email: string;
            Name: string;
        }
    ];
}
interface MailpitSendMessageConfirmation {
    ID: string;
}
interface MailpitHTMLCheckResponse {
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
                }
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
        }
    ];
}
interface MailpitLinkCheckResponse {
    Errors: number;
    Links: [
        {
            Status: string;
            StatusCode: number;
            URL: string;
        }
    ];
}
interface MailpitSpamAssassinResponse {
    Errors: number;
    IsSpam: boolean;
    Rules: [
        {
            Description: string;
            Name: string;
            Score: number;
        }
    ];
    Score: number;
}
interface MailpitReadStatusRequest {
    IDs: [string];
    Read: boolean;
}
interface MailpitDeleteRequest {
    IDs: [string];
}
interface MailpitSearch {
    query: {
        [key: string]: string;
    };
    start?: number;
    limit?: number;
    tz?: string;
}
interface MailpitSearchDelete {
    query: {
        [key: string]: string;
    };
    tz?: string;
}
interface MailpitSetTagsRequest {
    IDs: [string];
    Tags: [string];
}
declare class MailpitClient {
    private axiosInstance;
    constructor(baseURL: string);
    private handleRequest;
    getInfo(): Promise<MailpitInfo>;
    getConfiguration(): Promise<MailpitConfiguration>;
    getMessageSummary(id: string): Promise<MailpitMessageSummary>;
    getMessageHeaders(id: string): Promise<MailpitMessageHeaders>;
    getMessageAttachment(id: string, partID: string): Promise<string>;
    getMessageSource(id: string): Promise<string>;
    getAttachmentThumbnail(id: string, partID: string): Promise<string>;
    releaseMessage(id: string, releaseRequest: {
        To: string[];
    }): Promise<string>;
    sendMessage(sendReqest: MailpitSendRequest): Promise<MailpitSendMessageConfirmation>;
    htmlCheck(id: string): Promise<MailpitHTMLCheckResponse>;
    linkCheck(id: string): Promise<MailpitLinkCheckResponse>;
    spamAssassinCheck(id: string): Promise<MailpitSpamAssassinResponse>;
    listMessages(): Promise<MailpitMessagesSummary>;
    setReadStatus(readStatus: MailpitReadStatusRequest): Promise<string>;
    deleteMessages(deleteRequest: MailpitDeleteRequest): Promise<string>;
    searchMessages(search: MailpitSearch): Promise<MailpitMessagesSummary>;
    deleteMessagesBySearch(search: MailpitSearchDelete): Promise<string>;
    getTags(): Promise<[string]>;
    setTags(request: MailpitSetTagsRequest): Promise<string>;
    renameTag(tag: string, newTagName: string): Promise<string>;
    deleteTag(tag: string): Promise<string>;
    renderMessageHTML(id: string): Promise<string>;
    renderMessageText(id: string): Promise<string>;
}
export default MailpitClient;
