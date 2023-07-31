function getObjectsFromLocalStorage() {
  const objectsJSON = localStorage.getItem("groupeddish");
  if (objectsJSON) {
    return JSON.parse(objectsJSON);
  } else {
    return [];
  }
}

function saveObjectsToLocalStorage(objects) {
  const objectsJSON = JSON.stringify(objects);
  localStorage.setItem("groupeddish", objectsJSON);
}

function addObject(object) {
  let objects = getObjectsFromLocalStorage();

  if (!objects) {
    objects = [object];
  } else {
    const existingObject = objects.find((obj) => obj._id === object._id);
    if (!existingObject) {
      objects.push(object);
    } else {
      throw new Error();
    }
  }
  saveObjectsToLocalStorage(objects);
}

function deleteObjectById(id) {
  const objects = getObjectsFromLocalStorage();
  const updatedObjects = objects.filter((obj) => obj._id !== id);
  saveObjectsToLocalStorage(updatedObjects);
}

function getAllObjects() {
  return getObjectsFromLocalStorage();
}

function clearLocalStorage() {
  localStorage.removeItem("groupeddish");
}

const LocalStorageService = {
  addObject,
  deleteObjectById,
  getAllObjects,
  clearLocalStorage,
};

export default LocalStorageService;
