import React, { useState } from "react";
import "./UploadFile.scss";
import { useTranslation } from "react-i18next";
import { read, utils } from "xlsx";

const UploadFile = ({ setUploaded }) => {
  const { t } = useTranslation();
  const onClickInputFile = async (e) => {
    e.target.value = null;
    setUploaded((prevState) => ({
        ...prevState,
        ingredients: [],
      }));
  };
  const [preview, setPreview] = useState("");
  const handleChange = async (e) => {
    const file = e.target.files[0];
    setPreview(file.name);

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

      const filteredData = jsonData.filter((array) => array && array.length > 0);


      setUploaded((prevState) => ({
        ...prevState,
        ingredients: convertObject(filteredData),
      }));
    };
    reader.readAsArrayBuffer(file);
  };

  function convertObject(data) {
    const headers = data[0];
    const ingredients = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const ingredient = {};

      for (let j = 0; j < headers.length; j++) {
        if (headers[j] === "name_en") {
          ingredient.name = { en: row[j] };
        } else if (headers[j] === "name_uk") {
          ingredient.name.uk = row[j];
        } else if (headers[j] === "weight") {
          ingredient.weight = row[j];
        }
      }

      ingredients.push(ingredient);
    }

    return ingredients;
  }
  return (
    <div className="excel-uploader-container">
  
      <div className="uploader">
        <p>{t("Upload a file")}.</p>
        <input
          type="file"
          multiple={false}
          onClick={onClickInputFile}
          onChange={handleChange}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </div>
      <p>{preview}</p>
    </div>
  );
};

export default UploadFile;
