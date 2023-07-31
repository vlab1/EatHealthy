import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DeleteButton,
  SearchInput,
  Pagination,
  SelectInput,
  EditButton,
  DateField,
  TextInput,
} from "react-admin";
import { useTranslate } from "react-admin";

const PostPagination = () => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
);

const PatientList = (props) => {
  const t = useTranslate();

  const postFilter = [
    <TextInput source="email" label={t("email")} />,
    <TextInput source="userId" label={t("userId")} />,
    <SelectInput
      source="sex"
      label={t("sex")}
      choices={[
        {
          id: t("male"),
          name: t("male"),
        },
        { id: t("female"), name: t("female") },
      ]}
    />,
  ];
  return (
    <List
      filters={postFilter}
      queryOptions={{ refetchInterval: 50000 }}
      {...props}
      pagination={<PostPagination />}
    >
      <Datagrid>
        <TextField sortable={false} source="id" label={t("ID")} />
        <TextField sortable={false} source="firstName" label={t("firstName")} />
        <TextField sortable={false} source="lastName" label={t("lastName")} />
        <TextField
          sortable={false}
          source="patronymic"
          label={t("patronymic")}
        />
        <TextField sortable={false} source="sex" label={t("sex")} />
        <TextField sortable={false} source="phone" label={t("phone")} />
        <DateField sortable={false} source="birthDate" label={t("birthDate")} />
        <EditButton />
        <DeleteButton undoable="false" mutationMode="pessimistic" />;
      </Datagrid>
    </List>
  );
};

export default PatientList;
