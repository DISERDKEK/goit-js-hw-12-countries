const BASE_URL = 'https://api.restcountries.com/countries/v5/name';
const FIELDS = 'names.common,capitals,population,languages,flag.url_svg';
const API_KEY = process.env.API_KEY;

export default function fetchCountries(searchQuery) {
  const url = `${BASE_URL}?q=${encodeURIComponent(searchQuery)}&response_fields=${FIELDS}&api-key=${API_KEY}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(result => result.data.objects);
}