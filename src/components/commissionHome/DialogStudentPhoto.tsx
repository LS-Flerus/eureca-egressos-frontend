import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { Button, CloseButton, Dialog, Field,  Input, Portal, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { Toaster } from "../ui/toaster";
import { Form, useNavigate } from "react-router-dom";
import { LuUpload } from "react-icons/lu";
import { EstudanteResponse } from "@/interfaces/ServiceResponses";
import { uploadImageMongoDB } from "@/service/imageService";
import { UpdateStudentPayload } from "@/interfaces/ServicePayloads";
import { updateEstudante } from "@/service/estudantesService";
import { FileUploadDropzone, FileUploadList, FileUploadRoot, FileUploadTrigger, } from "../ui/file-upload";
  
type DialogStudentPhotoProps = {
  student: EstudanteResponse;
  children: React.ReactNode; // o trigger vem de fora
};

export const DialogStudentPhoto = ({ student, children }: DialogStudentPhotoProps) => {

    const [img, setImg] = useState("");

    // -------------------------------------- SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------
    const imagebase64 = async (file: any): Promise<string | ArrayBuffer | null | undefined> => {
        const reader = new FileReader()
        if(file) {
          reader.readAsDataURL(file)
          const data: string | ArrayBuffer | null = await new Promise((resolve,reject) => {
            reader.onload = ()=> resolve(reader.result)
            reader.onerror = (err) => reject(err)
          })
          return data
        }
      }
      
      const handleUploadImage = async (e: any) => {
        console.log(e)
        console.log(e.acceptedFiles[0])
        const file = e.acceptedFiles[0]
        
        const conversionResult: string | ArrayBuffer | null | undefined = await imagebase64(file)
        if(typeof conversionResult === "string") {
            const image: string = conversionResult
            setImg(image)
            console.log(image)
        }
      }

      /*
      const fetchImage = async() =>{
        const res = await fetch("http://localhost:8081")
        const data = await res.json()
        setAllImage(data.data)
      }
      */
    
        const handleSubmitImagem = async () => {
            console.log("tá aqui a imagem:")
            const novaImagem = await uploadImageMongoDB(img);
            console.log(novaImagem)
            const payload: UpdateStudentPayload = {
                id: student.id,
                name: student.name,
                courseCode: student.courseCode,
                semester: student.semester,
                plaqueId: student.plaqueId,
                photoId: novaImagem._id
            }
            const updatedStudent = await updateEstudante(payload);
    }
    // -------------------------------------- FIM DA SEÇÃO DE TRATAMENTO DE IMAGEM ----------------------------------------------------------

  return (
    <>
        <Dialog.Root
            placement={"center"}
            size={"xs"}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content boxShadow={"sm"} bgColor={`${EURECA_COLORS.CINZA_CLARO}`} className="text" color={EURECA_COLORS.CINZA} textAlign={"justify"}>
                      <Dialog.Header display={"flex"} flexDir={"column"}>
                          <Dialog.Title color={"black"}>Alterar foto do estudante</Dialog.Title>
                          <Dialog.Description></Dialog.Description>
                      </Dialog.Header>
                      <Dialog.Body>
                        <Form>
                          <Stack gap="2" w="full">
                                <FileUploadRoot alignItems="stretch" maxFiles={1} onFileChange={handleUploadImage}>
                                    <FileUploadDropzone
                                        label="Faça o upload da foto da turma inteira"
                                        description=".png ou .jpg de até 5MB"
                                        bgColor={"black/50"}
                                        cursor={"pointer"}
                                    />
                                    <FileUploadList/>
                                </FileUploadRoot>
                          </Stack>
                        </Form>
                      </Dialog.Body>
                      <Dialog.Footer mb={4} placeContent={"center"}>
                          <Button mt={"4"} mb={"4"} onClick={handleSubmitImagem} bgColor={EURECA_COLORS.AZUL_ESCURO} color={EURECA_COLORS.BRANCO}>Alterar</Button>
                      </Dialog.Footer>
                      <Dialog.CloseTrigger asChild>
                      <CloseButton m={2} size="sm" />
                      </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
        <Toaster/>
    </>
  );
};