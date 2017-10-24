/**
 * Message types
 */
export enum MessageType {REGISTRATION = 1, LEAVE, MESSAGE, BROADCAST}

/**
 * An address
 */
export interface Address
{
    ip: string,
    port: number
}

/**
 * This is how the Server sees a generic connected client
 */
export interface IClient
{
    id: number,
    username: string,
    address: {
        ip: string,
        port: number
    };
}

/**
 * The default structure of a message
 */
export interface IMessage
{
    type: MessageType,
    source: {
        id: number,
        username: string,
    },
    destination?: number,
    payload?: string
}