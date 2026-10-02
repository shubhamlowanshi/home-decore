import axios from "axios";

const GOOGLE_PLACES_URL =
  "https://places.googleapis.com/v1/places:searchText";

const GOOGLE_API_KEY =
  process.env.GOOGLE_API_KEY;

  console.log("GOOGLE_API_KEY:", GOOGLE_API_KEY);

// Search businesses using Places API (New)
export const searchBusinesses = async (
  keyword,
  location
) => { 
  try {
    const response = await axios.post(
      GOOGLE_PLACES_URL,
      {
        textQuery: `${keyword} in ${location}`,

        pageSize: 20,

        languageCode: "en",
      },
      {
        headers: {
          "Content-Type": "application/json",

          "X-Goog-Api-Key":
            GOOGLE_API_KEY,

          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.websiteUri,places.googleMapsUri,places.nationalPhoneNumber",
        },
      }
    );

    return response.data.places || [];
  } catch (error) {
    console.error(
      "Google Search Error:",
      error.response?.data ||
        error.message
    );

    throw new Error(
      error.response?.data?.error?.message ||
        "Google Places API request failed"
    );
  }
};


// Get details of a particular place
export const getPlaceDetails = async (
  placeId
) => {
  try {
    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "Content-Type":
            "application/json",

          "X-Goog-Api-Key":
            GOOGLE_API_KEY,

          "X-Goog-FieldMask":
            "id,displayName,formattedAddress,websiteUri,nationalPhoneNumber,googleMapsUri",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Place Details Error:",
      error.response?.data ||
        error.message
    );

    return null;
  }
};