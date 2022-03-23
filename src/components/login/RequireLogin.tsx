import { Center, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useClient } from "../../modules/client";
import { ContainerInlay } from "../layout/ContainerInlay";
import { PageContainer } from "../layout/PageContainer";
import { LoginPanel } from "./LoginPanel";

export function RequireLogin({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { isLoggedIn } = useClient();
  if (isLoggedIn) return <>{children}</>;

  return (
    <PageContainer>
      <ContainerInlay>
        <Center flexDirection="column">
          <Text fontSize="xl">{t("Please log in to use this feature.")}</Text>
          <LoginPanel />
        </Center>
      </ContainerInlay>
    </PageContainer>
  );
}