import axios from "axios";
import * as cheerio from "cheerio";

const commonPaths = [
  "",
  "/contact",
  "/contact-us",
  "/about",
  "/about-us",
];

const emailRegex =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const cleanEmail = (email) => {
  return email
    .toLowerCase()
    .replace(/[),.;:]+$/, "");
};

const extractEmailFromHtml = (html) => {
  const $ = cheerio.load(html);

  const text = $("body").text();

  const emails =
    text.match(emailRegex) || [];

  return emails
    .map(cleanEmail)
    .filter(
      (email) =>
        !email.includes("example.com") &&
        !email.includes("sentry.io")
    );
};

export const extractEmail = async (
  website
) => {
  if (!website) {
    return null;
  }

  let baseUrl = website;

  try {
    const parsedUrl = new URL(website);

    baseUrl =
      `${parsedUrl.protocol}//${parsedUrl.host}`;
  } catch {
    return null;
  }

  const foundEmails = new Set();

  for (const path of commonPaths) {
    try {
      const url = `${baseUrl}${path}`;

      const response =
        await axios.get(url, {
          timeout: 7000,

          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          },
        });

      const emails =
        extractEmailFromHtml(
          response.data
        );

      emails.forEach((email) =>
        foundEmails.add(email)
      );

      if (foundEmails.size > 0) {
        return [...foundEmails][0];
      }
    } catch {
      // Try next page
    }
  }

  return null;
};