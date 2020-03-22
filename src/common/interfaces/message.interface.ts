export interface MessageInterface {
  id: string;
  timestamp: number;
  flow: 'out' | 'in';
  from: string;
  to: string;
  payload?: {
    type?: number;
    text?: string;
    img?: string;
    data?: any;
  };
  message: any;
}
