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