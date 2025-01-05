export interface Message {
  message: string;
}

export interface ChatResponse {
  question: string;
  answer: string;
  documents?: DocumentsEntity[] | null;
}
export interface DocumentsEntity {
  id?: null;
  metadata: Metadata;
  page_content: string;
  type: string;
}
export interface Metadata {
  source_url: string;
  _id: string;
  _collection_name: string;
}
