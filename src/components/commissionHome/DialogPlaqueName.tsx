import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { Button, CloseButton, Dialog, Field, IconButton, Input, Portal, Stack } from "@chakra-ui/react";
import { PasswordInput } from "../ui/password-input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toaster, Toaster } from "../ui/toaster";
import { getProfile, getToken } from "@/service/eurecaService";
import { getUserByEnrollment } from "@/service/userService";
import { useNavigate } from "react-router-dom";
import { LuPencil } from "react-icons/lu";
import { PlacaResponse } from "@/interfaces/ServiceResponses";
import { UpdatePlaquePayload } from "@/interfaces/ServicePayloads";
import { updatePlaque } from "@/service/placasService";
  
type DialogPlaqueNameProps = {
    placa: PlacaResponse
}

export const DialogPlaqueName = ({ placa }: DialogPlaqueNameProps) => {

    const navigate = useNavigate();
    const [nameValue,setNameValue] = useState("");
    
    const checkEurecaTokenMutation = useMutation({
        mutationKey: ["getToken"],
        mutationFn: getToken,
        onSuccess: (data) => {
            sessionStorage.setItem(SESSION_STORAGE.EURECA_TOKEN,data);
            checkEurecaProfileMutation.mutate(data);
        },
        onError: (error) => {
          console.log(error)
          toaster.create({
            title: "Falha na autenticação",
            description: "Verifique suas credenciais ou tente novamente mais tarde",
            type: "error"
          });
        },
    });

    const checkEurecaProfileMutation = useMutation({
        mutationKey: ["getProfile"],
        mutationFn: getProfile,
        onSuccess: (data) => {
          if(data.attributes.type == "Curso") {
            sessionStorage.setItem(SESSION_STORAGE.EURECA_PROFILE, JSON.stringify(data))
            navigate("/egressos/coordenador")
          } else if (data.attributes.type == "Aluno"){
            checkEgressosUserMutation.mutate(data.id);
          } else {
            toaster.create({
              title: "Não autorizado!",
              description: "Se você for de uma comissão de formatura, utilize as credenciais dadas pela sua coordenação",
              type: "error"
            });
          }
        },
        onError: (error) => {
          console.log(error);
          toaster.create({
            title: "Falha na autenticação",
            description: "Verifique suas credenciais ou tente novamente mais tarde",
            type: "error"
          });
        },
    });

    const checkEgressosUserMutation = useMutation({
        mutationKey: ["getEgressosProfile"],
        mutationFn: getUserByEnrollment,
        onSuccess: (data) => {
          sessionStorage.setItem(SESSION_STORAGE.EGRESSOS_PROFILE, JSON.stringify(data))
          navigate("/egressos/comissao")
        },
        onError: (error) => {
          console.log(error);
          toaster.create({
            title: "Falha na autenticação",
            description: "Verifique suas credenciais ou tente novamente mais tarde",
            type: "error"
          });
        },
    });

    const handleUpdate = async () => {
        try {
            const payload: UpdatePlaquePayload = {
                id: placa.id,
                semester: placa.semester,
                courseCode: placa.courseCode,
                className: nameValue,
                approved: placa.approved,
                toApprove: placa.toApprove,
                campus: placa.campus
            }
            const updatedPlaque = await updatePlaque(payload)
            toaster.create({
                title: "Operação bem sucedida!",
                description: "Recarregue a página para atualizar a interface",
                type: "success"
            });
        } catch (error) {
            toaster.create({
                title: "Falha na operação",
                description: "Tente novamente mais tarde",
                type: "error"
            });
        }
    }

  return (
    <>
        <Dialog.Root
            placement={"center"}
            size={"xs"}>
            <Dialog.Trigger asChild>
                <IconButton size={"md"} variant={"ghost"} aria-label="Voltar" bgColor={EURECA_COLORS.AZUL_MEDIO}ml={2}> 
                    <LuPencil />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content boxShadow={"sm"} bgColor={`${EURECA_COLORS.BRANCO}`} className="text" color={EURECA_COLORS.CINZA} textAlign={"justify"}>
                      <Dialog.Header display={"flex"} flexDir={"column"}>
                          <Dialog.Title color={"black"}>Mudar nome da turma</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        <form>
                          <Stack gap="2" w="full">
                              <Field.Root>
                                  <Input autoComplete="" value={nameValue} onChange={(e) => setNameValue(e.target.value)} placeholder="Novo nome" _placeholder={{ color: "gray.500", opacity: 1 }} color="black" bg={EURECA_COLORS.CINZA_CLARO}/>
                              </Field.Root>
                          </Stack>
                        </form>
                      </Dialog.Body>
                      <Dialog.Footer mb={4} placeContent={"center"}>
                          <Button bg={EURECA_COLORS.AZUL_ESCURO} size={"xl"} color={EURECA_COLORS.BRANCO} onClick={handleUpdate} px={6}>Atualizar</Button>
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