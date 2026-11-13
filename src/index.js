import debounce from 'lodash.debounce';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import fetchCountries from './fetchCountries';
import './sass/index.scss';

const DEBOUNCE_DELAY = 500;

const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const infoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const query = event.target.value.trim();

  clearMarkup();

  if (!query) {
    return;
  }

  fetchCountries(query).then(renderCountries).catch(onError);
}

function clearMarkup() {
  listRef.innerHTML = '';
  infoRef.innerHTML = '';
}

function renderCountries(countries) {
  if (countries.length === 0) {
    onError();
    return;
  }

  if (countries.length > 10) {
    iziToast.info({
      title: 'Забагато збігів',
      message: 'Зробіть запит більш специфічним.',
      position: 'topRight',
    });
    return;
  }

  if (countries.length >= 2) {
    listRef.innerHTML = createListMarkup(countries);
    return;
  }

  infoRef.innerHTML = createCountryMarkup(countries[0]);
}

function onError() {
  iziToast.error({
    title: 'Помилка',
    message: 'Країну не знайдено.',
    position: 'topRight',
  });
}

function createListMarkup(countries) {
  return countries
    .map(
      ({ names, flag }) => `
        <li class="country-list__item">
          <img src="${flag.url_svg}" alt="Прапор ${names.common}" width="30" />
          <span>${names.common}</span>
        </li>`
    )
    .join('');
}

function createCountryMarkup({ names, capitals, population, languages, flag }) {
  const capital = capitals?.[0]?.name ?? '—';
  const languageList = (languages ?? []).map(({ name }) => name).join(', ');

  return `
    <div class="country-card">
      <h2 class="country-card__title">
        <img src="${flag.url_svg}" alt="Прапор ${names.common}" width="40" />
        ${names.common}
      </h2>
      <p><b>Столиця:</b> ${capital}</p>
      <p><b>Населення:</b> ${population?.toLocaleString() ?? '—'}</p>
      <p><b>Мови:</b> ${languageList || '—'}</p>
    </div>`;
}