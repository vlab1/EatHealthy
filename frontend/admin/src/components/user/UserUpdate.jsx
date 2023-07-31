import React from "react";
import { Edit, TextInput, TabbedForm, FormTab, SelectInput } from "react-admin";
import { useTranslate } from "react-admin";
const UserUpdate = (props) => {
  const t = useTranslate();
  return (
    <Edit {...props} undoable="false" mutationMode="pessimistic">
      <TabbedForm>
        <FormTab label={t("userUpdate")} sx={{ maxWidth: "40em" }}>
          <TextInput fullWidth disabled source="id" label={t("ID")} />
          <TextInput sx={{ minWidth: "67vh" }} disabled source="email" label={t("email")} />
          <SelectInput
          label={t("profile")}
            disabled
            sx={{ minWidth: "67vh" }}
            source="profileModel"

            choices={[
              {
                id: "Patients",
                name: "Patient",
              },
              { id: "Dietitians", name: "Dietitian" },
              { id: "EatingPlaces", name: "Eating place" },
            ]}
          />
          <SelectInput
               label={t("isActivated")}
            sx={{ minWidth: "67vh" }}
            source="emailIsActivated"

            choices={[
              {
                id: "true",
                name: t("activated"),
              },
              { id: "false", name: t("notActvated"), },
            ]}
          />
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};
export default UserUpdate;
