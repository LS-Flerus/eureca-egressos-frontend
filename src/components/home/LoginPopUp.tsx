import { EURECA_COLORS, SESSION_STORAGE } from "@/util/constants";
import { Button, CloseButton, Dialog, Field, Input, Portal, Stack } from "@chakra-ui/react";
import { PasswordInput } from "../ui/password-input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toaster, Toaster } from "../ui/toaster";
import { getProfile, getToken } from "@/service/eurecaService";
import { getUserByEnrollment } from "@/service/userService";
import { useNavigate } from "react-router-dom";
  
export const LoginPopUp = () => {

    const navigate = useNavigate();

    const [passwordvalue,setPasswordValue] = useState("");
    const [loginvalue,setLoginValue] = useState("");
    
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

  return (
    <>
        <Dialog.Root
            placement={"center"}
            size={"xs"}>
            <Dialog.Trigger asChild>
                <Button bg={EURECA_COLORS.AZUL_ESCURO} size={"xl"} color={EURECA_COLORS.BRANCO}>Login</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content boxShadow={"sm"} bgColor={`${EURECA_COLORS.BRANCO}`} className="text" color={EURECA_COLORS.CINZA} textAlign={"justify"}>
                      <Dialog.Header display={"flex"} flexDir={"column"}>
                          <Dialog.Title color={"black"}>Login</Dialog.Title>
                          <Dialog.Description>Entre com suas credenciais do SCAO caso seja um coordenador, ou com as credenciais fornecidas pelo coordenador do curso caso faça parte de uma comissão de formatura.</Dialog.Description>
                      </Dialog.Header>
                      <Dialog.Body>
                        <form>
                          <Stack gap="2" w="full">
                              <Field.Root>
                                  <Input autoComplete="" value={loginvalue} onChange={(e) => setLoginValue(e.target.value)} placeholder="Username" _placeholder={{ color: "gray.500", opacity: 1 }} color="black" bg={EURECA_COLORS.CINZA_CLARO}/>
                              </Field.Root>
                              <Field.Root>
                                  <PasswordInput autoComplete="current-password" _placeholder={{ color: "gray.500", opacity: 1 }} color="black" value={passwordvalue} onChange={(e) => setPasswordValue(e.target.value)} placeholder="Senha" bg={EURECA_COLORS.CINZA_CLARO}/>
                              </Field.Root>
                          </Stack>
                        </form>
                      </Dialog.Body>
                      <Dialog.Footer mb={4} placeContent={"center"}>
                          <Button bg={EURECA_COLORS.AZUL_ESCURO} size={"xl"} color={EURECA_COLORS.BRANCO} onClick={()=>checkEurecaTokenMutation.mutate({username: loginvalue, password: passwordvalue})} px={6}>Entrar</Button>
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