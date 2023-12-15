import imageDB from "./imagedb.js";

export default async function getImageURL(name, imageUrL) {
  const blob =  await imageDB.getBlob(name) || await fetch(`/img?id=${imageUrL}`).then(async (response) => {
    const blob = await response.blob();
    await imageDB.addBlob(name, blob);
    return blob;
  });
  return URL.createObjectURL(blob);
}
