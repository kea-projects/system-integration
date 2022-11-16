const pics = [
  {
    name: "1223456789.png",
    url: "hotdeals.dev/1223456789",
  },
  {
    name: "0987654321.png",
    url: "hotdeals.dev/0987654321",
  },
  {
    name: "0011223344.png",
    url: "hotdeals.dev/0011223344",
  },
];

export const getAllPics = () => {
  return pics;
};

export const getPicById = (id) => {
  return pics.filter((pic) => pic.name.replace(/\..*/m, "") === id);
};

export const uploadPic = (pic) => {
  const id = Date.now();
  const newPic = {
    name: id + ".jpeg",
    url: "hotdeals.dev/" + id,
  };
  pics.push(newPic);
  return newPic;
};
