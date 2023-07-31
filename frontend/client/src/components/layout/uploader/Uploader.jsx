import React, { useState } from "react";
import "./Uploader.scss";
import ImagesPreview from "../imagesPreview/ImagesPreview";
import { useTranslation } from "react-i18next";

const Uploader = ({ uploaded, setUploaded }) => {
  const [accept] = useState(".png, .jpg, .jpeg");
  const [isMultiple] = useState(true);
  const [preview, setPreview] = useState([]);
  const { t } = useTranslation();
  const onClickInputFile = async (e) => {
    e.target.value = null;
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

 

  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = await Promise.all(
      files.map(async (file) => ({
        preview: await getBase64(file),
        id: Math.random(),
        name: file.name,
      }))
    );
    setPreview((prevPreview) => [...prevPreview, ...newPreviews]);
    setUploaded((prevState) => {
      files.forEach((item, index) => {
        prevState.files.push({ file: item, id: newPreviews[index].id });
      });
      return prevState;
    });
  };

  const onDeleteImage = (item) => {
    setPreview((prevPreview) =>
      prevPreview.filter((prev) => prev.id !== item.id)
    );
    setUploaded((prevState) => ({
      ...prevState,
      files: prevState.files.filter((prev) => prev.id !== item.id),
    }));
  };

  return (
    <div className="uploader-container">
      <div className="uploader">
        <p>{t("Drag your files here or click in this area")}.</p>
        <input
          type="file"
          multiple={isMultiple}
          onClick={onClickInputFile}
          onChange={handleChange}
          accept={accept}
        />
      </div>

      <ImagesPreview
        preview={preview}
        onDeleteImage={onDeleteImage}
      ></ImagesPreview>
    </div>
  );
};

export default Uploader;
