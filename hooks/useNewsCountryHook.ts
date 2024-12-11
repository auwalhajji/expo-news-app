import newsCountryList from "@/constants/CountryList";
import { useCallback, useState } from "react";

const useNewsCountries = () => {
  const [newsCountries, setNewsCountries] = useState(newsCountryList);

  const toggleNewsCountry = useCallback((id: number) => {
    setNewsCountries((prevNewsCountries) => {
      return prevNewsCountries.map((item, index) => {
        if (index === id) {
          return {
            ...item,
            selected: !item.selected,
          };
        }
        return item;
      });
    });
  }, []);
  return {
    newsCountries,
    toggleNewsCountry,
  };
};

export default useNewsCountries;
