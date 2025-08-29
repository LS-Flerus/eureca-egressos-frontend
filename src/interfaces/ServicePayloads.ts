export type FiltersPayload  = {
    courseCode?: string, 
    startSemester?: string, 
    endSemester?: string, 
    className?: string, 
    campus?: string, 
    approved?: boolean, 
    toApprove?: Boolean, 
    studentName?: string
}

export type CreatePlaquePayload = {
  courseCode: string,
  semester: string,
  className: string,
  campus: number,
  approved: boolean,
  toApprove: boolean
}

export type UpdatePlaquePayload = {
  id?: string,
  courseCode?: string,
  semester?: string,
  className?: string,
  campus?: number,
  approved?: boolean,
  toApprove?: boolean
}

export type GetTokenPayload = {
    username: string,
    password: string
}

export type LoginPayload = {
    login: string,
    senha: string
}

export type CreateUserPayload = {
  name: string,
  enrollment: string,
  courseCode: string,
  plaqueId: string
}

export type CreatePlaqueSessionPayload = {
  plaqueId: string,
  name: string,
  content: string,
  isList: boolean
}

export type CreatePhotoPayload = {
  plaqueId: string,
  photoId: string,
  mainPhoto: boolean
}

export type UpdatePhotoPayload = {
  id: string,
  plaqueId: string,
  photoId: string,
  mainPhoto: boolean
}