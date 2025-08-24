export type PlacaResponse = {
    id: string,
    semester: string,
    courseCode: string,
    className: string,
    approved: boolean,
    toAprove: boolean,
    campus: number
}

export type EstudanteResponse = {
    id: string,
    name: string,
    courseCode: string,
    semester: string,
    plaqueId: string,
    photoId: string,
}

export type SessoesPlacaResponse = {
    id: string;
    plaqueId: string;
    name: string;
    content: string;
    isList: boolean;
}

export type GetTokenResponse = {
    token: string
}

export type GetEurecaProfileResponse = {
    id: string,
    name: string,
    identityProviderId: string,
    attributes: {
      code: number,
      name: string,
      type: string,
      email: string
    }
}