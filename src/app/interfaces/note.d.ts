export interface INote {
  idNote?: number;
  note: string;
}

export interface NoteResponse {
  idNote: number;
  menu_id: number;
  tutor_id: number;
  note: string;
}
