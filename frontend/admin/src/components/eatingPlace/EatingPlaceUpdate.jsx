import React from "react";
import {
  Edit,
  TextInput,
  TabbedForm,
  FormTab,
  SelectInput,
  DateInput,
  ImageInput,
  ImageField,
} from "react-admin";
import ImagesUrlsEditField from "../tagsField/ImagesUrlsEditField";
import { useTranslate } from "react-admin";
const EatingPlaceUpdate = (props) => {
  const t = useTranslate();
  return (
    <Edit {...props} undoable="false" mutationMode="pessimistic">
      <TabbedForm>
        <FormTab label={t("eatingPlaceUpdate")} sx={{ maxWidth: "40em" }}>
          <TextInput fullWidth disabled source="id" label={t("ID")} />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="name"
            label={t("name")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="contactFirstName"
            label={t("contactFirstName")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="contactLastName"
            label={t("contactLastName")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="contactPatronymic"
            label={t("contactPatronymic")}
          />
          <SelectInput
            sx={{ minWidth: "67vh" }}
            source="contactSex"
            label={t("contactSex")}
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
            source="contactPhone"
            label={t("contactPhone")}
          />
          <DateInput
            sx={{ minWidth: "67vh" }}
            source="contactBirthDate"
            label={t("contactBirthDate")}
          />

          <TextInput
            sx={{ minWidth: "67vh" }}
            source="country.en"
            label={t("countryEn")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="region.en"
            label={t("regionEn")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="city.en"
            label={t("cityEn")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="address.en"
            label={t("postcode")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="description.en"
            label={t("descriptionEn")}
            multiline
          />

          <TextInput
            sx={{ minWidth: "67vh" }}
            source="country.uk"
            label={t("countryLocale")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="region.uk"
            label={t("regionLocale")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="city.uk"
            label={t("cityLocale")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="address.uk"
            label={t("addressLocale")}
          />
          <TextInput
            sx={{ minWidth: "67vh" }}
            source="description.uk"
            label={t("descriptionLocale")}
            multiline
          />

          <TextInput
            sx={{ minWidth: "67vh" }}
            source="postcode"
            label={t("postcode")}
          />
          <ImagesUrlsEditField label="images" />
          <ImageInput
            multiple={true}
            source="files"
            accept="image/*"
            label={t("files")}
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};
export default EatingPlaceUpdate;
