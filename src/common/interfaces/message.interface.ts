export interface MessageInterface {
  id: string;
  timestamp: number;
  flow: 'out' | 'in';
  from: string;
  to: string;
  payload: {
    text?: string;
    img?: string;
    data?: any;
  };
}
