// types/order.ts
export enum OrderStatus {
  START = 'start',
  PREPARE = 'prepare',
  SHOOTING = 'shooting',
  PREPARATION_DOCUMENTS = 'preparation_of_documents_for_the_registry',
  READY = 'ready_for_issue',
}

export interface Order {
  name: string;
  price: number;
  status: OrderStatus;
  payment: boolean;
  problem: string;
}
