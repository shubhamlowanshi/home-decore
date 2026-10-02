import Buyer from "../models/buyer.js";

import {
  searchBusinesses,
  getPlaceDetails,
} from "../services/google.service.js";

import {
  extractEmail,
} from "../services/scraper.service.js";


// Find buyers
export const findBuyers = async (
  req,
  res
) => {
  try {
    const {
      keyword,
      location,
    } = req.body;

    if (!keyword || !location) {
      return res.status(400).json({
        success: false,
        message:
          "Keyword and location are required",
      });
    }

    // Search businesses
    const businesses =
      await searchBusinesses(
        keyword,
        location
      );

    const buyers = [];

    for (const business of businesses) {
      try {
        const placeId =
          business.id;

        // Check duplicate
        const existingBuyer =
          await Buyer.findOne({
            placeId,
          });

        if (existingBuyer) {
          buyers.push(existingBuyer);
          continue;
        }

        // Get details
        const details =
          await getPlaceDetails(
            placeId
          );

        if (!details) {
          continue;
        }

        const companyName =
          details.displayName?.text ||
          "Unknown Company";

        const website =
          details.websiteUri ||
          null;

        const email =
          website
            ? await extractEmail(
                website
              )
            : null;

        const buyer =
          await Buyer.create({
            companyName,

            placeId,

            website,

            email,

            phone:
              details.nationalPhoneNumber ||
              null,

            address:
              details.formattedAddress ||
              null,

            googleMapsUrl:
              details.googleMapsUri ||
              null,

            industry: keyword,

            country:
              "United States",

            source:
              "Google Places API",
          });

        buyers.push(buyer);
      } catch (error) {
        console.log(
          "Skipping business:",
          error.message
        );
      }
    }

    return res.status(200).json({
      success: true,

      count: buyers.length,

      buyers,
    });
  } catch (error) {
    console.error(
      "Find Buyers Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to find buyers",
    });
  }
};


// Get all saved buyers
export const getBuyers = async (
  req,
  res
) => {
  try {
    const buyers =
      await Buyer.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count: buyers.length,

      buyers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch buyers",
    });
  }
};