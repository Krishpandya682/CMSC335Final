export const get = async (req, res) => {
  try {
    const url =
      "https://newsapi.org/v2/everything?" +
      "q=Apple&" +
      "apiKey=1e6838a68bdb4e0cb942b0a3e209aa02";  

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // console.log(data); // Log the fetched data

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
