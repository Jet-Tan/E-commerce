export const isJsonString = (data) => {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const renderOptions = (arr) => {
  let results = [];

  if (Array.isArray(arr)) {
    results = arr.map((opt) => ({
      value: opt,
      label: opt,
    }));
  }

  results.push({
    value: "add_type",
    label: "Thêm type",
  });

  return results;
};
