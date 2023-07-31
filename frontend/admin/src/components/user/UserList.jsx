import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DeleteButton,
  SearchInput,
  Pagination,
  BooleanField,
  SelectInput,
  EditButton,
  TextInput
} from "react-admin";
import { useTranslate } from "react-admin";

const PostPagination = () => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
);

const UserList = (props) => {
  const t = useTranslate();

  const postFilter = [
    <TextInput source="email" label={t("email")} />,
    <SelectInput
      source="profileModel"
      label={t("profile")}
      choices={[
        {
          id: "Patients",
          name: t("patient"),
        },
        { id: "Dietitians", name: t("dietitian") },
        { id: "EatingPlaces", name: t("eatingPlace"), },
      ]}
    />,
    <SelectInput
      source="emailIsActivated"
      label={t("isActivated")}
      choices={[
        {
          id: "true",
          name:  t("activated"),
        },
        { id: "false", name: t("notActvated"), },
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
        <TextField sortable={false} source="email" label={t("email")} />
        <TextField sortable={true} source="profileModel" label={t("profile")} />
        <BooleanField
          sortable={true}
          source="emailIsActivated"
          label={t("isActivated")}
        />
        <EditButton />
        <DeleteButton undoable="false" mutationMode="pessimistic" />;
      </Datagrid>
    </List>
  );
};

export default UserList;
