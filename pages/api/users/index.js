import axios from "axios";

export default async function handler(req, res) {
  await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}/api/users`)
    .then((data) => {
      if (data.status === 200) {
        res.status(200).json(data.data);
      }
    })
    .catch((e) => {
      let response = e.response;
      res.status(400).json(response.data);
    });
}
