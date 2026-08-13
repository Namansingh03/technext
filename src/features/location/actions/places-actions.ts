"use server";

export type PlaceSuggestion = {
  placeId: string;
  mainText: string;
  secondaryText: string;
};

export type ResolvedLocation = {
  placeId: string;
  formattedAddress: string;
  city: string | null;
  state: string | null;
  country: string | null;
  countryCode: string | null;
  latitude: number;
  longitude: number;
  label: string;
};

type GoogleAutocompleteResponse = {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      structuredFormat?: {
        mainText?: {
          text?: string;
        };
        secondaryText?: {
          text?: string;
        };
      };
    };
  }>;
};

type GoogleAddressComponent = {
  longText?: string;
  shortText?: string;
  types?: string[];
};

type GooglePlaceResponse = {
  formattedAddress?: string;
  addressComponents?: GoogleAddressComponent[];
  location?: {
    latitude?: number;
    longitude?: number;
  };
};

export async function searchLocations(
  query: string,
): Promise<PlaceSuggestion[]> {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) {
    return [];
  }

  const apiKey = process.env.GOOGLE_MAP_API_KEY;

  if (!apiKey) {
    console.error("GOOGLE_MAP_API_KEY is missing");
    return [];
  }

  const response = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat",
      },
      body: JSON.stringify({
        input: trimmedQuery,

        // Only cities / geographical regions.
        includedPrimaryTypes: ["(cities)"],

        // Optional: keep results focused on India.
        includedRegionCodes: ["in"],
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error("Google Places Autocomplete failed:", response.status);

    return [];
  }

  const data = (await response.json()) as GoogleAutocompleteResponse;

  return (data.suggestions ?? [])
    .map((suggestion) => {
      const prediction = suggestion.placePrediction;

      if (!prediction?.placeId) {
        return null;
      }

      return {
        placeId: prediction.placeId,
        mainText: prediction.structuredFormat?.mainText?.text ?? "",
        secondaryText: prediction.structuredFormat?.secondaryText?.text ?? "",
      };
    })
    .filter((suggestion): suggestion is PlaceSuggestion => {
      return suggestion !== null && suggestion.mainText.length > 0;
    });
}

export async function resolveLocation(
  placeId: string,
): Promise<ResolvedLocation | null> {
  const apiKey = process.env.GOOGLE_MAP_API_KEY;

  if (!apiKey) {
    console.error("GOOGLE_MAP_API_KEY is missing");
    return null;
  }

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "formattedAddress,addressComponents,location",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error("Google Place Details failed:", response.status);

    return null;
  }

  const place = (await response.json()) as GooglePlaceResponse;

  const getComponent = (type: string) =>
    place.addressComponents?.find((component) =>
      component.types?.includes(type),
    );

  const city =
    getComponent("locality")?.longText ??
    getComponent("administrative_area_level_2")?.longText ??
    null;

  const state = getComponent("administrative_area_level_1")?.longText ?? null;

  const country = getComponent("country")?.longText ?? null;

  const countryCode = getComponent("country")?.shortText ?? null;

  const latitude = place.location?.latitude;
  const longitude = place.location?.longitude;

  if (
    !place.formattedAddress ||
    latitude === undefined ||
    longitude === undefined
  ) {
    return null;
  }

  return {
    placeId,
    formattedAddress: place.formattedAddress,
    city,
    state,
    country,
    countryCode,
    latitude,
    longitude,

    // Useful for displaying the selected value.
    label: place.formattedAddress,
  };
}
