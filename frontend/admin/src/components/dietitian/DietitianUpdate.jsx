import React from "react";
import {
  Edit,
  TextInput,
  TabbedForm,
  FormTab,
  SelectInput,
  DateInput,
} from "react-admin";
import { useTranslate } from "react-admin";

const DietitianUpdate = (props) => {
  const t = useTranslate();
  return (
    <Edit {...props} undoable="false" mutationMode="pessimistic">
      <TabbedForm>
        <FormTab label={t("dietitianUpdate")} sx={{ maxWidth: "40em" }}>
          <TextInput fullWidth disabled source="id" label={t("ID")} />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="firstName"
            label={t("firstName")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="lastName"
            label={t("lastName")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="patronymic"
            label={t("patronymic")}
          />
          <SelectInput
            sx={{ minWidth: "67vh" }}
            source="sex"
            label={t("sex")}
            choices={[
              {
                id: t("male"),
                name: t("male"),
              },
              { id: t("female"), name: t("female") },
            ]}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="phone"
            label={t("phone")}
          />
          <DateInput
            sx={{ minWidth: "67vh" }}
            source="birthDate"
            label={t("birthDate")}
          />
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};
export default DietitianUpdate;
