import React from "react";
import {
  Create,
  TextInput,
  TabbedForm,
  FormTab,
  SelectInput,
} from "react-admin";
import { useTranslate } from "react-admin";

const UserCreate = (props) => {
  const t = useTranslate();
  return (
    <Create {...props} undoable="false" mutationMode="pessimistic">
      <TabbedForm>
        <FormTab label={t("userCreate")} sx={{ maxWidth: "40em" }}>
          <TextInput
            sx={{ minWidth: "67vh" }}
            label={t("email")}
            source="email"
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            label={t("password")}
            source="password"
          />
          <SelectInput
            sx={{ minWidth: "67vh" }}
            source="profileModel"
            label={t("profile")}
            choices={[
              {
                id: "Patients",
                name: t("patient"),
              },
              { id: "Dietitians", name: t("dietitian") },
              { id: "EatingPlaces", name: t("eatingPlace") },
            ]}
          />
        </FormTab>
      </TabbedForm>
    </Create>
  );
};
export default UserCreate;
