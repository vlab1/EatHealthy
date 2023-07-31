import { useEditContext } from "react-admin";
import "./ImagesUrlsEditField.css";
import { useState } from "react";

const ImagesUrlsEditField = () => {
  const { record, isLoading } = useEditContext();
  const [images, setImages] = useState(record.images);
  if (isLoading) return null;
  const removeImage = async (event) => {
    try {
      setImages(record.images.filter((item) => item !== event.target.name));
      record.images = record.images.filter(
        (item) => item !== event.target.name
      );
    } catch (e) {
      throw new Error("Opps! Something went wrong!");
    }
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
        gridGap: "25px",
        background: "#eee",
        padding: "25px",
      }}
    >
      {images?.map((item) => {
        return (
          item && (
            <div class="image-area">
              <img
                crossorigin="anonymous"
                style={{ width: "100px", height: "100px" }}
                src={`http://localhost:5000/${item}`}
                alt={`http://localhost:5000/${item}`}
                key={item}
              />
              <a
                class="remove-image"
                name={item}
                onClick={removeImage}
                style={{ display: "inline", cursor: "pointer" }}
              >
                &#215;
              </a>
            </div>
          )
        );
      })}
    </div>
  );
};

export default ImagesUrlsEditField;
