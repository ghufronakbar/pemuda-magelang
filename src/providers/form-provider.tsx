import { FormArticleProvider } from "@/context/form-article-context";
import { FormProductProvider } from "@/context/form-product-context";
import { FormAdminProvider } from "@/context/form-admin-context";
import { FormUserProvider } from "@/context/form-user-context";
import { ReactNode } from "react";
import { FormAppDataProvider } from "@/context/form-app-data-context";
import { FormCategoryHubProvider } from "@/context/form-category-hub-context";
import { FormHubProvider } from "@/context/form-hub-context";

interface FormProviderProps {
  children: ReactNode;
}
export function FormProvider({ children }: FormProviderProps) {
  return (
    <FormArticleProvider>
      <FormProductProvider>
        <FormUserProvider>
          <FormAdminProvider>
            <FormAppDataProvider>
              <FormCategoryHubProvider>
                <FormHubProvider>{children}</FormHubProvider>
              </FormCategoryHubProvider>
            </FormAppDataProvider>
          </FormAdminProvider>
        </FormUserProvider>
      </FormProductProvider>
    </FormArticleProvider>
  );
}
