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
  login: string,
  password: string,
  name: string,
  courseCode: string,
  plaqueId: string
}

export type CreatePlaqueSessionPayload = {
  plaqueId: string,
  name: string,
  content: string,
  isList: boolean
}