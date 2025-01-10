export type ChatFormProps= {
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  }

export type inputEnvent =React.ChangeEvent<HTMLInputElement>
export type textArea=React.ChangeEvent<HTMLTextAreaElement>

export interface Message {'type':string,'message':string}



