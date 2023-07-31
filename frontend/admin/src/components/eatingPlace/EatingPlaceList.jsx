import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DeleteButton,
  Pagination,
  EditButton,
  TextInput
} from "react-admin";
import { useLocale } from "react-admin";
import { useTranslate } from "react-admin";


const PostPagination = () => (
  <Pagination rowsPerPageOptions={[10, 25, 50, 100]} />
);

const EatingPlaceList = (props) => {
  const language = useLocale();
  const t = useTranslate();

  const postFilter = [
    <TextInput source="email" label={t("email")} />,
    <TextInput source="userId" label={t("userId")} />,
    <TextInput source="country" label={t("country")}  />,
    <TextInput source="region" label={t("region")}  />,
    <TextInput source="city" label={t("city")} />,
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
        <TextField sortable={false} source="name" label={t("name")} />
        <TextField
          sortable={false}
          source={`country.${language}`}
          label={t("country")}
        />
        <TextField
          sortable={false}
          source={`region.${language}`}
          label={t("region")}
        />
        <TextField
          sortable={false}
          source={`city.${language}`}
          label={t("city")}
        />
        <TextField
          sortable={false}
          source={`description.${language}`}
          label={t("description")}
        />
        <EditButton />
        <DeleteButton undoable="false" mutationMode="pessimistic" />;
      </Datagrid>
    </List>
  );
};

export default EatingPlaceList;
