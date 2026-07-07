import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oltinoy Collection",
    short_name: "Oltinoy",
    description: "O'z tikuv sexidan optom modest fashion — abaya, ko'ylak, rumol.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3ec",
    theme_color: "#14161f",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
